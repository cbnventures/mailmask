import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { configSchema } from '../../lib/schema.js';
import { handleEmail } from '../../worker/handlers.js';
import {
  buildForwardedMessage,
  buildReverseAddress,
  buildSentMessage,
  decodeReverseTag,
  parseAddress,
  readFirstHeaderValue,
  splitRawMessage,
} from '../../worker/relay.js';

import type {
  Tests_Worker_Relay_BaseConfig,
  Tests_Worker_Relay_BuildForwardedMessage_RewritesTheSenderAndKeepsTheBody_Forwarded,
  Tests_Worker_Relay_BuildSentMessage_KeepsOnlyContentAndThreadingHeaders_Sent,
  Tests_Worker_Relay_Crlf,
  Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_ConsoleWarnSpy,
  Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_EmailBinding,
  Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message,
  Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_EmailBinding,
  Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_ForwardedText,
  Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message,
  Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_SentMessages,
  Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_EmailBinding,
  Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message,
  Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_EmailBinding,
  Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message,
  Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_SentMessages,
  Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_SentText,
  Tests_Worker_Relay_InboundRaw,
  Tests_Worker_Relay_Now,
  Tests_Worker_Relay_ParseAddress_ReadsTheFirstAddressWithOrWithoutADisplayName_Address,
  Tests_Worker_Relay_ReadFirstHeaderValue_ReadsOnlyTheTopMostCopyOfAHeader_Value,
  Tests_Worker_Relay_ReplyRaw,
  Tests_Worker_Relay_ReverseAddresses_EncodesAndDecodesASenderInTheAliasTag_LongSender,
  Tests_Worker_Relay_SendConfig,
  Tests_Worker_Relay_SplitRawMessage_KeepsFoldedHeaderLinesTogether_Split,
  Tests_Worker_Relay_TestEmailMessage_Constructor_From,
  Tests_Worker_Relay_TestEmailMessage_Constructor_Raw,
  Tests_Worker_Relay_TestEmailMessage_Constructor_To,
  Tests_Worker_Relay_TestEmailMessage_From,
  Tests_Worker_Relay_TestEmailMessage_Raw,
  Tests_Worker_Relay_TestEmailMessage_To,
  Tests_Worker_Relay_ToBytes_Returns,
  Tests_Worker_Relay_ToBytes_Text,
} from '../../types/tests/worker/relay.test.d.ts';

afterEach(() => {
  vi.restoreAllMocks();

  return;
});

/**
 * Tests - Worker - Relay.
 *
 * Stands in for Cloudflare's EmailMessage from "cloudflare:email", which only
 * exists inside Workers, and keeps what the handler passed to it.
 *
 * @since 1.2.0
 */
class TestEmailMessage {
  /**
   * Tests - Worker - Relay - Test Email Message - From.
   *
   * Envelope sender the handler gave the message.
   *
   * @since 1.2.0
   */
  public readonly from: Tests_Worker_Relay_TestEmailMessage_From;

  /**
   * Tests - Worker - Relay - Test Email Message - To.
   *
   * Envelope recipient the handler gave the message.
   *
   * @since 1.2.0
   */
  public readonly to: Tests_Worker_Relay_TestEmailMessage_To;

  /**
   * Tests - Worker - Relay - Test Email Message - Raw.
   *
   * Rebuilt raw message the handler gave the message.
   *
   * @since 1.2.0
   */
  public readonly raw: Tests_Worker_Relay_TestEmailMessage_Raw;

  /**
   * Tests - Worker - Relay - Constructor.
   *
   * Keeps the envelope and raw message so a test can read them back after
   * the handler sends the message through the fake binding.
   *
   * @param {Tests_Worker_Relay_TestEmailMessage_Constructor_From} from - From.
   * @param {Tests_Worker_Relay_TestEmailMessage_Constructor_To}   to   - To.
   * @param {Tests_Worker_Relay_TestEmailMessage_Constructor_Raw}  raw  - Raw.
   *
   * @since 1.2.0
   */
  public constructor(from: Tests_Worker_Relay_TestEmailMessage_Constructor_From, to: Tests_Worker_Relay_TestEmailMessage_Constructor_To, raw: Tests_Worker_Relay_TestEmailMessage_Constructor_Raw) {
    this.from = from;
    this.to = to;
    this.raw = raw;

    return;
  }
}

