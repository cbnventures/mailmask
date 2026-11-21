import { describe, expect, it } from 'vitest';

import { Runner as AppriseNotifier } from '../../../lib/notifiers/apprise.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Apprise - Apprise Adapter.
 *
 * @since 1.2.0
 */
describe('Apprise adapter', () => {
  it('builds its exact request and owns validation', () => {
    expect(new AppriseNotifier({
      type: 'apprise',
      name: 'apprise',
      url: 'https://apprise.example.com/notify/mailmask',
      urls: 'discord://target',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://apprise.example.com/notify/mailmask',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: 'Message <&>.',
        title: 'Mailmask <alert>',
        type: 'info',
        urls: 'discord://target',
      }),
    });

    expect(AppriseNotifier.validate({
      type: 'apprise',
      name: 'apprise',
      url: 'https://apprise.example.com',
    })).toBe(true);

    expect(AppriseNotifier.validate({
      type: 'apprise',
      name: 'apprise',
      url: 'http://apprise.example.com',
    })).toBe(false);

    return;
  });

  return;
});
