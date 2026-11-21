import { describe, expect, it } from 'vitest';

import { Runner as NtfyNotifier } from '../../../lib/notifiers/ntfy.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Ntfy - Ntfy Adapter.
 *
 * @since 1.2.0
 */
describe('ntfy adapter', () => {
  it('builds its exact request and owns validation', () => {
    expect(new NtfyNotifier({
      type: 'ntfy',
      name: 'ntfy',
      server: 'https://ntfy.example.com',
      topic: 'mailmask',
      token: 'tk_test',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://ntfy.example.com',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer tk_test',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'mailmask',
        title: 'Mailmask <alert>',
        message: 'Message <&>.',
        priority: 3,
        tags: ['email'],
      }),
    });

    expect(NtfyNotifier.validate({
      type: 'ntfy',
      name: 'ntfy',
      server: 'https://ntfy.example.com',
      topic: 'mailmask',
      token: 'tk_test',
    })).toBe(true);

    expect(NtfyNotifier.validate({
      type: 'ntfy',
      name: 'ntfy',
      server: 'https://ntfy.example.com',
      topic: 'mailmask',
      token: 'token',
    })).toBe(false);

    return;
  });

  return;
});
