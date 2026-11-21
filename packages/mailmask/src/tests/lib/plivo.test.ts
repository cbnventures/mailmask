import { createHmac } from 'node:crypto';

import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { Runner as PlivoAdapter } from '../../lib/plivo.js';

import type {
  Tests_Lib_Plivo_ConnectNumbers_CreatesTheApplicationAndLinksEveryNumber_ApplicationBody,
  Tests_Lib_Plivo_ConnectNumbers_CreatesTheApplicationAndLinksEveryNumber_Connected,
  Tests_Lib_Plivo_ConnectNumbers_CreatesTheApplicationAndLinksEveryNumber_FetchSpy,
  Tests_Lib_Plivo_InboundBody,
  Tests_Lib_Plivo_Nonce,
  Tests_Lib_Plivo_ParseInboundMessage_ReadsFormFieldsAndOrdersMediaByNumber_Message,
  Tests_Lib_Plivo_Provider,
  Tests_Lib_Plivo_ReleaseNumber_ChecksAndReleasesNumbersWithoutThePlus_FetchSpy,
  Tests_Lib_Plivo_SendMessage_PostsAnMMSWithBasicAuth_FetchSpy,
  Tests_Lib_Plivo_SendMessage_PostsAnMMSWithBasicAuth_RequestBody,
  Tests_Lib_Plivo_SendMessage_PostsAnMMSWithBasicAuth_RequestInit,
  Tests_Lib_Plivo_SignString_Returns,
  Tests_Lib_Plivo_SignString_Value,
  Tests_Lib_Plivo_VerifyWebhook_AcceptsAnyOfSeveralCommaSeparatedSignatures_Signature,
  Tests_Lib_Plivo_VerifyWebhook_AcceptsTheV3SignatureOverTheURLSortedFieldsAndNonce_SignedString,
  Tests_Lib_Plivo_VerifyWebhook_RefusesWrongTokensTamperedFieldsAndMissingHeaders_Signature,
  Tests_Lib_Plivo_WebhookUrl,
} from '../../types/tests/lib/plivo.test.d.ts';

afterEach(() => {
  vi.restoreAllMocks();

  return;
});

const provider: Tests_Lib_Plivo_Provider = {
  type: 'plivo',
  name: 'plivo',
  auth_id: 'MATESTONLY0000000000',
  auth_token: 'test-auth-token-only',
};

const webhookUrl: Tests_Lib_Plivo_WebhookUrl = 'https://mail.example.com/phone/plivo/messages';

const nonce: Tests_Lib_Plivo_Nonce = '05429567804466091622';

const inboundBody: Tests_Lib_Plivo_InboundBody = 'From=15550100200&To=15550100100&Text=Your+code+is+123456&Type=mms&MessageUUID=message-1&Media10=https%3A%2F%2Fmedia.example.com%2F11.jpg&Media2=https%3A%2F%2Fmedia.example.com%2F3.jpg&Media0=https%3A%2F%2Fmedia.example.com%2F1.jpg';

/**
 * Tests - Lib - Plivo - Sign String.
 *
 * Signs a string the way Plivo does, with Node's own HMAC, so the adapter is
 * checked against an independent implementation.
 *
 * @param {Tests_Lib_Plivo_SignString_Value} value - Value.
 *
 * @returns {Tests_Lib_Plivo_SignString_Returns}
 *
 * @since 1.2.0
 */
function signString(value: Tests_Lib_Plivo_SignString_Value): Tests_Lib_Plivo_SignString_Returns {
  return createHmac('sha256', provider['auth_token']).update(value).digest('base64');
}

/**
 * Tests - Lib - Plivo - Verify Webhook.
 *
 * @since 1.2.0
 */
