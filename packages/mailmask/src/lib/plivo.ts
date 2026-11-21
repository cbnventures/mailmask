import {
  constantTimeEqual,
  encodeBase64,
  getSubtleCrypto,
  normalizePhoneNumber,
  providerRequest,
} from './phone.js';
import { LIB_REGEX_PHONE_MEDIA_KEY } from './regex.js';
import {
  plivoApplicationSchema,
  plivoAvailableNumbersSchema,
  plivoBuyNumberSchema,
} from './schema.js';

import type {
  Lib_Plivo_Runner_AcknowledgeMessage_Returns,
  Lib_Plivo_Runner_AsPlivo_Provider,
  Lib_Plivo_Runner_AsPlivo_Returns,
  Lib_Plivo_Runner_BuildSignedUrl_BaseUrl,
  Lib_Plivo_Runner_BuildSignedUrl_Body,
  Lib_Plivo_Runner_BuildSignedUrl_Params,
  Lib_Plivo_Runner_BuildSignedUrl_ParamsString,
  Lib_Plivo_Runner_BuildSignedUrl_PostKeys,
  Lib_Plivo_Runner_BuildSignedUrl_QueryEntries,
  Lib_Plivo_Runner_BuildSignedUrl_QueryString,
  Lib_Plivo_Runner_BuildSignedUrl_Returns,
  Lib_Plivo_Runner_BuildSignedUrl_Url,
  Lib_Plivo_Runner_BuildSignedUrl_WebhookUrl,
  Lib_Plivo_Runner_BuyNumber_Number,
  Lib_Plivo_Runner_BuyNumber_Plivo,
  Lib_Plivo_Runner_BuyNumber_Provider,
  Lib_Plivo_Runner_BuyNumber_Purchase,
  Lib_Plivo_Runner_BuyNumber_Response,
  Lib_Plivo_Runner_BuyNumber_Returns,
  Lib_Plivo_Runner_CheckCredentials_Plivo,
  Lib_Plivo_Runner_CheckCredentials_Provider,
  Lib_Plivo_Runner_CheckCredentials_Response,
  Lib_Plivo_Runner_CheckCredentials_Returns,
  Lib_Plivo_Runner_ConnectNumbers_Application,
  Lib_Plivo_Runner_ConnectNumbers_ApplicationBody,
  Lib_Plivo_Runner_ConnectNumbers_ApplicationId,
  Lib_Plivo_Runner_ConnectNumbers_ApplicationResponse,
  Lib_Plivo_Runner_ConnectNumbers_BaseUrl,
  Lib_Plivo_Runner_ConnectNumbers_LinkedApplicationId,
  Lib_Plivo_Runner_ConnectNumbers_Numbers,
  Lib_Plivo_Runner_ConnectNumbers_Plivo,
  Lib_Plivo_Runner_ConnectNumbers_Provider,
  Lib_Plivo_Runner_ConnectNumbers_Response,
  Lib_Plivo_Runner_ConnectNumbers_Responses,
  Lib_Plivo_Runner_ConnectNumbers_Returns,
  Lib_Plivo_Runner_ConnectNumbers_UpdateResponse,
  Lib_Plivo_Runner_GetAccountUrl_Plivo,
  Lib_Plivo_Runner_GetAccountUrl_Returns,
  Lib_Plivo_Runner_GetHeaders_Plivo,
  Lib_Plivo_Runner_GetHeaders_Returns,
  Lib_Plivo_Runner_OwnsNumber_Number,
  Lib_Plivo_Runner_OwnsNumber_Plivo,
  Lib_Plivo_Runner_OwnsNumber_Provider,
  Lib_Plivo_Runner_OwnsNumber_Response,
  Lib_Plivo_Runner_OwnsNumber_Returns,
  Lib_Plivo_Runner_ParseInboundMessage_From,
  Lib_Plivo_Runner_ParseInboundMessage_MediaKeys,
  Lib_Plivo_Runner_ParseInboundMessage_MessageId,
  Lib_Plivo_Runner_ParseInboundMessage_Params,
  Lib_Plivo_Runner_ParseInboundMessage_Returns,
  Lib_Plivo_Runner_ParseInboundMessage_To,
  Lib_Plivo_Runner_ParseInboundMessage_Type,
  Lib_Plivo_Runner_ParseInboundMessage_Webhook,
  Lib_Plivo_Runner_ReleaseNumber_Number,
  Lib_Plivo_Runner_ReleaseNumber_Plivo,
  Lib_Plivo_Runner_ReleaseNumber_Provider,
  Lib_Plivo_Runner_ReleaseNumber_Response,
  Lib_Plivo_Runner_ReleaseNumber_Returns,
  Lib_Plivo_Runner_SearchNumbers_AvailableNumbers,
  Lib_Plivo_Runner_SearchNumbers_Plivo,
  Lib_Plivo_Runner_SearchNumbers_Provider,
  Lib_Plivo_Runner_SearchNumbers_Query,
  Lib_Plivo_Runner_SearchNumbers_Response,
  Lib_Plivo_Runner_SearchNumbers_Returns,
  Lib_Plivo_Runner_SearchNumbers_Search,
  Lib_Plivo_Runner_SendMessage_Message,
  Lib_Plivo_Runner_SendMessage_Plivo,
  Lib_Plivo_Runner_SendMessage_Provider,
  Lib_Plivo_Runner_SendMessage_Response,
  Lib_Plivo_Runner_SendMessage_Returns,
  Lib_Plivo_Runner_ToPlivoNumber_Number,
  Lib_Plivo_Runner_ToPlivoNumber_Returns,
  Lib_Plivo_Runner_VerifyWebhook_AuthTokenBytes,
  Lib_Plivo_Runner_VerifyWebhook_ExpectedSignature,
  Lib_Plivo_Runner_VerifyWebhook_Key,
  Lib_Plivo_Runner_VerifyWebhook_Nonce,
  Lib_Plivo_Runner_VerifyWebhook_Plivo,
  Lib_Plivo_Runner_VerifyWebhook_Provider,
  Lib_Plivo_Runner_VerifyWebhook_Returns,
  Lib_Plivo_Runner_VerifyWebhook_SignatureBytes,
  Lib_Plivo_Runner_VerifyWebhook_SignatureHeader,
  Lib_Plivo_Runner_VerifyWebhook_SignedContent,
  Lib_Plivo_Runner_VerifyWebhook_Webhook,
} from '../types/lib/plivo.d.ts';

