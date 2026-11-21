import type { MockInstance } from 'vitest';

import type { Lib_Schema_ConfigSchema, Lib_Schema_PhoneAliasConfig } from '../../../lib/schema.d.ts';

/**
 * Tests - CLI - Commands - Phone Alias.
 *
 * @since 1.2.0
 */
export type Tests_Cli_Commands_PhoneAlias_TestConfigPath = string;

export type Tests_Cli_Commands_PhoneAlias_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - CLI - Commands - Phone Alias - Phone Alias Commands - Attaches A Number The Account Owns.
 *
 * @since 1.2.0
 */
export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_AttachesANumberTheAccountOwns_PhoneResult_PhoneAlias = Lib_Schema_PhoneAliasConfig;

export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_AttachesANumberTheAccountOwns_PhoneResult_Status = string;

export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_AttachesANumberTheAccountOwns_PhoneResult = {
  phoneAlias: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_AttachesANumberTheAccountOwns_PhoneResult_PhoneAlias;
  status: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_AttachesANumberTheAccountOwns_PhoneResult_Status;
};

/**
 * Tests - CLI - Commands - Phone Alias - Phone Alias Commands - Buys A Number When Asked.
 *
 * @since 1.2.0
 */
export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_PhoneResult_PhoneAlias = Lib_Schema_PhoneAliasConfig;

export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_PhoneResult_Status = string;

export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_PhoneResult = {
  phoneAlias: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_PhoneResult_PhoneAlias;
  status: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_PhoneResult_Status;
};

/**
 * Tests - CLI - Commands - Phone Alias - Phone Alias Commands - Disables Re Dates Removes And Releases Phone Aliases.
 *
 * @since 1.2.0
 */
export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_DisablesReDatesRemovesAndReleasesPhoneAliases_ConfigJson = string;

export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_DisablesReDatesRemovesAndReleasesPhoneAliases_PhoneAliases = Array<Lib_Schema_PhoneAliasConfig>;

export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_DisablesReDatesRemovesAndReleasesPhoneAliases_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - CLI - Commands - Phone Alias - Phone Alias Commands - Refuses Unowned Numbers And Destinations Without A Phone.
 *
 * @since 1.2.0
 */
export type Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_RefusesUnownedNumbersAndDestinationsWithoutAPhone_FetchSpy = MockInstance<typeof fetch>;
