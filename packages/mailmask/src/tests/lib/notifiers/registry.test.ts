import { describe, expect, it } from 'vitest';

import { Runner as EmailNotifier } from '../../../lib/notifiers/email.js';
import { Runner as NotifierRegistry } from '../../../lib/notifiers/registry.js';
import { Runner as WebhookNotifier } from '../../../lib/notifiers/webhook.js';

/**
 * Tests - Lib - Notifiers - Registry - Notifier Registry.
 *
 * @since 1.2.0
 */
describe('Notifier registry', () => {
  it('selects adapters and routes validation', () => {
    expect(NotifierRegistry.create({
      type: 'email',
      name: 'email',
      from: 'mailmask@example.com',
      to: 'owner@example.com',
    })).toBeInstanceOf(EmailNotifier);

    expect(NotifierRegistry.createHttp({
      type: 'webhook',
      name: 'webhook',
      url: 'https://webhook.example.com/mailmask',
    })).toBeInstanceOf(WebhookNotifier);

    expect(NotifierRegistry.validate({
      type: 'ntfy',
      name: 'ntfy',
      server: 'https://ntfy.example.com',
      topic: 'mailmask',
      token: 'tk_test',
    })).toBe(true);

    expect(NotifierRegistry.validate({
      type: 'ntfy',
      name: 'ntfy',
      server: 'http://ntfy.example.com',
      topic: 'mailmask',
      token: 'bad',
    })).toBe(false);

    return;
  });

  return;
});