describe('verifyWebhook', () => {
  it('accepts the V3 signature over the URL sorted fields and nonce', async () => {
    const signedString: Tests_Lib_Plivo_VerifyWebhook_AcceptsTheV3SignatureOverTheURLSortedFieldsAndNonce_SignedString = [
      `${webhookUrl}?`,
      'From15550100200',
      'Media0https://media.example.com/1.jpg',
      'Media10https://media.example.com/11.jpg',
      'Media2https://media.example.com/3.jpg',
      'MessageUUIDmessage-1',
      'TextYour code is 123456',
      'To15550100100',
      'Typemms',
      `.${nonce}`,
    ].join('');

    await expect(PlivoAdapter.verifyWebhook(provider, {
      url: webhookUrl,
      headers: new Headers({
        'x-plivo-signature-v3': signString(signedString),
        'x-plivo-signature-v3-nonce': nonce,
      }),
      body: inboundBody,
    })).resolves.toBe(true);

    return;
  });

  it('accepts any of several comma separated signatures', async () => {
    const signature: Tests_Lib_Plivo_VerifyWebhook_AcceptsAnyOfSeveralCommaSeparatedSignatures_Signature = signString(`${webhookUrl}?a=1&b=2.FromX.${nonce}`);

    await expect(PlivoAdapter.verifyWebhook(provider, {
      url: `${webhookUrl}?b=2&a=1`,
      headers: new Headers({
        'x-plivo-signature-v3': `old-signature,${signature}`,
        'x-plivo-signature-v3-nonce': nonce,
      }),
      body: 'From=X',
    })).resolves.toBe(true);

    return;
  });

  it('refuses wrong tokens tampered fields and missing headers', async () => {
    const signature: Tests_Lib_Plivo_VerifyWebhook_RefusesWrongTokensTamperedFieldsAndMissingHeaders_Signature = signString(`${webhookUrl}?FromX.${nonce}`);

    await expect(PlivoAdapter.verifyWebhook(provider, {
      url: webhookUrl,
      headers: new Headers({
        'x-plivo-signature-v3': signature,
        'x-plivo-signature-v3-nonce': nonce,
      }),
      body: 'From=X',
    })).resolves.toBe(true);

    await expect(PlivoAdapter.verifyWebhook(provider, {
      url: webhookUrl,
      headers: new Headers({
        'x-plivo-signature-v3': signature,
        'x-plivo-signature-v3-nonce': nonce,
      }),
      body: 'From=Y',
    })).resolves.toBe(false);

    await expect(PlivoAdapter.verifyWebhook({
      ...provider,
      auth_token: 'another-token',
    }, {
      url: webhookUrl,
      headers: new Headers({
        'x-plivo-signature-v3': signature,
        'x-plivo-signature-v3-nonce': nonce,
      }),
      body: 'From=X',
    })).resolves.toBe(false);

    await expect(PlivoAdapter.verifyWebhook(provider, {
      url: webhookUrl,
      headers: new Headers({ 'x-plivo-signature-v3': signature }),
      body: 'From=X',
    })).resolves.toBe(false);

    return;
  });

  return;
});

/**
 * Tests - Lib - Plivo - Parse Inbound Message.
 *
 * @since 1.2.0
 */
describe('parseInboundMessage', () => {
  it('reads form fields and orders media by number', () => {
    const message: Tests_Lib_Plivo_ParseInboundMessage_ReadsFormFieldsAndOrdersMediaByNumber_Message = PlivoAdapter.parseInboundMessage({
      url: webhookUrl,
      headers: new Headers(),
      body: inboundBody,
    });

    expect(message).toEqual({
      messageId: 'message-1',
      from: '+15550100200',
      to: ['+15550100100'],
      text: 'Your code is 123456',
      mediaUrls: [
        'https://media.example.com/1.jpg',
        'https://media.example.com/3.jpg',
        'https://media.example.com/11.jpg',
      ],
    });

    expect(PlivoAdapter.parseInboundMessage({
      url: webhookUrl,
      headers: new Headers(),
      body: 'From=15550100200&To=15550100100&Type=whatsapp&MessageUUID=message-2',
    })).toBeUndefined();

    expect(PlivoAdapter.parseInboundMessage({
      url: webhookUrl,
      headers: new Headers(),
      body: 'To=15550100100',
    })).toBeUndefined();

    return;
  });

  return;
});

/**
 * Tests - Lib - Plivo - Send Message.
 *
 * @since 1.2.0
 */
