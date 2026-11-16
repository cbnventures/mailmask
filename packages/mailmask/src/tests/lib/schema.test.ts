import { describe, expect, it } from 'vitest';

import { aliasSchema, notifierSchema } from '../../lib/schema.js';

import type {
  Tests_Lib_Schema_AliasSchema_ValidatesAddressesExpiryAndSenderRules_Result,
  Tests_Lib_Schema_NotifierSchema_RequiresHttpsAndNtfyTokens_Result,
  Tests_Lib_Schema_NotifierSchema_ValidatesEverySupportedType_Notifiers,
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
  it('validates every supported type', () => {
    const notifiers: Tests_Lib_Schema_NotifierSchema_ValidatesEverySupportedType_Notifiers = [
      {
        type: 'apprise',
        name: 'apprise',
        url: 'https://apprise.example.com/notify',
        urls: 'discord://target',
      },
      {
        type: 'discord',
        name: 'discord',
        webhook_url: 'https://discord.com/api/webhooks/one/two',
      },
      {
        type: 'email',
        name: 'email',
        from: 'mailmask@example.com',
        to: 'owner@example.com',
      },
      {
        type: 'gotify',
        name: 'gotify',
        url: 'https://gotify.example.com',
        token: 'token',
      },
      {
        type: 'matrix',
        name: 'matrix',
        homeserver_url: 'https://matrix.example.com',
        room_id: '!room:example.com',
        access_token: 'token',
      },
      {
        type: 'ntfy',
        name: 'ntfy',
        server: 'https://ntfy.example.com',
        topic: 'mailmask',
        token: 'tk_token',
      },
      {
        type: 'ntfy-reverse-proxy',
        name: 'proxy',
        url: 'https://proxy.example.com/mailmask',
      },
      {
        type: 'pushover',
        name: 'pushover',
        user_key: 'user',
        app_token: 'token',
      },
      {
        type: 'slack',
        name: 'slack',
        webhook_url: 'https://hooks.slack.com/services/one/two/three',
      },
      {
        type: 'telegram',
        name: 'telegram',
        bot_token: 'token',
        chat_id: '-100123',
      },
      {
        type: 'webhook',
        name: 'webhook',
        url: 'https://webhook.example.com/mailmask',
        token: 'token',
      },
    ];

    for (const notifier of notifiers) {
      expect(notifierSchema.safeParse(notifier)['success']).toBe(true);
    }

    return;
  });

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

    expect(notifierSchema.safeParse({
      type: 'slack',
      name: 'slack',
      webhook_url: 'https://example.com/not-slack',
    })['success']).toBe(false);

    expect(notifierSchema.safeParse({
      type: 'email',
      name: 'email',
      from: 'not-an-email',
      to: 'owner@example.com',
    })['success']).toBe(false);

    return;
  });

  return;
});
