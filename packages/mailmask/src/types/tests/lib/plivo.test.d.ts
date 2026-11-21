import type { MockInstance } from 'vitest';

import type { Lib_Schema_PhoneProviderConfig, Lib_Schema_PlivoProviderConfig } from '../../lib/schema.d.ts';
import type { Shared_PhoneInboundMessage } from '../../shared.d.ts';

/**
 * Tests - Lib - Plivo.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Plivo_Provider = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

export type Tests_Lib_Plivo_WebhookUrl = string;

export type Tests_Lib_Plivo_Nonce = string;

export type Tests_Lib_Plivo_InboundBody = string;

/**
 * Tests - Lib - Plivo - Connect Numbers - Creates The Application And Links Every Number.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Plivo_ConnectNumbers_CreatesTheApplicationAndLinksEveryNumber_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Lib_Plivo_ConnectNumbers_CreatesTheApplicationAndLinksEveryNumber_Connected = Lib_Schema_PhoneProviderConfig & {};

export type Tests_Lib_Plivo_ConnectNumbers_CreatesTheApplicationAndLinksEveryNumber_ApplicationBody = Record<string, unknown>;

/**
 * Tests - Lib - Plivo - Parse Inbound Message - Reads Form Fields And Orders Media By Number.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Plivo_ParseInboundMessage_ReadsFormFieldsAndOrdersMediaByNumber_Message = Shared_PhoneInboundMessage | undefined;

/**
 * Tests - Lib - Plivo - Release Number - Checks And Releases Numbers Without The Plus.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Plivo_ReleaseNumber_ChecksAndReleasesNumbersWithoutThePlus_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - Lib - Plivo - Send Message - Posts An Mms With Basic Auth.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Plivo_SendMessage_PostsAnMMSWithBasicAuth_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Lib_Plivo_SendMessage_PostsAnMMSWithBasicAuth_RequestInit = RequestInit | undefined;

export type Tests_Lib_Plivo_SendMessage_PostsAnMMSWithBasicAuth_RequestBody = Record<string, unknown>;

/**
 * Tests - Lib - Plivo - Sign String.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Plivo_SignString_Value = string;

export type Tests_Lib_Plivo_SignString_Returns = string;

/**
 * Tests - Lib - Plivo - Verify Webhook - Accepts Any Of Several Comma Separated Signatures.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Plivo_VerifyWebhook_AcceptsAnyOfSeveralCommaSeparatedSignatures_Signature = string;

/**
 * Tests - Lib - Plivo - Verify Webhook - Accepts The V3 Signature Over The Url Sorted Fields And Nonce.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Plivo_VerifyWebhook_AcceptsTheV3SignatureOverTheURLSortedFieldsAndNonce_SignedString = string;

/**
 * Tests - Lib - Plivo - Verify Webhook - Refuses Wrong Tokens Tampered Fields And Missing Headers.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Plivo_VerifyWebhook_RefusesWrongTokensTamperedFieldsAndMissingHeaders_Signature = string;
