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
  Worker_Router_ResolveRoute_DefaultDestination,
  Worker_Router_ResolveRoute_Destination,
  Worker_Router_ResolveRoute_Domain,
  Worker_Router_ResolveRoute_ExpiresAt,
  Worker_Router_ResolveRoute_LocalPart,
  Worker_Router_ResolveRoute_NormalizedSender,
  Worker_Router_ResolveRoute_Now,
  Worker_Router_ResolveRoute_PlusIndex,
  Worker_Router_ResolveRoute_Recipient,
  Worker_Router_ResolveRoute_RefusalAction,
  Worker_Router_ResolveRoute_Returns,
  Worker_Router_ResolveRoute_Sender,
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
 * @since UNRELEASED
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
 * Decides what happens to an inbound message. Known, active aliases forward
 * to their destination unless a sender rule refuses the message; unknown
 * recipients follow the configured unknown alias action.
 *
 * @param {Worker_Router_ResolveRoute_Recipient} recipient - Recipient.
 * @param {Worker_Router_ResolveRoute_Sender}    sender    - Sender.
 * @param {Worker_Router_ResolveRoute_Config}    config    - Config.
 * @param {Worker_Router_ResolveRoute_Now}       now       - Now.
 *
 * @returns {Worker_Router_ResolveRoute_Returns}
 *
 * @since UNRELEASED
 */
function resolveRoute(recipient: Worker_Router_ResolveRoute_Recipient, sender: Worker_Router_ResolveRoute_Sender, config: Worker_Router_ResolveRoute_Config, now: Worker_Router_ResolveRoute_Now): Worker_Router_ResolveRoute_Returns {
  const settings: Worker_Router_ResolveRoute_Settings = config['settings'];
  const atIndex: Worker_Router_ResolveRoute_AtIndex = recipient.lastIndexOf('@');
  const domain: Worker_Router_ResolveRoute_Domain = recipient.slice(atIndex + 1).toLowerCase();
  let localPart: Worker_Router_ResolveRoute_LocalPart = recipient.slice(0, atIndex).toLowerCase();

  // Disabled, expired, and refused mail never falls through to the catch-all destination.
  const refusalAction: Worker_Router_ResolveRoute_RefusalAction = (settings['unknown_alias_action'] === 'drop') ? 'drop' : 'reject';

  if (atIndex < 0 || domain !== settings['base_domain']) {
    return {
      action: 'reject',
      reason: 'Recipient domain is not handled by this Worker',
      destinationEmail: undefined,
      aliasAddress: undefined,
      aliasLabel: undefined,
    };
  }

  // Strip a "+tag" suffix so "alias+shop@domain" resolves to "alias".
  if (settings['subaddressing'] === true) {
    const plusIndex: Worker_Router_ResolveRoute_PlusIndex = localPart.indexOf('+');

    if (plusIndex > 0) {
      localPart = localPart.slice(0, plusIndex);
    }
  }

  const alias: Worker_Router_ResolveRoute_Alias = config['aliases'].find((configAlias) => configAlias['address'] === localPart);

  if (alias === undefined) {
    if (settings['unknown_alias_action'] === 'forward') {
      const defaultDestination: Worker_Router_ResolveRoute_DefaultDestination = config['destinations'].find((destination) => destination['name'] === settings['default_destination']);

      if (defaultDestination !== undefined) {
        return {
          action: 'forward',
          reason: 'Unknown alias forwarded to the default destination',
          destinationEmail: defaultDestination['email'],
          aliasAddress: undefined,
          aliasLabel: undefined,
        };
      }
    }

    return {
      action: refusalAction,
      reason: 'Address not found',
      destinationEmail: undefined,
      aliasAddress: undefined,
      aliasLabel: undefined,
    };
  }

  if (alias['enabled'] === false) {
    return {
      action: refusalAction,
      reason: 'Address is disabled',
      destinationEmail: undefined,
      aliasAddress: alias['address'],
      aliasLabel: alias['label'],
    };
  }

  const expiresAt: Worker_Router_ResolveRoute_ExpiresAt = alias['expires_at'];

  if (expiresAt !== undefined && Date.parse(expiresAt) <= now) {
    return {
      action: refusalAction,
      reason: 'Address has expired',
      destinationEmail: undefined,
      aliasAddress: alias['address'],
      aliasLabel: alias['label'],
    };
  }

  const blockedSenders: Worker_Router_ResolveRoute_BlockedSenders = alias['blocked_senders'] ?? [];
  const allowedSenders: Worker_Router_ResolveRoute_AllowedSenders = alias['allowed_senders'];
  const normalizedSender: Worker_Router_ResolveRoute_NormalizedSender = sender.toLowerCase();

  if (blockedSenders.some((blockedSender) => matchesSender(normalizedSender, blockedSender)) === true) {
    return {
      action: refusalAction,
      reason: 'Sender is blocked',
      destinationEmail: undefined,
      aliasAddress: alias['address'],
      aliasLabel: alias['label'],
    };
  }

  if (
    allowedSenders !== undefined
    && allowedSenders.some((allowedSender) => matchesSender(normalizedSender, allowedSender)) === false
  ) {
    return {
      action: refusalAction,
      reason: 'Sender is not allowed',
      destinationEmail: undefined,
      aliasAddress: alias['address'],
      aliasLabel: alias['label'],
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
    };
  }

  return {
    action: 'forward',
    reason: 'Alias forwarded to its destination',
    destinationEmail: destination['email'],
    aliasAddress: alias['address'],
    aliasLabel: alias['label'],
  };
}

export {
  matchesSender,
  resolveRoute,
};
