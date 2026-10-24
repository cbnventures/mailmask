import type { Lib_Schema_ConfigSchema, Lib_Schema_SettingsConfig } from '../../lib/schema.d.ts';

/**
 * CLI - Commands - Generate.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Generate_ProjectRoot = string;

export type Cli_Commands_Generate_DefaultWranglerTomlPath = string;

/**
 * CLI - Commands - Generate - Generate Wrangler Toml.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Generate_GenerateWranglerToml_ConfigPath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_OutputPath = string | undefined;

export type Cli_Commands_Generate_GenerateWranglerToml_AccountId = string;

export type Cli_Commands_Generate_GenerateWranglerToml_Returns = void;

export type Cli_Commands_Generate_GenerateWranglerToml_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Generate_GenerateWranglerToml_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Commands_Generate_GenerateWranglerToml_CompatibilityDate = string;

export type Cli_Commands_Generate_GenerateWranglerToml_OutputDir = string;

export type Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryPath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryRelativePath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryConfigPath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryToml = string;

export type Cli_Commands_Generate_GenerateWranglerToml_SettingsJson = string;

export type Cli_Commands_Generate_GenerateWranglerToml_DestinationsJson = string;

export type Cli_Commands_Generate_GenerateWranglerToml_NotifiersJson = string;

export type Cli_Commands_Generate_GenerateWranglerToml_AliasesJson = string;

export type Cli_Commands_Generate_GenerateWranglerToml_AliasPart = string;

export type Cli_Commands_Generate_GenerateWranglerToml_AliasParts = Cli_Commands_Generate_GenerateWranglerToml_AliasPart[];

export type Cli_Commands_Generate_GenerateWranglerToml_Lines = string[];

/**
 * CLI - Commands - Generate - Split By Bytes.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Generate_SplitByBytes_Text = string;

export type Cli_Commands_Generate_SplitByBytes_MaxBytes = number;

export type Cli_Commands_Generate_SplitByBytes_Part = string;

export type Cli_Commands_Generate_SplitByBytes_Returns = Cli_Commands_Generate_SplitByBytes_Part[];

export type Cli_Commands_Generate_SplitByBytes_Parts = Cli_Commands_Generate_SplitByBytes_Part[];

export type Cli_Commands_Generate_SplitByBytes_Current = string;

export type Cli_Commands_Generate_SplitByBytes_CurrentBytes = number;

export type Cli_Commands_Generate_SplitByBytes_CharacterBytes = number;
