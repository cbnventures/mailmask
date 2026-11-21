import { createHmac, generateKeyPairSync, sign } from 'node:crypto';

import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { configSchema } from '../../lib/schema.js';
import { createWorker } from '../../worker/index.js';
import { handlePhoneWebhook } from '../../worker/phone-handlers.js';

import type {
  Tests_Worker_PhoneHandlers_BaseConfig,
  Tests_Worker_PhoneHandlers_Config,
  Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_CallsResponse,
  Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_GetResponse,
  Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_PostResponse,
  Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_Worker,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_AnswersWithAnErrorWhenForwardingFails_ConsoleWarnSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_AnswersWithAnErrorWhenForwardingFails_Response,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_Context,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_FetchSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_Response,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_EndsPlivoCallsWithoutSendingAnything_FetchSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_EndsPlivoCallsWithoutSendingAnything_Response,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedPlivoTextToTheDestinationPhone_FetchSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedPlivoTextToTheDestinationPhone_RequestBody,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedPlivoTextToTheDestinationPhone_Response,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedTelnyxTextToTheDestinationPhone_FetchSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedTelnyxTextToTheDestinationPhone_RequestBody,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedTelnyxTextToTheDestinationPhone_Response,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_IgnoresDeliveryReceipts_FetchSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_IgnoresDeliveryReceipts_Response,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_RefusesBadSignaturesAndUnknownProviders_FetchSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_RefusesBadSignaturesAndUnknownProviders_Response,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_RefusesBadSignaturesAndUnknownProviders_UnknownResponse,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_SendsATextFromTheDestinationPhoneThroughTheAlias_FetchSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_SendsATextFromTheDestinationPhoneThroughTheAlias_RequestBody,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_SendsATextFromTheDestinationPhoneThroughTheAlias_Response,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_ConsoleWarnSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_FetchSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_NoticeBody,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_Response,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TextsHelpWhenTheDestinationPhoneLeavesOutTheNumber_FetchSpy,
  Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TextsHelpWhenTheDestinationPhoneLeavesOutTheNumber_RequestBody,
  Tests_Worker_PhoneHandlers_KeyPair,
  Tests_Worker_PhoneHandlers_Now,
  Tests_Worker_PhoneHandlers_PlivoRequest_Body,
  Tests_Worker_PhoneHandlers_PlivoRequest_Returns,
  Tests_Worker_PhoneHandlers_PlivoRequest_Signature,
  Tests_Worker_PhoneHandlers_PlivoRequest_Url,
  Tests_Worker_PhoneHandlers_PublicKey,
  Tests_Worker_PhoneHandlers_TelnyxBody_EventType,
  Tests_Worker_PhoneHandlers_TelnyxBody_From,
  Tests_Worker_PhoneHandlers_TelnyxBody_Returns,
  Tests_Worker_PhoneHandlers_TelnyxBody_Text,
  Tests_Worker_PhoneHandlers_TelnyxBody_To,
  Tests_Worker_PhoneHandlers_TelnyxRequest_Body,
  Tests_Worker_PhoneHandlers_TelnyxRequest_Returns,
  Tests_Worker_PhoneHandlers_TelnyxRequest_Signature,
  Tests_Worker_PhoneHandlers_TelnyxRequest_Timestamp,
} from '../../types/tests/worker/phone-handlers.test.d.ts';

afterEach(() => {
  vi.restoreAllMocks();

  return;
});

const now: Tests_Worker_PhoneHandlers_Now = Date.parse('2026-11-20T12:00:00.000Z');

const keyPair: Tests_Worker_PhoneHandlers_KeyPair = generateKeyPairSync('ed25519');

const publicKey: Tests_Worker_PhoneHandlers_PublicKey = keyPair.publicKey.export({
  type: 'spki',
  format: 'der',
}).subarray(12).toString('base64');

const baseConfig: Tests_Worker_PhoneHandlers_BaseConfig = {
  destinations: [{
    name: 'personal',
    email: 'me@inbox.test',
    phone: '+15550100300',
  }],
  aliases: [],
  phone_providers: [
    {
      type: 'telnyx',
      name: 'telnyx',
      api_key: 'KEY_TEST_ONLY',
      public_key: publicKey,
    },
    {
      type: 'plivo',
      name: 'plivo',
      auth_id: 'MATESTONLY0000000000',
      auth_token: 'test-auth-token-only',
    },
  ],
  phone_aliases: [
    {
      number: '+15550100100',
      provider: 'telnyx',
      destination: 'personal',
      label: 'Food delivery',
      enabled: true,
    },
    {
      number: '+15550100101',
      provider: 'plivo',
      destination: 'personal',
      enabled: true,
    },
    {
      number: '+15550100102',
      provider: 'telnyx',
      destination: 'personal',
      enabled: false,
    },
  ],
  notifiers: [{
    type: 'webhook',
    name: 'hook',
    url: 'https://notifications.example.com/mailmask',
  }],
  settings: {
    worker_name: 'mailmask',
    base_domain: 'mail.example.com',
    subaddressing: true,
    add_alias_headers: true,
  },
};

