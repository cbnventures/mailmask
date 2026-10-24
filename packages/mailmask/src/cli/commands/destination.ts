import { configSchema, destinationSchema } from '../../lib/schema.js';
import { loadConfig, saveConfig } from './config-io.js';

import type {
  Cli_Commands_Destination_AddDestination_Config,
  Cli_Commands_Destination_AddDestination_ConfigPath,
  Cli_Commands_Destination_AddDestination_Destination,
  Cli_Commands_Destination_AddDestination_Parsed,
  Cli_Commands_Destination_AddDestination_Returns,
  Cli_Commands_Destination_ListDestinations_ConfigPath,
  Cli_Commands_Destination_ListDestinations_Returns,
  Cli_Commands_Destination_RemoveDestination_Config,
  Cli_Commands_Destination_RemoveDestination_ConfigPath,
  Cli_Commands_Destination_RemoveDestination_Filtered,
  Cli_Commands_Destination_RemoveDestination_Name,
  Cli_Commands_Destination_RemoveDestination_ReferencingAliases,
  Cli_Commands_Destination_RemoveDestination_Returns,
} from '../../types/cli/commands/destination.d.ts';

/**
 * CLI - Commands - Destination - Add Destination.
 *
 * Registers a new destination inbox after validating its fields and
 * checking that neither the name nor the email address is already used.
 *
 * @param {Cli_Commands_Destination_AddDestination_ConfigPath}  configPath  - Config path.
 * @param {Cli_Commands_Destination_AddDestination_Destination} destination - Destination.
 *
 * @returns {Cli_Commands_Destination_AddDestination_Returns}
 *
 * @since 0.0.1
 */
function addDestination(configPath: Cli_Commands_Destination_AddDestination_ConfigPath, destination: Cli_Commands_Destination_AddDestination_Destination): Cli_Commands_Destination_AddDestination_Returns {
  const config: Cli_Commands_Destination_AddDestination_Config = configSchema.parse(loadConfig(configPath));
  const parsed: Cli_Commands_Destination_AddDestination_Parsed = destinationSchema.parse({
    name: destination['name'],
    email: destination['email'].trim().toLowerCase(),
  });

  if (config['destinations'].some((existingDestination) => existingDestination['name'] === parsed['name']) === true) {
    throw new Error(`Destination "${parsed['name']}" already exists.`);
  }

  if (config['destinations'].some((existingDestination) => existingDestination['email'] === parsed['email']) === true) {
    throw new Error(`A destination for "${parsed['email']}" already exists.`);
  }

  config['destinations'].push(parsed);

  saveConfig(configPath, config);

  return;
}

/**
 * CLI - Commands - Destination - List Destinations.
 *
 * Loads the configuration file and returns every destination
 * inbox so callers can display or reference them.
 *
 * @param {Cli_Commands_Destination_ListDestinations_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Commands_Destination_ListDestinations_Returns}
 *
 * @since 0.0.1
 */
function listDestinations(configPath: Cli_Commands_Destination_ListDestinations_ConfigPath): Cli_Commands_Destination_ListDestinations_Returns {
  return configSchema.parse(loadConfig(configPath))['destinations'];
}

/**
 * CLI - Commands - Destination - Remove Destination.
 *
 * Removes a destination by name. Refuses while any alias or the
 * default destination setting still references it.
 *
 * @param {Cli_Commands_Destination_RemoveDestination_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Destination_RemoveDestination_Name}       name       - Name.
 *
 * @returns {Cli_Commands_Destination_RemoveDestination_Returns}
 *
 * @since 0.0.1
 */
function removeDestination(configPath: Cli_Commands_Destination_RemoveDestination_ConfigPath, name: Cli_Commands_Destination_RemoveDestination_Name): Cli_Commands_Destination_RemoveDestination_Returns {
  const config: Cli_Commands_Destination_RemoveDestination_Config = configSchema.parse(loadConfig(configPath));
  const filtered: Cli_Commands_Destination_RemoveDestination_Filtered = config['destinations'].filter((destination) => destination['name'] !== name);

  if (filtered.length === config['destinations'].length) {
    throw new Error(`Destination "${name}" does not exist.`);
  }

  const referencingAliases: Cli_Commands_Destination_RemoveDestination_ReferencingAliases = config['aliases'].filter((alias) => alias['destination'] === name).map((alias) => alias['address']);

  if (referencingAliases.length > 0) {
    throw new Error(`Destination "${name}" is still used by: ${referencingAliases.join(', ')}.`);
  }

  if (config['settings']['default_destination'] === name) {
    throw new Error(`Destination "${name}" is the default destination. Change the setting first.`);
  }

  Reflect.set(config, 'destinations', filtered);

  saveConfig(configPath, config);

  return;
}

export {
  addDestination,
  listDestinations,
  removeDestination,
};
