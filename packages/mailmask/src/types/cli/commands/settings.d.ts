import type { Lib_Schema_ConfigSchema, Lib_Schema_SettingsConfig } from '../../lib/schema.d.ts';

/**
 * CLI - Commands - Settings - Get Settings.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Settings_GetSettings_ConfigPath = string;

export type Cli_Commands_Settings_GetSettings_Returns = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Commands_Settings_GetSettings_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * CLI - Commands - Settings - Update Settings.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Settings_UpdateSettings_ConfigPath = string;

export type Cli_Commands_Settings_UpdateSettings_Updates = Partial<Lib_Schema_SettingsConfig>;

export type Cli_Commands_Settings_UpdateSettings_Returns = void;

export type Cli_Commands_Settings_UpdateSettings_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };
