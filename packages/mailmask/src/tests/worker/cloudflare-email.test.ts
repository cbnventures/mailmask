import {
  describe, expect, it, vi,
} from 'vitest';

import { isDmarcPass, sendRawEmail, sendTextEmail } from '../../worker/cloudflare-email.js';

import type {
  Tests_Worker_CloudflareEmail_Crlf,
  Tests_Worker_CloudflareEmail_IsDmarcPass_TrustsOnlyTheFirstCloudflareAuthenticationResult_Passed,
  Tests_Worker_CloudflareEmail_SendRawEmail_SendsTheBytesAsAnEmailMessageStream_EmailBinding,
  Tests_Worker_CloudflareEmail_SendRawEmail_SendsTheBytesAsAnEmailMessageStream_SentMessages,
  Tests_Worker_CloudflareEmail_SendRawEmail_SendsTheBytesAsAnEmailMessageStream_SentText,
  Tests_Worker_CloudflareEmail_SendTextEmail_SendsTheStructuredMessage_EmailBinding,
  Tests_Worker_CloudflareEmail_SendTextEmail_SendsTheStructuredMessage_SentMessages,
  Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_From,
  Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_Raw,
  Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_To,
  Tests_Worker_CloudflareEmail_TestEmailMessage_From,
  Tests_Worker_CloudflareEmail_TestEmailMessage_Raw,
  Tests_Worker_CloudflareEmail_TestEmailMessage_To,
  Tests_Worker_CloudflareEmail_ToBytes_Returns,
  Tests_Worker_CloudflareEmail_ToBytes_Text,
} from '../../types/tests/worker/cloudflare-email.test.d.ts';

/**
 * Tests - Worker - Cloudflare Email.
 *
 * Stands in for Cloudflare's EmailMessage from "cloudflare:email", which only
 * exists inside Workers, and keeps what the adapter passed to it.
 *
 * @since 1.2.0
 */
class TestEmailMessage {
  /**
   * Tests - Worker - Cloudflare Email - From.
   *
   * Envelope sender the adapter gave the message.
   *
   * @since 1.2.0
   */
  public readonly from: Tests_Worker_CloudflareEmail_TestEmailMessage_From;

  /**
   * Tests - Worker - Cloudflare Email - To.
   *
   * Envelope recipient the adapter gave the message.
   *
   * @since 1.2.0
   */
  public readonly to: Tests_Worker_CloudflareEmail_TestEmailMessage_To;

  /**
   * Tests - Worker - Cloudflare Email - Raw.
   *
   * Raw message stream the adapter gave the message.
   *
   * @since 1.2.0
   */
  public readonly raw: Tests_Worker_CloudflareEmail_TestEmailMessage_Raw;

  /**
   * Tests - Worker - Cloudflare Email - Constructor.
   *
   * Keeps the envelope and raw message so a test can read them back after the
   * adapter sends the message through the fake binding.
   *
   * @param {Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_From} from - From.
   * @param {Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_To}   to   - To.
   * @param {Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_Raw}  raw  - Raw.
   *
   * @since 1.2.0
   */
  public constructor(from: Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_From, to: Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_To, raw: Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_Raw) {
    this.from = from;
    this.to = to;
    this.raw = raw;

    return;
  }
}

const crlf: Tests_Worker_CloudflareEmail_Crlf = String.fromCharCode(13, 10);

/**
 * Tests - Worker - Cloudflare Email - To Bytes.
 *
 * Encodes a test message as the bytes the adapter reads.
 *
 * @param {Tests_Worker_CloudflareEmail_ToBytes_Text} text - Text.
 *
 * @returns {Tests_Worker_CloudflareEmail_ToBytes_Returns}
 *
 * @since 1.2.0
 */
function toBytes(text: Tests_Worker_CloudflareEmail_ToBytes_Text): Tests_Worker_CloudflareEmail_ToBytes_Returns {
  return new TextEncoder().encode(text);
}

/**
 * Tests - Worker - Cloudflare Email - Is Dmarc Pass.
 *
 * @since 1.2.0
 */
describe('isDmarcPass', () => {
  it('trusts only the first Cloudflare authentication result', () => {
    const passed: Tests_Worker_CloudflareEmail_IsDmarcPass_TrustsOnlyTheFirstCloudflareAuthenticationResult_Passed = isDmarcPass(toBytes([
      'Authentication-Results: mx.cloudflare.net; dkim=pass header.d=inbox.test; dmarc=pass header.from=inbox.test',
      'Authentication-Results: other.example.com; dmarc=fail',
      '',
      'Body',
    ].join(crlf)));

    expect(passed).toBe(true);

    expect(isDmarcPass(toBytes([
      'Authentication-Results: other.example.com; dmarc=pass',
      'Authentication-Results: mx.cloudflare.net; dmarc=pass',
      '',
      'Body',
    ].join(crlf)))).toBe(false);

    expect(isDmarcPass(toBytes([
      'Authentication-Results: mx.cloudflare.net; dmarc=fail',
      '',
      'Body',
    ].join(crlf)))).toBe(false);

    expect(isDmarcPass(toBytes([
      'Subject: Hello',
      '',
      'Body',
    ].join(crlf)))).toBe(false);

    return;
  });

  return;
});

/**
 * Tests - Worker - Cloudflare Email - Send Raw Email.
 *
 * @since 1.2.0
 */
describe('sendRawEmail', () => {
  it('sends the bytes as an email message stream', async () => {
    const sentMessages: Tests_Worker_CloudflareEmail_SendRawEmail_SendsTheBytesAsAnEmailMessageStream_SentMessages = [];
    const emailBinding: Tests_Worker_CloudflareEmail_SendRawEmail_SendsTheBytesAsAnEmailMessageStream_EmailBinding = {
      send: vi.fn(async (outboundMessage) => {
        sentMessages.push(outboundMessage);

        return { messageId: 'sent-1' };
      }),
    };

    await sendRawEmail(emailBinding, TestEmailMessage, 'shop@mail.example.com', 'news@store.example.com', toBytes('Subject: Hi'));

    expect(sentMessages[0]).toBeInstanceOf(TestEmailMessage);

    expect(sentMessages[0]).toMatchObject({
      from: 'shop@mail.example.com',
      to: 'news@store.example.com',
    });

    const sentText: Tests_Worker_CloudflareEmail_SendRawEmail_SendsTheBytesAsAnEmailMessageStream_SentText = await new Response(Reflect.get(sentMessages[0] ?? {}, 'raw')).text();

    expect(sentText).toBe('Subject: Hi');

    return;
  });

  return;
});

/**
 * Tests - Worker - Cloudflare Email - Send Text Email.
 *
 * @since 1.2.0
 */
describe('sendTextEmail', () => {
  it('sends the structured message', async () => {
    const sentMessages: Tests_Worker_CloudflareEmail_SendTextEmail_SendsTheStructuredMessage_SentMessages = [];
    const emailBinding: Tests_Worker_CloudflareEmail_SendTextEmail_SendsTheStructuredMessage_EmailBinding = {
      send: vi.fn(async (outboundMessage) => {
        sentMessages.push(outboundMessage);

        return { messageId: 'sent-1' };
      }),
    };

    await sendTextEmail(emailBinding, {
      from: 'mailmask@mail.example.com',
      to: 'owner@example.com',
      subject: 'Mailmask refused a message',
      text: 'Body',
    });

    expect(sentMessages).toEqual([{
      from: 'mailmask@mail.example.com',
      to: 'owner@example.com',
      subject: 'Mailmask refused a message',
      text: 'Body',
    }]);

    return;
  });

  return;
});
