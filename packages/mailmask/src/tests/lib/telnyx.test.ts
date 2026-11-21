import { generateKeyPairSync, sign } from 'node:crypto';

import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { Runner as TelnyxAdapter } from '../../lib/telnyx.js';

import type {
  Tests_Lib_Telnyx_BuyNumber_OrdersTheNumberAndReturnsTheOrderStatus_FetchSpy,
  Tests_Lib_Telnyx_BuyNumber_OrdersTheNumberAndReturnsTheOrderStatus_RequestBody,
  Tests_Lib_Telnyx_ConnectNumbers_CreatesTheMessagingProfileAndAssignsEveryNumber_Connected,
  Tests_Lib_Telnyx_ConnectNumbers_CreatesTheMessagingProfileAndAssignsEveryNumber_FetchSpy,
  Tests_Lib_Telnyx_ConnectNumbers_CreatesTheMessagingProfileAndAssignsEveryNumber_ProfileBody,
  Tests_Lib_Telnyx_ConnectNumbers_LimitsTheProfileToTheConfiguredDestinationCountries_FetchSpy,
  Tests_Lib_Telnyx_ConnectNumbers_LimitsTheProfileToTheConfiguredDestinationCountries_ProfileBody,
  Tests_Lib_Telnyx_InboundBody,
  Tests_Lib_Telnyx_Now,
  Tests_Lib_Telnyx_ParseInboundMessage_IgnoresStatusEventsAndBrokenBodies_StatusBody,
  Tests_Lib_Telnyx_ParseInboundMessage_ReadsTheSenderRecipientsTextAndMedia_Message,
  Tests_Lib_Telnyx_Provider,
  Tests_Lib_Telnyx_ReleaseNumber_LooksUpTheNumberIDAndDeletesIt_FetchSpy,
  Tests_Lib_Telnyx_SearchNumbers_SearchesSMSNumbersInAnAreaCode_FetchSpy,
  Tests_Lib_Telnyx_SearchNumbers_SearchesSMSNumbersInAnAreaCode_Numbers,
  Tests_Lib_Telnyx_SearchNumbers_SearchesSMSNumbersInAnAreaCode_RequestUrl,
  Tests_Lib_Telnyx_SendMessage_PostsTheForwardedTextWithItsMedia_FetchSpy,
  Tests_Lib_Telnyx_SendMessage_PostsTheForwardedTextWithItsMedia_RequestBody,
  Tests_Lib_Telnyx_SendMessage_PostsTheForwardedTextWithItsMedia_RequestInit,
  Tests_Lib_Telnyx_SignWebhook_Body,
  Tests_Lib_Telnyx_SignWebhook_KeyPair,
  Tests_Lib_Telnyx_SignWebhook_PublicKey,
  Tests_Lib_Telnyx_SignWebhook_Returns,
  Tests_Lib_Telnyx_SignWebhook_Signature,
  Tests_Lib_Telnyx_SignWebhook_Timestamp,
  Tests_Lib_Telnyx_VerifyWebhook_AcceptsAValidSignature_Signed,
  Tests_Lib_Telnyx_VerifyWebhook_RefusesMissingHeadersAndBadPublicKeys_Signed,
  Tests_Lib_Telnyx_VerifyWebhook_RefusesStaleTimestamps_Signed,
  Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_OtherSigned,
  Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_Signed,
} from '../../types/tests/lib/telnyx.test.d.ts';

afterEach(() => {
  vi.restoreAllMocks();

  return;
});

const now: Tests_Lib_Telnyx_Now = Date.parse('2026-11-20T12:00:00.000Z');

const provider: Tests_Lib_Telnyx_Provider = {
  type: 'telnyx',
  name: 'telnyx',
  api_key: 'KEY_TEST_ONLY',
  public_key: 'cHVibGljLWtleS1wbGFjZWhvbGRlci0zMi1ieXRlcyE=',
};

const inboundBody: Tests_Lib_Telnyx_InboundBody = JSON.stringify({
  data: {
    event_type: 'message.received',
    id: 'event-1',
    payload: {
      id: 'message-1',
      from: { phone_number: '+15550100200' },
      to: [{ phone_number: '+15550100100' }],
      text: 'Your code is 123456',
      media: [{ url: 'https://media.example.com/photo.jpg' }],
    },
  },
});

/**
 * Tests - Lib - Telnyx - Sign Webhook.
 *
 * Signs a webhook with a fresh Ed25519 key from Node's own crypto, so the
 * adapter is checked against an independent implementation.
 *
 * @param {Tests_Lib_Telnyx_SignWebhook_Body}      body      - Body.
 * @param {Tests_Lib_Telnyx_SignWebhook_Timestamp} timestamp - Timestamp.
 *
 * @returns {Tests_Lib_Telnyx_SignWebhook_Returns}
 *
 * @since 1.2.0
 */
