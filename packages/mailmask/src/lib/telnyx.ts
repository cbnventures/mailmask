import {
  decodeBase64,
  getSubtleCrypto,
  normalizePhoneNumber,
  providerRequest,
} from './phone.js';
import {
  telnyxAvailableNumbersSchema,
  telnyxMessagingProfileSchema,
  telnyxNumberOrderSchema,
  telnyxPhoneNumbersSchema,
  telnyxWebhookSchema,
} from './schema.js';

import type {
  Lib_Telnyx_Runner_AcknowledgeMessage_Body,
  Lib_Telnyx_Runner_AcknowledgeMessage_Returns,
  Lib_Telnyx_Runner_AsTelnyx_Provider,
  Lib_Telnyx_Runner_AsTelnyx_Returns,
  Lib_Telnyx_Runner_BuyNumber_Number,
  Lib_Telnyx_Runner_BuyNumber_Order,
  Lib_Telnyx_Runner_BuyNumber_Provider,
  Lib_Telnyx_Runner_BuyNumber_Response,
  Lib_Telnyx_Runner_BuyNumber_Returns,
  Lib_Telnyx_Runner_BuyNumber_Telnyx,
  Lib_Telnyx_Runner_CheckCredentials_Provider,
  Lib_Telnyx_Runner_CheckCredentials_Response,
  Lib_Telnyx_Runner_CheckCredentials_Returns,
  Lib_Telnyx_Runner_CheckCredentials_Telnyx,
  Lib_Telnyx_Runner_ConnectNumbers_BaseUrl,
  Lib_Telnyx_Runner_ConnectNumbers_Numbers,
  Lib_Telnyx_Runner_ConnectNumbers_Profile,
  Lib_Telnyx_Runner_ConnectNumbers_ProfileBody,
  Lib_Telnyx_Runner_ConnectNumbers_ProfileResponse,
  Lib_Telnyx_Runner_ConnectNumbers_Provider,
  Lib_Telnyx_Runner_ConnectNumbers_Response,
  Lib_Telnyx_Runner_ConnectNumbers_Responses,
  Lib_Telnyx_Runner_ConnectNumbers_Returns,
  Lib_Telnyx_Runner_ConnectNumbers_Telnyx,
  Lib_Telnyx_Runner_ConnectNumbers_WebhookUrl,
  Lib_Telnyx_Runner_FindNumberId_AccountNumber,
  Lib_Telnyx_Runner_FindNumberId_Number,
  Lib_Telnyx_Runner_FindNumberId_Numbers,
  Lib_Telnyx_Runner_FindNumberId_Response,
  Lib_Telnyx_Runner_FindNumberId_Returns,
  Lib_Telnyx_Runner_FindNumberId_Telnyx,
  Lib_Telnyx_Runner_GetHeaders_Returns,
  Lib_Telnyx_Runner_GetHeaders_Telnyx,
  Lib_Telnyx_Runner_OwnsNumber_Number,
  Lib_Telnyx_Runner_OwnsNumber_NumberId,
  Lib_Telnyx_Runner_OwnsNumber_Provider,
  Lib_Telnyx_Runner_OwnsNumber_Returns,
  Lib_Telnyx_Runner_ParseInboundMessage_Parsed,
  Lib_Telnyx_Runner_ParseInboundMessage_Payload,
  Lib_Telnyx_Runner_ParseInboundMessage_Raw,
  Lib_Telnyx_Runner_ParseInboundMessage_Returns,
  Lib_Telnyx_Runner_ParseInboundMessage_Webhook,
  Lib_Telnyx_Runner_ReleaseNumber_Number,
  Lib_Telnyx_Runner_ReleaseNumber_NumberId,
  Lib_Telnyx_Runner_ReleaseNumber_Provider,
  Lib_Telnyx_Runner_ReleaseNumber_Response,
  Lib_Telnyx_Runner_ReleaseNumber_Returns,
  Lib_Telnyx_Runner_ReleaseNumber_Telnyx,
  Lib_Telnyx_Runner_SearchNumbers_AvailableNumbers,
  Lib_Telnyx_Runner_SearchNumbers_Provider,
  Lib_Telnyx_Runner_SearchNumbers_Query,
  Lib_Telnyx_Runner_SearchNumbers_Response,
  Lib_Telnyx_Runner_SearchNumbers_Returns,
  Lib_Telnyx_Runner_SearchNumbers_Search,
  Lib_Telnyx_Runner_SearchNumbers_Telnyx,
  Lib_Telnyx_Runner_SendMessage_Message,
  Lib_Telnyx_Runner_SendMessage_Provider,
  Lib_Telnyx_Runner_SendMessage_Response,
  Lib_Telnyx_Runner_SendMessage_Returns,
  Lib_Telnyx_Runner_SendMessage_Telnyx,
  Lib_Telnyx_Runner_VerifyWebhook_Key,
  Lib_Telnyx_Runner_VerifyWebhook_Now,
  Lib_Telnyx_Runner_VerifyWebhook_Provider,
  Lib_Telnyx_Runner_VerifyWebhook_PublicKeyBytes,
  Lib_Telnyx_Runner_VerifyWebhook_Returns,
  Lib_Telnyx_Runner_VerifyWebhook_SignatureBytes,
  Lib_Telnyx_Runner_VerifyWebhook_SignatureHeader,
  Lib_Telnyx_Runner_VerifyWebhook_SignedContent,
  Lib_Telnyx_Runner_VerifyWebhook_Telnyx,
  Lib_Telnyx_Runner_VerifyWebhook_Timestamp,
  Lib_Telnyx_Runner_VerifyWebhook_TimestampHeader,
  Lib_Telnyx_Runner_VerifyWebhook_Webhook,
} from '../types/lib/telnyx.d.ts';

