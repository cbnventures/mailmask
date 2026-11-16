import type {
  Lib_Notification_BuildEmailMessage_Notifier,
  Lib_Notification_BuildEmailMessage_Payload,
  Lib_Notification_BuildEmailMessage_Returns,
  Lib_Notification_BuildNotifierRequest_BearerHeaders,
  Lib_Notification_BuildNotifierRequest_Notifier,
  Lib_Notification_BuildNotifierRequest_Payload,
  Lib_Notification_BuildNotifierRequest_Returns,
  Lib_Notification_BuildNotifierRequest_TransactionId,
  Lib_Notification_BuildRefusalNotification_Action,
  Lib_Notification_BuildRefusalNotification_ActionDescription,
  Lib_Notification_BuildRefusalNotification_Alias,
  Lib_Notification_BuildRefusalNotification_EnvelopeSender,
  Lib_Notification_BuildRefusalNotification_Message,
  Lib_Notification_BuildRefusalNotification_OccurredAt,
  Lib_Notification_BuildRefusalNotification_Reason,
  Lib_Notification_BuildRefusalNotification_ReasonCode,
  Lib_Notification_BuildRefusalNotification_Recipient,
  Lib_Notification_BuildRefusalNotification_Returns,
  Lib_Notification_BuildTestNotification_OccurredAt,
  Lib_Notification_BuildTestNotification_Returns,
  Lib_Notification_EscapeSlack_Returns,
  Lib_Notification_EscapeSlack_Value,
  Lib_Notification_TrimTrailingSlashes_Returns,
  Lib_Notification_TrimTrailingSlashes_Trimmed,
  Lib_Notification_TrimTrailingSlashes_Value,
} from '../types/lib/notification.d.ts';

/**
 * Lib - Notification - Timeout Milliseconds.
 *
 * Maximum time one notifier may delay best-effort fan-out. Each notifier gets
 * its own deadline so one slow service cannot hold the others open.
 *
 * @since UNRELEASED
 */
const NOTIFICATION_TIMEOUT_MILLISECONDS = 10_000;

/**
 * Lib - Notification - Escape Slack.
 *
 * Escapes the three characters Slack reserves in message text. This keeps
 * titles and messages literal when Slack applies its automatic formatting.
 *
 * @param {Lib_Notification_EscapeSlack_Value} value - Value.
 *
 * @returns {Lib_Notification_EscapeSlack_Returns}
 *
 * @since UNRELEASED
 */