const now: Tests_Worker_Relay_Now = Date.parse('2026-11-20T12:00:00.000Z');

const crlf: Tests_Worker_Relay_Crlf = String.fromCharCode(13, 10);

const inboundRaw: Tests_Worker_Relay_InboundRaw = [
  'Received: from mx.store.example.com',
  'DKIM-Signature: v=1; d=store.example.com;',
  '  b=abc',
  'From: Store News <news@store.example.com>',
  'To: shop@mail.example.com',
  'Subject: Sale',
  'Message-ID: <m1@store.example.com>',
  'Content-Type: text/plain; charset=utf-8',
  '',
  'Hello there',
  '',
].join(crlf);

const replyRaw: Tests_Worker_Relay_ReplyRaw = [
  'Authentication-Results: mx.cloudflare.net; dkim=pass header.d=inbox.test; dmarc=pass header.from=inbox.test',
  'Authentication-Results: other.example.com; dmarc=fail',
  'From: Me Myself <me@inbox.test>',
  'To: shop+news=store.example.com@mail.example.com',
  'Subject: Re: Sale',
  'In-Reply-To: <m1@store.example.com>',
  'X-Mailer: Private Client',
  'Message-ID: <reply-1@inbox.test>',
  'Content-Type: text/plain',
  '',
  'Thanks!',
  '',
].join(crlf);

const baseConfig: Tests_Worker_Relay_BaseConfig = {
  destinations: [{
    name: 'personal',
    email: 'me@inbox.test',
  }],
  aliases: [{
    address: 'shop',
    destination: 'personal',
    label: 'Shopping',
    enabled: true,
  }],
  notifiers: [],
  settings: {
    worker_name: 'mailmask',
    base_domain: 'mail.example.com',
    subaddressing: true,
    add_alias_headers: true,
    send_from_aliases: true,
  },
};

const sendConfig: Tests_Worker_Relay_SendConfig = configSchema.parse(baseConfig);

/**
 * Tests - Worker - Relay - To Bytes.
 *
 * Encodes a test message as the bytes the relay helpers read.
 *
 * @param {Tests_Worker_Relay_ToBytes_Text} text - Text.
 *
 * @returns {Tests_Worker_Relay_ToBytes_Returns}
 *
 * @since 1.2.0
 */
function toBytes(text: Tests_Worker_Relay_ToBytes_Text): Tests_Worker_Relay_ToBytes_Returns {
  return new TextEncoder().encode(text);
}

/**
 * Tests - Worker - Relay - Reverse Addresses.
 *
 * @since 1.2.0
 */
describe('reverse addresses', () => {
  it('encodes and decodes a sender in the alias tag', () => {
    const longSender: Tests_Worker_Relay_ReverseAddresses_EncodesAndDecodesASenderInTheAliasTag_LongSender = `${'a'.repeat(60)}@store.example.com`;

    expect(buildReverseAddress('shop', 'News@Store.example.com', 'mail.example.com')).toBe('shop+news=store.example.com@mail.example.com');

    expect(decodeReverseTag('news=store.example.com')).toBe('news@store.example.com');

    expect(decodeReverseTag('a+b=c=store.example.com')).toBe('a+b=c@store.example.com');

    expect(decodeReverseTag('promo')).toBeUndefined();

    expect(buildReverseAddress('shop', longSender, 'mail.example.com')).toBeUndefined();

    expect(buildReverseAddress('shop', 'not-an-address', 'mail.example.com')).toBeUndefined();

    return;
  });

  return;
});

/**
 * Tests - Worker - Relay - Parse Address.
 *
 * @since 1.2.0
 */
describe('parseAddress', () => {
  it('reads the first address with or without a display name', () => {
    const address: Tests_Worker_Relay_ParseAddress_ReadsTheFirstAddressWithOrWithoutADisplayName_Address = parseAddress('Store News <News@Store.example.com>');

    expect(address).toBe('news@store.example.com');

    expect(parseAddress('news@store.example.com, other@store.example.com')).toBe('news@store.example.com');

    expect(parseAddress('undisclosed-recipients:;')).toBeUndefined();

    expect(parseAddress(null)).toBeUndefined();

    return;
  });

  return;
});