/**
 * Lib - Telnyx - API Base.
 *
 * Base URL of the Telnyx v2 REST API that buys, releases, and points numbers,
 * and sends the forwarded texts.
 *
 * @since 1.2.0
 */
const TELNYX_API_BASE = 'https://api.telnyx.com/v2';

/**
 * Lib - Telnyx - Timestamp Tolerance Seconds.
 *
 * How far a webhook's signed timestamp may be from the Worker's clock. Telnyx
 * asks receivers to refuse anything older than five minutes to stop replays.
 *
 * @since 1.2.0
 */
const TIMESTAMP_TOLERANCE_SECONDS = 300;

/**
 * Lib - Telnyx.
 *
 * Phone provider adapter for Telnyx. It checks Ed25519 webhook signatures, reads
 * inbound texts, sends forwarded texts, and manages the account's numbers.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Telnyx - Verify Webhook.
   *
   * Checks the Ed25519 signature Telnyx puts on every webhook against the public
   * key from the portal, over "timestamp|raw body", and refuses stale timestamps.
   *
   * @param {Lib_Telnyx_Runner_VerifyWebhook_Provider} provider - Provider.
   * @param {Lib_Telnyx_Runner_VerifyWebhook_Webhook}  webhook  - Webhook.
   * @param {Lib_Telnyx_Runner_VerifyWebhook_Now}      now      - Now.
   *
   * @returns {Lib_Telnyx_Runner_VerifyWebhook_Returns}
   *
   * @since 1.2.0
   */
  public static async verifyWebhook(provider: Lib_Telnyx_Runner_VerifyWebhook_Provider, webhook: Lib_Telnyx_Runner_VerifyWebhook_Webhook, now: Lib_Telnyx_Runner_VerifyWebhook_Now): Lib_Telnyx_Runner_VerifyWebhook_Returns {
    const telnyx: Lib_Telnyx_Runner_VerifyWebhook_Telnyx = Runner.asTelnyx(provider);
    const signatureHeader: Lib_Telnyx_Runner_VerifyWebhook_SignatureHeader = webhook['headers'].get('telnyx-signature-ed25519');
    const timestampHeader: Lib_Telnyx_Runner_VerifyWebhook_TimestampHeader = webhook['headers'].get('telnyx-timestamp');

    if (signatureHeader === null || timestampHeader === null) {
      return false;
    }

    const timestamp: Lib_Telnyx_Runner_VerifyWebhook_Timestamp = Number(timestampHeader);

    if (
      Number.isInteger(timestamp) === false
      || Math.abs((now / 1000) - timestamp) > TIMESTAMP_TOLERANCE_SECONDS
    ) {
      return false;
    }

    const publicKeyBytes: Lib_Telnyx_Runner_VerifyWebhook_PublicKeyBytes = decodeBase64(telnyx['public_key']);
    const signatureBytes: Lib_Telnyx_Runner_VerifyWebhook_SignatureBytes = decodeBase64(signatureHeader);

    if (
      publicKeyBytes === undefined
      || signatureBytes === undefined
      || publicKeyBytes.length !== 32
    ) {
      return false;
    }

    const signedContent: Lib_Telnyx_Runner_VerifyWebhook_SignedContent = new Uint8Array(new TextEncoder().encode(`${timestampHeader}|${webhook['body']}`));

    try {
      const key: Lib_Telnyx_Runner_VerifyWebhook_Key = await getSubtleCrypto().importKey('raw', publicKeyBytes, { name: 'Ed25519' }, false, ['verify']);

      return await getSubtleCrypto().verify({ name: 'Ed25519' }, key, signatureBytes, signedContent);
    } catch {
      return false;
    }
  }

  /**
   * Lib - Telnyx - Parse Inbound Message.
   *
   * Reads a "message.received" webhook into Mailmask's inbound message shape.
   * Status events for texts Mailmask sent return undefined so they are ignored.
   *
   * @param {Lib_Telnyx_Runner_ParseInboundMessage_Webhook} webhook - Webhook.
   *
   * @returns {Lib_Telnyx_Runner_ParseInboundMessage_Returns}
   *
   * @since 1.2.0
   */
  public static parseInboundMessage(webhook: Lib_Telnyx_Runner_ParseInboundMessage_Webhook): Lib_Telnyx_Runner_ParseInboundMessage_Returns {
    let raw: Lib_Telnyx_Runner_ParseInboundMessage_Raw = undefined;

    try {
      raw = JSON.parse(webhook['body']);
    } catch {
      return undefined;
    }

    const parsed: Lib_Telnyx_Runner_ParseInboundMessage_Parsed = telnyxWebhookSchema.safeParse(raw);

    if (parsed['success'] === false || parsed['data']['data']['event_type'] !== 'message.received') {
      return undefined;
    }

    const payload: Lib_Telnyx_Runner_ParseInboundMessage_Payload = parsed['data']['data']['payload'];

    if (payload === undefined) {
      return undefined;
    }

    return {
      messageId: payload['id'],
      from: normalizePhoneNumber(payload['from']['phone_number']),
      to: payload['to'].map((recipient) => normalizePhoneNumber(recipient['phone_number'])),
      text: payload['text'] ?? '',
      mediaUrls: (payload['media'] ?? []).map((media) => media['url']),
    };
  }

  /**
   * Lib - Telnyx - Acknowledge Message.
   *
   * Builds the reply that tells Telnyx the webhook was handled, so it does
   * not retry a text that was already forwarded or refused.
   *
   * @returns {Lib_Telnyx_Runner_AcknowledgeMessage_Returns}
   *
   * @since 1.2.0
   */
  public static acknowledgeMessage(): Lib_Telnyx_Runner_AcknowledgeMessage_Returns {
    const body: Lib_Telnyx_Runner_AcknowledgeMessage_Body = JSON.stringify({
      status: 'success',
      message: 'Handled.',
    }, null, 2);

    return {
      body,
      contentType: 'application/json',
    };
  }

  /**
   * Lib - Telnyx - Send Message.
   *
   * Sends a text from the alias number, either a forwarded text to the destination
   * phone or the user's own text to someone else. MMS media links go along as-is.
   *
   * @param {Lib_Telnyx_Runner_SendMessage_Provider} provider - Provider.
   * @param {Lib_Telnyx_Runner_SendMessage_Message}  message  - Message.
   *
   * @returns {Lib_Telnyx_Runner_SendMessage_Returns}
   *
   * @since 1.2.0
   */
  public static async sendMessage(provider: Lib_Telnyx_Runner_SendMessage_Provider, message: Lib_Telnyx_Runner_SendMessage_Message): Lib_Telnyx_Runner_SendMessage_Returns {
    const telnyx: Lib_Telnyx_Runner_SendMessage_Telnyx = Runner.asTelnyx(provider);
    const response: Lib_Telnyx_Runner_SendMessage_Response = await providerRequest(`${TELNYX_API_BASE}/messages`, 'POST', Runner.getHeaders(telnyx), {
      from: message['from'],
      to: message['to'],
      text: message['text'],
      ...((message['mediaUrls'].length > 0) ? { media_urls: message['mediaUrls'] } : {}),
    });

    if (response['ok'] === false) {
      throw new Error(`Telnyx refused the text (HTTP ${String(response['status'])}).`);
    }

    return;
  }

  /**
   * Lib - Telnyx - Check Credentials.
   *
   * Reads the account balance, the cheapest call that needs a valid API key,
   * so "mm phone provider check" can tell a bad key apart from a network error.
   *
   * @param {Lib_Telnyx_Runner_CheckCredentials_Provider} provider - Provider.
   *
   * @returns {Lib_Telnyx_Runner_CheckCredentials_Returns}
   *
   * @since 1.2.0
   */
  public static async checkCredentials(provider: Lib_Telnyx_Runner_CheckCredentials_Provider): Lib_Telnyx_Runner_CheckCredentials_Returns {
    const telnyx: Lib_Telnyx_Runner_CheckCredentials_Telnyx = Runner.asTelnyx(provider);
    const response: Lib_Telnyx_Runner_CheckCredentials_Response = await providerRequest(`${TELNYX_API_BASE}/balance`, 'GET', Runner.getHeaders(telnyx), undefined);

    if (response['ok'] === false) {
      throw new Error(`Telnyx rejected the API key for "${telnyx['name']}" (HTTP ${String(response['status'])}).`);
    }

    if (decodeBase64(telnyx['public_key']) === undefined) {
      throw new Error(`The public key for "${telnyx['name']}" is not base64. Copy it again from Telnyx's Keys & Credentials page.`);
    }

    return;
  }

  /**
   * Lib - Telnyx - Search Numbers.
   *
   * Lists numbers that can be bought and receive texts, optionally inside one
   * area code, so a phone alias can start from a fresh number.
   *
   * @param {Lib_Telnyx_Runner_SearchNumbers_Provider} provider - Provider.
   * @param {Lib_Telnyx_Runner_SearchNumbers_Search}   search   - Search.
   *
   * @returns {Lib_Telnyx_Runner_SearchNumbers_Returns}
   *
   * @since 1.2.0
   */
  public static async searchNumbers(provider: Lib_Telnyx_Runner_SearchNumbers_Provider, search: Lib_Telnyx_Runner_SearchNumbers_Search): Lib_Telnyx_Runner_SearchNumbers_Returns {
    const telnyx: Lib_Telnyx_Runner_SearchNumbers_Telnyx = Runner.asTelnyx(provider);
    const query: Lib_Telnyx_Runner_SearchNumbers_Query = new URLSearchParams({
      'filter[country_code]': search['countryCode'],
      'filter[features]': 'sms',
      'filter[limit]': String(search['limit']),
    });

    if (search['areaCode'] !== undefined) {
      query.set('filter[national_destination_code]', search['areaCode']);
    }

    const response: Lib_Telnyx_Runner_SearchNumbers_Response = await providerRequest(`${TELNYX_API_BASE}/available_phone_numbers?${query.toString()}`, 'GET', Runner.getHeaders(telnyx), undefined);

    if (response['ok'] === false) {
      throw new Error(`Telnyx number search failed (HTTP ${String(response['status'])}).`);
    }

    const availableNumbers: Lib_Telnyx_Runner_SearchNumbers_AvailableNumbers = telnyxAvailableNumbersSchema.parse(response['data']);

    return availableNumbers['data'].map((availableNumber) => ({
      number: availableNumber['phone_number'],
      features: (availableNumber['features'] ?? []).map((feature) => feature['name']),
    }));
  }

  /**
   * Lib - Telnyx - Owns Number.
   *
   * Confirms a number already belongs to the Telnyx account before it becomes
   * a phone alias, so a typo is caught before deploy.
   *
   * @param {Lib_Telnyx_Runner_OwnsNumber_Provider} provider - Provider.
   * @param {Lib_Telnyx_Runner_OwnsNumber_Number}   number   - Number.
   *
   * @returns {Lib_Telnyx_Runner_OwnsNumber_Returns}
   *
   * @since 1.2.0
   */
  public static async ownsNumber(provider: Lib_Telnyx_Runner_OwnsNumber_Provider, number: Lib_Telnyx_Runner_OwnsNumber_Number): Lib_Telnyx_Runner_OwnsNumber_Returns {
    const numberId: Lib_Telnyx_Runner_OwnsNumber_NumberId = await Runner.findNumberId(Runner.asTelnyx(provider), number);

    return numberId !== undefined;
  }

  /**
   * Lib - Telnyx - Buy Number.
   *
   * Orders one number found by a search and returns the order status. Telnyx
   * orders start pending and usually finish within a minute.
   *
   * @param {Lib_Telnyx_Runner_BuyNumber_Provider} provider - Provider.
   * @param {Lib_Telnyx_Runner_BuyNumber_Number}   number   - Number.
   *
   * @returns {Lib_Telnyx_Runner_BuyNumber_Returns}
   *
   * @since 1.2.0
   */
  public static async buyNumber(provider: Lib_Telnyx_Runner_BuyNumber_Provider, number: Lib_Telnyx_Runner_BuyNumber_Number): Lib_Telnyx_Runner_BuyNumber_Returns {
    const telnyx: Lib_Telnyx_Runner_BuyNumber_Telnyx = Runner.asTelnyx(provider);
    const response: Lib_Telnyx_Runner_BuyNumber_Response = await providerRequest(`${TELNYX_API_BASE}/number_orders`, 'POST', Runner.getHeaders(telnyx), {
      phone_numbers: [{ phone_number: number }],
      ...((telnyx['messaging_profile_id'] !== undefined) ? { messaging_profile_id: telnyx['messaging_profile_id'] } : {}),
    });

    if (response['ok'] === false) {
      throw new Error(`Telnyx could not sell "${number}" (HTTP ${String(response['status'])}).`);
    }

    const order: Lib_Telnyx_Runner_BuyNumber_Order = telnyxNumberOrderSchema.parse(response['data']);

    if (order['data']['status'] === 'failure') {
      throw new Error(`Telnyx could not complete the order for "${number}".`);
    }

    return order['data']['status'];
  }

  /**
   * Lib - Telnyx - Release Number.
   *
   * Deletes a number from the Telnyx account. Telnyx stops billing for it and
   * may give it to someone else, so the CLI asks before calling this.
   *
   * @param {Lib_Telnyx_Runner_ReleaseNumber_Provider} provider - Provider.
   * @param {Lib_Telnyx_Runner_ReleaseNumber_Number}   number   - Number.
   *
   * @returns {Lib_Telnyx_Runner_ReleaseNumber_Returns}
   *
   * @since 1.2.0
   */
  public static async releaseNumber(provider: Lib_Telnyx_Runner_ReleaseNumber_Provider, number: Lib_Telnyx_Runner_ReleaseNumber_Number): Lib_Telnyx_Runner_ReleaseNumber_Returns {
    const telnyx: Lib_Telnyx_Runner_ReleaseNumber_Telnyx = Runner.asTelnyx(provider);
    const numberId: Lib_Telnyx_Runner_ReleaseNumber_NumberId = await Runner.findNumberId(telnyx, number);

    if (numberId === undefined) {
      throw new Error(`"${number}" is not on the Telnyx account for "${telnyx['name']}".`);
    }

    const response: Lib_Telnyx_Runner_ReleaseNumber_Response = await providerRequest(`${TELNYX_API_BASE}/phone_numbers/${encodeURIComponent(numberId)}`, 'DELETE', Runner.getHeaders(telnyx), undefined);

    if (response['ok'] === false) {
      throw new Error(`Telnyx could not release "${number}" (HTTP ${String(response['status'])}).`);
    }

    return;
  }

  /**
   * Lib - Telnyx - Connect Numbers.
   *
   * Points the messaging profile's webhook at the Worker, creating it on the first
   * deploy, sets the countries it may text, and assigns every alias number to it.
   *
   * @param {Lib_Telnyx_Runner_ConnectNumbers_Provider} provider - Provider.
   * @param {Lib_Telnyx_Runner_ConnectNumbers_Numbers}  numbers  - Numbers.
   * @param {Lib_Telnyx_Runner_ConnectNumbers_BaseUrl}  baseUrl  - Base url.
   *
   * @returns {Lib_Telnyx_Runner_ConnectNumbers_Returns}
   *
   * @since 1.2.0
   */
  public static async connectNumbers(provider: Lib_Telnyx_Runner_ConnectNumbers_Provider, numbers: Lib_Telnyx_Runner_ConnectNumbers_Numbers, baseUrl: Lib_Telnyx_Runner_ConnectNumbers_BaseUrl): Lib_Telnyx_Runner_ConnectNumbers_Returns {
    const telnyx: Lib_Telnyx_Runner_ConnectNumbers_Telnyx = Runner.asTelnyx(provider);
    const webhookUrl: Lib_Telnyx_Runner_ConnectNumbers_WebhookUrl = `${baseUrl}/phone/${telnyx['name']}/messages`;
    const profileBody: Lib_Telnyx_Runner_ConnectNumbers_ProfileBody = {
      name: `Mailmask (${telnyx['name']})`,
      webhook_url: webhookUrl,
      webhook_api_version: '2',
      whitelisted_destinations: telnyx['destination_countries'] ?? ['*'],
    };
    let profileResponse: Lib_Telnyx_Runner_ConnectNumbers_ProfileResponse = undefined;

    if (telnyx['messaging_profile_id'] === undefined) {
      profileResponse = await providerRequest(`${TELNYX_API_BASE}/messaging_profiles`, 'POST', Runner.getHeaders(telnyx), profileBody);
    } else {
      profileResponse = await providerRequest(`${TELNYX_API_BASE}/messaging_profiles/${encodeURIComponent(telnyx['messaging_profile_id'])}`, 'PATCH', Runner.getHeaders(telnyx), profileBody);
    }

    if (profileResponse['ok'] === false) {
      throw new Error(`Telnyx could not save the messaging profile for "${telnyx['name']}" (HTTP ${String(profileResponse['status'])}).`);
    }

    const profile: Lib_Telnyx_Runner_ConnectNumbers_Profile = telnyxMessagingProfileSchema.parse(profileResponse['data']);
    const responses: Lib_Telnyx_Runner_ConnectNumbers_Responses = await Promise.all(numbers.map((number) => providerRequest(`${TELNYX_API_BASE}/messaging_phone_numbers/${encodeURIComponent(number)}`, 'PATCH', Runner.getHeaders(telnyx), {
      messaging_profile_id: profile['data']['id'],
    })));

    for (let responseIndex = 0; responseIndex < responses.length; responseIndex += 1) {
      const response: Lib_Telnyx_Runner_ConnectNumbers_Response = responses[responseIndex];

      if (response !== undefined && response['ok'] === false) {
        throw new Error(`Telnyx could not point "${numbers[responseIndex] ?? ''}" at the messaging profile (HTTP ${String(response['status'])}).`);
      }
    }

    return {
      ...telnyx,
      messaging_profile_id: profile['data']['id'],
    };
  }

  /**
   * Lib - Telnyx - Find Number ID.
   *
   * Looks up the ID Telnyx gives a number on the account, which releasing a
   * number needs, and returns undefined when the account does not have it.
   *
   * @param {Lib_Telnyx_Runner_FindNumberId_Telnyx} telnyx - Telnyx.
   * @param {Lib_Telnyx_Runner_FindNumberId_Number} number - Number.
   *
   * @private
   *
   * @returns {Lib_Telnyx_Runner_FindNumberId_Returns}
   *
   * @since 1.2.0
   */
  private static async findNumberId(telnyx: Lib_Telnyx_Runner_FindNumberId_Telnyx, number: Lib_Telnyx_Runner_FindNumberId_Number): Lib_Telnyx_Runner_FindNumberId_Returns {
    const response: Lib_Telnyx_Runner_FindNumberId_Response = await providerRequest(`${TELNYX_API_BASE}/phone_numbers?filter[phone_number]=${encodeURIComponent(number)}`, 'GET', Runner.getHeaders(telnyx), undefined);

    if (response['ok'] === false) {
      throw new Error(`Telnyx could not list the numbers for "${telnyx['name']}" (HTTP ${String(response['status'])}).`);
    }

    const numbers: Lib_Telnyx_Runner_FindNumberId_Numbers = telnyxPhoneNumbersSchema.parse(response['data']);
    const accountNumber: Lib_Telnyx_Runner_FindNumberId_AccountNumber = numbers['data'].find((dataNumber) => normalizePhoneNumber(dataNumber['phone_number']) === number);

    if (accountNumber === undefined) {
      return undefined;
    }

    return accountNumber['id'];
  }

  /**
   * Lib - Telnyx - As Telnyx.
   *
   * Narrows a phone provider to a Telnyx account. The provider lookup already
   * matches types, so a mismatch means the config was changed underneath it.
   *
   * @param {Lib_Telnyx_Runner_AsTelnyx_Provider} provider - Provider.
   *
   * @private
   *
   * @returns {Lib_Telnyx_Runner_AsTelnyx_Returns}
   *
   * @since 1.2.0
   */
  private static asTelnyx(provider: Lib_Telnyx_Runner_AsTelnyx_Provider): Lib_Telnyx_Runner_AsTelnyx_Returns {
    if (provider['type'] !== 'telnyx') {
      throw new Error(`Phone provider "${provider['name']}" is not a Telnyx account.`);
    }

    return provider;
  }

  /**
   * Lib - Telnyx - Get Headers.
   *
   * Builds the bearer authorization header every Telnyx API call needs from
   * the account's API key.
   *
   * @param {Lib_Telnyx_Runner_GetHeaders_Telnyx} telnyx - Telnyx.
   *
   * @private
   *
   * @returns {Lib_Telnyx_Runner_GetHeaders_Returns}
   *
   * @since 1.2.0
   */
  private static getHeaders(telnyx: Lib_Telnyx_Runner_GetHeaders_Telnyx): Lib_Telnyx_Runner_GetHeaders_Returns {
    return { Authorization: `Bearer ${telnyx['api_key']}` };
  }
}
