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
  Lib_Schema_PlivoApplication,
  Lib_Schema_PlivoAvailableNumbers,
  Lib_Schema_PlivoBuyNumber,
  Lib_Schema_PlivoProviderConfig,
} from './schema.d.ts';

/**
 * Lib - Plivo - Runner - Acknowledge Message.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_AcknowledgeMessage_Returns = Shared_PhoneWebhookReply;

/**
 * Lib - Plivo - Runner - As Plivo.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_AsPlivo_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Plivo_Runner_AsPlivo_Returns = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

/**
 * Lib - Plivo - Runner - Build Signed Url.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_BuildSignedUrl_WebhookUrl = string;

export type Lib_Plivo_Runner_BuildSignedUrl_Body = string;

export type Lib_Plivo_Runner_BuildSignedUrl_Returns = string;

export type Lib_Plivo_Runner_BuildSignedUrl_Url = URL;

export type Lib_Plivo_Runner_BuildSignedUrl_Params = URLSearchParams;

export type Lib_Plivo_Runner_BuildSignedUrl_PostKey = string;

export type Lib_Plivo_Runner_BuildSignedUrl_PostKeys = Lib_Plivo_Runner_BuildSignedUrl_PostKey[];

export type Lib_Plivo_Runner_BuildSignedUrl_QueryEntry = [string, string];

export type Lib_Plivo_Runner_BuildSignedUrl_QueryEntries = Lib_Plivo_Runner_BuildSignedUrl_QueryEntry[];

export type Lib_Plivo_Runner_BuildSignedUrl_QueryString = string;

export type Lib_Plivo_Runner_BuildSignedUrl_BaseUrl = string;

export type Lib_Plivo_Runner_BuildSignedUrl_ParamsString = string;

/**
 * Lib - Plivo - Runner - Buy Number.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_BuyNumber_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Plivo_Runner_BuyNumber_Number = string;

export type Lib_Plivo_Runner_BuyNumber_Returns = Promise<string>;

export type Lib_Plivo_Runner_BuyNumber_Plivo = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

export type Lib_Plivo_Runner_BuyNumber_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

export type Lib_Plivo_Runner_BuyNumber_Purchase = { [Key in keyof Lib_Schema_PlivoBuyNumber]: Lib_Schema_PlivoBuyNumber[Key] };

/**
 * Lib - Plivo - Runner - Check Credentials.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_CheckCredentials_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Plivo_Runner_CheckCredentials_Returns = Promise<void>;

export type Lib_Plivo_Runner_CheckCredentials_Plivo = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

export type Lib_Plivo_Runner_CheckCredentials_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

/**
 * Lib - Plivo - Runner - Connect Numbers.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_ConnectNumbers_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Plivo_Runner_ConnectNumbers_Number = string;

export type Lib_Plivo_Runner_ConnectNumbers_Numbers = Lib_Plivo_Runner_ConnectNumbers_Number[];

export type Lib_Plivo_Runner_ConnectNumbers_BaseUrl = string;

export type Lib_Plivo_Runner_ConnectNumbers_Returns = Promise<Lib_Schema_PhoneProviderConfig>;

export type Lib_Plivo_Runner_ConnectNumbers_Plivo = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

export type Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_AppName = string;

export type Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_AnswerUrl = string;

export type Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_AnswerMethod = 'POST';

export type Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_MessageUrl = string;

export type Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_MessageMethod = 'POST';

export type Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_LogIncomingMessages = false;

export type Lib_Plivo_Runner_ConnectNumbers_ApplicationBody = {
  app_name: Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_AppName;
  answer_url: Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_AnswerUrl;
  answer_method: Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_AnswerMethod;
  message_url: Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_MessageUrl;
  message_method: Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_MessageMethod;
  log_incoming_messages: Lib_Plivo_Runner_ConnectNumbers_ApplicationBody_LogIncomingMessages;
};

export type Lib_Plivo_Runner_ConnectNumbers_ApplicationId = string | undefined;

export type Lib_Plivo_Runner_ConnectNumbers_ApplicationResponse = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

export type Lib_Plivo_Runner_ConnectNumbers_Application = { [Key in keyof Lib_Schema_PlivoApplication]: Lib_Schema_PlivoApplication[Key] };

export type Lib_Plivo_Runner_ConnectNumbers_UpdateResponse = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

export type Lib_Plivo_Runner_ConnectNumbers_LinkedApplicationId = string;

export type Lib_Plivo_Runner_ConnectNumbers_Responses = Shared_PhoneProviderResponse[];

export type Lib_Plivo_Runner_ConnectNumbers_Response = Shared_PhoneProviderResponse | undefined;

/**
 * Lib - Plivo - Runner - Get Account Url.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_GetAccountUrl_Plivo = Lib_Schema_PlivoProviderConfig;

export type Lib_Plivo_Runner_GetAccountUrl_Returns = string;

/**
 * Lib - Plivo - Runner - Get Headers.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_GetHeaders_Plivo = Lib_Schema_PlivoProviderConfig;

export type Lib_Plivo_Runner_GetHeaders_Returns = Record<string, string>;

/**
 * Lib - Plivo - Runner - Owns Number.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_OwnsNumber_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Plivo_Runner_OwnsNumber_Number = string;

export type Lib_Plivo_Runner_OwnsNumber_Returns = Promise<boolean>;

export type Lib_Plivo_Runner_OwnsNumber_Plivo = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

export type Lib_Plivo_Runner_OwnsNumber_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

/**
 * Lib - Plivo - Runner - Parse Inbound Message.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_ParseInboundMessage_Webhook = Shared_PhoneWebhook;

export type Lib_Plivo_Runner_ParseInboundMessage_Returns = Shared_PhoneInboundMessage | undefined;

export type Lib_Plivo_Runner_ParseInboundMessage_Params = URLSearchParams;

export type Lib_Plivo_Runner_ParseInboundMessage_From = string | null;

export type Lib_Plivo_Runner_ParseInboundMessage_To = string | null;

export type Lib_Plivo_Runner_ParseInboundMessage_MessageId = string | null;

export type Lib_Plivo_Runner_ParseInboundMessage_Type = string;

export type Lib_Plivo_Runner_ParseInboundMessage_MediaKey = string;

export type Lib_Plivo_Runner_ParseInboundMessage_MediaKeys = Lib_Plivo_Runner_ParseInboundMessage_MediaKey[];

/**
 * Lib - Plivo - Runner - Release Number.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_ReleaseNumber_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Plivo_Runner_ReleaseNumber_Number = string;

export type Lib_Plivo_Runner_ReleaseNumber_Returns = Promise<void>;

export type Lib_Plivo_Runner_ReleaseNumber_Plivo = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

export type Lib_Plivo_Runner_ReleaseNumber_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

/**
 * Lib - Plivo - Runner - Search Numbers.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_SearchNumbers_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Plivo_Runner_SearchNumbers_Search = Shared_PhoneNumberSearch;

export type Lib_Plivo_Runner_SearchNumbers_Returns = Promise<Shared_PhoneAvailableNumber[]>;

export type Lib_Plivo_Runner_SearchNumbers_Plivo = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

export type Lib_Plivo_Runner_SearchNumbers_Query = URLSearchParams;

export type Lib_Plivo_Runner_SearchNumbers_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

export type Lib_Plivo_Runner_SearchNumbers_AvailableNumbers = { [Key in keyof Lib_Schema_PlivoAvailableNumbers]: Lib_Schema_PlivoAvailableNumbers[Key] };

/**
 * Lib - Plivo - Runner - Send Message.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_SendMessage_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Plivo_Runner_SendMessage_Message = Shared_PhoneOutboundMessage;

export type Lib_Plivo_Runner_SendMessage_Returns = Promise<void>;

export type Lib_Plivo_Runner_SendMessage_Plivo = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

export type Lib_Plivo_Runner_SendMessage_Response = { [Key in keyof Shared_PhoneProviderResponse]: Shared_PhoneProviderResponse[Key] };

/**
 * Lib - Plivo - Runner - To Plivo Number.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_ToPlivoNumber_Number = string;

export type Lib_Plivo_Runner_ToPlivoNumber_Returns = string;

/**
 * Lib - Plivo - Runner - Verify Webhook.
 *
 * @since 1.2.0
 */
