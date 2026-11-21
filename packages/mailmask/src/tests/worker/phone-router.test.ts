import { describe, expect, it } from 'vitest';

import { resolvePhoneRoute } from '../../worker/phone-router.js';

import type {
  Tests_Worker_PhoneRouter_BaseConfig,
  Tests_Worker_PhoneRouter_Now,
  Tests_Worker_PhoneRouter_ResolvePhoneRoute_AppliesBlockedSendersBeforeAllowedSenders_Config,
  Tests_Worker_PhoneRouter_ResolvePhoneRoute_ForwardsAnActiveNumberToTheDestinationPhone_Decision,
  Tests_Worker_PhoneRouter_ResolvePhoneRoute_RefusesUnknownDisabledExpiredAndMisconfiguredNumbers_UnknownDecision,
  Tests_Worker_PhoneRouter_ResolvePhoneRoute_SendsTextsFromTheDestinationPhoneThroughTheAlias_Decision,
} from '../../types/tests/worker/phone-router.test.d.ts';

const now: Tests_Worker_PhoneRouter_Now = Date.parse('2026-11-20T12:00:00.000Z');

const baseConfig: Tests_Worker_PhoneRouter_BaseConfig = {
  destinations: [
    {
      name: 'personal',
      email: 'me@inbox.test',
      phone: '+15550100300',
    },
    {
      name: 'inbox-only',
      email: 'other@inbox.test',
    },
  ],
  aliases: [],
  phone_providers: [
    {
      type: 'telnyx',
      name: 'telnyx',
      api_key: 'KEY_TEST_ONLY',
      public_key: 'cHVibGljLWtleS1wbGFjZWhvbGRlci0zMi1ieXRlcyE=',
    },
    {
      type: 'plivo',
      name: 'plivo',
      auth_id: 'MATESTONLY0000000000',
      auth_token: 'test-auth-token-only',
    },
  ],
  phone_aliases: [
    {
      number: '+15550100100',
      provider: 'telnyx',
      destination: 'personal',
      label: 'Food delivery',
      enabled: true,
    },
    {
      number: '+15550100101',
      provider: 'plivo',
      destination: 'personal',
      enabled: true,
    },
    {
      number: '+15550100102',
      provider: 'telnyx',
      destination: 'personal',
      enabled: false,
    },
    {
      number: '+15550100103',
      provider: 'telnyx',
      destination: 'personal',
      enabled: true,
      expires_at: '2026-11-01T00:00:00.000Z',
    },
    {
      number: '+15550100104',
      provider: 'telnyx',
      destination: 'inbox-only',
      enabled: true,
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
 * Tests - Worker - Phone Router - Resolve Phone Route.
 *
 * @since 1.2.0
 */
describe('resolvePhoneRoute', () => {
  it('forwards an active number to the destination phone', () => {
    const decision: Tests_Worker_PhoneRouter_ResolvePhoneRoute_ForwardsAnActiveNumberToTheDestinationPhone_Decision = resolvePhoneRoute(['+15550100100'], '+15550100200', 'Your code is 123456', 'telnyx', baseConfig, now);

    expect(decision).toEqual({
      action: 'forward',
      reason: 'Text forwarded to its destination',
      aliasNumber: '+15550100100',
      aliasLabel: 'Food delivery',
      recipient: '+15550100300',
      text: '+15550100200: Your code is 123456',
    });

    expect(resolvePhoneRoute([
      '+15550100999',
      '+15550100101',
    ], '+15550100200', 'hello', 'plivo', baseConfig, now)['recipient']).toBe('+15550100300');

    return;
  });

  it('sends texts from the destination phone through the alias', () => {
    const decision: Tests_Worker_PhoneRouter_ResolvePhoneRoute_SendsTextsFromTheDestinationPhoneThroughTheAlias_Decision = resolvePhoneRoute(['+15550100100'], '+15550100300', '+1 (555) 010-0200: On my way', 'telnyx', baseConfig, now);

    expect(decision).toEqual({
      action: 'send',
      reason: 'Text sent from the phone alias',
      aliasNumber: '+15550100100',
      aliasLabel: 'Food delivery',
      recipient: '+15550100200',
      text: 'On my way',
    });

    expect(resolvePhoneRoute(['+15550100100'], '+15550100300', '12345: STOP', 'telnyx', baseConfig, now)).toMatchObject({
      action: 'send',
      recipient: '12345',
      text: 'STOP',
    });

    expect(resolvePhoneRoute(['+15550100100'], '+15550100300', 'On my way', 'telnyx', baseConfig, now)).toMatchObject({
      action: 'help',
      recipient: '+15550100300',
      text: expect.stringContaining('+15550100123: Hello'),
    });

    expect(resolvePhoneRoute(['+15550100102'], '+15550100300', '+15550100200: hi', 'telnyx', baseConfig, now)['reason']).toBe('Number is disabled');

    return;
  });

  it('refuses unknown, disabled, expired, and misconfigured numbers', () => {
    const unknownDecision: Tests_Worker_PhoneRouter_ResolvePhoneRoute_RefusesUnknownDisabledExpiredAndMisconfiguredNumbers_UnknownDecision = resolvePhoneRoute(['+15550100999'], '+15550100200', 'hello', 'telnyx', baseConfig, now);

    expect(unknownDecision).toMatchObject({
      action: 'reject',
      reason: 'Number not found',
      aliasNumber: undefined,
    });

    expect(resolvePhoneRoute(['+15550100101'], '+15550100200', 'hello', 'telnyx', baseConfig, now)['reason']).toBe('Number not found');

    expect(resolvePhoneRoute(['+15550100102'], '+15550100200', 'hello', 'telnyx', baseConfig, now)).toMatchObject({
      action: 'reject',
      reason: 'Number is disabled',
      aliasNumber: '+15550100102',
    });

    expect(resolvePhoneRoute(['+15550100103'], '+15550100200', 'hello', 'telnyx', baseConfig, now)['reason']).toBe('Number has expired');

    expect(resolvePhoneRoute(['+15550100103'], '+15550100200', 'hello', 'telnyx', baseConfig, Date.parse('2026-10-01T00:00:00.000Z'))['action']).toBe('forward');

    expect(resolvePhoneRoute(['+15550100104'], '+15550100200', 'hello', 'telnyx', baseConfig, now)['reason']).toBe('Number is misconfigured');

    return;
  });

  it('applies blocked senders before allowed senders', () => {
    const config: Tests_Worker_PhoneRouter_ResolvePhoneRoute_AppliesBlockedSendersBeforeAllowedSenders_Config = {
      ...baseConfig,
      phone_aliases: [{
        number: '+15550100100',
        provider: 'telnyx',
        destination: 'personal',
        enabled: true,
        allowed_senders: [
          '+1555*',
          '12345',
          'Acme Bank',
        ],
        blocked_senders: [
          '+15550100666',
          'SPAM*',
        ],
      }],
    };

    expect(resolvePhoneRoute(['+15550100100'], '+15550100200', 'hello', 'telnyx', config, now)['action']).toBe('forward');

    expect(resolvePhoneRoute(['+15550100100'], '12345', 'hello', 'telnyx', config, now)['action']).toBe('forward');

    expect(resolvePhoneRoute(['+15550100100'], 'ACME BANK', 'hello', 'telnyx', config, now)['action']).toBe('forward');

    expect(resolvePhoneRoute(['+15550100100'], '+15550100666', 'hello', 'telnyx', config, now)['reason']).toBe('Sender is blocked');

    expect(resolvePhoneRoute(['+15550100100'], 'SpamDeals', 'hello', 'telnyx', config, now)['reason']).toBe('Sender is blocked');

    expect(resolvePhoneRoute(['+15550100100'], '+14155550100', 'hello', 'telnyx', config, now)['reason']).toBe('Sender is not allowed');

    expect(resolvePhoneRoute(['+15550100100'], 'ACME', 'hello', 'telnyx', config, now)['reason']).toBe('Sender is not allowed');

    return;
  });

  return;
});