const config: Tests_Worker_PhoneHandlers_Config = configSchema.parse(baseConfig);

/**
 * Tests - Worker - Phone Handlers - Telnyx Body.
 *
 * Builds a Telnyx messaging webhook body for one recipient, event type, sender,
 * and text, so each test can send texts and delivery receipts.
 *
 * @param {Tests_Worker_PhoneHandlers_TelnyxBody_To}        to        - To.
 * @param {Tests_Worker_PhoneHandlers_TelnyxBody_EventType} eventType - Event type.
 * @param {Tests_Worker_PhoneHandlers_TelnyxBody_From}      [from]    - From.
 * @param {Tests_Worker_PhoneHandlers_TelnyxBody_Text}      [text]    - Text.
 *
 * @returns {Tests_Worker_PhoneHandlers_TelnyxBody_Returns}
 *
 * @since 1.2.0
 */
function telnyxBody(to: Tests_Worker_PhoneHandlers_TelnyxBody_To, eventType: Tests_Worker_PhoneHandlers_TelnyxBody_EventType, from: Tests_Worker_PhoneHandlers_TelnyxBody_From = '+15550100200', text: Tests_Worker_PhoneHandlers_TelnyxBody_Text = 'Your code is 123456'): Tests_Worker_PhoneHandlers_TelnyxBody_Returns {
  return JSON.stringify({
    data: {
      event_type: eventType,
      id: 'event-1',
      payload: {
        id: 'message-1',
        from: { phone_number: from },
        to: [{ phone_number: to }],
        text,
      },
    },
  });
}

/**
 * Tests - Worker - Phone Handlers - Telnyx Request.
 *
 * Signs a Telnyx webhook with the test key pair and wraps it in the request the
 * Worker receives.
 *
 * @param {Tests_Worker_PhoneHandlers_TelnyxRequest_Body} body - Body.
 *
 * @returns {Tests_Worker_PhoneHandlers_TelnyxRequest_Returns}
 *
 * @since 1.2.0
 */
function telnyxRequest(body: Tests_Worker_PhoneHandlers_TelnyxRequest_Body): Tests_Worker_PhoneHandlers_TelnyxRequest_Returns {
  const timestamp: Tests_Worker_PhoneHandlers_TelnyxRequest_Timestamp = String(now / 1000);
  const signature: Tests_Worker_PhoneHandlers_TelnyxRequest_Signature = sign(null, Buffer.from(`${timestamp}|${body}`), keyPair.privateKey).toString('base64');

  return new Request('https://mail.example.com/phone/telnyx/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'telnyx-signature-ed25519': signature,
      'telnyx-timestamp': timestamp,
    },
    body,
  });
}

/**
 * Tests - Worker - Phone Handlers - Plivo Request.
 *
 * Signs a Plivo form webhook with the test auth token and wraps it in the request
 * the Worker receives.
 *
 * @param {Tests_Worker_PhoneHandlers_PlivoRequest_Body} body - Body.
 *
 * @returns {Tests_Worker_PhoneHandlers_PlivoRequest_Returns}
 *
 * @since 1.2.0
 */
function plivoRequest(body: Tests_Worker_PhoneHandlers_PlivoRequest_Body): Tests_Worker_PhoneHandlers_PlivoRequest_Returns {
  const url: Tests_Worker_PhoneHandlers_PlivoRequest_Url = 'https://mail.example.com/phone/plivo/messages';
  const signature: Tests_Worker_PhoneHandlers_PlivoRequest_Signature = createHmac('sha256', 'test-auth-token-only').update(`${url}?${[...new URLSearchParams(body).entries()].sort((a, b) => a[0].localeCompare(b[0])).map((entry) => `${entry[0]}${entry[1]}`).join('')}.nonce-1`).digest('base64');

  return new Request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-plivo-signature-v3': signature,
      'x-plivo-signature-v3-nonce': 'nonce-1',
    },
    body,
  });
}

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook.
 *
 * @since 1.2.0
 */
