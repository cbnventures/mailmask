import type { Lib_Schema_ConfigSchema, Lib_Schema_SettingsConfig } from '../lib/schema.d.ts';
import type { Shared_NotificationPayload } from '../shared.d.ts';
import type { Shared_RouteDecision } from '../shared.d.ts';

/**
 * Worker - Handlers - Handle Email.
 *
 * @since 1.0.0
 */
export type Worker_Handlers_HandleEmail_Message = Pick<ForwardableEmailMessage, 'to' | 'from' | 'forward' | 'setReject'>;

export type Worker_Handlers_HandleEmail_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Worker_Handlers_HandleEmail_Now = number;

export type Worker_Handlers_HandleEmail_Context = Pick<ExecutionContext, 'waitUntil'>;

export type Worker_Handlers_HandleEmail_EmailBinding = SendEmail | undefined;

export type Worker_Handlers_HandleEmail_Returns = Promise<void>;

export type Worker_Handlers_HandleEmail_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Worker_Handlers_HandleEmail_Decision = Shared_RouteDecision;

export type Worker_Handlers_HandleEmail_ForwardHeaders = Headers;

export type Worker_Handlers_HandleEmail_Payload = { [Key in keyof Shared_NotificationPayload]: Shared_NotificationPayload[Key] };