async function signWebhook(body: Tests_Lib_Telnyx_SignWebhook_Body, timestamp: Tests_Lib_Telnyx_SignWebhook_Timestamp): Tests_Lib_Telnyx_SignWebhook_Returns {
  const keyPair: Tests_Lib_Telnyx_SignWebhook_KeyPair = generateKeyPairSync('ed25519');

  // An Ed25519 SPKI key is a 12-byte header followed by the 32-byte raw key Telnyx shows in its portal.
  const publicKey: Tests_Lib_Telnyx_SignWebhook_PublicKey = keyPair.publicKey.export({
    type: 'spki',
    format: 'der',
  }).subarray(12).toString('base64');
  const signature: Tests_Lib_Telnyx_SignWebhook_Signature = sign(null, Buffer.from(`${timestamp}|${body}`), keyPair.privateKey).toString('base64');

  return {
    provider: {
      ...provider,
      public_key: publicKey,
    },
    webhook: {
      url: 'https://mail.example.com/phone/telnyx/messages',
      headers: new Headers({
        'telnyx-signature-ed25519': signature,
        'telnyx-timestamp': timestamp,
      }),
      body,
    },
  };
}

/**
 * Tests - Lib - Telnyx - Verify Webhook.
 *
 * @since 1.2.0
 */
describe('verifyWebhook', () => {
  it('accepts a valid signature', async () => {
    const signed: Tests_Lib_Telnyx_VerifyWebhook_AcceptsAValidSignature_Signed = await signWebhook(inboundBody, String(now / 1000));

    await expect(TelnyxAdapter.verifyWebhook(signed['provider'], signed['webhook'], now)).resolves.toBe(true);

    return;
  });

  it('refuses tampered bodies and other keys', async () => {
    const signed: Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_Signed = await signWebhook(inboundBody, String(now / 1000));
    const otherSigned: Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_OtherSigned = await signWebhook(inboundBody, String(now / 1000));

    await expect(TelnyxAdapter.verifyWebhook(signed['provider'], {
      ...signed['webhook'],
      body: inboundBody.replace('123456', '654321'),
    }, now)).resolves.toBe(false);

    await expect(TelnyxAdapter.verifyWebhook(otherSigned['provider'], signed['webhook'], now)).resolves.toBe(false);

    return;
  });

  it('refuses stale timestamps', async () => {
    const signed: Tests_Lib_Telnyx_VerifyWebhook_RefusesStaleTimestamps_Signed = await signWebhook(inboundBody, String((now / 1000) - 301));

    await expect(TelnyxAdapter.verifyWebhook(signed['provider'], signed['webhook'], now)).resolves.toBe(false);

    await expect(TelnyxAdapter.verifyWebhook(signed['provider'], signed['webhook'], now - 2000)).resolves.toBe(true);

    return;
  });

  it('refuses missing headers and bad public keys', async () => {
    const signed: Tests_Lib_Telnyx_VerifyWebhook_RefusesMissingHeadersAndBadPublicKeys_Signed = await signWebhook(inboundBody, String(now / 1000));

    await expect(TelnyxAdapter.verifyWebhook(signed['provider'], {
      ...signed['webhook'],
      headers: new Headers({ 'telnyx-timestamp': String(now / 1000) }),
    }, now)).resolves.toBe(false);

    await expect(TelnyxAdapter.verifyWebhook({
      ...signed['provider'],
      public_key: 'not base64!',
    }, signed['webhook'], now)).resolves.toBe(false);

    await expect(TelnyxAdapter.verifyWebhook({
      ...signed['provider'],
      public_key: 'c2hvcnQ=',
    }, signed['webhook'], now)).resolves.toBe(false);

    await expect(TelnyxAdapter.verifyWebhook({
      type: 'plivo',
      name: 'plivo',
      auth_id: 'MATEST',
      auth_token: 'token',
    }, signed['webhook'], now)).rejects.toThrow('is not a Telnyx account');

    return;
  });

  return;
});

/**
 * Tests - Lib - Telnyx - Parse Inbound Message.
 *
 * @since 1.2.0
 */
