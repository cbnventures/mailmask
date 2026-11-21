import type {
  Lib_Schema_ConfigSchema,
  Lib_Schema_PhoneAliasConfig,
  Lib_Schema_PhoneProviderConfig,
} from '../../lib/schema.d.ts';

/**
 * CLI - Commands - Phone Provider - Add Phone Provider.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneProvider_AddPhoneProvider_ConfigPath = string;

export type Cli_Commands_PhoneProvider_AddPhoneProvider_Provider = Lib_Schema_PhoneProviderConfig;

export type Cli_Commands_PhoneProvider_AddPhoneProvider_Returns = void;

export type Cli_Commands_PhoneProvider_AddPhoneProvider_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_PhoneProvider_AddPhoneProvider_Parsed = Lib_Schema_PhoneProviderConfig & {};

export type Cli_Commands_PhoneProvider_AddPhoneProvider_PhoneProviders = Array<Lib_Schema_PhoneProviderConfig>;

/**
 * CLI - Commands - Phone Provider - Check Phone Provider.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneProvider_CheckPhoneProvider_ConfigPath = string;

export type Cli_Commands_PhoneProvider_CheckPhoneProvider_Name = string;

export type Cli_Commands_PhoneProvider_CheckPhoneProvider_Returns = Promise<void>;

export type Cli_Commands_PhoneProvider_CheckPhoneProvider_Provider = Lib_Schema_PhoneProviderConfig & {};

/**
 * CLI - Commands - Phone Provider - Connect Phone Providers.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneProvider_ConnectPhoneProviders_ConfigPath = string;

export type Cli_Commands_PhoneProvider_ConnectPhoneProviders_BaseUrl = string;

export type Cli_Commands_PhoneProvider_ConnectPhoneProviders_Returns = Promise<string[]>;

export type Cli_Commands_PhoneProvider_ConnectPhoneProviders_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_PhoneProvider_ConnectPhoneProviders_PhoneAliases = Array<Lib_Schema_PhoneAliasConfig>;

export type Cli_Commands_PhoneProvider_ConnectPhoneProviders_Connected = Array<Lib_Schema_PhoneProviderConfig>;

export type Cli_Commands_PhoneProvider_ConnectPhoneProviders_Number = string;

export type Cli_Commands_PhoneProvider_ConnectPhoneProviders_Numbers = Cli_Commands_PhoneProvider_ConnectPhoneProviders_Number[];

/**
 * CLI - Commands - Phone Provider - Find Phone Provider.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneProvider_FindPhoneProvider_ConfigPath = string;

export type Cli_Commands_PhoneProvider_FindPhoneProvider_Name = string;

export type Cli_Commands_PhoneProvider_FindPhoneProvider_Returns = Lib_Schema_PhoneProviderConfig & {};

export type Cli_Commands_PhoneProvider_FindPhoneProvider_Provider = Lib_Schema_PhoneProviderConfig | undefined;

/**
 * CLI - Commands - Phone Provider - List Phone Providers.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneProvider_ListPhoneProviders_ConfigPath = string;

export type Cli_Commands_PhoneProvider_ListPhoneProviders_Returns = Array<Lib_Schema_PhoneProviderConfig>;

/**
 * CLI - Commands - Phone Provider - Remove Phone Provider.
 *
 * @since 1.2.0
 */
export type Cli_Commands_PhoneProvider_RemovePhoneProvider_ConfigPath = string;

export type Cli_Commands_PhoneProvider_RemovePhoneProvider_Name = string;

export type Cli_Commands_PhoneProvider_RemovePhoneProvider_Returns = void;

export type Cli_Commands_PhoneProvider_RemovePhoneProvider_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_PhoneProvider_RemovePhoneProvider_PhoneProviders = Array<Lib_Schema_PhoneProviderConfig>;

export type Cli_Commands_PhoneProvider_RemovePhoneProvider_Filtered = Array<Lib_Schema_PhoneProviderConfig>;

export type Cli_Commands_PhoneProvider_RemovePhoneProvider_ReferencingNumbers = string[];
