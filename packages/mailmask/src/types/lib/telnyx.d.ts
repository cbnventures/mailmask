import type { z } from 'zod';

import type {
  Shared_PhoneAvailableNumber,
  Shared_PhoneInboundMessage,
  Shared_PhoneNumberSearch,
  Shared_PhoneOutboundMessage,
  Shared_PhoneProviderResponse,
  Shared_PhoneWebhook,
  Shared_PhoneWebhookReply,
} from '../shared.d.ts';
import type {
  Lib_Schema_PhoneProviderConfig,
  Lib_Schema_TelnyxAvailableNumbers,
  Lib_Schema_TelnyxMessagingProfile,
  Lib_Schema_TelnyxNumberOrder,
  Lib_Schema_TelnyxPhoneNumber,
  Lib_Schema_TelnyxPhoneNumbers,
  Lib_Schema_TelnyxProviderConfig,
  Lib_Schema_TelnyxWebhook,
  Lib_Schema_TelnyxWebhookDataPayload,
} from './schema.d.ts';

/**
 * Lib - Telnyx - Runner - Acknowledge Message.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_AcknowledgeMessage_Returns = Shared_PhoneWebhookReply;

export type Lib_Telnyx_Runner_AcknowledgeMessage_Body = string;

/**
 * Lib - Telnyx - Runner - As Telnyx.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_AsTelnyx_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Telnyx_Runner_AsTelnyx_Returns = { [Key in keyof Lib_Schema_TelnyxProviderConfig]: Lib_Schema_TelnyxProviderConfig[Key] };

/**
 * Lib - Telnyx - Runner - Buy Number.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_BuyNumber_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Telnyx_Runner_BuyNumber_Number = string;

export type Lib_Telnyx_Runner_BuyNumber_Returns = Promise<string>;

export type Lib_Telnyx_Runner_BuyNumber_Telnyx = { [Key in keyof Lib_Schema_TelnyxProviderConfig]: Lib_Schema_TelnyxProviderConfig[Key] };

export type Lib_Telnyx_Runner_BuyNumber_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

export type Lib_Telnyx_Runner_BuyNumber_Order = { [Key in keyof Lib_Schema_TelnyxNumberOrder]: Lib_Schema_TelnyxNumberOrder[Key] };

/**
 * Lib - Telnyx - Runner - Check Credentials.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_CheckCredentials_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Telnyx_Runner_CheckCredentials_Returns = Promise<void>;

export type Lib_Telnyx_Runner_CheckCredentials_Telnyx = { [Key in keyof Lib_Schema_TelnyxProviderConfig]: Lib_Schema_TelnyxProviderConfig[Key] };

export type Lib_Telnyx_Runner_CheckCredentials_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

/**
 * Lib - Telnyx - Runner - Connect Numbers.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_ConnectNumbers_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Telnyx_Runner_ConnectNumbers_Number = string;

export type Lib_Telnyx_Runner_ConnectNumbers_Numbers = Lib_Telnyx_Runner_ConnectNumbers_Number[];

export type Lib_Telnyx_Runner_ConnectNumbers_BaseUrl = string;

export type Lib_Telnyx_Runner_ConnectNumbers_Returns = Promise<Lib_Schema_PhoneProviderConfig>;

export type Lib_Telnyx_Runner_ConnectNumbers_Telnyx = { [Key in keyof Lib_Schema_TelnyxProviderConfig]: Lib_Schema_TelnyxProviderConfig[Key] };

export type Lib_Telnyx_Runner_ConnectNumbers_WebhookUrl = string;

export type Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_Name = string;

export type Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_WebhookUrl = string;

export type Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_WebhookApiVersion = '2';

export type Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_WhitelistedDestination = string;

export type Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_WhitelistedDestinations = Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_WhitelistedDestination[];

export type Lib_Telnyx_Runner_ConnectNumbers_ProfileBody = {
  name: Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_Name;
  webhook_url: Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_WebhookUrl;
  webhook_api_version: Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_WebhookApiVersion;
  whitelisted_destinations: Lib_Telnyx_Runner_ConnectNumbers_ProfileBody_WhitelistedDestinations;
};

export type Lib_Telnyx_Runner_ConnectNumbers_ProfileResponse = Shared_PhoneProviderResponse | undefined;

export type Lib_Telnyx_Runner_ConnectNumbers_Profile = { [Key in keyof Lib_Schema_TelnyxMessagingProfile]: Lib_Schema_TelnyxMessagingProfile[Key] };

export type Lib_Telnyx_Runner_ConnectNumbers_Responses = Shared_PhoneProviderResponse[];

export type Lib_Telnyx_Runner_ConnectNumbers_Response = Shared_PhoneProviderResponse | undefined;

/**
 * Lib - Telnyx - Runner - Find Number Id.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_FindNumberId_Telnyx = Lib_Schema_TelnyxProviderConfig;

export type Lib_Telnyx_Runner_FindNumberId_Number = string;

export type Lib_Telnyx_Runner_FindNumberId_Returns = Promise<string | undefined>;

export type Lib_Telnyx_Runner_FindNumberId_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

export type Lib_Telnyx_Runner_FindNumberId_Numbers = { [Key in keyof Lib_Schema_TelnyxPhoneNumbers]: Lib_Schema_TelnyxPhoneNumbers[Key] };

export type Lib_Telnyx_Runner_FindNumberId_AccountNumber = Lib_Schema_TelnyxPhoneNumber | undefined;

/**
 * Lib - Telnyx - Runner - Get Headers.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_GetHeaders_Telnyx = Lib_Schema_TelnyxProviderConfig;

export type Lib_Telnyx_Runner_GetHeaders_Returns = Record<string, string>;

/**
 * Lib - Telnyx - Runner - Owns Number.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_OwnsNumber_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Telnyx_Runner_OwnsNumber_Number = string;

export type Lib_Telnyx_Runner_OwnsNumber_Returns = Promise<boolean>;

export type Lib_Telnyx_Runner_OwnsNumber_NumberId = string | undefined;

/**
 * Lib - Telnyx - Runner - Parse Inbound Message.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_ParseInboundMessage_Webhook = Shared_PhoneWebhook;

export type Lib_Telnyx_Runner_ParseInboundMessage_Returns = Shared_PhoneInboundMessage | undefined;

export type Lib_Telnyx_Runner_ParseInboundMessage_Raw = unknown;

export type Lib_Telnyx_Runner_ParseInboundMessage_Parsed = z.ZodSafeParseResult<Lib_Schema_TelnyxWebhook>;

export type Lib_Telnyx_Runner_ParseInboundMessage_Payload = Lib_Schema_TelnyxWebhookDataPayload | undefined;

/**
 * Lib - Telnyx - Runner - Release Number.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_ReleaseNumber_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Telnyx_Runner_ReleaseNumber_Number = string;

export type Lib_Telnyx_Runner_ReleaseNumber_Returns = Promise<void>;

export type Lib_Telnyx_Runner_ReleaseNumber_Telnyx = { [Key in keyof Lib_Schema_TelnyxProviderConfig]: Lib_Schema_TelnyxProviderConfig[Key] };

export type Lib_Telnyx_Runner_ReleaseNumber_NumberId = string | undefined;

export type Lib_Telnyx_Runner_ReleaseNumber_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

/**
 * Lib - Telnyx - Runner - Search Numbers.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_SearchNumbers_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Telnyx_Runner_SearchNumbers_Search = Shared_PhoneNumberSearch;

export type Lib_Telnyx_Runner_SearchNumbers_Returns = Promise<Shared_PhoneAvailableNumber[]>;

export type Lib_Telnyx_Runner_SearchNumbers_Telnyx = { [Key in keyof Lib_Schema_TelnyxProviderConfig]: Lib_Schema_TelnyxProviderConfig[Key] };

export type Lib_Telnyx_Runner_SearchNumbers_Query = URLSearchParams;

export type Lib_Telnyx_Runner_SearchNumbers_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

export type Lib_Telnyx_Runner_SearchNumbers_AvailableNumbers = { [Key in keyof Lib_Schema_TelnyxAvailableNumbers]: Lib_Schema_TelnyxAvailableNumbers[Key] };

/**
 * Lib - Telnyx - Runner - Send Message.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_SendMessage_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Telnyx_Runner_SendMessage_Message = Shared_PhoneOutboundMessage;

export type Lib_Telnyx_Runner_SendMessage_Returns = Promise<void>;

export type Lib_Telnyx_Runner_SendMessage_Telnyx = { [Key in keyof Lib_Schema_TelnyxProviderConfig]: Lib_Schema_TelnyxProviderConfig[Key] };

export type Lib_Telnyx_Runner_SendMessage_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

/**
 * Lib - Telnyx - Runner - Verify Webhook.
 *
 * @since 1.2.0
 */
