import type {
  Lib_Schema_ConfigSchema,
  Lib_Schema_DestinationConfig,
  Lib_Schema_PhoneAliasConfig,
  Lib_Schema_PhoneProviderConfig,
} from '../../lib/schema.d.ts';
import type { Shared_PhoneAvailableNumber, Shared_PhoneNumberSearch } from '../../shared.d.ts';

/**
 * CLI - Commands - Phone Alias - Add Phone Alias.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneAlias_AddPhoneAlias_ConfigPath = string;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Number = string;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Buy = boolean;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Provider = string;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Destination = string;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Label = string | undefined;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Expires = string | undefined;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options_SenderPattern = string;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options_AllowedSenders = Cli_Commands_PhoneAlias_AddPhoneAlias_Options_SenderPattern[] | undefined;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options_BlockedSenders = Cli_Commands_PhoneAlias_AddPhoneAlias_Options_SenderPattern[] | undefined;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Options = {
  number: Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Number;
  buy: Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Buy;
  provider: Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Provider;
  destination: Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Destination;
  label: Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Label;
  expires: Cli_Commands_PhoneAlias_AddPhoneAlias_Options_Expires;
  allowedSenders: Cli_Commands_PhoneAlias_AddPhoneAlias_Options_AllowedSenders;
  blockedSenders: Cli_Commands_PhoneAlias_AddPhoneAlias_Options_BlockedSenders;
};

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Returns = Promise<Cli_Commands_PhoneAlias_AddPhoneAlias_Result>;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Result_PhoneAlias = Lib_Schema_PhoneAliasConfig;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Result_Status = string;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Result = {
  phoneAlias: Cli_Commands_PhoneAlias_AddPhoneAlias_Result_PhoneAlias;
  status: Cli_Commands_PhoneAlias_AddPhoneAlias_Result_Status;
};

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Provider = Lib_Schema_PhoneProviderConfig & {};

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Destination = Lib_Schema_DestinationConfig | undefined;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_PhoneAliases = Array<Lib_Schema_PhoneAliasConfig>;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Number = string;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_ExpiresAt = string | undefined;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_PhoneAlias = { [Key in keyof Lib_Schema_PhoneAliasConfig]: Lib_Schema_PhoneAliasConfig[Key] };

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Status = string;

export type Cli_Commands_PhoneAlias_AddPhoneAlias_Owned = boolean;

/**
 * CLI - Commands - Phone Alias - Describe Phone Alias Status.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_PhoneAlias = { [Key in keyof Lib_Schema_PhoneAliasConfig]: Lib_Schema_PhoneAliasConfig[Key] };

export type Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_Now = number;

export type Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_Returns = string;

/**
 * CLI - Commands - Phone Alias - Find Phone Alias.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneAlias_FindPhoneAlias_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_PhoneAlias_FindPhoneAlias_Number = string;

export type Cli_Commands_PhoneAlias_FindPhoneAlias_Returns = { [Key in keyof Lib_Schema_PhoneAliasConfig]: Lib_Schema_PhoneAliasConfig[Key] };

export type Cli_Commands_PhoneAlias_FindPhoneAlias_NormalizedNumber = string;

export type Cli_Commands_PhoneAlias_FindPhoneAlias_PhoneAlias = Lib_Schema_PhoneAliasConfig | undefined;

/**
 * CLI - Commands - Phone Alias - List Phone Aliases.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneAlias_ListPhoneAliases_ConfigPath = string;

export type Cli_Commands_PhoneAlias_ListPhoneAliases_Returns = Array<Lib_Schema_PhoneAliasConfig>;

/**
 * CLI - Commands - Phone Alias - Release Phone Alias.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneAlias_ReleasePhoneAlias_ConfigPath = string;

export type Cli_Commands_PhoneAlias_ReleasePhoneAlias_Number = string;

export type Cli_Commands_PhoneAlias_ReleasePhoneAlias_Returns = Promise<void>;

export type Cli_Commands_PhoneAlias_ReleasePhoneAlias_PhoneAlias = { [Key in keyof Lib_Schema_PhoneAliasConfig]: Lib_Schema_PhoneAliasConfig[Key] };

export type Cli_Commands_PhoneAlias_ReleasePhoneAlias_Provider = Lib_Schema_PhoneProviderConfig & {};

/**
 * CLI - Commands - Phone Alias - Remove Phone Alias.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneAlias_RemovePhoneAlias_ConfigPath = string;

export type Cli_Commands_PhoneAlias_RemovePhoneAlias_Number = string;

export type Cli_Commands_PhoneAlias_RemovePhoneAlias_Returns = void;

export type Cli_Commands_PhoneAlias_RemovePhoneAlias_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_PhoneAlias_RemovePhoneAlias_PhoneAlias = { [Key in keyof Lib_Schema_PhoneAliasConfig]: Lib_Schema_PhoneAliasConfig[Key] };

/**
 * CLI - Commands - Phone Alias - Search Phone Numbers.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneAlias_SearchPhoneNumbers_ConfigPath = string;

export type Cli_Commands_PhoneAlias_SearchPhoneNumbers_ProviderName = string;

export type Cli_Commands_PhoneAlias_SearchPhoneNumbers_Search = Shared_PhoneNumberSearch;

export type Cli_Commands_PhoneAlias_SearchPhoneNumbers_Returns = Promise<Shared_PhoneAvailableNumber[]>;

export type Cli_Commands_PhoneAlias_SearchPhoneNumbers_Provider = Lib_Schema_PhoneProviderConfig & {};

/**
 * CLI - Commands - Phone Alias - Set Phone Alias Enabled.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_ConfigPath = string;

export type Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Number = string;

export type Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Enabled = boolean;

export type Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Returns = void;

export type Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_PhoneAlias = { [Key in keyof Lib_Schema_PhoneAliasConfig]: Lib_Schema_PhoneAliasConfig[Key] };

/**
 * CLI - Commands - Phone Alias - Set Phone Alias Expiry.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_ConfigPath = string;

export type Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Number = string;

export type Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Expires = string;

export type Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Returns = string | undefined;

export type Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_PhoneAlias = { [Key in keyof Lib_Schema_PhoneAliasConfig]: Lib_Schema_PhoneAliasConfig[Key] };

export type Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_ExpiresAt = string | undefined;
