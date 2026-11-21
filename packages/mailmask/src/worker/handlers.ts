import { buildRefusalNotification } from '../lib/notification.js';
import { isDmarcPass, sendRawEmail } from './cloudflare-email.js';
import { sendNotifications } from './notify.js';
import {
  buildForwardedMessage,
  buildReverseAddress,
  buildSentMessage,
  parseAddress,
  readRawMessage,
} from './relay.js';
import { resolveRoute } from './router.js';

import type {
  Worker_Handlers_HandleEmail_AliasEmail,
  Worker_Handlers_HandleEmail_AliasHeaders,
  Worker_Handlers_HandleEmail_Config,
  Worker_Handlers_HandleEmail_Context,
  Worker_Handlers_HandleEmail_Decision,
  Worker_Handlers_HandleEmail_EmailBinding,
  Worker_Handlers_HandleEmail_EmailMessageConstructor,
  Worker_Handlers_HandleEmail_ErrorMessage,
  Worker_Handlers_HandleEmail_ForwardedRaw,
  Worker_Handlers_HandleEmail_ForwardHeaders,
  Worker_Handlers_HandleEmail_HeaderSender,
  Worker_Handlers_HandleEmail_Message,
  Worker_Handlers_HandleEmail_MessageHeaders,
  Worker_Handlers_HandleEmail_Now,
  Worker_Handlers_HandleEmail_Payload,
  Worker_Handlers_HandleEmail_Raw,
  Worker_Handlers_HandleEmail_ReplyTarget,
  Worker_Handlers_HandleEmail_Returns,
  Worker_Handlers_HandleEmail_ReverseAddress,
  Worker_Handlers_HandleEmail_SendFailure,
  Worker_Handlers_HandleEmail_SentRaw,
  Worker_Handlers_HandleEmail_Settings,
} from '../types/worker/handlers.d.ts';

/**
 * Worker - Handlers - Handle Email.
 *
 * Routes one inbound message: forwards it to the alias destination, sends the
 * user's own mail on from the alias, or rejects it. With sending turned on, a
 * forward comes from a reply address so a reply goes back through the alias.
 *
 * @param {Worker_Handlers_HandleEmail_Message}                 message                   - Message.
 * @param {Worker_Handlers_HandleEmail_Config}                  config                    - Config.
 * @param {Worker_Handlers_HandleEmail_Now}                     now                       - Now.
 * @param {Worker_Handlers_HandleEmail_Context}                 context                   - Context.
 * @param {Worker_Handlers_HandleEmail_EmailBinding}            [emailBinding]            - Email binding.
 * @param {Worker_Handlers_HandleEmail_EmailMessageConstructor} [emailMessageConstructor] - Email message constructor.
 *
 * @returns {Worker_Handlers_HandleEmail_Returns}
 *
 * @since 1.2.0
 */
