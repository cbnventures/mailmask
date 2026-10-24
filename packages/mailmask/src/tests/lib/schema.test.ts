import { describe, expect, it } from 'vitest';

import { aliasSchema, notifierSchema } from '../../lib/schema.js';

import type {
  Tests_Lib_Schema_AliasSchema_ValidatesAddressesExpiryAndSenderRules_Result,
  Tests_Lib_Schema_NotifierSchema_RequiresHttpsAndNtfyTokens_Result,
} from '../../types/tests/lib/schema.test.d.ts';

/**
 * Tests - Lib - Schema - Alias Schema.
 *
 * @since 0.0.1
 */
describe('aliasSchema', () => {
  it('validates addresses, expiry, and sender rules', () => {
    const result: Tests_Lib_Schema_AliasSchema_ValidatesAddressesExpiryAndSenderRules_Result = aliasSchema.safeParse({
      address: 'velvet-harbor-42',
      destination: 'personal',
      enabled: true,
      expires_at: '2026-12-31T00:00:00.000Z',
      allowed_senders: [
        '*@shop.test',
        'news@shop.test',
      ],
    });

    expect(result['success']).toBe(true);

    expect(aliasSchema.safeParse({
      address: '-bad',
      destination: 'personal',
      enabled: true,
    })['success']).toBe(false);

    expect(aliasSchema.safeParse({
      address: 'ok',
      destination: 'personal',
      enabled: true,
      allowed_senders: ['shop.test'],
    })['success']).toBe(false);

    return;
  });

  return;
});

/**
 * Tests - Lib - Schema - Notifier Schema.
 *
 * @since 0.0.1
 */
describe('notifierSchema', () => {
  it('requires https and ntfy tokens', () => {
    const result: Tests_Lib_Schema_NotifierSchema_RequiresHttpsAndNtfyTokens_Result = notifierSchema.safeParse({
      type: 'ntfy-reverse-proxy',
      name: 'proxy',
      url: 'http://alerts.ntfy.example.com',
    });

    expect(result['success']).toBe(false);

    expect(notifierSchema.safeParse({
      type: 'ntfy',
      name: 'phone',
      server: 'https://ntfy.example.com',
      topic: 'alerts',
      token: 'not-a-token',
    })['success']).toBe(false);

    expect(notifierSchema.safeParse({
      type: 'ntfy-reverse-proxy',
      name: 'proxy',
      url: 'https://alerts.ntfy.example.com',
    })['success']).toBe(true);

    return;
  });

  return;
});
