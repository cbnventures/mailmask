import type { Lib_Schema_AliasConfig, Lib_Schema_ConfigSchema } from '../../../lib/schema.d.ts';

/**
 * Tests - CLI - Commands - Alias.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Alias_TestConfigPath = string;

export type Tests_Cli_Commands_Alias_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - CLI - Commands - Alias - Alias Commands.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Alias_AliasCommands_ConfigJson = string;

/**
 * Tests - CLI - Commands - Alias - Alias Commands - Adds A Custom Alias With An Expiry And Sender Rules.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Alias_AliasCommands_AddsACustomAliasWithAnExpiryAndSenderRules_Alias = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

/**
 * Tests - CLI - Commands - Alias - Alias Commands - Disables Changes Expiry Of And Removes Aliases.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Alias_AliasCommands_DisablesChangesExpiryOfAndRemovesAliases_Alias = { [Key in keyof Lib_Schema_AliasConfig]: Lib_Schema_AliasConfig[Key] };

export type Tests_Cli_Commands_Alias_AliasCommands_DisablesChangesExpiryOfAndRemovesAliases_Aliases = Tests_Cli_Commands_Alias_AliasCommands_DisablesChangesExpiryOfAndRemovesAliases_Alias[];

/**
 * Tests - CLI - Commands - Alias - Alias Commands - Rejects Duplicates And Unknown Destinations.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Address = string;

export type Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Style = 'words' | 'random';

export type Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Destination = string;

export type Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Label = string | undefined;

export type Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Expires = string | undefined;

export type Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_AllowedSenders = string[] | undefined;

export type Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_BlockedSenders = string[] | undefined;

export type Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options = {
  address: Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Address;
  style: Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Style;
  destination: Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Destination;
  label: Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Label;
  expires: Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_Expires;
  allowedSenders: Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_AllowedSenders;
  blockedSenders: Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options_BlockedSenders;
};

/**
 * Tests - CLI - Commands - Alias - Generate Address - Generates Word And Random Styles.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Alias_GenerateAddress_GeneratesWordAndRandomStyles_WordPart = string;

export type Tests_Cli_Commands_Alias_GenerateAddress_GeneratesWordAndRandomStyles_WordParts = Tests_Cli_Commands_Alias_GenerateAddress_GeneratesWordAndRandomStyles_WordPart[];

export type Tests_Cli_Commands_Alias_GenerateAddress_GeneratesWordAndRandomStyles_RandomAddress = string;

/**
 * Tests - CLI - Commands - Alias - Parse Expiry - Handles Durations Dates And Never.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Alias_ParseExpiry_HandlesDurationsDatesAndNever_Now = number;
