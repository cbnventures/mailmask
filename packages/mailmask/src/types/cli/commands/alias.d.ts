import type { Lib_Schema_AliasConfig, Lib_Schema_ConfigSchema } from '../../lib/schema.d.ts';

/**
 * CLI - Commands - Alias - Add Alias.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Alias_AddAlias_ConfigPath = string;

export type Cli_Commands_Alias_AddAlias_Options_Address = string | undefined;

export type Cli_Commands_Alias_AddAlias_Options_Style = 'words' | 'random';

export type Cli_Commands_Alias_AddAlias_Options_Destination = string;

export type Cli_Commands_Alias_AddAlias_Options_Label = string | undefined;

export type Cli_Commands_Alias_AddAlias_Options_Expires = string | undefined;

export type Cli_Commands_Alias_AddAlias_Options_SenderPattern = string;

export type Cli_Commands_Alias_AddAlias_Options_AllowedSenders = Cli_Commands_Alias_AddAlias_Options_SenderPattern[] | undefined;

export type Cli_Commands_Alias_AddAlias_Options_BlockedSenders = Cli_Commands_Alias_AddAlias_Options_SenderPattern[] | undefined;

export type Cli_Commands_Alias_AddAlias_Options = {
  address: Cli_Commands_Alias_AddAlias_Options_Address;
  style: Cli_Commands_Alias_AddAlias_Options_Style;
  destination: Cli_Commands_Alias_AddAlias_Options_Destination;
  label: Cli_Commands_Alias_AddAlias_Options_Label;
  expires: Cli_Commands_Alias_AddAlias_Options_Expires;
  allowedSenders: Cli_Commands_Alias_AddAlias_Options_AllowedSenders;
  blockedSenders: Cli_Commands_Alias_AddAlias_Options_BlockedSenders;
};

export type Cli_Commands_Alias_AddAlias_Returns = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

export type Cli_Commands_Alias_AddAlias_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Alias_AddAlias_ExistingAddresses = Set<string>;

export type Cli_Commands_Alias_AddAlias_Address = string;

export type Cli_Commands_Alias_AddAlias_ExpiresAt = string | undefined;

export type Cli_Commands_Alias_AddAlias_Alias = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

/**
 * CLI - Commands - Alias - Describe Alias Status.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Alias_DescribeAliasStatus_Alias = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

export type Cli_Commands_Alias_DescribeAliasStatus_Now = number;

export type Cli_Commands_Alias_DescribeAliasStatus_Returns = string;

/**
 * CLI - Commands - Alias - Find Alias.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Alias_FindAlias_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Alias_FindAlias_Address = string;

export type Cli_Commands_Alias_FindAlias_Returns = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

export type Cli_Commands_Alias_FindAlias_Alias = Lib_Schema_AliasConfig | undefined;

/**
 * CLI - Commands - Alias - Generate Address.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Alias_GenerateAddress_Style = 'words' | 'random';

export type Cli_Commands_Alias_GenerateAddress_Returns = string;

export type Cli_Commands_Alias_GenerateAddress_Word = string;

export type Cli_Commands_Alias_GenerateAddress_Words = Cli_Commands_Alias_GenerateAddress_Word[];

export type Cli_Commands_Alias_GenerateAddress_Suffix = string;

/**
 * CLI - Commands - Alias - List Aliases.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Alias_ListAliases_ConfigPath = string;

export type Cli_Commands_Alias_ListAliases_Returns = Array<Lib_Schema_AliasConfig>;

/**
 * CLI - Commands - Alias - Parse Expiry.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Alias_ParseExpiry_Value = string | undefined;

export type Cli_Commands_Alias_ParseExpiry_Now = number;

export type Cli_Commands_Alias_ParseExpiry_Returns = string | undefined;

export type Cli_Commands_Alias_ParseExpiry_Match = RegExpMatchArray | null;

export type Cli_Commands_Alias_ParseExpiry_Amount = number;

export type Cli_Commands_Alias_ParseExpiry_Unit = string;

export type Cli_Commands_Alias_ParseExpiry_UnitMilliseconds = Map<string, number>;

export type Cli_Commands_Alias_ParseExpiry_Parsed = number;

/**
 * CLI - Commands - Alias - Remove Alias.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Alias_RemoveAlias_ConfigPath = string;

export type Cli_Commands_Alias_RemoveAlias_Address = string;

export type Cli_Commands_Alias_RemoveAlias_Returns = void;

export type Cli_Commands_Alias_RemoveAlias_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Alias_RemoveAlias_Filtered = Array<Lib_Schema_AliasConfig>;

/**
 * CLI - Commands - Alias - Set Alias Enabled.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Alias_SetAliasEnabled_ConfigPath = string;

export type Cli_Commands_Alias_SetAliasEnabled_Address = string;

export type Cli_Commands_Alias_SetAliasEnabled_Enabled = boolean;

export type Cli_Commands_Alias_SetAliasEnabled_Returns = void;

export type Cli_Commands_Alias_SetAliasEnabled_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Alias_SetAliasEnabled_Alias = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

/**
 * CLI - Commands - Alias - Set Alias Expiry.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Alias_SetAliasExpiry_ConfigPath = string;

export type Cli_Commands_Alias_SetAliasExpiry_Address = string;

export type Cli_Commands_Alias_SetAliasExpiry_Expires = string;

export type Cli_Commands_Alias_SetAliasExpiry_Returns = string | undefined;

export type Cli_Commands_Alias_SetAliasExpiry_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Alias_SetAliasExpiry_Alias = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

export type Cli_Commands_Alias_SetAliasExpiry_ExpiresAt = string | undefined;
