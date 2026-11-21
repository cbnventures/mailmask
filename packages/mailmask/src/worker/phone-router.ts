import { matchesPhoneSender, normalizePhoneNumber } from '../lib/phone.js';
import { LIB_REGEX_PHONE_OUTBOUND_TEXT } from '../lib/regex.js';

import type {
  Worker_PhoneRouter_ResolvePhoneRoute_AllowedSenders,
  Worker_PhoneRouter_ResolvePhoneRoute_BlockedSenders,
  Worker_PhoneRouter_ResolvePhoneRoute_Config,
  Worker_PhoneRouter_ResolvePhoneRoute_Destination,
  Worker_PhoneRouter_ResolvePhoneRoute_ExpiresAt,
  Worker_PhoneRouter_ResolvePhoneRoute_Now,
  Worker_PhoneRouter_ResolvePhoneRoute_OutboundMatch,
  Worker_PhoneRouter_ResolvePhoneRoute_PhoneAlias,
  Worker_PhoneRouter_ResolvePhoneRoute_ProviderName,
  Worker_PhoneRouter_ResolvePhoneRoute_Recipient,
  Worker_PhoneRouter_ResolvePhoneRoute_Recipients,
  Worker_PhoneRouter_ResolvePhoneRoute_Returns,
  Worker_PhoneRouter_ResolvePhoneRoute_Sender,
  Worker_PhoneRouter_ResolvePhoneRoute_Text,
} from '../types/worker/phone-router.d.ts';

/**
 * Worker - Phone Router - Help Text.
 *
 * The reply a destination phone gets when it texts its phone alias without
 * saying who the text is for, so the user learns the "number: message" form.
 *
 * @since 1.2.0
 */
const HELP_TEXT = 'Mailmask: start your text with the number to send it to, like "+15550100123: Hello".';

/**
 * Worker - Phone Router - Resolve Phone Route.
 *
 * Decides what happens to a text that reaches a phone alias. A text from the
 * alias's own destination phone goes out through the alias to the number it
 * starts with; any other text is forwarded to the destination phone or dropped.
 *
 * @param {Worker_PhoneRouter_ResolvePhoneRoute_Recipients}   recipients   - Recipients.
 * @param {Worker_PhoneRouter_ResolvePhoneRoute_Sender}       sender       - Sender.
 * @param {Worker_PhoneRouter_ResolvePhoneRoute_Text}         text         - Text.
 * @param {Worker_PhoneRouter_ResolvePhoneRoute_ProviderName} providerName - Provider name.
 * @param {Worker_PhoneRouter_ResolvePhoneRoute_Config}       config       - Config.
 * @param {Worker_PhoneRouter_ResolvePhoneRoute_Now}          now          - Now.
 *
 * @returns {Worker_PhoneRouter_ResolvePhoneRoute_Returns}
 *
 * @since 1.2.0
 */
function resolvePhoneRoute(recipients: Worker_PhoneRouter_ResolvePhoneRoute_Recipients, sender: Worker_PhoneRouter_ResolvePhoneRoute_Sender, text: Worker_PhoneRouter_ResolvePhoneRoute_Text, providerName: Worker_PhoneRouter_ResolvePhoneRoute_ProviderName, config: Worker_PhoneRouter_ResolvePhoneRoute_Config, now: Worker_PhoneRouter_ResolvePhoneRoute_Now): Worker_PhoneRouter_ResolvePhoneRoute_Returns {
  // A number only counts when it belongs to the provider that sent the webhook.
  const phoneAlias: Worker_PhoneRouter_ResolvePhoneRoute_PhoneAlias = (config['phone_aliases'] ?? []).find((configPhoneAlias) => configPhoneAlias['provider'] === providerName && recipients.includes(configPhoneAlias['number']) === true);

  if (phoneAlias === undefined) {
    return {
      action: 'reject',
      reason: 'Number not found',
      aliasNumber: undefined,
      aliasLabel: undefined,
      recipient: undefined,
      text: undefined,
    };
  }

  if (phoneAlias['enabled'] === false) {
    return {
      action: 'reject',
      reason: 'Number is disabled',
      aliasNumber: phoneAlias['number'],
      aliasLabel: phoneAlias['label'],
      recipient: undefined,
      text: undefined,
    };
  }

  const expiresAt: Worker_PhoneRouter_ResolvePhoneRoute_ExpiresAt = phoneAlias['expires_at'];

  if (expiresAt !== undefined && Date.parse(expiresAt) <= now) {
    return {
      action: 'reject',
      reason: 'Number has expired',
      aliasNumber: phoneAlias['number'],
      aliasLabel: phoneAlias['label'],
      recipient: undefined,
      text: undefined,
    };
  }

  const destination: Worker_PhoneRouter_ResolvePhoneRoute_Destination = config['destinations'].find((configDestination) => configDestination['name'] === phoneAlias['destination']);

  if (destination === undefined || destination['phone'] === undefined) {
    return {
      action: 'reject',
      reason: 'Number is misconfigured',
      aliasNumber: phoneAlias['number'],
      aliasLabel: phoneAlias['label'],
      recipient: undefined,
      text: undefined,
    };
  }

  // A text from the destination phone is the user's own, sent on through the alias to the number it starts with.
  if (destination['phone'] === sender) {
    const outboundMatch: Worker_PhoneRouter_ResolvePhoneRoute_OutboundMatch = text.match(LIB_REGEX_PHONE_OUTBOUND_TEXT);

    if (outboundMatch === null || outboundMatch[1] === undefined) {
      return {
        action: 'help',
        reason: 'Text does not start with a number',
        aliasNumber: phoneAlias['number'],
        aliasLabel: phoneAlias['label'],
        recipient: destination['phone'],
        text: HELP_TEXT,
      };
    }

    const recipient: Worker_PhoneRouter_ResolvePhoneRoute_Recipient = normalizePhoneNumber(outboundMatch[1]);

    return {
      action: 'send',
      reason: 'Text sent from the phone alias',
      aliasNumber: phoneAlias['number'],
      aliasLabel: phoneAlias['label'],
      recipient,
      text: outboundMatch[2] ?? '',
    };
  }

  const blockedSenders: Worker_PhoneRouter_ResolvePhoneRoute_BlockedSenders = phoneAlias['blocked_senders'] ?? [];
  const allowedSenders: Worker_PhoneRouter_ResolvePhoneRoute_AllowedSenders = phoneAlias['allowed_senders'];

  if (blockedSenders.some((blockedSender) => matchesPhoneSender(sender, blockedSender)) === true) {
    return {
      action: 'reject',
      reason: 'Sender is blocked',
      aliasNumber: phoneAlias['number'],
      aliasLabel: phoneAlias['label'],
      recipient: undefined,
      text: undefined,
    };
  }

  if (
    allowedSenders !== undefined
    && allowedSenders.some((allowedSender) => matchesPhoneSender(sender, allowedSender)) === false
  ) {
    return {
      action: 'reject',
      reason: 'Sender is not allowed',
      aliasNumber: phoneAlias['number'],
      aliasLabel: phoneAlias['label'],
      recipient: undefined,
      text: undefined,
    };
  }

  // The sender leads the forwarded text in the same "number: message" form a reply uses.
  return {
    action: 'forward',
    reason: 'Text forwarded to its destination',
    aliasNumber: phoneAlias['number'],
    aliasLabel: phoneAlias['label'],
    recipient: destination['phone'],
    text: `${sender}: ${text}`,
  };
}

export {
  resolvePhoneRoute,
};