function escapeSlack(value: Lib_Notification_EscapeSlack_Value): Lib_Notification_EscapeSlack_Returns {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/**
 * Lib - Notification - Trim Trailing Slashes.
 *
 * Removes trailing slashes before a fixed API path is appended. It preserves
 * the rest of the service's configured base URL unchanged.
 *
 * @param {Lib_Notification_TrimTrailingSlashes_Value} value - Value.
 *
 * @returns {Lib_Notification_TrimTrailingSlashes_Returns}
 *
 * @since UNRELEASED
 */
function trimTrailingSlashes(value: Lib_Notification_TrimTrailingSlashes_Value): Lib_Notification_TrimTrailingSlashes_Returns {
  let trimmed: Lib_Notification_TrimTrailingSlashes_Trimmed = value;

  while (trimmed.endsWith('/') === true) {
    trimmed = trimmed.slice(0, -1);
  }

  return trimmed;
}

/**
 * Lib - Notification - Build Refusal Notification.
 *
 * Creates Mailmask's versioned notification payload for refused mail. The
 * details use stable reason codes while the message keeps the routing reason.
 *
 * @param {Lib_Notification_BuildRefusalNotification_Alias}          alias          - Alias.
 * @param {Lib_Notification_BuildRefusalNotification_EnvelopeSender} envelopeSender - Envelope sender.
 * @param {Lib_Notification_BuildRefusalNotification_Recipient}      recipient      - Recipient.
 * @param {Lib_Notification_BuildRefusalNotification_Reason}         reason         - Reason.
 * @param {Lib_Notification_BuildRefusalNotification_Action}         action         - Action.
 * @param {Lib_Notification_BuildRefusalNotification_OccurredAt}     occurredAt     - Occurred at.
 *
 * @returns {Lib_Notification_BuildRefusalNotification_Returns}
 *
 * @since UNRELEASED
 */
function buildRefusalNotification(alias: Lib_Notification_BuildRefusalNotification_Alias, envelopeSender: Lib_Notification_BuildRefusalNotification_EnvelopeSender, recipient: Lib_Notification_BuildRefusalNotification_Recipient, reason: Lib_Notification_BuildRefusalNotification_Reason, action: Lib_Notification_BuildRefusalNotification_Action, occurredAt: Lib_Notification_BuildRefusalNotification_OccurredAt): Lib_Notification_BuildRefusalNotification_Returns {
  let reasonCode: Lib_Notification_BuildRefusalNotification_ReasonCode = 'refused';

  switch (reason) {
    case 'Address is disabled': {
      reasonCode = 'disabled';

      break;
    }

    case 'Address has expired': {
      reasonCode = 'expired';

      break;
    }

    case 'Sender is blocked':
    case 'Sender is not allowed': {
      reasonCode = 'filtered';

      break;
    }

    case 'Address is misconfigured': {
      reasonCode = 'misconfigured';

      break;
    }

    default: {
      break;
    }
  }

  const actionDescription: Lib_Notification_BuildRefusalNotification_ActionDescription = (action === 'drop') ? 'dropped' : 'rejected';
  const message: Lib_Notification_BuildRefusalNotification_Message = `Mail to ${recipient} from ${envelopeSender} was ${actionDescription}: ${reason}.`;

  return {
    version: 1,
    app: 'mailmask',
    event: 'message-refused',
    title: 'Mailmask refused a message',
    message,
    priority: 3,
    tags: ['email'],
    occurredAt: new Date(occurredAt).toISOString(),
    details: {
      alias,
      envelopeSender,
      recipient,
      reason: reasonCode,
    },
  };
}

/**
 * Lib - Notification - Build Test Notification.
 *
 * Creates the deterministic example payload used by the CLI test command. Its
 * details match the production schema without referring to a real message.
 *
 * @param {Lib_Notification_BuildTestNotification_OccurredAt} [occurredAt] - Occurred at.
 *
 * @returns {Lib_Notification_BuildTestNotification_Returns}
 *
 * @since UNRELEASED
 */
function buildTestNotification(occurredAt: Lib_Notification_BuildTestNotification_OccurredAt = Date.now()): Lib_Notification_BuildTestNotification_Returns {
  return {
    version: 1,
    app: 'mailmask',
    event: 'test',
    title: 'Mailmask test notification',
    message: 'Mailmask successfully sent this test notification.',
    priority: 3,
    tags: [
      'email',
      'test',
    ],
    occurredAt: new Date(occurredAt).toISOString(),
    details: {
      alias: 'test@example.com',
      envelopeSender: 'sender@example.com',
      recipient: 'test@example.com',
      reason: 'test',
    },
  };
}

/**
 * Lib - Notification - Build Email Message.
 *
 * Converts a payload to the structured message accepted by Cloudflare's
 * send_email binding.
 *
 * @param {Lib_Notification_BuildEmailMessage_Notifier} notifier - Notifier.
 * @param {Lib_Notification_BuildEmailMessage_Payload}  payload  - Payload.
 *
 * @returns {Lib_Notification_BuildEmailMessage_Returns}
 *
 * @since UNRELEASED
 */
function buildEmailMessage(notifier: Lib_Notification_BuildEmailMessage_Notifier, payload: Lib_Notification_BuildEmailMessage_Payload): Lib_Notification_BuildEmailMessage_Returns {
  return {
    from: notifier['from'],
    to: notifier['to'],
    subject: payload['title'],
    text: [
      payload['message'],
      '',
      `Alias: ${payload['details']['alias']}`,
      `Envelope sender: ${payload['details']['envelopeSender']}`,
      `Recipient: ${payload['details']['recipient']}`,
      `Reason: ${payload['details']['reason']}`,
    ].join('\n'),
  };
}

/**
 * Lib - Notification - Build Notifier Request.
 *
 * Converts a Mailmask notification payload to the official HTTP request
 * shape for one notifier. Email is returned separately for send_email.
 *
 * @param {Lib_Notification_BuildNotifierRequest_Notifier} notifier - Notifier.
 * @param {Lib_Notification_BuildNotifierRequest_Payload}  payload  - Payload.
 *
 * @returns {Lib_Notification_BuildNotifierRequest_Returns}
 *
 * @since UNRELEASED
 */
function buildNotifierRequest(notifier: Lib_Notification_BuildNotifierRequest_Notifier, payload: Lib_Notification_BuildNotifierRequest_Payload): Lib_Notification_BuildNotifierRequest_Returns {
  if (notifier['type'] === 'email') {
    return undefined;
  }

  const bearerHeaders: Lib_Notification_BuildNotifierRequest_BearerHeaders = ('token' in notifier && notifier['token'] !== undefined) ? { Authorization: `Bearer ${notifier['token']}` } : {};

  switch (notifier['type']) {
    case 'apprise': {
      return {
        url: notifier['url'],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: payload['message'],
          title: payload['title'],
          type: 'info',
          ...((notifier['urls'] === undefined) ? {} : { urls: notifier['urls'] }),
        }),
      };
    }

    case 'discord': {
      return {
        url: notifier['webhook_url'],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            color: 3_113_463,
            description: payload['message'],
            timestamp: payload['occurredAt'],
            title: payload['title'],
          }],
        }),
      };
    }

    case 'gotify': {
      return {
        url: `${trimTrailingSlashes(notifier['url'])}/message`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Gotify-Key': notifier['token'],
        },
        body: JSON.stringify({
          message: payload['message'],
          priority: payload['priority'],
          title: payload['title'],
        }),
      };
    }

    case 'matrix': {
      const transactionId: Lib_Notification_BuildNotifierRequest_TransactionId = `${String(Date.now())}-${Math.random().toString(36).slice(2)}`;

      return {
        url: `${trimTrailingSlashes(notifier['homeserver_url'])}/_matrix/client/v3/rooms/${encodeURIComponent(notifier['room_id'])}/send/m.room.message/${transactionId}`,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${notifier['access_token']}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: [
            payload['title'],
            payload['message'],
          ].join('\n'),
          msgtype: 'm.text',
        }),
      };
    }

    case 'ntfy': {
      return {
        url: notifier['server'],
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notifier['token']}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: notifier['topic'],
          title: payload['title'],
          message: payload['message'],
          priority: payload['priority'],
          tags: payload['tags'],
        }),
      };
    }

    case 'pushover': {
      return {
        url: 'https://api.pushover.net/1/messages.json',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: notifier['app_token'],
          user: notifier['user_key'],
          title: payload['title'],
          message: payload['message'],
          priority: 0,
        }),
      };
    }

    case 'slack': {
      return {
        url: notifier['webhook_url'],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: [
            `*${escapeSlack(payload['title'])}*`,
            escapeSlack(payload['message']),
          ].join('\n'),
        }),
      };
    }

    case 'telegram': {
      return {
        url: `https://api.telegram.org/bot${notifier['bot_token']}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: notifier['chat_id'],
          text: [
            payload['title'],
            '',
            payload['message'],
          ].join('\n'),
          link_preview_options: { is_disabled: true },
        }),
      };
    }

    case 'ntfy-reverse-proxy':
    case 'webhook': {
      return {
        url: notifier['url'],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...bearerHeaders,
        },
        body: JSON.stringify(payload),
      };
    }

    default: {
      return undefined;
    }
  }
}

export {
  NOTIFICATION_TIMEOUT_MILLISECONDS,
  buildEmailMessage,
  buildNotifierRequest,
  buildRefusalNotification,
  buildTestNotification,
};
