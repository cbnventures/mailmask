import { describe, expect, it } from 'vitest';

import { Runner as WebhookNotifier } from '../../../lib/notifiers/webhook.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Webhook - Webhook Adapter.
 *
 * @since 1.2.0
 */
describe('Webhook adapter', () => {
  it('builds its exact request and owns validation', () => {
    expect(new WebhookNotifier({
      type: 'webhook',
      name: 'webhook',
      url: 'https://webhook.example.com/mailmask',
      token: 'webhook-token',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://webhook.example.com/mailmask',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer webhook-token',
      },
      body: JSON.stringify(createPayload()),
    });

    expect(WebhookNotifier.validate({
      type: 'webhook',
      name: 'webhook',
      url: 'https://webhook.example.com/mailmask',
    })).toBe(true);

    expect(WebhookNotifier.validate({
      type: 'webhook',
      name: 'webhook',
      url: 'http://webhook.example.com/mailmask',
    })).toBe(false);

    return;
  });

  return;
});