/**
 * Lib - Plivo - API Base.
 *
 * Base URL of the Plivo v1 REST API. Every account path below it starts with
 * the account's auth ID.
 *
 * @since 1.2.0
 */
const PLIVO_API_BASE = 'https://api.plivo.com/v1/Account';

/**
 * Lib - Plivo.
 *
 * Phone provider adapter for Plivo. It checks X-Plivo-Signature-V3 webhook
 * signatures, reads inbound texts, sends forwarded texts, and manages numbers.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Plivo - Verify Webhook.
   *
   * Recomputes the V3 signature, an HMAC-SHA256 of the URL, sorted POST fields,
   * and nonce keyed by the auth token, and accepts any listed signature.
   *
   * @param {Lib_Plivo_Runner_VerifyWebhook_Provider} provider - Provider.
   * @param {Lib_Plivo_Runner_VerifyWebhook_Webhook}  webhook  - Webhook.
   *
   * @returns {Lib_Plivo_Runner_VerifyWebhook_Returns}
   *
   * @since 1.2.0
   */
  public static async verifyWebhook(provider: Lib_Plivo_Runner_VerifyWebhook_Provider, webhook: Lib_Plivo_Runner_VerifyWebhook_Webhook): Lib_Plivo_Runner_VerifyWebhook_Returns {
    const plivo: Lib_Plivo_Runner_VerifyWebhook_Plivo = Runner.asPlivo(provider);
    const signatureHeader: Lib_Plivo_Runner_VerifyWebhook_SignatureHeader = webhook['headers'].get('x-plivo-signature-v3');
    const nonce: Lib_Plivo_Runner_VerifyWebhook_Nonce = webhook['headers'].get('x-plivo-signature-v3-nonce');

    // Plivo signs a nonce but no timestamp, so there is no age to check.
    if (signatureHeader === null || nonce === null) {
      return false;
    }

    const signedContent: Lib_Plivo_Runner_VerifyWebhook_SignedContent = new Uint8Array(new TextEncoder().encode(`${Runner.buildSignedUrl(webhook['url'], webhook['body'])}.${nonce}`));
    const authTokenBytes: Lib_Plivo_Runner_VerifyWebhook_AuthTokenBytes = new Uint8Array(new TextEncoder().encode(plivo['auth_token']));

    try {
      const key: Lib_Plivo_Runner_VerifyWebhook_Key = await getSubtleCrypto().importKey('raw', authTokenBytes, {
        name: 'HMAC',
        hash: 'SHA-256',
      }, false, ['sign']);
      const signatureBytes: Lib_Plivo_Runner_VerifyWebhook_SignatureBytes = new Uint8Array(await getSubtleCrypto().sign('HMAC', key, signedContent));
      const expectedSignature: Lib_Plivo_Runner_VerifyWebhook_ExpectedSignature = encodeBase64(signatureBytes);

      return signatureHeader.split(',').some((signature) => constantTimeEqual(signature.trim(), expectedSignature) === true);
    } catch {
      return false;
    }
  }

  /**
   * Lib - Plivo - Parse Inbound Message.
   *
   * Reads Plivo's form-encoded message webhook into Mailmask's inbound message
   * shape. Media0, Media1, and so on become the MMS media links in order.
   *
   * @param {Lib_Plivo_Runner_ParseInboundMessage_Webhook} webhook - Webhook.
   *
   * @returns {Lib_Plivo_Runner_ParseInboundMessage_Returns}
   *
   * @since 1.2.0
   */
  public static parseInboundMessage(webhook: Lib_Plivo_Runner_ParseInboundMessage_Webhook): Lib_Plivo_Runner_ParseInboundMessage_Returns {
    const params: Lib_Plivo_Runner_ParseInboundMessage_Params = new URLSearchParams(webhook['body']);
    const from: Lib_Plivo_Runner_ParseInboundMessage_From = params.get('From');
    const to: Lib_Plivo_Runner_ParseInboundMessage_To = params.get('To');
    const messageId: Lib_Plivo_Runner_ParseInboundMessage_MessageId = params.get('MessageUUID');
    const type: Lib_Plivo_Runner_ParseInboundMessage_Type = (params.get('Type') ?? 'sms').toLowerCase();

    if (
      from === null
      || to === null
      || messageId === null
      || (
        type !== 'sms'
        && type !== 'mms'
      )
    ) {
      return undefined;
    }

    const mediaKeys: Lib_Plivo_Runner_ParseInboundMessage_MediaKeys = [...params.keys()].filter((key) => LIB_REGEX_PHONE_MEDIA_KEY.test(key) === true).sort((a, b) => Number(a.slice(5)) - Number(b.slice(5)));

    return {
      messageId,
      from: normalizePhoneNumber(from),
      to: [normalizePhoneNumber(to)],
      text: params.get('Text') ?? '',
      mediaUrls: mediaKeys.map((mediaKey) => params.get(mediaKey) ?? '').filter((mediaUrl) => mediaUrl !== ''),
    };
  }

  /**
   * Lib - Plivo - Acknowledge Message.
   *
   * Builds the empty Plivo XML reply. Plivo expects XML from a message URL,
   * and an empty response tells it Mailmask sends nothing back to the sender.
   *
   * @returns {Lib_Plivo_Runner_AcknowledgeMessage_Returns}
   *
   * @since 1.2.0
   */
  public static acknowledgeMessage(): Lib_Plivo_Runner_AcknowledgeMessage_Returns {
    return {
      body: '<Response></Response>',
      contentType: 'application/xml',
    };
  }

  /**
   * Lib - Plivo - Send Message.
   *
   * Sends a text from the alias number, either a forwarded text or the user's own
   * text. Media links go along as-is, and Plivo is asked not to log the content.
   *
   * @param {Lib_Plivo_Runner_SendMessage_Provider} provider - Provider.
   * @param {Lib_Plivo_Runner_SendMessage_Message}  message  - Message.
   *
   * @returns {Lib_Plivo_Runner_SendMessage_Returns}
   *
   * @since 1.2.0
   */
  public static async sendMessage(provider: Lib_Plivo_Runner_SendMessage_Provider, message: Lib_Plivo_Runner_SendMessage_Message): Lib_Plivo_Runner_SendMessage_Returns {
    const plivo: Lib_Plivo_Runner_SendMessage_Plivo = Runner.asPlivo(provider);
    const response: Lib_Plivo_Runner_SendMessage_Response = await providerRequest(`${Runner.getAccountUrl(plivo)}/Message/`, 'POST', Runner.getHeaders(plivo), {
      src: Runner.toPlivoNumber(message['from']),
      dst: Runner.toPlivoNumber(message['to']),
      text: message['text'],
      log: false,
      ...((message['mediaUrls'].length > 0) ? {
        type: 'mms',
        media_urls: message['mediaUrls'],
      } : {}),
    });

    if (response['ok'] === false) {
      throw new Error(`Plivo refused the text (HTTP ${String(response['status'])}).`);
    }

    return;
  }

  /**
   * Lib - Plivo - Check Credentials.
   *
   * Reads the account details, the cheapest call that needs a valid auth ID
   * and auth token, so a bad pair is reported before deploy.
   *
   * @param {Lib_Plivo_Runner_CheckCredentials_Provider} provider - Provider.
   *
   * @returns {Lib_Plivo_Runner_CheckCredentials_Returns}
   *
   * @since 1.2.0
   */
  public static async checkCredentials(provider: Lib_Plivo_Runner_CheckCredentials_Provider): Lib_Plivo_Runner_CheckCredentials_Returns {
    const plivo: Lib_Plivo_Runner_CheckCredentials_Plivo = Runner.asPlivo(provider);
    const response: Lib_Plivo_Runner_CheckCredentials_Response = await providerRequest(`${Runner.getAccountUrl(plivo)}/`, 'GET', Runner.getHeaders(plivo), undefined);

    if (response['ok'] === false) {
      throw new Error(`Plivo rejected the auth ID and auth token for "${plivo['name']}" (HTTP ${String(response['status'])}).`);
    }

    return;
  }

  /**
   * Lib - Plivo - Search Numbers.
   *
   * Lists local numbers that can be rented and receive texts, optionally
   * starting with an area code, so a phone alias can start from a fresh number.
   *
   * @param {Lib_Plivo_Runner_SearchNumbers_Provider} provider - Provider.
   * @param {Lib_Plivo_Runner_SearchNumbers_Search}   search   - Search.
   *
   * @returns {Lib_Plivo_Runner_SearchNumbers_Returns}
   *
   * @since 1.2.0
   */
  public static async searchNumbers(provider: Lib_Plivo_Runner_SearchNumbers_Provider, search: Lib_Plivo_Runner_SearchNumbers_Search): Lib_Plivo_Runner_SearchNumbers_Returns {
    const plivo: Lib_Plivo_Runner_SearchNumbers_Plivo = Runner.asPlivo(provider);
    const query: Lib_Plivo_Runner_SearchNumbers_Query = new URLSearchParams({
      country_iso: search['countryCode'],
      type: 'local',
      services: 'sms',
      limit: String(Math.min(search['limit'], 20)),
    });

    if (search['areaCode'] !== undefined) {
      query.set('pattern', search['areaCode']);
    }

    const response: Lib_Plivo_Runner_SearchNumbers_Response = await providerRequest(`${Runner.getAccountUrl(plivo)}/PhoneNumber/?${query.toString()}`, 'GET', Runner.getHeaders(plivo), undefined);

    if (response['ok'] === false) {
      throw new Error(`Plivo number search failed (HTTP ${String(response['status'])}).`);
    }

    const availableNumbers: Lib_Plivo_Runner_SearchNumbers_AvailableNumbers = plivoAvailableNumbersSchema.parse(response['data']);

    return availableNumbers['objects'].map((availableNumber) => ({
      number: normalizePhoneNumber(availableNumber['number']),
      features: [
        ...((availableNumber['sms_enabled'] === true) ? ['sms'] : []),
        ...((availableNumber['mms_enabled'] === true) ? ['mms'] : []),
        ...((availableNumber['voice_enabled'] === true) ? ['voice'] : []),
      ],
    }));
  }

  /**
   * Lib - Plivo - Owns Number.
   *
   * Confirms a number is rented on the Plivo account before it becomes a phone
   * alias. Plivo answers not found for numbers the account does not have.
   *
   * @param {Lib_Plivo_Runner_OwnsNumber_Provider} provider - Provider.
   * @param {Lib_Plivo_Runner_OwnsNumber_Number}   number   - Number.
   *
   * @returns {Lib_Plivo_Runner_OwnsNumber_Returns}
   *
   * @since 1.2.0
   */
  public static async ownsNumber(provider: Lib_Plivo_Runner_OwnsNumber_Provider, number: Lib_Plivo_Runner_OwnsNumber_Number): Lib_Plivo_Runner_OwnsNumber_Returns {
    const plivo: Lib_Plivo_Runner_OwnsNumber_Plivo = Runner.asPlivo(provider);
    const response: Lib_Plivo_Runner_OwnsNumber_Response = await providerRequest(`${Runner.getAccountUrl(plivo)}/Number/${Runner.toPlivoNumber(number)}/`, 'GET', Runner.getHeaders(plivo), undefined);

    if (response['status'] === 404) {
      return false;
    }

    if (response['ok'] === false) {
      throw new Error(`Plivo could not look up "${number}" (HTTP ${String(response['status'])}).`);
    }

    return true;
  }

  /**
   * Lib - Plivo - Buy Number.
   *
   * Rents one number found by a search and returns its status. Numbers that
   * need compliance documents stay pending until Plivo approves them.
   *
   * @param {Lib_Plivo_Runner_BuyNumber_Provider} provider - Provider.
   * @param {Lib_Plivo_Runner_BuyNumber_Number}   number   - Number.
   *
   * @returns {Lib_Plivo_Runner_BuyNumber_Returns}
   *
   * @since 1.2.0
   */
  public static async buyNumber(provider: Lib_Plivo_Runner_BuyNumber_Provider, number: Lib_Plivo_Runner_BuyNumber_Number): Lib_Plivo_Runner_BuyNumber_Returns {
    const plivo: Lib_Plivo_Runner_BuyNumber_Plivo = Runner.asPlivo(provider);
    const response: Lib_Plivo_Runner_BuyNumber_Response = await providerRequest(`${Runner.getAccountUrl(plivo)}/PhoneNumber/${Runner.toPlivoNumber(number)}/`, 'POST', Runner.getHeaders(plivo), (plivo['application_id'] !== undefined) ? { app_id: plivo['application_id'] } : {});

    if (response['ok'] === false) {
      throw new Error(`Plivo could not rent "${number}" (HTTP ${String(response['status'])}).`);
    }

    const purchase: Lib_Plivo_Runner_BuyNumber_Purchase = plivoBuyNumberSchema.parse(response['data']);

    return purchase['status'] ?? 'fulfilled';
  }

  /**
   * Lib - Plivo - Release Number.
   *
   * Unrents a number from the Plivo account. Plivo stops billing for it and
   * may give it to someone else, so the CLI asks before calling this.
   *
   * @param {Lib_Plivo_Runner_ReleaseNumber_Provider} provider - Provider.
   * @param {Lib_Plivo_Runner_ReleaseNumber_Number}   number   - Number.
   *
   * @returns {Lib_Plivo_Runner_ReleaseNumber_Returns}
   *
   * @since 1.2.0
   */
  public static async releaseNumber(provider: Lib_Plivo_Runner_ReleaseNumber_Provider, number: Lib_Plivo_Runner_ReleaseNumber_Number): Lib_Plivo_Runner_ReleaseNumber_Returns {
    const plivo: Lib_Plivo_Runner_ReleaseNumber_Plivo = Runner.asPlivo(provider);
    const response: Lib_Plivo_Runner_ReleaseNumber_Response = await providerRequest(`${Runner.getAccountUrl(plivo)}/Number/${Runner.toPlivoNumber(number)}/`, 'DELETE', Runner.getHeaders(plivo), undefined);

    if (response['ok'] === false) {
      throw new Error(`Plivo could not release "${number}" (HTTP ${String(response['status'])}).`);
    }

    return;
  }

  /**
   * Lib - Plivo - Connect Numbers.
   *
   * Points the application at the Worker's message route, creating it
   * on the first deploy, and links every number. Plivo requires an answer URL, so
   * it gets the same route, whose empty reply ends a call.
   *
   * @param {Lib_Plivo_Runner_ConnectNumbers_Provider} provider - Provider.
   * @param {Lib_Plivo_Runner_ConnectNumbers_Numbers}  numbers  - Numbers.
   * @param {Lib_Plivo_Runner_ConnectNumbers_BaseUrl}  baseUrl  - Base url.
   *
   * @returns {Lib_Plivo_Runner_ConnectNumbers_Returns}
   *
   * @since 1.2.0
   */
  public static async connectNumbers(provider: Lib_Plivo_Runner_ConnectNumbers_Provider, numbers: Lib_Plivo_Runner_ConnectNumbers_Numbers, baseUrl: Lib_Plivo_Runner_ConnectNumbers_BaseUrl): Lib_Plivo_Runner_ConnectNumbers_Returns {
    const plivo: Lib_Plivo_Runner_ConnectNumbers_Plivo = Runner.asPlivo(provider);
    const applicationBody: Lib_Plivo_Runner_ConnectNumbers_ApplicationBody = {
      app_name: `mailmask-${plivo['name']}`,
      answer_url: `${baseUrl}/phone/${plivo['name']}/messages`,
      answer_method: 'POST',
      message_url: `${baseUrl}/phone/${plivo['name']}/messages`,
      message_method: 'POST',
      log_incoming_messages: false,
    };
    let applicationId: Lib_Plivo_Runner_ConnectNumbers_ApplicationId = plivo['application_id'];

    if (applicationId === undefined) {
      const applicationResponse: Lib_Plivo_Runner_ConnectNumbers_ApplicationResponse = await providerRequest(`${Runner.getAccountUrl(plivo)}/Application/`, 'POST', Runner.getHeaders(plivo), applicationBody);

      if (applicationResponse['ok'] === false) {
        throw new Error(`Plivo could not create the application for "${plivo['name']}" (HTTP ${String(applicationResponse['status'])}).`);
      }

      const application: Lib_Plivo_Runner_ConnectNumbers_Application = plivoApplicationSchema.parse(applicationResponse['data']);

      applicationId = application['app_id'];
    } else {
      const updateResponse: Lib_Plivo_Runner_ConnectNumbers_UpdateResponse = await providerRequest(`${Runner.getAccountUrl(plivo)}/Application/${encodeURIComponent(applicationId)}/`, 'POST', Runner.getHeaders(plivo), applicationBody);

      if (updateResponse['ok'] === false) {
        throw new Error(`Plivo could not update the application for "${plivo['name']}" (HTTP ${String(updateResponse['status'])}).`);
      }
    }

    const linkedApplicationId: Lib_Plivo_Runner_ConnectNumbers_LinkedApplicationId = applicationId;
    const responses: Lib_Plivo_Runner_ConnectNumbers_Responses = await Promise.all(numbers.map((number) => providerRequest(`${Runner.getAccountUrl(plivo)}/Number/${Runner.toPlivoNumber(number)}/`, 'POST', Runner.getHeaders(plivo), {
      app_id: linkedApplicationId,
    })));

    for (let responseIndex = 0; responseIndex < responses.length; responseIndex += 1) {
      const response: Lib_Plivo_Runner_ConnectNumbers_Response = responses[responseIndex];

      if (response !== undefined && response['ok'] === false) {
        throw new Error(`Plivo could not link "${numbers[responseIndex] ?? ''}" to the application (HTTP ${String(response['status'])}).`);
      }
    }

    return {
      ...plivo,
      application_id: applicationId,
    };
  }

  /**
   * Lib - Plivo - Build Signed URL.
   *
   * Rebuilds the string Plivo signs before the nonce, matching its SDK: the URL
   * with sorted query fields, then each sorted POST field as key and value.
   *
   * @param {Lib_Plivo_Runner_BuildSignedUrl_WebhookUrl} webhookUrl - Webhook url.
   * @param {Lib_Plivo_Runner_BuildSignedUrl_Body}       body       - Body.
   *
   * @private
   *
   * @returns {Lib_Plivo_Runner_BuildSignedUrl_Returns}
   *
   * @since 1.2.0
   */
  private static buildSignedUrl(webhookUrl: Lib_Plivo_Runner_BuildSignedUrl_WebhookUrl, body: Lib_Plivo_Runner_BuildSignedUrl_Body): Lib_Plivo_Runner_BuildSignedUrl_Returns {
    const url: Lib_Plivo_Runner_BuildSignedUrl_Url = new URL(webhookUrl);
    const params: Lib_Plivo_Runner_BuildSignedUrl_Params = new URLSearchParams(body);
    const postKeys: Lib_Plivo_Runner_BuildSignedUrl_PostKeys = [...new Set(params.keys())].sort();
    const queryEntries: Lib_Plivo_Runner_BuildSignedUrl_QueryEntries = [...url['searchParams'].entries()].sort((a, b) => {
      if (a[0] !== b[0]) {
        return (a[0] < b[0]) ? -1 : 1;
      }

      if (a[1] === b[1]) {
        return 0;
      }

      return (a[1] < b[1]) ? -1 : 1;
    });
    const queryString: Lib_Plivo_Runner_BuildSignedUrl_QueryString = queryEntries.map((queryEntry) => `${queryEntry[0]}=${queryEntry[1]}`).join('&');
    let baseUrl: Lib_Plivo_Runner_BuildSignedUrl_BaseUrl = `${url['protocol']}//${url['host']}${url['pathname']}`;
    let paramsString: Lib_Plivo_Runner_BuildSignedUrl_ParamsString = '';

    if (queryString.length > 0 || postKeys.length > 0) {
      baseUrl += `?${queryString}`;
    }

    if (queryString.length > 0 && postKeys.length > 0) {
      baseUrl += '.';
    }

    for (const postKey of postKeys) {
      for (const value of params.getAll(postKey).sort()) {
        paramsString += `${postKey}${value}`;
      }
    }

    return `${baseUrl}${paramsString}`;
  }

  /**
   * Lib - Plivo - As Plivo.
   *
   * Narrows a phone provider to a Plivo account. The provider lookup already
   * matches types, so a mismatch means the config was changed underneath it.
   *
   * @param {Lib_Plivo_Runner_AsPlivo_Provider} provider - Provider.
   *
   * @private
   *
   * @returns {Lib_Plivo_Runner_AsPlivo_Returns}
   *
   * @since 1.2.0
   */
  private static asPlivo(provider: Lib_Plivo_Runner_AsPlivo_Provider): Lib_Plivo_Runner_AsPlivo_Returns {
    if (provider['type'] !== 'plivo') {
      throw new Error(`Phone provider "${provider['name']}" is not a Plivo account.`);
    }

    return provider;
  }

  /**
   * Lib - Plivo - Get Account URL.
   *
   * Builds the account's API root from its auth ID. Every Plivo resource path
   * Mailmask calls starts here.
   *
   * @param {Lib_Plivo_Runner_GetAccountUrl_Plivo} plivo - Plivo.
   *
   * @private
   *
   * @returns {Lib_Plivo_Runner_GetAccountUrl_Returns}
   *
   * @since 1.2.0
   */
  private static getAccountUrl(plivo: Lib_Plivo_Runner_GetAccountUrl_Plivo): Lib_Plivo_Runner_GetAccountUrl_Returns {
    return `${PLIVO_API_BASE}/${encodeURIComponent(plivo['auth_id'])}`;
  }

  /**
   * Lib - Plivo - Get Headers.
   *
   * Builds the HTTP Basic authorization header every Plivo API call needs from
   * the auth ID and auth token.
   *
   * @param {Lib_Plivo_Runner_GetHeaders_Plivo} plivo - Plivo.
   *
   * @private
   *
   * @returns {Lib_Plivo_Runner_GetHeaders_Returns}
   *
   * @since 1.2.0
   */
  private static getHeaders(plivo: Lib_Plivo_Runner_GetHeaders_Plivo): Lib_Plivo_Runner_GetHeaders_Returns {
    return { Authorization: `Basic ${btoa(`${plivo['auth_id']}:${plivo['auth_token']}`)}` };
  }

  /**
   * Lib - Plivo - To Plivo Number.
   *
   * Drops the "+" from an E.164 number, the form Plivo uses in resource paths
   * and in the source and destination of a message.
   *
   * @param {Lib_Plivo_Runner_ToPlivoNumber_Number} number - Number.
   *
   * @private
   *
   * @returns {Lib_Plivo_Runner_ToPlivoNumber_Returns}
   *
   * @since 1.2.0
   */
  private static toPlivoNumber(number: Lib_Plivo_Runner_ToPlivoNumber_Number): Lib_Plivo_Runner_ToPlivoNumber_Returns {
    return normalizePhoneNumber(number).replace('+', '');
  }
}
