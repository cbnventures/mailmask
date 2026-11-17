import { buildRefusalNotification } from '../lib/notification.js';
import { sendNotifications } from './notify.js';
import { resolveRoute } from './router.js';

import type {
  Worker_Handlers_HandleEmail_Config,
  Worker_Handlers_HandleEmail_Context,
  Worker_Handlers_HandleEmail_Decision,
  Worker_Handlers_HandleEmail_EmailBinding,
  Worker_Handlers_HandleEmail_ForwardHeaders,
  Worker_Handlers_HandleEmail_Message,
  Worker_Handlers_HandleEmail_Now,
  Worker_Handlers_HandleEmail_Payload,
  Worker_Handlers_HandleEmail_Returns,
  Worker_Handlers_HandleEmail_Settings,
} from '../types/worker/handlers.d.ts';

/**
 * Worker - Handlers - Handle Email.
 *
 * Routes one inbound message: forwards it to the alias destination with
 * optional identifying headers, or rejects it. Refusals on known
 * aliases schedule a best-effort notification for every configured notifier.
 *
 * @param {Worker_Handlers_HandleEmail_Message}      message        - Message.
 * @param {Worker_Handlers_HandleEmail_Config}       config         - Config.
 * @param {Worker_Handlers_HandleEmail_Now}          now            - Now.
 * @param {Worker_Handlers_HandleEmail_Context}      context        - Context.
 * @param {Worker_Handlers_HandleEmail_EmailBinding} [emailBinding] - Email binding.
 *
 * @returns {Worker_Handlers_HandleEmail_Returns}
 *
 * @since 1.0.0
 */
async function handleEmail(message: Worker_Handlers_HandleEmail_Message, config: Worker_Handlers_HandleEmail_Config, now: Worker_Handlers_HandleEmail_Now, context: Worker_Handlers_HandleEmail_Context, emailBinding?: Worker_Handlers_HandleEmail_EmailBinding): Worker_Handlers_HandleEmail_Returns {
  const settings: Worker_Handlers_HandleEmail_Settings = config['settings'];
  const decision: Worker_Handlers_HandleEmail_Decision = resolveRoute(message['to'], message['from'], config, now);

  if (decision['action'] === 'forward' && decision['destinationEmail'] !== undefined) {
    const forwardHeaders: Worker_Handlers_HandleEmail_ForwardHeaders = new Headers();

    if (settings['add_alias_headers'] === true) {
      forwardHeaders.set('X-Mailmask-Alias', message['to']);

      if (decision['aliasLabel'] !== undefined) {
        forwardHeaders.set('X-Mailmask-Label', decision['aliasLabel']);
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
