import type prompts from 'prompts';

import type {
  Lib_Schema_AliasConfig,
  Lib_Schema_DestinationConfig,
  Lib_Schema_NotifierConfig,
  Lib_Schema_SettingsConfig,
} from '../../lib/schema.d.ts';

/**
 * CLI - Menu - Interactive - Alias Menu.
 *
 * @since 0.0.1
 */
export type Cli_Menu_Interactive_AliasMenu_ConfigPath = string;

export type Cli_Menu_Interactive_AliasMenu_Returns = Promise<void>;

export type Cli_Menu_Interactive_AliasMenu_InMenu = boolean;

export type Cli_Menu_Interactive_AliasMenu_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_AliasMenu_Action = string | undefined;

export type Cli_Menu_Interactive_AliasMenu_ErrorMessage = string;

/**
 * CLI - Menu - Interactive - Create Alias Flow.
 *
 * @since 0.0.1
 */
export type Cli_Menu_Interactive_CreateAliasFlow_ConfigPath = string;

export type Cli_Menu_Interactive_CreateAliasFlow_Returns = Promise<void>;

export type Cli_Menu_Interactive_CreateAliasFlow_Destinations = Array<Lib_Schema_DestinationConfig>;

export type Cli_Menu_Interactive_CreateAliasFlow_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Menu_Interactive_CreateAliasFlow_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_CreateAliasFlow_Alias = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

/**
 * CLI - Menu - Interactive - Destination Menu.
 *
 * @since 0.0.1
 */
export type Cli_Menu_Interactive_DestinationMenu_ConfigPath = string;

export type Cli_Menu_Interactive_DestinationMenu_Returns = Promise<void>;

export type Cli_Menu_Interactive_DestinationMenu_InMenu = boolean;

export type Cli_Menu_Interactive_DestinationMenu_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_DestinationMenu_Action = string | undefined;

export type Cli_Menu_Interactive_DestinationMenu_Destinations = Array<Lib_Schema_DestinationConfig>;

export type Cli_Menu_Interactive_DestinationMenu_AddResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_DestinationMenu_RemoveResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_DestinationMenu_ErrorMessage = string;

/**
 * CLI - Menu - Interactive - Interactive Menu.
 *
 * @since 0.0.1
 */
export type Cli_Menu_Interactive_InteractiveMenu_ConfigDirs = string[];

export type Cli_Menu_Interactive_InteractiveMenu_Returns = Promise<void>;

export type Cli_Menu_Interactive_InteractiveMenu_Version = string;

export type Cli_Menu_Interactive_InteractiveMenu_Header = string;

export type Cli_Menu_Interactive_InteractiveMenu_ConfigPath = string;

export type Cli_Menu_Interactive_InteractiveMenu_FirstConfigDir = string | undefined;

export type Cli_Menu_Interactive_InteractiveMenu_ConfigDirResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_InteractiveMenu_Running = boolean;

export type Cli_Menu_Interactive_InteractiveMenu_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_InteractiveMenu_Action = string | undefined;

export type Cli_Menu_Interactive_InteractiveMenu_ErrorMessage = string;

/**
 * CLI - Menu - Interactive - Modify Alias Flow.
 *
 * @since 0.0.1
 */
export type Cli_Menu_Interactive_ModifyAliasFlow_ConfigPath = string;

export type Cli_Menu_Interactive_ModifyAliasFlow_Returns = Promise<void>;

export type Cli_Menu_Interactive_ModifyAliasFlow_Aliases = Array<Lib_Schema_AliasConfig>;

export type Cli_Menu_Interactive_ModifyAliasFlow_Now = number;

export type Cli_Menu_Interactive_ModifyAliasFlow_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_ModifyAliasFlow_Action = string | undefined;

export type Cli_Menu_Interactive_ModifyAliasFlow_ExpiresAt = string | undefined;

/**
 * CLI - Menu - Interactive - Notifier Menu.
 *
 * @since 0.0.1
 */
export type Cli_Menu_Interactive_NotifierMenu_ConfigPath = string;

export type Cli_Menu_Interactive_NotifierMenu_Returns = Promise<void>;

export type Cli_Menu_Interactive_NotifierMenu_InMenu = boolean;

export type Cli_Menu_Interactive_NotifierMenu_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_NotifierMenu_Action = string | undefined;

export type Cli_Menu_Interactive_NotifierMenu_Notifiers = Array<Lib_Schema_NotifierConfig>;

export type Cli_Menu_Interactive_NotifierMenu_Target = string;

export type Cli_Menu_Interactive_NotifierMenu_NtfyResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_NotifierMenu_ProxyResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_NotifierMenu_RemoveResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_NotifierMenu_ErrorMessage = string;

/**
 * CLI - Menu - Interactive - Print Aliases.
 *
 * @since 0.0.1
 */
export type Cli_Menu_Interactive_PrintAliases_ConfigPath = string;

export type Cli_Menu_Interactive_PrintAliases_Returns = void;

export type Cli_Menu_Interactive_PrintAliases_Aliases = Array<Lib_Schema_AliasConfig>;

export type Cli_Menu_Interactive_PrintAliases_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Menu_Interactive_PrintAliases_Now = number;

export type Cli_Menu_Interactive_PrintAliases_Status = string;

export type Cli_Menu_Interactive_PrintAliases_LabelSuffix = string;

/**
 * CLI - Menu - Interactive - Settings Flow.
 *
 * @since 0.0.1
 */
export type Cli_Menu_Interactive_SettingsFlow_ConfigPath = string;

export type Cli_Menu_Interactive_SettingsFlow_Returns = Promise<void>;

export type Cli_Menu_Interactive_SettingsFlow_CurrentSettings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Menu_Interactive_SettingsFlow_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_SettingsFlow_ErrorMessage = string;

/**
 * CLI - Menu - Interactive - Split List.
 *
 * @since 0.0.1
 */
export type Cli_Menu_Interactive_SplitList_Value = unknown;

export type Cli_Menu_Interactive_SplitList_Entry = string;

export type Cli_Menu_Interactive_SplitList_Returns = Cli_Menu_Interactive_SplitList_Entry[] | undefined;
