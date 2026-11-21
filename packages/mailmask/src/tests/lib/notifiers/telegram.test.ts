import { describe, expect, it } from 'vitest';

import { Runner as TelegramNotifier } from '../../../lib/notifiers/telegram.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Telegram - Telegram Adapter.
 *
 * @since 1.2.0
 */
describe('Telegram adapter', () => {
  it('builds its exact request and owns validation', () => {
    expect(new TelegramNotifier({
      type: 'telegram',
      name: 'telegram',
      bot_token: 'bot-token',
      chat_id: '-100123',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://api.telegram.org/botbot-token/sendMessage',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: '-100123',
        text: [
          'Mailmask <alert>',
          '',
          'Message <&>.',
        ].join('\n'),
        link_preview_options: { is_disabled: true },
      }),
    });

    expect(TelegramNotifier.validate({
      type: 'telegram',
      name: 'telegram',
      bot_token: 'bot-token',
      chat_id: '-100123',
    })).toBe(true);

    expect(TelegramNotifier.validate({
      type: 'telegram',
      name: 'telegram',
      bot_token: '',
      chat_id: '-100123',
    })).toBe(false);

    return;
  });

  return;
});
