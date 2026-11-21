import type { Lib_Schema_ConfigSchema, Lib_Schema_SettingsConfig } from '../../lib/schema.d.ts';

/**
 * CLI - Commands - Generate - Generate Wrangler Toml.
 *
 * @since 1.0.0
 */
export type Cli_Commands_Generate_GenerateWranglerToml_ConfigPath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_OutputPath = string | undefined;

export type Cli_Commands_Generate_GenerateWranglerToml_AccountId = string;

export type Cli_Commands_Generate_GenerateWranglerToml_Returns = void;

export type Cli_Commands_Generate_GenerateWranglerToml_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Generate_GenerateWranglerToml_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Commands_Generate_GenerateWranglerToml_CompatibilityDate = string;

export type Cli_Commands_Generate_GenerateWranglerToml_OutputDir = string;

export type Cli_Commands_Generate_GenerateWranglerToml_BundleDir = string;

export type Cli_Commands_Generate_GenerateWranglerToml_BundleConfigPath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_BundleEntryPath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_EmailDestination = string;

export type Cli_Commands_Generate_GenerateWranglerToml_EmailDestinations = Cli_Commands_Generate_GenerateWranglerToml_EmailDestination[];

export type Cli_Commands_Generate_GenerateWranglerToml_SendFromAliases = boolean;

export type Cli_Commands_Generate_GenerateWranglerToml_RealBundleDir = string;

export type Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryPath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryRelativePath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryImportPath = string;

export type Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryImport = string;

export type Cli_Commands_Generate_GenerateWranglerToml_EntryLines = string[];

export type Cli_Commands_Generate_GenerateWranglerToml_Lines = string[];

/**
 * CLI - Commands - Generate - Get Wrangler Toml Path.
 *
 * @since 1.0.0
 */
export type Cli_Commands_Generate_GetWranglerTomlPath_ConfigPath = string;

export type Cli_Commands_Generate_GetWranglerTomlPath_Returns = string;
