import { describe, expect, it } from 'vitest';

import { Runner as NtfyReverseProxyNotifier } from '../../../lib/notifiers/ntfy-reverse-proxy.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Ntfy Reverse Proxy - Reverse Proxy For Ntfy Adapter.
 *
 * @since 1.2.0
 */
describe('Reverse Proxy for ntfy adapter', () => {
  it('builds its exact request and owns validation', () => {
    expect(new NtfyReverseProxyNotifier({
      type: 'ntfy-reverse-proxy',
      name: 'proxy',
      url: 'https://proxy.example.com/mailmask',
      token: 'proxy-token',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://proxy.example.com/mailmask',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer proxy-token',
      },
      body: JSON.stringify(createPayload()),
    });

    expect(NtfyReverseProxyNotifier.validate({
      type: 'ntfy-reverse-proxy',
      name: 'proxy',
      url: 'https://proxy.example.com/mailmask',
    })).toBe(true);

    expect(NtfyReverseProxyNotifier.validate({
      type: 'ntfy-reverse-proxy',
      name: 'proxy',
      url: 'http://proxy.example.com/mailmask',
    })).toBe(false);

    return;
  });

  return;
});
