import { Runner as EmailNotifier } from './notifiers/email.js';
import { Runner as NotifierRegistry } from './notifiers/registry.js';

import type {
  Lib_Notification_BuildEmailMessage_Notifier,
  Lib_Notification_BuildEmailMessage_Payload,
  Lib_Notification_BuildEmailMessage_Returns,
  Lib_Notification_BuildNotifierRequest_Notifier,
  Lib_Notification_BuildNotifierRequest_Payload,
  Lib_Notification_BuildNotifierRequest_Returns,
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
  Lib_Notification_BuildTextRefusalNotification_Alias,
  Lib_Notification_BuildTextRefusalNotification_OccurredAt,
  Lib_Notification_BuildTextRefusalNotification_Reason,
  Lib_Notification_BuildTextRefusalNotification_ReasonCode,
  Lib_Notification_BuildTextRefusalNotification_Returns,
  Lib_Notification_BuildTextRefusalNotification_Sender,
} from '../types/lib/notification.d.ts';

/**
 * Lib - Notification - Timeout Milliseconds.
 *
 * Maximum time one notifier may delay best-effort fan-out. Each notifier gets
 * its own deadline so one slow service cannot hold the others open.
 *
 * @since 1.0.0
 */
const NOTIFICATION_TIMEOUT_MILLISECONDS = 10_000;

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
 * @since 1.0.0
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
 * Lib - Notification - Build Text Refusal Notification.
 *
 * Creates the same versioned payload for a text that a phone alias refused, so
 * every notifier handles phone aliases without new fields. Texts are dropped.
 *
 * @param {Lib_Notification_BuildTextRefusalNotification_Alias}      alias      - Alias.
 * @param {Lib_Notification_BuildTextRefusalNotification_Sender}     sender     - Sender.
 * @param {Lib_Notification_BuildTextRefusalNotification_Reason}     reason     - Reason.
 * @param {Lib_Notification_BuildTextRefusalNotification_OccurredAt} occurredAt - Occurred at.
 *
 * @returns {Lib_Notification_BuildTextRefusalNotification_Returns}
 *
 * @since 1.2.0
 */
function buildTextRefusalNotification(alias: Lib_Notification_BuildTextRefusalNotification_Alias, sender: Lib_Notification_BuildTextRefusalNotification_Sender, reason: Lib_Notification_BuildTextRefusalNotification_Reason, occurredAt: Lib_Notification_BuildTextRefusalNotification_OccurredAt): Lib_Notification_BuildTextRefusalNotification_Returns {
  let reasonCode: Lib_Notification_BuildTextRefusalNotification_ReasonCode = 'refused';

  switch (reason) {
    case 'Number is disabled': {
      reasonCode = 'disabled';

      break;
    }

    case 'Number has expired': {
      reasonCode = 'expired';

      break;
    }

    case 'Sender is blocked':
    case 'Sender is not allowed': {
      reasonCode = 'filtered';

      break;
    }

    case 'Number is misconfigured': {
      reasonCode = 'misconfigured';

      break;
    }

    default: {
      break;
    }
  }

  return {
    version: 1,
    app: 'mailmask',
    event: 'message-refused',
    title: 'Mailmask refused a text',
    message: `Text to ${alias} from ${sender} was dropped: ${reason}.`,
    priority: 3,
    tags: ['sms'],
    occurredAt: new Date(occurredAt).toISOString(),
    details: {
      alias,
      envelopeSender: sender,
      recipient: alias,
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
 * @since 1.0.0
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
 * Preserves the public email-message builder while the email adapter owns the
 * Cloudflare binding shape and all email-specific fields.
 *
 * @param {Lib_Notification_BuildEmailMessage_Notifier} notifier - Notifier.
 * @param {Lib_Notification_BuildEmailMessage_Payload}  payload  - Payload.
 *
 * @returns {Lib_Notification_BuildEmailMessage_Returns}
 *
 * @since 1.0.0
 */
function buildEmailMessage(notifier: Lib_Notification_BuildEmailMessage_Notifier, payload: Lib_Notification_BuildEmailMessage_Payload): Lib_Notification_BuildEmailMessage_Returns {
  return new EmailNotifier(notifier).buildMessage(payload);
}

/**
 * Lib - Notification - Build Notifier Request.
 *
 * Preserves the public request builder while the registry selects the adapter
 * that owns each third-party URL, authentication rule, header, and body.
 *
 * @param {Lib_Notification_BuildNotifierRequest_Notifier} notifier - Notifier.
 * @param {Lib_Notification_BuildNotifierRequest_Payload}  payload  - Payload.
 *
 * @returns {Lib_Notification_BuildNotifierRequest_Returns}
 *
 * @since 1.0.0
 */
function buildNotifierRequest(notifier: Lib_Notification_BuildNotifierRequest_Notifier, payload: Lib_Notification_BuildNotifierRequest_Payload): Lib_Notification_BuildNotifierRequest_Returns {
  if (notifier['type'] === 'email') {
    return undefined;
  }

  return NotifierRegistry.createHttp(notifier).buildRequest(payload);
}

export {
  NOTIFICATION_TIMEOUT_MILLISECONDS,
  buildEmailMessage,
  buildNotifierRequest,
  buildRefusalNotification,
  buildTestNotification,
  buildTextRefusalNotification,
};
