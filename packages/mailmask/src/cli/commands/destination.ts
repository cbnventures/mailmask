import { normalizePhoneNumber } from '../../lib/phone.js';
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
  Cli_Commands_Destination_SetDestinationPhone_Config,
  Cli_Commands_Destination_SetDestinationPhone_ConfigPath,
  Cli_Commands_Destination_SetDestinationPhone_Destination,
  Cli_Commands_Destination_SetDestinationPhone_Name,
  Cli_Commands_Destination_SetDestinationPhone_Phone,
  Cli_Commands_Destination_SetDestinationPhone_PhoneAliases,
  Cli_Commands_Destination_SetDestinationPhone_Returns,
} from '../../types/cli/commands/destination.d.ts';

/**
 * CLI - Commands - Destination - Add Destination.
 *
 * Registers a new destination inbox, with an optional real phone number for
 * phone aliases, after checking that the name and email are not already used.
 *
 * @param {Cli_Commands_Destination_AddDestination_ConfigPath}  configPath  - Config path.
 * @param {Cli_Commands_Destination_AddDestination_Destination} destination - Destination.
 *
 * @returns {Cli_Commands_Destination_AddDestination_Returns}
 *
 * @since 1.2.0
 */
function addDestination(configPath: Cli_Commands_Destination_AddDestination_ConfigPath, destination: Cli_Commands_Destination_AddDestination_Destination): Cli_Commands_Destination_AddDestination_Returns {
  const config: Cli_Commands_Destination_AddDestination_Config = configSchema.parse(loadConfig(configPath));
  const parsed: Cli_Commands_Destination_AddDestination_Parsed = destinationSchema.parse({
    name: destination['name'],
    email: destination['email'].trim().toLowerCase(),
    ...((destination['phone'] !== undefined) ? { phone: normalizePhoneNumber(destination['phone']) } : {}),
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
 * Removes a destination by name. Refuses while any email or phone alias
 * still references it, so no alias is left without somewhere to forward.
 *
 * @param {Cli_Commands_Destination_RemoveDestination_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Destination_RemoveDestination_Name}       name       - Name.
 *
 * @returns {Cli_Commands_Destination_RemoveDestination_Returns}
 *
 * @since 1.2.0
 */
function removeDestination(configPath: Cli_Commands_Destination_RemoveDestination_ConfigPath, name: Cli_Commands_Destination_RemoveDestination_Name): Cli_Commands_Destination_RemoveDestination_Returns {
  const config: Cli_Commands_Destination_RemoveDestination_Config = configSchema.parse(loadConfig(configPath));
  const filtered: Cli_Commands_Destination_RemoveDestination_Filtered = config['destinations'].filter((destination) => destination['name'] !== name);

  if (filtered.length === config['destinations'].length) {
    throw new Error(`Destination "${name}" does not exist.`);
  }

  const referencingAliases: Cli_Commands_Destination_RemoveDestination_ReferencingAliases = [
    ...config['aliases'].filter((alias) => alias['destination'] === name).map((alias) => alias['address']),
    ...(config['phone_aliases'] ?? []).filter((phoneAlias) => phoneAlias['destination'] === name).map((phoneAlias) => phoneAlias['number']),
  ];

  if (referencingAliases.length > 0) {
    throw new Error(`Destination "${name}" is still used by: ${referencingAliases.join(', ')}.`);
  }

  Reflect.set(config, 'destinations', filtered);

  saveConfig(configPath, config);

  return;
}

/**
 * CLI - Commands - Destination - Set Destination Phone.
 *
 * Sets or clears the real phone number of a destination. Phone aliases forward
 * texts to this number, so clearing it is refused while one still uses it.
 *
 * @param {Cli_Commands_Destination_SetDestinationPhone_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Destination_SetDestinationPhone_Name}       name       - Name.
 * @param {Cli_Commands_Destination_SetDestinationPhone_Phone}      phone      - Phone.
 *
 * @returns {Cli_Commands_Destination_SetDestinationPhone_Returns}
 *
 * @since 1.2.0
 */
function setDestinationPhone(configPath: Cli_Commands_Destination_SetDestinationPhone_ConfigPath, name: Cli_Commands_Destination_SetDestinationPhone_Name, phone: Cli_Commands_Destination_SetDestinationPhone_Phone): Cli_Commands_Destination_SetDestinationPhone_Returns {
  const config: Cli_Commands_Destination_SetDestinationPhone_Config = configSchema.parse(loadConfig(configPath));
  const destination: Cli_Commands_Destination_SetDestinationPhone_Destination = config['destinations'].find((configDestination) => configDestination['name'] === name);

  if (destination === undefined) {
    throw new Error(`Destination "${name}" does not exist.`);
  }

  if (phone === undefined) {
    const phoneAliases: Cli_Commands_Destination_SetDestinationPhone_PhoneAliases = (config['phone_aliases'] ?? []).filter((phoneAlias) => phoneAlias['destination'] === name).map((phoneAlias) => phoneAlias['number']);

    if (phoneAliases.length > 0) {
      throw new Error(`Destination "${name}" still receives texts from: ${phoneAliases.join(', ')}.`);
    }

    Reflect.deleteProperty(destination, 'phone');
  } else {
    Reflect.set(destination, 'phone', destinationSchema.shape['phone'].parse(normalizePhoneNumber(phone)));
  }

  saveConfig(configPath, config);

  return;
}

export {
  addDestination,
  listDestinations,
  removeDestination,
  setDestinationPhone,
};