describe('sendMessage', () => {
  it('posts an MMS with basic auth', async () => {
    const fetchSpy: Tests_Lib_Plivo_SendMessage_PostsAnMMSWithBasicAuth_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"message_uuid":["sent-1"]}', { status: 202 }));

    await PlivoAdapter.sendMessage(provider, {
      from: '+15550100100',
      to: '+15550100300',
      text: 'From +15550100200: hello',
      mediaUrls: ['https://media.example.com/1.jpg'],
    });

    const requestInit: Tests_Lib_Plivo_SendMessage_PostsAnMMSWithBasicAuth_RequestInit = fetchSpy.mock.calls[0]![1];
    const requestBody: Tests_Lib_Plivo_SendMessage_PostsAnMMSWithBasicAuth_RequestBody = JSON.parse(String(requestInit!['body']));

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://api.plivo.com/v1/Account/MATESTONLY0000000000/Message/');

    expect(new Headers(requestInit!['headers']).get('Authorization')).toBe(`Basic ${Buffer.from('MATESTONLY0000000000:test-auth-token-only').toString('base64')}`);

    expect(requestBody).toEqual({
      src: '15550100100',
      dst: '15550100300',
      text: 'From +15550100200: hello',
      log: false,
      type: 'mms',
      media_urls: ['https://media.example.com/1.jpg'],
    });

    return;
  });

  return;
});

/**
 * Tests - Lib - Plivo - Release Number.
 *
 * @since 1.2.0
 */
describe('releaseNumber', () => {
  it('checks and releases numbers without the plus', async () => {
    const fetchSpy: Tests_Lib_Plivo_ReleaseNumber_ChecksAndReleasesNumbersWithoutThePlus_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      if (init !== undefined && init['method'] === 'DELETE') {
        return new Response(null, { status: 204 });
      }

      if (String(input).includes('15550100999') === true) {
        return new Response('{"error":"not found"}', { status: 404 });
      }

      return new Response('{"number":"15550100100"}', { status: 200 });
    });

    await expect(PlivoAdapter.ownsNumber(provider, '+15550100100')).resolves.toBe(true);

    await expect(PlivoAdapter.ownsNumber(provider, '+15550100999')).resolves.toBe(false);

    await PlivoAdapter.releaseNumber(provider, '+15550100100');

    expect(fetchSpy.mock.calls.at(-1)![0]).toBe('https://api.plivo.com/v1/Account/MATESTONLY0000000000/Number/15550100100/');

    expect(fetchSpy.mock.calls.at(-1)![1]!['method']).toBe('DELETE');

    return;
  });

  return;
});

/**
 * Tests - Lib - Plivo - Connect Numbers.
 *
 * @since 1.2.0
 */
describe('connectNumbers', () => {
  it('creates the application and links every number', async () => {
    const fetchSpy: Tests_Lib_Plivo_ConnectNumbers_CreatesTheApplicationAndLinksEveryNumber_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('{"app_id":"application-1"}', { status: 201 }));
    const connected: Tests_Lib_Plivo_ConnectNumbers_CreatesTheApplicationAndLinksEveryNumber_Connected = await PlivoAdapter.connectNumbers(provider, ['+15550100100'], 'https://mail.example.com');
    const applicationBody: Tests_Lib_Plivo_ConnectNumbers_CreatesTheApplicationAndLinksEveryNumber_ApplicationBody = JSON.parse(String(fetchSpy.mock.calls[0]![1]!['body']));

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://api.plivo.com/v1/Account/MATESTONLY0000000000/Application/');

    expect(applicationBody['message_url']).toBe('https://mail.example.com/phone/plivo/messages');

    expect(applicationBody['answer_url']).toBe('https://mail.example.com/phone/plivo/messages');

    expect(applicationBody['log_incoming_messages']).toBe(false);

    expect(fetchSpy.mock.calls[1]![0]).toBe('https://api.plivo.com/v1/Account/MATESTONLY0000000000/Number/15550100100/');

    expect(connected).toEqual({
      ...provider,
      application_id: 'application-1',
    });

    return;
  });

  return;
});
