import type { Lib_Schema_ConfigSchema, Lib_Schema_DestinationConfig } from '../../lib/schema.d.ts';

/**
 * CLI - Commands - Destination - Add Destination.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Destination_AddDestination_ConfigPath = string;

export type Cli_Commands_Destination_AddDestination_Destination = { [Key in keyof Lib_Schema_DestinationConfig]: Lib_Schema_DestinationConfig[Key] };

export type Cli_Commands_Destination_AddDestination_Returns = void;

export type Cli_Commands_Destination_AddDestination_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Destination_AddDestination_Parsed = { [Key in keyof Lib_Schema_DestinationConfig]: Lib_Schema_DestinationConfig[Key] };

/**
 * CLI - Commands - Destination - List Destinations.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Destination_ListDestinations_ConfigPath = string;

export type Cli_Commands_Destination_ListDestinations_Returns = Array<Lib_Schema_DestinationConfig>;

/**
 * CLI - Commands - Destination - Remove Destination.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Destination_RemoveDestination_ConfigPath = string;

export type Cli_Commands_Destination_RemoveDestination_Name = string;

export type Cli_Commands_Destination_RemoveDestination_Returns = void;

export type Cli_Commands_Destination_RemoveDestination_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Destination_RemoveDestination_Filtered = Array<Lib_Schema_DestinationConfig>;

export type Cli_Commands_Destination_RemoveDestination_ReferencingAliases = string[];

/**
 * CLI - Commands - Destination - Set Destination Phone.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Destination_SetDestinationPhone_ConfigPath = string;

export type Cli_Commands_Destination_SetDestinationPhone_Name = string;

export type Cli_Commands_Destination_SetDestinationPhone_Phone = string | undefined;

export type Cli_Commands_Destination_SetDestinationPhone_Returns = void;

export type Cli_Commands_Destination_SetDestinationPhone_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Cli_Commands_Destination_SetDestinationPhone_Destination = Lib_Schema_DestinationConfig | undefined;

export type Cli_Commands_Destination_SetDestinationPhone_PhoneAliases = string[];
