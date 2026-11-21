import { describe, expect, it } from 'vitest';

import { configSchema } from '../../lib/schema.js';
import { matchesSender, resolveRoute } from '../../worker/router.js';

import type {
  Tests_Worker_Router_BaseConfig,
  Tests_Worker_Router_MatchesSender_MatchesExactAddressesCaseInsensitively_Matched,
  Tests_Worker_Router_MatchesSender_MatchesWholeDomainWildcardsOnly_Matched,
  Tests_Worker_Router_Now,
  Tests_Worker_Router_ResolveRoute_AppliesBlockedSendersBeforeAllowedSenders_Config,
  Tests_Worker_Router_ResolveRoute_DoesNotStripTagsWhenSubaddressingIsOff_Config,
  Tests_Worker_Router_ResolveRoute_ForwardsAnActiveAliasToItsDestination_Decision,
  Tests_Worker_Router_ResolveRoute_IgnoresCaseAndStripsSubaddressTags_Decision,
  Tests_Worker_Router_ResolveRoute_RefusesDisabledExpiredAndForeignRecipients_Config,
  Tests_Worker_Router_ResolveRoute_RejectsUnknownRecipientsAndRefusalsInsteadOfForwardingThem_Config,
  Tests_Worker_Router_ResolveRoute_SendsMailFromTheAliasInboxToAReplyAddressThroughTheAlias_Config,
} from '../../types/tests/worker/router.test.d.ts';

const now: Tests_Worker_Router_Now = Date.parse('2026-10-24T12:00:00.000Z');

const baseConfig: Tests_Worker_Router_BaseConfig = {
  destinations: [
    {
      name: 'personal',
      email: 'me@inbox.test',
    },
    {
      name: 'spam',
      email: 'spam@inbox.test',
    },
  ],
  aliases: [
    {
      address: 'shop',
      destination: 'personal',
      label: 'Shopping',
      enabled: true,
    },
    {
      address: 'old',
      destination: 'personal',
      enabled: false,
    },
    {
      address: 'trial',
      destination: 'personal',
      enabled: true,
      expires_at: '2026-10-01T00:00:00.000Z',
    },
    {
      address: 'bank',
      destination: 'personal',
      enabled: true,
      allowed_senders: ['*@bank.test'],
      blocked_senders: ['phish@bank.test'],
    },
  ],
  notifiers: [],
  settings: {
    worker_name: 'mailmask',
    base_domain: 'mail.example.com',
    subaddressing: true,
    add_alias_headers: true,
  },
};

/**
 * Tests - Worker - Router - Matches Sender.
 *
 * @since 0.0.1
 */
describe('matchesSender', () => {
  it('matches exact addresses case-insensitively', () => {
    const matched: Tests_Worker_Router_MatchesSender_MatchesExactAddressesCaseInsensitively_Matched = matchesSender('news@shop.test', 'News@Shop.test');

    expect(matched).toBe(true);

    expect(matchesSender('other@shop.test', 'news@shop.test')).toBe(false);

    return;
  });

  it('matches whole-domain wildcards only', () => {
    const matched: Tests_Worker_Router_MatchesSender_MatchesWholeDomainWildcardsOnly_Matched = matchesSender('a@shop.test', '*@shop.test');

    expect(matched).toBe(true);

    expect(matchesSender('a@eu.shop.test', '*@shop.test')).toBe(false);

    return;
  });

  return;
});

/**
 * Tests - Worker - Router - Resolve Route.
 *
 * @since 0.0.1
 */
