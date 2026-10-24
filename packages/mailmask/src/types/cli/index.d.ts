import type { Command } from 'commander';

import type { Lib_Schema_AliasConfig, Lib_Schema_SettingsConfig } from '../lib/schema.d.ts';
import type { Cli_Commands_Validate_ValidateConfig_Returns } from './commands/validate.d.ts';

/**
 * CLI - Env Dir.
 *
 * @since 0.0.1
 */
export type Cli_Index_EnvDir = string | undefined;

/**
 * CLI - Get Config File Path.
 *
 * @since 0.0.1
 */
export type Cli_Index_GetConfigFilePath_Returns = string;

export type Cli_Index_ConfigDir = string | undefined;

export type Cli_Index_ConfigPath = string;

export type Cli_Index_GetConfigFilePath_DefaultDir = string;

export type Cli_Index_SamplePath = string;

/**
 * CLI - Main.
 *
 * @since 0.0.1
 */
export type Cli_Index_Main_Returns = Promise<void>;

export type Cli_Index_Main_ConfigDirs = string[];

export type Cli_Index_Main_ConfigPath = string;

export type Cli_Index_Main_AliasCommand = Command;

export type Cli_Index_Main_Alias = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

export type Cli_Index_Main_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Index_Main_ListSettings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Index_Main_Now = number;

export type Cli_Index_Main_ExpiresAt = string | undefined;

export type Cli_Index_Main_DestinationCommand = Command;

export type Cli_Index_Main_NotifierCommand = Command;

export type Cli_Index_Main_Result = { [Key in keyof Cli_Commands_Validate_ValidateConfig_Returns]: Cli_Commands_Validate_ValidateConfig_Returns[Key] };

export type Cli_Index_Main_Message = string;

/**
 * CLI - Program.
 *
 * @since 0.0.1
 */
export type Cli_Index_Program = Command;

/**
 * CLI - Split Senders.
 *
 * @since 0.0.1
 */
export type Cli_Index_SplitSenders_Value = string | undefined;

export type Cli_Index_SplitSenders_Sender = string;

export type Cli_Index_SplitSenders_Returns = Cli_Index_SplitSenders_Sender[] | undefined;