async function handleEmail(message: Worker_Handlers_HandleEmail_Message, config: Worker_Handlers_HandleEmail_Config, now: Worker_Handlers_HandleEmail_Now, context: Worker_Handlers_HandleEmail_Context, emailBinding?: Worker_Handlers_HandleEmail_EmailBinding, emailMessageConstructor?: Worker_Handlers_HandleEmail_EmailMessageConstructor): Worker_Handlers_HandleEmail_Returns {
  const settings: Worker_Handlers_HandleEmail_Settings = config['settings'];
  const messageHeaders: Worker_Handlers_HandleEmail_MessageHeaders = message['headers'] ?? new Headers();
  const headerSender: Worker_Handlers_HandleEmail_HeaderSender = parseAddress(messageHeaders.get('from'));
  const decision: Worker_Handlers_HandleEmail_Decision = resolveRoute(message['to'], message['from'], config, now, headerSender);

  if (
    decision['action'] === 'send'
    && decision['aliasAddress'] !== undefined
    && decision['recipientEmail'] !== undefined
  ) {
    if (
      emailBinding === undefined
      || emailMessageConstructor === undefined
      || message['raw'] === undefined
    ) {
      message.setReject('Sending from aliases is not set up for this Worker');

      return;
    }

    const raw: Worker_Handlers_HandleEmail_Raw = await readRawMessage(message['raw']);

    // Only mail that passed DMARC really came from the alias's inbox, so nobody else can send as the alias.
    if (isDmarcPass(raw) === false) {
      message.setReject('Sender could not be verified');

      return;
    }

    const aliasEmail: Worker_Handlers_HandleEmail_AliasEmail = `${decision['aliasAddress']}@${settings['base_domain']}`;
    const sentRaw: Worker_Handlers_HandleEmail_SentRaw = buildSentMessage(raw, aliasEmail, decision['recipientEmail'], settings['base_domain']);

    try {
      await sendRawEmail(emailBinding, emailMessageConstructor, aliasEmail, decision['recipientEmail'], sentRaw);
    } catch (error) {
      const sendFailure: Worker_Handlers_HandleEmail_SendFailure = (error instanceof Error) ? error['message'] : 'unknown failure';

      message.setReject(`Sending from the alias failed: ${sendFailure}`);
    }

    return;
  }

  if (decision['action'] === 'forward' && decision['destinationEmail'] !== undefined) {
    const forwardHeaders: Worker_Handlers_HandleEmail_ForwardHeaders = new Headers();
    const aliasHeaders: Worker_Handlers_HandleEmail_AliasHeaders = [];

    if (settings['add_alias_headers'] === true) {
      forwardHeaders.set('X-Mailmask-Alias', message['to']);

      aliasHeaders.push(`X-Mailmask-Alias: ${message['to']}`);

      if (decision['aliasLabel'] !== undefined) {
        forwardHeaders.set('X-Mailmask-Label', decision['aliasLabel']);

        aliasHeaders.push(`X-Mailmask-Label: ${decision['aliasLabel']}`);
      }
    }

    // A forward from the reply address sends the user's reply back through the alias instead of from their inbox.
    if (
      settings['send_from_aliases'] === true
      && emailBinding !== undefined
      && emailMessageConstructor !== undefined
      && decision['aliasAddress'] !== undefined
      && message['raw'] !== undefined
    ) {
      const replyTarget: Worker_Handlers_HandleEmail_ReplyTarget = parseAddress(messageHeaders.get('reply-to'))
        ?? headerSender
        ?? message['from'].toLowerCase();
      const reverseAddress: Worker_Handlers_HandleEmail_ReverseAddress = buildReverseAddress(decision['aliasAddress'], replyTarget, settings['base_domain']);

      if (reverseAddress !== undefined) {
        try {
          const forwardedRaw: Worker_Handlers_HandleEmail_ForwardedRaw = buildForwardedMessage(await readRawMessage(message['raw']), reverseAddress, replyTarget, aliasHeaders);

          await sendRawEmail(emailBinding, emailMessageConstructor, reverseAddress, decision['destinationEmail'], forwardedRaw);

          return;
        } catch (error) {
          const errorMessage: Worker_Handlers_HandleEmail_ErrorMessage = (error instanceof Error) ? error['message'] : 'unknown failure.';

          // eslint-disable-next-line no-console -- Cloudflare failures use warning-level Worker logs.
          console.warn(`Alias "${decision['aliasAddress']}" could not forward from its reply address, so it forwarded plainly: ${errorMessage}`);
        }
      }
    }

    await message.forward(decision['destinationEmail'], forwardHeaders);

    return;
  }

  message.setReject(decision['reason']);

  // Only refusals on known aliases notify; unknown recipients are mostly spam.
  if (decision['aliasAddress'] !== undefined) {
    const payload: Worker_Handlers_HandleEmail_Payload = buildRefusalNotification(
      `${decision['aliasAddress']}@${settings['base_domain']}`,
      message['from'],
      message['to'],
      decision['reason'],
      'reject',
      now,
    );

    context.waitUntil(sendNotifications(config['notifiers'], payload, emailBinding));
  }

  return;
}

export {
  handleEmail,
};