describe('resolveRoute', () => {
  it('forwards an active alias to its destination', () => {
    const decision: Tests_Worker_Router_ResolveRoute_ForwardsAnActiveAliasToItsDestination_Decision = resolveRoute('shop@mail.example.com', 'store@shop.test', configSchema.parse(baseConfig), now);

    expect(decision).toStrictEqual({
      action: 'forward',
      reason: 'Alias forwarded to its destination',
      destinationEmail: 'me@inbox.test',
      aliasAddress: 'shop',
      aliasLabel: 'Shopping',
      recipientEmail: undefined,
    });

    return;
  });

  it('sends mail from the alias inbox to a reply address through the alias', () => {
    const config: Tests_Worker_Router_ResolveRoute_SendsMailFromTheAliasInboxToAReplyAddressThroughTheAlias_Config = configSchema.parse(baseConfig);

    Reflect.set(config['settings'], 'send_from_aliases', true);

    expect(resolveRoute('shop+news=store.example.com@mail.example.com', 'bounce@inbox.test', config, now, 'Me@Inbox.test')).toStrictEqual({
      action: 'send',
      reason: 'Mail sent from the alias',
      destinationEmail: 'me@inbox.test',
      aliasAddress: 'shop',
      aliasLabel: 'Shopping',
      recipientEmail: 'news@store.example.com',
    });

    expect(resolveRoute('old+news=store.example.com@mail.example.com', 'me@inbox.test', config, now, 'me@inbox.test')).toMatchObject({
      action: 'reject',
      reason: 'Address is disabled',
    });

    expect(resolveRoute('shop+news=store.example.com@mail.example.com', 'news@store.example.com', config, now, 'news@store.example.com')['action']).toBe('forward');

    Reflect.set(config['settings'], 'send_from_aliases', false);

    expect(resolveRoute('shop+news=store.example.com@mail.example.com', 'me@inbox.test', config, now, 'me@inbox.test')['action']).toBe('forward');

    return;
  });

  it('ignores case and strips subaddress tags', () => {
    const decision: Tests_Worker_Router_ResolveRoute_IgnoresCaseAndStripsSubaddressTags_Decision = resolveRoute('Shop+Promo@Mail.Example.com', 'store@shop.test', configSchema.parse(baseConfig), now);

    expect(decision['action']).toBe('forward');

    return;
  });

  it('does not strip tags when subaddressing is off', () => {
    const config: Tests_Worker_Router_ResolveRoute_DoesNotStripTagsWhenSubaddressingIsOff_Config = configSchema.parse(baseConfig);

    Reflect.set(config['settings'], 'subaddressing', false);

    expect(resolveRoute('shop+promo@mail.example.com', 'store@shop.test', config, now)['reason']).toBe('Address not found');

    return;
  });

  it('refuses disabled, expired, and foreign recipients', () => {
    const config: Tests_Worker_Router_ResolveRoute_RefusesDisabledExpiredAndForeignRecipients_Config = configSchema.parse(baseConfig);

    expect(resolveRoute('old@mail.example.com', 'a@b.test', config, now)['reason']).toBe('Address is disabled');

    expect(resolveRoute('trial@mail.example.com', 'a@b.test', config, now)['reason']).toBe('Address has expired');

    expect(resolveRoute('shop@elsewhere.test', 'a@b.test', config, now)['action']).toBe('reject');

    return;
  });

  it('applies blocked senders before allowed senders', () => {
    const config: Tests_Worker_Router_ResolveRoute_AppliesBlockedSendersBeforeAllowedSenders_Config = configSchema.parse(baseConfig);

    expect(resolveRoute('bank@mail.example.com', 'alerts@bank.test', config, now)['action']).toBe('forward');

    expect(resolveRoute('bank@mail.example.com', 'phish@bank.test', config, now)['reason']).toBe('Sender is blocked');

    expect(resolveRoute('bank@mail.example.com', 'x@evil.test', config, now)['reason']).toBe('Sender is not allowed');

    return;
  });

  it('rejects unknown recipients and refusals instead of forwarding them', () => {
    const config: Tests_Worker_Router_ResolveRoute_RejectsUnknownRecipientsAndRefusalsInsteadOfForwardingThem_Config = configSchema.parse(baseConfig);

    expect(resolveRoute('nobody@mail.example.com', 'a@b.test', config, now)).toStrictEqual({
      action: 'reject',
      reason: 'Address not found',
      destinationEmail: undefined,
      aliasAddress: undefined,
      aliasLabel: undefined,
      recipientEmail: undefined,
    });

    expect(resolveRoute('old@mail.example.com', 'a@b.test', config, now)['action']).toBe('reject');

    return;
  });

  return;
});
