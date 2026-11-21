import type { Lib_Schema_ConfigSchema, Lib_Schema_SettingsConfig } from '../lib/schema.d.ts';
import type { Shared_NotificationPayload } from '../shared.d.ts';
import type { Shared_RouteDecision } from '../shared.d.ts';

/**
 * Worker - Handlers - Handle Email.
 *
 * @since 1.2.0
 */
export type Worker_Handlers_HandleEmail_Message = Pick<ForwardableEmailMessage, 'to' | 'from' | 'forward' | 'setReject'> & Partial<Pick<ForwardableEmailMessage, 'headers' | 'raw'>>;

export type Worker_Handlers_HandleEmail_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Worker_Handlers_HandleEmail_Now = number;

export type Worker_Handlers_HandleEmail_Context = Pick<ExecutionContext, 'waitUntil'>;

export type Worker_Handlers_HandleEmail_EmailBinding = SendEmail | undefined;

export type Worker_Handlers_HandleEmail_EmailMessageConstructor = (new (from: string, to: string, raw: ReadableStream | string) => EmailMessage) | undefined;

export type Worker_Handlers_HandleEmail_Returns = Promise<void>;

export type Worker_Handlers_HandleEmail_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Worker_Handlers_HandleEmail_MessageHeaders = Headers;

export type Worker_Handlers_HandleEmail_HeaderSender = string | undefined;

export type Worker_Handlers_HandleEmail_Decision = Shared_RouteDecision;

export type Worker_Handlers_HandleEmail_Raw = Uint8Array;

export type Worker_Handlers_HandleEmail_AliasEmail = string;

export type Worker_Handlers_HandleEmail_SentRaw = Uint8Array;

export type Worker_Handlers_HandleEmail_SendFailure = string;

export type Worker_Handlers_HandleEmail_ForwardHeaders = Headers;

export type Worker_Handlers_HandleEmail_AliasHeader = string;

export type Worker_Handlers_HandleEmail_AliasHeaders = Worker_Handlers_HandleEmail_AliasHeader[];

export type Worker_Handlers_HandleEmail_ReplyTarget = string;

export type Worker_Handlers_HandleEmail_ReverseAddress = string | undefined;

export type Worker_Handlers_HandleEmail_ForwardedRaw = Uint8Array;

export type Worker_Handlers_HandleEmail_ErrorMessage = string;

export type Worker_Handlers_HandleEmail_Payload = { [Key in keyof Shared_NotificationPayload]: Shared_NotificationPayload[Key] };
