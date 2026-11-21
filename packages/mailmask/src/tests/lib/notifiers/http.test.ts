import { describe, expect, it } from 'vitest';

import { Runner as HttpDelivery } from '../../../lib/notifiers/http.js';

/**
 * Tests - Lib - Notifiers - HTTP - HTTP Delivery.
 *
 * @since 1.2.0
 */
describe('HTTP delivery', () => {
  it('keeps shared URL trimming and failure wording', async () => {
    expect(HttpDelivery.trimTrailingSlashes('https://example.com///')).toBe('https://example.com');

    await expect(HttpDelivery.send({
      url: 'https://example.com',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    }, {
      emailBinding: undefined,
      fetch: () => Promise.reject(new Error('private network detail')),
      sendEmail: () => Promise.resolve(),
      signal: new AbortController().signal,
    })).rejects.toThrow('request failed.');

    await expect(HttpDelivery.send({
      url: 'https://example.com',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    }, {
      emailBinding: undefined,
      fetch: () => Promise.resolve(new Response('', { status: 503 })),
      sendEmail: () => Promise.resolve(),
      signal: new AbortController().signal,
    })).rejects.toThrow('returned HTTP 503.');

    return;
  });

  return;
});
