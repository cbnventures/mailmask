import { describe, expect, it } from 'vitest';

import { Runner as EmailNotifier } from '../../../lib/notifiers/email.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Email - Email Adapter.
 *
 * @since 1.2.0
 */
describe('Email adapter', () => {
  it('builds its exact message and owns validation', () => {
    expect(new EmailNotifier({
      type: 'email',
      name: 'email',
      from: 'mailmask@example.com',
      to: 'owner@example.com',
    }).buildMessage(createPayload())).toEqual({
      from: 'mailmask@example.com',
      to: 'owner@example.com',
      subject: 'Mailmask <alert>',
      text: [
        'Message <&>.',
        '',
        'Alias: old@example.com',
        'Envelope sender: sender@example.com',
        'Recipient: old@example.com',
        'Reason: filtered',
      ].join('\n'),
    });

    expect(EmailNotifier.validate({
      type: 'email',
      name: 'email',
      from: 'mailmask@example.com',
      to: 'owner@example.com',
    })).toBe(true);

    expect(EmailNotifier.validate({
      type: 'email',
      name: 'email',
      from: 'not-an-address',
      to: 'owner@example.com',
    })).toBe(false);

    return;
  });

  return;
});
