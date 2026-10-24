import type { Lib_Schema_ConfigSchema } from '../../lib/schema.d.ts';

/**
 * CLI - Commands - Config IO.
 *
 * @since UNRELEASED
 */
export type Cli_Commands_ConfigIo_LoadConfig_ConfigPath = string;

export type Cli_Commands_ConfigIo_LoadConfig_Returns = unknown;

export type Cli_Commands_ConfigIo_LoadConfig_ConfigRaw = string;

export type Cli_Commands_ConfigIo_LoadConfig_Parsed = unknown;

/**
 * CLI - Commands - Config IO.
 *
 * @since UNRELEASED
 */
export type Cli_Commands_ConfigIo_NormalizeConfig_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_ConfigIo_NormalizeConfig_Returns = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_ConfigIo_NormalizeConfig_SortedDestinations = Lib_Schema_ConfigSchema['destinations'];

export type Cli_Commands_ConfigIo_NormalizeConfig_SortedAliases = Lib_Schema_ConfigSchema['aliases'];

/**
 * CLI - Commands - Config IO.
 *
 * @since UNRELEASED
 */
export type Cli_Commands_ConfigIo_SaveConfig_ConfigPath = string;

export type Cli_Commands_ConfigIo_SaveConfig_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_ConfigIo_SaveConfig_Returns = void;
