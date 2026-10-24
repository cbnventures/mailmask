import { sendNotifications } from './notify.js';
import { resolveRoute } from './router.js';

import type {
  Worker_Handlers_HandleEmail_Config,
  Worker_Handlers_HandleEmail_Decision,
  Worker_Handlers_HandleEmail_ForwardHeaders,
  Worker_Handlers_HandleEmail_Message,
  Worker_Handlers_HandleEmail_NotifyBody,
  Worker_Handlers_HandleEmail_Now,
  Worker_Handlers_HandleEmail_Returns,
  Worker_Handlers_HandleEmail_Settings,
} from '../types/worker/handlers.d.ts';

/**
 * Worker - Handlers - Handle Email.
 *
 * Routes one inbound message: forwards it to the alias destination with
 * optional identifying headers, or rejects or drops it. Refusals on known
 * aliases send a best-effort notification to every configured notifier.
 *
 * @param {Worker_Handlers_HandleEmail_Message} message - Message.
 * @param {Worker_Handlers_HandleEmail_Config}  config  - Config.
 * @param {Worker_Handlers_HandleEmail_Now}     now     - Now.
 *
 * @returns {Worker_Handlers_HandleEmail_Returns}
 *
 * @since UNRELEASED
 */
async function handleEmail(message: Worker_Handlers_HandleEmail_Message, config: Worker_Handlers_HandleEmail_Config, now: Worker_Handlers_HandleEmail_Now): Worker_Handlers_HandleEmail_Returns {
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

  // Only refusals on known aliases notify; unknown recipients are mostly spam.
  if (decision['aliasAddress'] !== undefined) {
    const notifyBody: Worker_Handlers_HandleEmail_NotifyBody = [
      `Alias: ${decision['aliasAddress']}@${settings['base_domain']}`,
      `From: ${message['from']}`,
      `Action: ${decision['action']}`,
      `Reason: ${decision['reason']}`,
    ].join('\n');

    await sendNotifications(config['notifiers'], 'Mailmask refused a message', notifyBody);
  }

  if (decision['action'] === 'drop') {
    return;
  }

  message.setReject(decision['reason']);

  return;
}

export {
  handleEmail,
};
