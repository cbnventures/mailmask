import { describe, expect, it } from 'vitest';

import { Runner as PushoverNotifier } from '../../../lib/notifiers/pushover.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Pushover - Pushover Adapter.
 *
 * @since 1.2.0
 */
describe('Pushover adapter', () => {
  it('builds its exact request and owns validation', () => {
    expect(new PushoverNotifier({
      type: 'pushover',
      name: 'pushover',
      user_key: 'user-key',
      app_token: 'app-token',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://api.pushover.net/1/messages.json',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'app-token',
        user: 'user-key',
        title: 'Mailmask <alert>',
        message: 'Message <&>.',
        priority: 0,
      }),
    });

    expect(PushoverNotifier.validate({
      type: 'pushover',
      name: 'pushover',
      user_key: 'user-key',
      app_token: 'app-token',
    })).toBe(true);

    expect(PushoverNotifier.validate({
      type: 'pushover',
      name: 'pushover',
      user_key: '',
      app_token: 'app-token',
    })).toBe(false);

    return;
  });

  return;
});
