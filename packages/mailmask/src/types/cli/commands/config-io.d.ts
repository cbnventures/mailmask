import type { Lib_Schema_ConfigSchema } from '../../lib/schema.d.ts';

/**
 * CLI - Commands - Config IO.
 *
 * @since 1.1.0
 */
export type Cli_Commands_ConfigIo_NoticedConfigPaths = Set<string>;

/**
 * CLI - Commands - Config IO - Drop Retired Settings.
 *
 * @since 1.1.0
 */
export type Cli_Commands_ConfigIo_DropRetiredSettings_ConfigPath = string;

export type Cli_Commands_ConfigIo_DropRetiredSettings_Parsed = unknown;

export type Cli_Commands_ConfigIo_DropRetiredSettings_Returns = void;

export type Cli_Commands_ConfigIo_DropRetiredSettings_Settings = unknown;

export type Cli_Commands_ConfigIo_DropRetiredSettings_RetiredKey = string;

export type Cli_Commands_ConfigIo_DropRetiredSettings_RetiredKeys = Cli_Commands_ConfigIo_DropRetiredSettings_RetiredKey[];

/**
 * CLI - Commands - Config IO.
 *
 * @since 0.0.1
 */
export type Cli_Commands_ConfigIo_LoadConfig_ConfigPath = string;

export type Cli_Commands_ConfigIo_LoadConfig_Returns = unknown;

export type Cli_Commands_ConfigIo_LoadConfig_ConfigRaw = string;

export type Cli_Commands_ConfigIo_LoadConfig_Parsed = unknown;

/**
 * CLI - Commands - Config IO.
 *
 * @since 0.0.1
 */
export type Cli_Commands_ConfigIo_NormalizeConfig_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_ConfigIo_NormalizeConfig_Returns = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_ConfigIo_NormalizeConfig_SortedDestinations = Lib_Schema_ConfigSchema['destinations'];

export type Cli_Commands_ConfigIo_NormalizeConfig_SortedAliases = Lib_Schema_ConfigSchema['aliases'];

export type Cli_Commands_ConfigIo_NormalizeConfig_PhoneProviders = Lib_Schema_ConfigSchema['phone_providers'];

export type Cli_Commands_ConfigIo_NormalizeConfig_PhoneAliases = Lib_Schema_ConfigSchema['phone_aliases'];

/**
 * CLI - Commands - Config IO.
 *
 * @since 0.0.1
 */
export type Cli_Commands_ConfigIo_SaveConfig_ConfigPath = string;

export type Cli_Commands_ConfigIo_SaveConfig_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_ConfigIo_SaveConfig_Returns = void;
