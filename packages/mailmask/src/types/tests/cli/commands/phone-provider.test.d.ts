import type { MockInstance } from 'vitest';

import type { Lib_Schema_ConfigSchema, Lib_Schema_PhoneProviderConfig } from '../../../lib/schema.d.ts';

/**
 * Tests - CLI - Commands - Phone Provider.
 *
 * @since 1.2.0
 */
export type Tests_Cli_Commands_PhoneProvider_TestConfigPath = string;

export type Tests_Cli_Commands_PhoneProvider_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - CLI - Commands - Phone Provider - Phone Provider Commands - Adds And Removes Providers.
 *
 * @since 1.2.0
 */
export type Tests_Cli_Commands_PhoneProvider_PhoneProviderCommands_AddsAndRemovesProviders_Providers = Array<Lib_Schema_PhoneProviderConfig>;

/**
 * Tests - CLI - Commands - Phone Provider - Phone Provider Commands - Checks And Connects Providers.
 *
 * @since 1.2.0
 */
export type Tests_Cli_Commands_PhoneProvider_PhoneProviderCommands_ChecksAndConnectsProviders_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Cli_Commands_PhoneProvider_PhoneProviderCommands_ChecksAndConnectsProviders_Connected = string[];
