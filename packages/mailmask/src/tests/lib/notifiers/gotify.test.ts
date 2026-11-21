import { describe, expect, it } from 'vitest';

import { Runner as GotifyNotifier } from '../../../lib/notifiers/gotify.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Gotify - Gotify Adapter.
 *
 * @since 1.2.0
 */
describe('Gotify adapter', () => {
  it('builds its exact request and owns validation', () => {
    expect(new GotifyNotifier({
      type: 'gotify',
      name: 'gotify',
      url: 'https://gotify.example.com/',
      token: 'gotify-token',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://gotify.example.com/message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gotify-Key': 'gotify-token',
      },
      body: JSON.stringify({
        message: 'Message <&>.',
        priority: 3,
        title: 'Mailmask <alert>',
      }),
    });

    expect(GotifyNotifier.validate({
      type: 'gotify',
      name: 'gotify',
      url: 'https://gotify.example.com',
      token: 'token',
    })).toBe(true);

    expect(GotifyNotifier.validate({
      type: 'gotify',
      name: 'gotify',
      url: 'http://gotify.example.com',
      token: 'token',
    })).toBe(false);

    return;
  });

  return;
});