describe('handlePhoneWebhook', () => {
  it('forwards a verified Telnyx text to the destination phone', async () => {
    const fetchSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedTelnyxTextToTheDestinationPhone_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"data":{"id":"sent-1"}}', { status: 200 }));
    const response: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedTelnyxTextToTheDestinationPhone_Response = await handlePhoneWebhook(telnyxRequest(telnyxBody('+15550100100', 'message.received')), 'telnyx', config, now, { waitUntil: vi.fn() });
    const requestBody: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedTelnyxTextToTheDestinationPhone_RequestBody = JSON.parse(String(fetchSpy.mock.calls[0]![1]!['body']));

    expect(response['status']).toBe(200);

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://api.telnyx.com/v2/messages');

    expect(requestBody).toEqual({
      from: '+15550100100',
      to: '+15550100300',
      text: '+15550100200: Your code is 123456',
    });

    return;
  });

  it('forwards a verified Plivo text to the destination phone', async () => {
    const fetchSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedPlivoTextToTheDestinationPhone_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"message_uuid":["sent-1"]}', { status: 202 }));
    const response: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedPlivoTextToTheDestinationPhone_Response = await handlePhoneWebhook(plivoRequest('From=15550100200&To=15550100101&Text=Hello&Type=sms&MessageUUID=message-2'), 'plivo', config, now, { waitUntil: vi.fn() });
    const requestBody: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedPlivoTextToTheDestinationPhone_RequestBody = JSON.parse(String(fetchSpy.mock.calls[0]![1]!['body']));

    expect(response['status']).toBe(200);

    expect(response.headers.get('Content-Type')).toBe('application/xml');

    expect(await response.text()).toBe('<Response></Response>');

    expect(requestBody).toEqual({
      src: '15550100101',
      dst: '15550100300',
      text: '+15550100200: Hello',
      log: false,
    });

    return;
  });

  it('sends a text from the destination phone through the alias', async () => {
    const fetchSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_SendsATextFromTheDestinationPhoneThroughTheAlias_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"data":{"id":"sent-1"}}', { status: 200 }));
    const response: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_SendsATextFromTheDestinationPhoneThroughTheAlias_Response = await handlePhoneWebhook(telnyxRequest(telnyxBody('+15550100100', 'message.received', '+15550100300', '+15550100200: On my way')), 'telnyx', config, now, { waitUntil: vi.fn() });
    const requestBody: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_SendsATextFromTheDestinationPhoneThroughTheAlias_RequestBody = JSON.parse(String(fetchSpy.mock.calls[0]![1]!['body']));

    expect(response['status']).toBe(200);

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    expect(requestBody).toEqual({
      from: '+15550100100',
      to: '+15550100200',
      text: 'On my way',
    });

    return;
  });

  it('texts help when the destination phone leaves out the number', async () => {
    const fetchSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TextsHelpWhenTheDestinationPhoneLeavesOutTheNumber_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"data":{"id":"sent-1"}}', { status: 200 }));

    await handlePhoneWebhook(telnyxRequest(telnyxBody('+15550100100', 'message.received', '+15550100300', 'On my way')), 'telnyx', config, now, { waitUntil: vi.fn() });

    const requestBody: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TextsHelpWhenTheDestinationPhoneLeavesOutTheNumber_RequestBody = JSON.parse(String(fetchSpy.mock.calls[0]![1]!['body']));

    expect(requestBody['from']).toBe('+15550100100');

    expect(requestBody['to']).toBe('+15550100300');

    expect(String(requestBody['text'])).toContain('start your text with the number');

    return;
  });

  it('tells the destination phone when sending fails', async () => {
    const consoleWarnSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_ConsoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_FetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{"errors":[]}', { status: 400 }))
      .mockResolvedValueOnce(new Response('{"data":{"id":"sent-1"}}', { status: 200 }));
    const response: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_Response = await handlePhoneWebhook(telnyxRequest(telnyxBody('+15550100100', 'message.received', '+15550100300', '+15550100200: On my way')), 'telnyx', config, now, { waitUntil: vi.fn() });
    const noticeBody: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_NoticeBody = JSON.parse(String(fetchSpy.mock.calls[1]![1]!['body']));

    expect(response['status']).toBe(200);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

    expect(noticeBody['to']).toBe('+15550100300');

    expect(String(noticeBody['text'])).toContain('could not send your text to +15550100200');

    return;
  });

  it('refuses bad signatures and unknown providers', async () => {
    const fetchSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_RefusesBadSignaturesAndUnknownProviders_FetchSpy = vi.spyOn(globalThis, 'fetch');
    const response: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_RefusesBadSignaturesAndUnknownProviders_Response = await handlePhoneWebhook(new Request('https://mail.example.com/phone/telnyx/messages', {
      method: 'POST',
      headers: {
        'telnyx-signature-ed25519': 'AAAA',
        'telnyx-timestamp': String(now / 1000),
      },
      body: telnyxBody('+15550100100', 'message.received'),
    }), 'telnyx', config, now, { waitUntil: vi.fn() });
    const unknownResponse: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_RefusesBadSignaturesAndUnknownProviders_UnknownResponse = await handlePhoneWebhook(telnyxRequest(telnyxBody('+15550100100', 'message.received')), 'other', config, now, { waitUntil: vi.fn() });

    expect(response['status']).toBe(401);

    expect(unknownResponse['status']).toBe(404);

    expect(fetchSpy).not.toHaveBeenCalled();

    return;
  });

  it('drops texts to a disabled number and notifies', async () => {
    const fetchSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok', { status: 200 }));
    const context: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_Context = { waitUntil: vi.fn() };
    const response: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_Response = await handlePhoneWebhook(telnyxRequest(telnyxBody('+15550100102', 'message.received')), 'telnyx', config, now, context);

    expect(response['status']).toBe(200);

    expect(context['waitUntil']).toHaveBeenCalledWith(expect.any(Promise));

    await context['waitUntil'].mock.calls[0]![0];

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://notifications.example.com/mailmask');

    expect(String(fetchSpy.mock.calls[0]![1]!['body'])).toContain('Text to +15550100102 from +15550100200 was dropped: Number is disabled.');

    return;
  });

  it('answers with an error when forwarding fails', async () => {
    const consoleWarnSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_AnswersWithAnErrorWhenForwardingFails_ConsoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"errors":[]}', { status: 500 }));

    const response: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_AnswersWithAnErrorWhenForwardingFails_Response = await handlePhoneWebhook(telnyxRequest(telnyxBody('+15550100100', 'message.received')), 'telnyx', config, now, { waitUntil: vi.fn() });

    expect(response['status']).toBe(502);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

    expect(String(consoleWarnSpy.mock.calls[0]![0])).not.toContain('123456');

    return;
  });

  it('ignores delivery receipts', async () => {
    const fetchSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_IgnoresDeliveryReceipts_FetchSpy = vi.spyOn(globalThis, 'fetch');
    const response: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_IgnoresDeliveryReceipts_Response = await handlePhoneWebhook(telnyxRequest(telnyxBody('+15550100300', 'message.finalized')), 'telnyx', config, now, { waitUntil: vi.fn() });

    expect(response['status']).toBe(200);

    expect(fetchSpy).not.toHaveBeenCalled();

    return;
  });

  it('ends Plivo calls without sending anything', async () => {
    const fetchSpy: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_EndsPlivoCallsWithoutSendingAnything_FetchSpy = vi.spyOn(globalThis, 'fetch');
    const response: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_EndsPlivoCallsWithoutSendingAnything_Response = await handlePhoneWebhook(plivoRequest('From=15550100200&To=15550100101&CallUUID=call-1'), 'plivo', config, now, { waitUntil: vi.fn() });

    expect(response['status']).toBe(200);

    expect(await response.text()).toBe('<Response></Response>');

    expect(fetchSpy).not.toHaveBeenCalled();

    return;
  });

  return;
});

/**
 * Tests - Worker - Phone Handlers - Create Worker.
 *
 * @since 1.2.0
 */
describe('createWorker', () => {
  it('routes text webhooks and refuses other paths and methods', async () => {
    const worker: Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_Worker = createWorker(baseConfig);
    const getResponse: Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_GetResponse = await worker.fetch(new Request('https://mail.example.com/phone/telnyx/messages', { method: 'GET' }));
    const callsResponse: Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_CallsResponse = await worker.fetch(new Request('https://mail.example.com/phone/plivo/calls', { method: 'POST' }), {}, { waitUntil: vi.fn() });

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"data":{"id":"sent-1"}}', { status: 200 }));

    vi.useFakeTimers({ toFake: ['Date'] });

    vi.setSystemTime(now);

    const postResponse: Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_PostResponse = await worker.fetch(telnyxRequest(telnyxBody('+15550100100', 'message.received')), {}, { waitUntil: vi.fn() });

    vi.useRealTimers();

    expect(getResponse['status']).toBe(405);

    expect(getResponse.headers.get('Allow')).toBe('POST');

    expect(callsResponse['status']).toBe(405);

    expect(postResponse['status']).toBe(200);

    return;
  });

  return;
});