describe('parseInboundMessage', () => {
  it('reads the sender, recipients, text, and media', () => {
    const message: Tests_Lib_Telnyx_ParseInboundMessage_ReadsTheSenderRecipientsTextAndMedia_Message = TelnyxAdapter.parseInboundMessage({
      url: 'https://mail.example.com/phone/telnyx/messages',
      headers: new Headers(),
      body: inboundBody,
    });

    expect(message).toEqual({
      messageId: 'message-1',
      from: '+15550100200',
      to: ['+15550100100'],
      text: 'Your code is 123456',
      mediaUrls: ['https://media.example.com/photo.jpg'],
    });

    return;
  });

  it('ignores status events and broken bodies', () => {
    const statusBody: Tests_Lib_Telnyx_ParseInboundMessage_IgnoresStatusEventsAndBrokenBodies_StatusBody = inboundBody.replace('message.received', 'message.finalized');

    expect(TelnyxAdapter.parseInboundMessage({
      url: 'https://mail.example.com/phone/telnyx/messages',
      headers: new Headers(),
      body: statusBody,
    })).toBeUndefined();

    expect(TelnyxAdapter.parseInboundMessage({
      url: 'https://mail.example.com/phone/telnyx/messages',
      headers: new Headers(),
      body: '{not json',
    })).toBeUndefined();

    return;
  });

  return;
});

/**
 * Tests - Lib - Telnyx - Send Message.
 *
 * @since 1.2.0
 */
describe('sendMessage', () => {
  it('posts the forwarded text with its media', async () => {
    const fetchSpy: Tests_Lib_Telnyx_SendMessage_PostsTheForwardedTextWithItsMedia_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"data":{"id":"sent-1"}}', { status: 200 }));

    await TelnyxAdapter.sendMessage(provider, {
      from: '+15550100100',
      to: '+15550100300',
      text: 'From +15550100200: hello',
      mediaUrls: ['https://media.example.com/photo.jpg'],
    });

    const requestInit: Tests_Lib_Telnyx_SendMessage_PostsTheForwardedTextWithItsMedia_RequestInit = fetchSpy.mock.calls[0]![1];
    const requestBody: Tests_Lib_Telnyx_SendMessage_PostsTheForwardedTextWithItsMedia_RequestBody = JSON.parse(String(requestInit!['body']));

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://api.telnyx.com/v2/messages');

    expect(new Headers(requestInit!['headers']).get('Authorization')).toBe('Bearer KEY_TEST_ONLY');

    expect(requestBody).toEqual({
      from: '+15550100100',
      to: '+15550100300',
      text: 'From +15550100200: hello',
      media_urls: ['https://media.example.com/photo.jpg'],
    });

    fetchSpy.mockResolvedValue(new Response('{"errors":[]}', { status: 422 }));

    await expect(TelnyxAdapter.sendMessage(provider, {
      from: '+15550100100',
      to: '+15550100300',
      text: 'hello',
      mediaUrls: [],
    })).rejects.toThrow('HTTP 422');

    return;
  });

  return;
});

/**
 * Tests - Lib - Telnyx - Search Numbers.
 *
 * @since 1.2.0
 */
describe('searchNumbers', () => {
  it('searches SMS numbers in an area code', async () => {
    const fetchSpy: Tests_Lib_Telnyx_SearchNumbers_SearchesSMSNumbersInAnAreaCode_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      data: [{
        phone_number: '+15550100400',
        features: [
          { name: 'sms' },
          { name: 'mms' },
        ],
      }],
    }), { status: 200 }));
    const numbers: Tests_Lib_Telnyx_SearchNumbers_SearchesSMSNumbersInAnAreaCode_Numbers = await TelnyxAdapter.searchNumbers(provider, {
      countryCode: 'US',
      areaCode: '555',
      limit: 5,
    });
    const requestUrl: Tests_Lib_Telnyx_SearchNumbers_SearchesSMSNumbersInAnAreaCode_RequestUrl = new URL(String(fetchSpy.mock.calls[0]![0]));

    expect(numbers).toEqual([{
      number: '+15550100400',
      features: [
        'sms',
        'mms',
      ],
    }]);

    expect(requestUrl.searchParams.get('filter[national_destination_code]')).toBe('555');

    expect(requestUrl.searchParams.get('filter[features]')).toBe('sms');

    expect(requestUrl.searchParams.get('filter[limit]')).toBe('5');

    return;
  });

  return;
});

/**
 * Tests - Lib - Telnyx - Buy Number.
 *
 * @since 1.2.0
 */
