import { describe, expect, it } from 'vitest';

import { Runner as DiscordNotifier } from '../../../lib/notifiers/discord.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Discord - Discord Adapter.
 *
 * @since 1.2.0
 */
describe('Discord adapter', () => {
  it('builds its exact request and owns validation', () => {
    expect(new DiscordNotifier({
      type: 'discord',
      name: 'discord',
      webhook_url: 'https://discord.com/api/webhooks/one/two',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://discord.com/api/webhooks/one/two',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          color: 3_113_463,
          description: 'Message <&>.',
          timestamp: '2026-11-20T12:00:00.000Z',
          title: 'Mailmask <alert>',
        }],
      }),
    });

    expect(DiscordNotifier.validate({
      type: 'discord',
      name: 'discord',
      webhook_url: 'https://discordapp.com/api/webhooks/one/two',
    })).toBe(true);

    expect(DiscordNotifier.validate({
      type: 'discord',
      name: 'discord',
      webhook_url: 'https://example.com/webhook',
    })).toBe(false);

    return;
  });

  return;
});
