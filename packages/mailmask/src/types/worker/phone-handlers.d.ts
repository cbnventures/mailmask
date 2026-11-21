import type { Lib_PhoneProvider_GetPhoneProviderAdapter_Returns } from '../lib/phone-provider.d.ts';
import type { Lib_Schema_ConfigSchema, Lib_Schema_PhoneProviderConfig } from '../lib/schema.d.ts';
import type {
  Shared_NotificationPayload,
  Shared_PhoneInboundMessage,
  Shared_PhoneRouteDecision,
  Shared_PhoneWebhook,
  Shared_PhoneWebhookReply,
} from '../shared.d.ts';

/**
 * Worker - Phone Handlers - Error Response.
 *
 * @since 1.2.0
 */
export type Worker_PhoneHandlers_ErrorResponse_Status = number;

export type Worker_PhoneHandlers_ErrorResponse_Message = string;

export type Worker_PhoneHandlers_ErrorResponse_Returns = Response;

export type Worker_PhoneHandlers_ErrorResponse_Body = string;

/**
 * Worker - Phone Handlers - Handle Phone Webhook.
 *
 * @since 1.2.0
 */
export type Worker_PhoneHandlers_HandlePhoneWebhook_Request = Request;

export type Worker_PhoneHandlers_HandlePhoneWebhook_ProviderName = string;

export type Worker_PhoneHandlers_HandlePhoneWebhook_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Worker_PhoneHandlers_HandlePhoneWebhook_Now = number;

export type Worker_PhoneHandlers_HandlePhoneWebhook_Context = Pick<ExecutionContext, 'waitUntil'>;

export type Worker_PhoneHandlers_HandlePhoneWebhook_EmailBinding = SendEmail | undefined;

export type Worker_PhoneHandlers_HandlePhoneWebhook_Returns = Promise<Response>;

export type Worker_PhoneHandlers_HandlePhoneWebhook_Provider = Lib_Schema_PhoneProviderConfig | undefined;

export type Worker_PhoneHandlers_HandlePhoneWebhook_Adapter = { [Key in keyof Lib_PhoneProvider_GetPhoneProviderAdapter_Returns]: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns[Key] };

export type Worker_PhoneHandlers_HandlePhoneWebhook_Webhook = { [Key in keyof Shared_PhoneWebhook]: Shared_PhoneWebhook[Key] };

export type Worker_PhoneHandlers_HandlePhoneWebhook_Verified = boolean;

export type Worker_PhoneHandlers_HandlePhoneWebhook_InboundMessage = Shared_PhoneInboundMessage | undefined;

export type Worker_PhoneHandlers_HandlePhoneWebhook_Decision = { [Key in keyof Shared_PhoneRouteDecision]: Shared_PhoneRouteDecision[Key] };

export type Worker_PhoneHandlers_HandlePhoneWebhook_ErrorMessage = string;

export type Worker_PhoneHandlers_HandlePhoneWebhook_Payload = { [Key in keyof Shared_NotificationPayload]: Shared_NotificationPayload[Key] };

/**
 * Worker - Phone Handlers - Reply Response.
 *
 * @since 1.2.0
 */
export type Worker_PhoneHandlers_ReplyResponse_Reply = Shared_PhoneWebhookReply;

export type Worker_PhoneHandlers_ReplyResponse_Returns = Response;
