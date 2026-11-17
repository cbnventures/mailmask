import type { Lib_Schema_ConfigSchema, Lib_Schema_NotifierConfig } from '../../lib/schema.d.ts';
import type { Shared_NotificationRequest } from '../../shared.d.ts';

/**
 * CLI - Commands - Notifier - Add Notifier.
 *
 * @since 1.0.0
 */
export type Cli_Commands_Notifier_AddNotifier_ConfigPath = string;

export type Cli_Commands_Notifier_AddNotifier_Notifier = Lib_Schema_NotifierConfig;

export type Cli_Commands_Notifier_AddNotifier_Returns = void;

export type Cli_Commands_Notifier_AddNotifier_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Notifier_AddNotifier_Parsed = Lib_Schema_NotifierConfig & {};

/**
 * CLI - Commands - Notifier - List Notifiers.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Notifier_ListNotifiers_ConfigPath = string;

export type Cli_Commands_Notifier_ListNotifiers_Returns = Array<Lib_Schema_NotifierConfig>;

/**
 * CLI - Commands - Notifier - Remove Notifier.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Notifier_RemoveNotifier_ConfigPath = string;

export type Cli_Commands_Notifier_RemoveNotifier_Name = string;

export type Cli_Commands_Notifier_RemoveNotifier_Returns = void;

export type Cli_Commands_Notifier_RemoveNotifier_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Notifier_RemoveNotifier_Filtered = Array<Lib_Schema_NotifierConfig>;

/**
 * CLI - Commands - Notifier - Test Notifier.
 *
 * @since 1.0.0
 */
export type Cli_Commands_Notifier_TestNotifier_ConfigPath = string;

export type Cli_Commands_Notifier_TestNotifier_Name = string;

export type Cli_Commands_Notifier_TestNotifier_Returns = Promise<void>;

export type Cli_Commands_Notifier_TestNotifier_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Notifier_TestNotifier_Notifier = Lib_Schema_NotifierConfig | undefined;

export type Cli_Commands_Notifier_TestNotifier_Request = Shared_NotificationRequest | undefined;

export type Cli_Commands_Notifier_TestNotifier_Controller = AbortController;

export type Cli_Commands_Notifier_TestNotifier_TimeoutId = ReturnType<typeof setTimeout>;

export type Cli_Commands_Notifier_TestNotifier_Response = Response;
