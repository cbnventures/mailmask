import type prompts from 'prompts';

import type {
  Lib_Schema_AliasConfig,
  Lib_Schema_DestinationConfig,
  Lib_Schema_NotifierConfig,
  Lib_Schema_PhoneAliasConfig,
  Lib_Schema_PhoneProviderConfig,
  Lib_Schema_SettingsConfig,
} from '../../lib/schema.d.ts';
import type { Shared_PhoneAvailableNumber } from '../../shared.d.ts';

/**
 * CLI - Menu - Interactive - Add Phone Provider Flow.
 *
 * @since 1.2.0
 */
export type Cli_Menu_Interactive_AddPhoneProviderFlow_ConfigPath = string;

export type Cli_Menu_Interactive_AddPhoneProviderFlow_Returns = Promise<void>;

export type Cli_Menu_Interactive_AddPhoneProviderFlow_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_AddPhoneProviderFlow_Name = string;

export type Cli_Menu_Interactive_AddPhoneProviderFlow_DestinationCountry = string;

export type Cli_Menu_Interactive_AddPhoneProviderFlow_DestinationCountries = Cli_Menu_Interactive_AddPhoneProviderFlow_DestinationCountry[] | undefined;

export type Cli_Menu_Interactive_AddPhoneProviderFlow_ErrorMessage = string;

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
 * CLI - Menu - Interactive - Create Phone Alias Flow.
 *
 * @since 1.2.0
 */
export type Cli_Menu_Interactive_CreatePhoneAliasFlow_ConfigPath = string;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_Returns = Promise<void>;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneProviders = Array<Lib_Schema_PhoneProviderConfig>;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneDestinations = Array<Lib_Schema_DestinationConfig>;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_SourceResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_Number = string | undefined;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_ExistingResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_SearchResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_AvailableNumbers = Array<Shared_PhoneAvailableNumber>;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_PickResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_DetailsResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneResult_PhoneAlias = Lib_Schema_PhoneAliasConfig;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneResult_Status = string;

export type Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneResult = {
  phoneAlias: Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneResult_PhoneAlias;
  status: Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneResult_Status;
};

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
 * CLI - Menu - Interactive - Modify Phone Alias Flow.
 *
 * @since 1.2.0
 */
export type Cli_Menu_Interactive_ModifyPhoneAliasFlow_ConfigPath = string;

export type Cli_Menu_Interactive_ModifyPhoneAliasFlow_Returns = Promise<void>;

export type Cli_Menu_Interactive_ModifyPhoneAliasFlow_PhoneAliases = Array<Lib_Schema_PhoneAliasConfig>;

export type Cli_Menu_Interactive_ModifyPhoneAliasFlow_Now = number;

export type Cli_Menu_Interactive_ModifyPhoneAliasFlow_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_ModifyPhoneAliasFlow_Action = string | undefined;

export type Cli_Menu_Interactive_ModifyPhoneAliasFlow_ExpiresAt = string | undefined;

/**
 * CLI - Menu - Interactive - Notifier Menu.
 *
 * @since 1.0.0
 */
export type Cli_Menu_Interactive_NotifierMenu_ConfigPath = string;

export type Cli_Menu_Interactive_NotifierMenu_Returns = Promise<void>;

export type Cli_Menu_Interactive_NotifierMenu_InMenu = boolean;

export type Cli_Menu_Interactive_NotifierMenu_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_NotifierMenu_Action = string | undefined;

export type Cli_Menu_Interactive_NotifierMenu_Notifiers = Array<Lib_Schema_NotifierConfig>;

export type Cli_Menu_Interactive_NotifierMenu_NtfyResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_NotifierMenu_ProxyResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_NotifierMenu_RemoveResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_NotifierMenu_ErrorMessage = string;

/**
 * CLI - Menu - Interactive - Phone Alias Menu.
 *
 * @since 1.2.0
 */
export type Cli_Menu_Interactive_PhoneAliasMenu_ConfigPath = string;

export type Cli_Menu_Interactive_PhoneAliasMenu_Returns = Promise<void>;

export type Cli_Menu_Interactive_PhoneAliasMenu_InMenu = boolean;

export type Cli_Menu_Interactive_PhoneAliasMenu_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_PhoneAliasMenu_Action = string | undefined;

export type Cli_Menu_Interactive_PhoneAliasMenu_ErrorMessage = string;

/**
 * CLI - Menu - Interactive - Phone Provider Menu.
 *
 * @since 1.2.0
 */
export type Cli_Menu_Interactive_PhoneProviderMenu_ConfigPath = string;

export type Cli_Menu_Interactive_PhoneProviderMenu_Returns = Promise<void>;

export type Cli_Menu_Interactive_PhoneProviderMenu_InMenu = boolean;

export type Cli_Menu_Interactive_PhoneProviderMenu_Response = prompts.Answers<string>;

export type Cli_Menu_Interactive_PhoneProviderMenu_Action = string | undefined;

export type Cli_Menu_Interactive_PhoneProviderMenu_PhoneProviders = Array<Lib_Schema_PhoneProviderConfig>;

export type Cli_Menu_Interactive_PhoneProviderMenu_RemoveResponse = prompts.Answers<string>;

export type Cli_Menu_Interactive_PhoneProviderMenu_ErrorMessage = string;

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
 * CLI - Menu - Interactive - Print Phone Aliases.
 *
 * @since 1.2.0
 */
export type Cli_Menu_Interactive_PrintPhoneAliases_ConfigPath = string;

export type Cli_Menu_Interactive_PrintPhoneAliases_Returns = void;

export type Cli_Menu_Interactive_PrintPhoneAliases_PhoneAliases = Array<Lib_Schema_PhoneAliasConfig>;

export type Cli_Menu_Interactive_PrintPhoneAliases_Now = number;

export type Cli_Menu_Interactive_PrintPhoneAliases_Status = string;

export type Cli_Menu_Interactive_PrintPhoneAliases_LabelSuffix = string;

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