describe('buyNumber', () => {
  it('orders the number and returns the order status', async () => {
    const fetchSpy: Tests_Lib_Telnyx_BuyNumber_OrdersTheNumberAndReturnsTheOrderStatus_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      data: {
        id: 'order-1',
        status: 'pending',
      },
    }), { status: 200 }));

    await expect(TelnyxAdapter.buyNumber({
      ...provider,
      messaging_profile_id: 'profile-1',
    }, '+15550100400')).resolves.toBe('pending');

    const requestBody: Tests_Lib_Telnyx_BuyNumber_OrdersTheNumberAndReturnsTheOrderStatus_RequestBody = JSON.parse(String(fetchSpy.mock.calls[0]![1]!['body']));

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://api.telnyx.com/v2/number_orders');

    expect(requestBody).toEqual({
      phone_numbers: [{ phone_number: '+15550100400' }],
      messaging_profile_id: 'profile-1',
    });

    fetchSpy.mockResolvedValue(new Response(JSON.stringify({
      data: {
        id: 'order-2',
        status: 'failure',
      },
    }), { status: 200 }));

    await expect(TelnyxAdapter.buyNumber(provider, '+15550100400')).rejects.toThrow('could not complete the order');

    return;
  });

  return;
});

/**
 * Tests - Lib - Telnyx - Release Number.
 *
 * @since 1.2.0
 */
describe('releaseNumber', () => {
  it('looks up the number ID and deletes it', async () => {
    const fetchSpy: Tests_Lib_Telnyx_ReleaseNumber_LooksUpTheNumberIDAndDeletesIt_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (_input, init) => {
      if (init !== undefined && init['method'] === 'DELETE') {
        return new Response(null, { status: 200 });
      }

      return new Response(JSON.stringify({
        data: [{
          id: 'number-1',
          phone_number: '+15550100100',
        }],
      }), { status: 200 });
    });

    await expect(TelnyxAdapter.ownsNumber(provider, '+15550100100')).resolves.toBe(true);

    await expect(TelnyxAdapter.ownsNumber(provider, '+15550100999')).resolves.toBe(false);

    await TelnyxAdapter.releaseNumber(provider, '+15550100100');

    expect(fetchSpy.mock.calls.at(-1)![0]).toBe('https://api.telnyx.com/v2/phone_numbers/number-1');

    expect(fetchSpy.mock.calls.at(-1)![1]!['method']).toBe('DELETE');

    await expect(TelnyxAdapter.releaseNumber(provider, '+15550100999')).rejects.toThrow('is not on the Telnyx account');

    return;
  });

  return;
});

/**
 * Tests - Lib - Telnyx - Connect Numbers.
 *
 * @since 1.2.0
 */
describe('connectNumbers', () => {
  it('creates the messaging profile and assigns every number', async () => {
    const fetchSpy: Tests_Lib_Telnyx_ConnectNumbers_CreatesTheMessagingProfileAndAssignsEveryNumber_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(JSON.stringify({
      data: { id: 'profile-1' },
    }), { status: 200 }));
    const connected: Tests_Lib_Telnyx_ConnectNumbers_CreatesTheMessagingProfileAndAssignsEveryNumber_Connected = await TelnyxAdapter.connectNumbers(provider, [
      '+15550100100',
      '+15550100101',
    ], 'https://mail.example.com');
    const profileBody: Tests_Lib_Telnyx_ConnectNumbers_CreatesTheMessagingProfileAndAssignsEveryNumber_ProfileBody = JSON.parse(String(fetchSpy.mock.calls[0]![1]!['body']));

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://api.telnyx.com/v2/messaging_profiles');

    expect(profileBody['webhook_url']).toBe('https://mail.example.com/phone/telnyx/messages');

    expect(profileBody['whitelisted_destinations']).toEqual(['*']);

    expect(fetchSpy.mock.calls.map((call) => call[0])).toContain('https://api.telnyx.com/v2/messaging_phone_numbers/%2B15550100101');

    expect(connected).toEqual({
      ...provider,
      messaging_profile_id: 'profile-1',
    });

    return;
  });

  it('limits the profile to the configured destination countries', async () => {
    const fetchSpy: Tests_Lib_Telnyx_ConnectNumbers_LimitsTheProfileToTheConfiguredDestinationCountries_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(JSON.stringify({
      data: { id: 'profile-1' },
    }), { status: 200 }));

    await TelnyxAdapter.connectNumbers({
      ...provider,
      messaging_profile_id: 'profile-1',
      destination_countries: [
        'US',
        'CA',
      ],
    }, ['+15550100100'], 'https://mail.example.com');

    const profileBody: Tests_Lib_Telnyx_ConnectNumbers_LimitsTheProfileToTheConfiguredDestinationCountries_ProfileBody = JSON.parse(String(fetchSpy.mock.calls[0]![1]!['body']));

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://api.telnyx.com/v2/messaging_profiles/profile-1');

    expect(fetchSpy.mock.calls[0]![1]!['method']).toBe('PATCH');

    expect(profileBody['whitelisted_destinations']).toEqual([
      'US',
      'CA',
    ]);

    return;
  });

  return;
});
