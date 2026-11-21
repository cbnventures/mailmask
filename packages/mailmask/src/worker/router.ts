import { decodeReverseTag } from './relay.js';

import type {
  Worker_Router_MatchesSender_NormalizedPattern,
  Worker_Router_MatchesSender_Pattern,
  Worker_Router_MatchesSender_Returns,
  Worker_Router_MatchesSender_Sender,
  Worker_Router_MatchesSender_SenderDomain,
  Worker_Router_ResolveRoute_Alias,
  Worker_Router_ResolveRoute_AllowedSenders,
  Worker_Router_ResolveRoute_AtIndex,
  Worker_Router_ResolveRoute_BlockedSenders,
  Worker_Router_ResolveRoute_Config,
  Worker_Router_ResolveRoute_Destination,
  Worker_Router_ResolveRoute_Domain,
  Worker_Router_ResolveRoute_ExpiresAt,
  Worker_Router_ResolveRoute_HeaderSender,
  Worker_Router_ResolveRoute_LocalPart,
  Worker_Router_ResolveRoute_NormalizedSender,
  Worker_Router_ResolveRoute_Now,
  Worker_Router_ResolveRoute_PlusIndex,
  Worker_Router_ResolveRoute_Recipient,
  Worker_Router_ResolveRoute_RecipientEmail,
  Worker_Router_ResolveRoute_Returns,
  Worker_Router_ResolveRoute_SendAlias,
  Worker_Router_ResolveRoute_SendDestination,
  Worker_Router_ResolveRoute_Sender,
  Worker_Router_ResolveRoute_SendExpiresAt,
  Worker_Router_ResolveRoute_SendReason,
  Worker_Router_ResolveRoute_Settings,
} from '../types/worker/router.d.ts';

/**
 * Worker - Router - Matches Sender.
 *
 * Checks a lowercased sender address against a single sender rule, which
 * is either an exact address or a "*@domain" wildcard for the whole domain.
 *
 * @param {Worker_Router_MatchesSender_Sender}  sender  - Sender.
 * @param {Worker_Router_MatchesSender_Pattern} pattern - Pattern.
 *
 * @returns {Worker_Router_MatchesSender_Returns}
 *
 * @since 0.0.1
 */
function matchesSender(sender: Worker_Router_MatchesSender_Sender, pattern: Worker_Router_MatchesSender_Pattern): Worker_Router_MatchesSender_Returns {
  const normalizedPattern: Worker_Router_MatchesSender_NormalizedPattern = pattern.toLowerCase();

  if (normalizedPattern.startsWith('*@') === true) {
    const senderDomain: Worker_Router_MatchesSender_SenderDomain = sender.slice(sender.lastIndexOf('@') + 1);

    return senderDomain === normalizedPattern.slice(2);
  }

  return sender === normalizedPattern;
}

/**
 * Worker - Router - Resolve Route.
 *
 * Decides what happens to an inbound message. Mail from an alias's own inbox to
 * a reply address is sent on from the alias; other mail to a known, active alias
 * forwards unless a sender rule refuses it, and every refusal is rejected.
 *
 * @param {Worker_Router_ResolveRoute_Recipient}    recipient      - Recipient.
 * @param {Worker_Router_ResolveRoute_Sender}       sender         - Sender.
 * @param {Worker_Router_ResolveRoute_Config}       config         - Config.
 * @param {Worker_Router_ResolveRoute_Now}          now            - Now.
 * @param {Worker_Router_ResolveRoute_HeaderSender} [headerSender] - Header sender.
 *
 * @returns {Worker_Router_ResolveRoute_Returns}
 *
 * @since 1.2.0
 */
