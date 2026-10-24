import type { Lib_Schema_ConfigSchema, Lib_Schema_NotifierConfig } from '../../lib/schema.d.ts';

/**
 * CLI - Commands - Notifier - Add Notifier.
 *
 * @since 0.0.1
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