/**
 * Tests - Worker - Relay - Split Raw Message.
 *
 * @since 1.2.0
 */
describe('splitRawMessage', () => {
  it('keeps folded header lines together', () => {
    const split: Tests_Worker_Relay_SplitRawMessage_KeepsFoldedHeaderLinesTogether_Split = splitRawMessage(toBytes(inboundRaw));

    expect(split['headers'][1]).toBe([
      'DKIM-Signature: v=1; d=store.example.com;',
      '  b=abc',
    ].join(crlf));

    expect(new TextDecoder().decode(split['body'])).toBe([
      'Hello there',
      '',
    ].join(crlf));

    return;
  });

  return;
});

/**
 * Tests - Worker - Relay - Build Forwarded Message.
 *
 * @since 1.2.0
 */
describe('buildForwardedMessage', () => {
  it('rewrites the sender and keeps the body', () => {
    const forwarded: Tests_Worker_Relay_BuildForwardedMessage_RewritesTheSenderAndKeepsTheBody_Forwarded = new TextDecoder().decode(buildForwardedMessage(toBytes(inboundRaw), 'shop+news=store.example.com@mail.example.com', 'news@store.example.com', ['X-Mailmask-Alias: shop@mail.example.com']));

    expect(forwarded).toContain('From: "news@store.example.com" <shop+news=store.example.com@mail.example.com>');

    expect(forwarded).toContain('Reply-To: shop+news=store.example.com@mail.example.com');

    expect(forwarded).toContain('X-Mailmask-Alias: shop@mail.example.com');

    expect(forwarded).toContain('Subject: Sale');

    expect(forwarded).not.toContain('DKIM-Signature');

    expect(forwarded).not.toContain('Store News <news@store.example.com>');

    expect(forwarded.endsWith([
      '',
      '',
      'Hello there',
      '',
    ].join(crlf))).toBe(true);

    return;
  });

  return;
});

/**
 * Tests - Worker - Relay - Build Sent Message.
 *
 * @since 1.2.0
 */
describe('buildSentMessage', () => {
  it('keeps only content and threading headers', () => {
    const sent: Tests_Worker_Relay_BuildSentMessage_KeepsOnlyContentAndThreadingHeaders_Sent = new TextDecoder().decode(buildSentMessage(toBytes(replyRaw), 'shop@mail.example.com', 'news@store.example.com', 'mail.example.com'));

    expect(sent).toContain('From: shop@mail.example.com');

    expect(sent).toContain('To: news@store.example.com');

    expect(sent).toContain('Subject: Re: Sale');

    expect(sent).toContain('In-Reply-To: <m1@store.example.com>');

    expect(sent).toContain('@mail.example.com>');

    expect(sent).not.toContain('me@inbox.test');

    expect(sent).not.toContain('Me Myself');

    expect(sent).not.toContain('Private Client');

    expect(sent).not.toContain('inbox.test');

    return;
  });

  return;
});

/**
 * Tests - Worker - Relay - Read First Header Value.
 *
 * @since 1.2.0
 */
describe('readFirstHeaderValue', () => {
  it('reads only the top-most copy of a header', () => {
    const value: Tests_Worker_Relay_ReadFirstHeaderValue_ReadsOnlyTheTopMostCopyOfAHeader_Value = readFirstHeaderValue(toBytes(replyRaw), 'Authentication-Results');

    expect(value).toBe('mx.cloudflare.net; dkim=pass header.d=inbox.test; dmarc=pass header.from=inbox.test');

    expect(readFirstHeaderValue(toBytes(inboundRaw), 'authentication-results')).toBeUndefined();

    return;
  });

  return;
});

/**
 * Tests - Worker - Relay - Handle Email.
 *
 * @since 1.2.0
 */