function resolveRoute(recipient: Worker_Router_ResolveRoute_Recipient, sender: Worker_Router_ResolveRoute_Sender, config: Worker_Router_ResolveRoute_Config, now: Worker_Router_ResolveRoute_Now, headerSender?: Worker_Router_ResolveRoute_HeaderSender): Worker_Router_ResolveRoute_Returns {
  const settings: Worker_Router_ResolveRoute_Settings = config['settings'];
  const atIndex: Worker_Router_ResolveRoute_AtIndex = recipient.lastIndexOf('@');
  const domain: Worker_Router_ResolveRoute_Domain = recipient.slice(atIndex + 1).toLowerCase();
  let localPart: Worker_Router_ResolveRoute_LocalPart = recipient.slice(0, atIndex).toLowerCase();

  if (atIndex < 0 || domain !== settings['base_domain']) {
    return {
      action: 'reject',
      reason: 'Recipient domain is not handled by this Worker',
      destinationEmail: undefined,
      aliasAddress: undefined,
      aliasLabel: undefined,
      recipientEmail: undefined,
    };
  }

  const plusIndex: Worker_Router_ResolveRoute_PlusIndex = localPart.indexOf('+');

  // Mail from the alias's own inbox to "alias+local=domain@" is the user writing back through the alias.
  if (
    settings['send_from_aliases'] === true
    && plusIndex > 0
    && headerSender !== undefined
  ) {
    const sendAlias: Worker_Router_ResolveRoute_SendAlias = config['aliases'].find((configAlias) => configAlias['address'] === localPart.slice(0, plusIndex));
    const sendDestination: Worker_Router_ResolveRoute_SendDestination = (sendAlias === undefined) ? undefined : config['destinations'].find((configDestination) => configDestination['name'] === sendAlias['destination']);
    const recipientEmail: Worker_Router_ResolveRoute_RecipientEmail = decodeReverseTag(localPart.slice(plusIndex + 1));

    if (
      sendAlias !== undefined
      && sendDestination !== undefined
      && recipientEmail !== undefined
      && sendDestination['email'].toLowerCase() === headerSender.toLowerCase()
    ) {
      const sendExpiresAt: Worker_Router_ResolveRoute_SendExpiresAt = sendAlias['expires_at'];
      let sendReason: Worker_Router_ResolveRoute_SendReason = undefined;

      if (sendAlias['enabled'] === false) {
        sendReason = 'Address is disabled';
      } else if (sendExpiresAt !== undefined && Date.parse(sendExpiresAt) <= now) {
        sendReason = 'Address has expired';
      }

      return {
        action: (sendReason === undefined) ? 'send' : 'reject',
        reason: sendReason ?? 'Mail sent from the alias',
        destinationEmail: sendDestination['email'],
        aliasAddress: sendAlias['address'],
        aliasLabel: sendAlias['label'],
        recipientEmail,
      };
    }
  }

  // Strip a "+tag" suffix so "alias+shop@domain" resolves to "alias".
  if (settings['subaddressing'] === true && plusIndex > 0) {
    localPart = localPart.slice(0, plusIndex);
  }

  const alias: Worker_Router_ResolveRoute_Alias = config['aliases'].find((configAlias) => configAlias['address'] === localPart);

  // Email Routing only sends alias addresses here, so a miss means a stale rule or a "+tag" with subaddressing off.
  if (alias === undefined) {
    return {
      action: 'reject',
      reason: 'Address not found',
      destinationEmail: undefined,
      aliasAddress: undefined,
      aliasLabel: undefined,
      recipientEmail: undefined,
    };
  }

  if (alias['enabled'] === false) {
    return {
      action: 'reject',
      reason: 'Address is disabled',
      destinationEmail: undefined,
      aliasAddress: alias['address'],
      aliasLabel: alias['label'],
      recipientEmail: undefined,
    };
  }

  const expiresAt: Worker_Router_ResolveRoute_ExpiresAt = alias['expires_at'];

  if (expiresAt !== undefined && Date.parse(expiresAt) <= now) {
    return {
      action: 'reject',
      reason: 'Address has expired',
      destinationEmail: undefined,
      aliasAddress: alias['address'],
      aliasLabel: alias['label'],
      recipientEmail: undefined,
    };
  }

  const blockedSenders: Worker_Router_ResolveRoute_BlockedSenders = alias['blocked_senders'] ?? [];
  const allowedSenders: Worker_Router_ResolveRoute_AllowedSenders = alias['allowed_senders'];
  const normalizedSender: Worker_Router_ResolveRoute_NormalizedSender = sender.toLowerCase();

  if (blockedSenders.some((blockedSender) => matchesSender(normalizedSender, blockedSender)) === true) {
    return {
      action: 'reject',
      reason: 'Sender is blocked',
      destinationEmail: undefined,
      aliasAddress: alias['address'],
      aliasLabel: alias['label'],
      recipientEmail: undefined,
    };
  }

  if (
    allowedSenders !== undefined
    && allowedSenders.some((allowedSender) => matchesSender(normalizedSender, allowedSender)) === false
  ) {
    return {
      action: 'reject',
      reason: 'Sender is not allowed',
      destinationEmail: undefined,
      aliasAddress: alias['address'],
      aliasLabel: alias['label'],
      recipientEmail: undefined,
    };
  }

  const destination: Worker_Router_ResolveRoute_Destination = config['destinations'].find((configDestination) => configDestination['name'] === alias['destination']);

  if (destination === undefined) {
    return {
      action: 'reject',
      reason: 'Address is misconfigured',
      destinationEmail: undefined,
      aliasAddress: alias['address'],
      aliasLabel: alias['label'],
      recipientEmail: undefined,
    };
  }

  return {
    action: 'forward',
    reason: 'Alias forwarded to its destination',
    destinationEmail: destination['email'],
    aliasAddress: alias['address'],
    aliasLabel: alias['label'],
    recipientEmail: undefined,
  };
}

export {
  matchesSender,
  resolveRoute,
};