export type Lib_Plivo_Runner_VerifyWebhook_Provider = Lib_Schema_PhoneProviderConfig;

export type Lib_Plivo_Runner_VerifyWebhook_Webhook = Shared_PhoneWebhook;

export type Lib_Plivo_Runner_VerifyWebhook_Returns = Promise<boolean>;

export type Lib_Plivo_Runner_VerifyWebhook_Plivo = { [Key in keyof Lib_Schema_PlivoProviderConfig]: Lib_Schema_PlivoProviderConfig[Key] };

export type Lib_Plivo_Runner_VerifyWebhook_SignatureHeader = string | null;

export type Lib_Plivo_Runner_VerifyWebhook_Nonce = string | null;

export type Lib_Plivo_Runner_VerifyWebhook_SignedContent = Uint8Array<ArrayBuffer>;

export type Lib_Plivo_Runner_VerifyWebhook_AuthTokenBytes = Uint8Array<ArrayBuffer>;

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Web Crypto is a stable global in Node.js 22 and in Workers.
export type Lib_Plivo_Runner_VerifyWebhook_Key = Awaited<ReturnType<typeof crypto.subtle.importKey>>;

export type Lib_Plivo_Runner_VerifyWebhook_SignatureBytes = Uint8Array;

export type Lib_Plivo_Runner_VerifyWebhook_ExpectedSignature = string;