export type Lib_Telnyx_Runner_VerifyWebhook_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Telnyx_Runner_VerifyWebhook_Webhook = Shared_PhoneWebhook;

export type Lib_Telnyx_Runner_VerifyWebhook_Now = number;

export type Lib_Telnyx_Runner_VerifyWebhook_Returns = Promise<boolean>;

export type Lib_Telnyx_Runner_VerifyWebhook_Telnyx = { [Key in keyof Lib_Schema_TelnyxProviderConfig]: Lib_Schema_TelnyxProviderConfig[Key] };

export type Lib_Telnyx_Runner_VerifyWebhook_SignatureHeader = string | null;

export type Lib_Telnyx_Runner_VerifyWebhook_TimestampHeader = string | null;

export type Lib_Telnyx_Runner_VerifyWebhook_Timestamp = number;

export type Lib_Telnyx_Runner_VerifyWebhook_PublicKeyBytes = Uint8Array<ArrayBuffer> | undefined;

export type Lib_Telnyx_Runner_VerifyWebhook_SignatureBytes = Uint8Array<ArrayBuffer> | undefined;

export type Lib_Telnyx_Runner_VerifyWebhook_SignedContent = Uint8Array<ArrayBuffer>;

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Web Crypto is a stable global in Node.js 22 and in Workers.
export type Lib_Telnyx_Runner_VerifyWebhook_Key = Awaited<ReturnType<typeof crypto.subtle.importKey>>;