describe('handleEmail', () => {
  it('forwards from a reply address', async () => {
    const sentMessages: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_SentMessages = [];
    const emailBinding: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_EmailBinding = {
      send: vi.fn(async (outboundMessage) => {
        sentMessages.push(outboundMessage);

        return { messageId: 'sent-1' };
      }),
    };
    const message: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message = {
      to: 'shop@mail.example.com',
      from: 'bounce-123@store.example.com',
      headers: new Headers({ from: 'Store News <news@store.example.com>' }),
      raw: new Blob([inboundRaw]).stream(),
      forward: vi.fn(async () => ({ messageId: 'forwarded' })),
      setReject: vi.fn(),
    };

    await handleEmail(message, sendConfig, now, { waitUntil: vi.fn() }, emailBinding, TestEmailMessage);

    expect(message['forward']).not.toHaveBeenCalled();

    expect(sentMessages).toHaveLength(1);

    expect(sentMessages[0]).toBeInstanceOf(TestEmailMessage);

    expect(sentMessages[0]).toMatchObject({
      from: 'shop+news=store.example.com@mail.example.com',
      to: 'me@inbox.test',
    });

    const forwardedText: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_ForwardedText = await new Response(Reflect.get(sentMessages[0] ?? {}, 'raw')).text();

    expect(forwardedText).toContain('Reply-To: shop+news=store.example.com@mail.example.com');

    expect(forwardedText).toContain('X-Mailmask-Label: Shopping');

    return;
  });

  it('sends the users reply from the alias', async () => {
    const sentMessages: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_SentMessages = [];
    const emailBinding: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_EmailBinding = {
      send: vi.fn(async (outboundMessage) => {
        sentMessages.push(outboundMessage);

        return { messageId: 'sent-1' };
      }),
    };
    const message: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message = {
      to: 'shop+news=store.example.com@mail.example.com',
      from: 'me@inbox.test',
      headers: new Headers({ from: 'Me Myself <me@inbox.test>' }),
      raw: new Blob([replyRaw]).stream(),
      forward: vi.fn(async () => ({ messageId: 'forwarded' })),
      setReject: vi.fn(),
    };

    await handleEmail(message, sendConfig, now, { waitUntil: vi.fn() }, emailBinding, TestEmailMessage);

    expect(message['setReject']).not.toHaveBeenCalled();

    expect(message['forward']).not.toHaveBeenCalled();

    expect(sentMessages[0]).toMatchObject({
      from: 'shop@mail.example.com',
      to: 'news@store.example.com',
    });

    const sentText: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_SentText = await new Response(Reflect.get(sentMessages[0] ?? {}, 'raw')).text();

    expect(sentText).not.toContain('inbox.test');

    expect(sentText).toContain('Thanks!');

    return;
  });

  it('refuses mail that failed DMARC', async () => {
    const emailBinding: Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_EmailBinding = {
      send: vi.fn(async () => ({ messageId: 'sent-1' })),
    };
    const message: Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message = {
      to: 'shop+news=store.example.com@mail.example.com',
      from: 'me@inbox.test',
      headers: new Headers({ from: 'me@inbox.test' }),
      raw: new Blob([inboundRaw]).stream(),
      forward: vi.fn(async () => ({ messageId: 'forwarded' })),
      setReject: vi.fn(),
    };

    await handleEmail(message, sendConfig, now, { waitUntil: vi.fn() }, emailBinding, TestEmailMessage);

    expect(message['setReject']).toHaveBeenCalledWith('Sender could not be verified');

    expect(emailBinding['send']).not.toHaveBeenCalled();

    return;
  });

  it('falls back to a plain forward when the binding fails', async () => {
    const consoleWarnSpy: Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_ConsoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const emailBinding: Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_EmailBinding = {
      send: vi.fn(async () => Promise.reject(new Error('E_SENDER_DOMAIN_NOT_AVAILABLE'))),
    };
    const message: Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message = {
      to: 'shop@mail.example.com',
      from: 'news@store.example.com',
      headers: new Headers({ from: 'news@store.example.com' }),
      raw: new Blob([inboundRaw]).stream(),
      forward: vi.fn(async () => ({ messageId: 'forwarded' })),
      setReject: vi.fn(),
    };

    await handleEmail(message, sendConfig, now, { waitUntil: vi.fn() }, emailBinding, TestEmailMessage);

    expect(message['forward']).toHaveBeenCalledWith('me@inbox.test', expect.any(Headers));

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

    return;
  });

  return;
});
