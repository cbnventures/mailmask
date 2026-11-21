import type { Tests_Lib_Notifiers_Fixtures_CreatePayload_Returns } from '../../../types/tests/lib/notifiers/fixtures.d.ts';

/**
 * Tests - Lib - Notifiers - Fixtures - Create Payload.
 *
 * Builds one stable refusal payload for exact adapter request comparisons.
 *
 * @returns {Tests_Lib_Notifiers_Fixtures_CreatePayload_Returns}
 *
 * @since 1.2.0
 */
export function createPayload(): Tests_Lib_Notifiers_Fixtures_CreatePayload_Returns {
  return {
    version: 1,
    app: 'mailmask',
    event: 'message-refused',
    title: 'Mailmask <alert>',
    message: 'Message <&>.',
    priority: 3,
    tags: ['email'],
    occurredAt: '2026-11-20T12:00:00.000Z',
    details: {
      alias: 'old@example.com',
      envelopeSender: 'sender@example.com',
      recipient: 'old@example.com',
      reason: 'filtered',
    },
  };
}
