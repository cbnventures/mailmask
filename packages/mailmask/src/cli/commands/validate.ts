import { configSchema } from '../../lib/schema.js';
import { loadConfig } from './config-io.js';

import type {
  Cli_Commands_Validate_ValidateConfig_AddressCounts,
  Cli_Commands_Validate_ValidateConfig_Config,
  Cli_Commands_Validate_ValidateConfig_ConfigPath,
  Cli_Commands_Validate_ValidateConfig_DefaultDestination,
  Cli_Commands_Validate_ValidateConfig_DestinationNames,
  Cli_Commands_Validate_ValidateConfig_EntryAddress,
  Cli_Commands_Validate_ValidateConfig_EntryCount,
  Cli_Commands_Validate_ValidateConfig_Errors,
  Cli_Commands_Validate_ValidateConfig_NotifierNames,
  Cli_Commands_Validate_ValidateConfig_ParseResult,
  Cli_Commands_Validate_ValidateConfig_Raw,
  Cli_Commands_Validate_ValidateConfig_Returns,
} from '../../types/cli/commands/validate.d.ts';

/**
 * CLI - Commands - Validate - Config.
 *
 * Runs structural and referential integrity checks on the configuration
 * file, returning a list of any validation errors found.
 *
 * @param {Cli_Commands_Validate_ValidateConfig_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Commands_Validate_ValidateConfig_Returns}
 *
 * @since 0.0.1
 */
function validateConfig(configPath: Cli_Commands_Validate_ValidateConfig_ConfigPath): Cli_Commands_Validate_ValidateConfig_Returns {
  const errors: Cli_Commands_Validate_ValidateConfig_Errors = [];
  const raw: Cli_Commands_Validate_ValidateConfig_Raw = loadConfig(configPath);
  const parseResult: Cli_Commands_Validate_ValidateConfig_ParseResult = configSchema.safeParse(raw);

  if (parseResult['success'] === false) {
    for (const issue of parseResult['error']['issues']) {
      errors.push(`${issue['path'].join('.')}: ${issue['message']}`);
    }

    return {
      valid: false,
      errors,
    };
  }

  const config: Cli_Commands_Validate_ValidateConfig_Config = parseResult['data'];
  const destinationNames: Cli_Commands_Validate_ValidateConfig_DestinationNames = new Set();

  for (const destination of config['destinations']) {
    if (destinationNames.has(destination['name']) === true) {
      errors.push(`Duplicate destination name "${destination['name']}".`);
    }

    destinationNames.add(destination['name']);
  }

  for (const alias of config['aliases']) {
    if (destinationNames.has(alias['destination']) === false) {
      errors.push(`Alias "${alias['address']}": destination "${alias['destination']}" does not exist (missing).`);
    }
  }

  const defaultDestination: Cli_Commands_Validate_ValidateConfig_DefaultDestination = config['settings']['default_destination'];

  if (defaultDestination !== undefined && destinationNames.has(defaultDestination) === false) {
    errors.push(`Settings: default_destination "${defaultDestination}" does not exist (missing).`);
  }

  const notifierNames: Cli_Commands_Validate_ValidateConfig_NotifierNames = new Set();

  for (const notifier of config['notifiers']) {
    if (notifierNames.has(notifier['name']) === true) {
      errors.push(`Duplicate notifier name "${notifier['name']}".`);
    }

    notifierNames.add(notifier['name']);
  }

  const addressCounts: Cli_Commands_Validate_ValidateConfig_AddressCounts = new Map();

  for (const alias of config['aliases']) {
    addressCounts.set(alias['address'], (addressCounts.get(alias['address']) ?? 0) + 1);
  }

  for (const entry of addressCounts) {
    const entryAddress: Cli_Commands_Validate_ValidateConfig_EntryAddress = entry[0];
    const entryCount: Cli_Commands_Validate_ValidateConfig_EntryCount = entry[1];

    if (entryCount > 1) {
      errors.push(`Duplicate alias address "${entryAddress}".`);
    }
  }

  return {
    valid: errors['length'] === 0,
    errors,
  };
}

export {
  validateConfig,
};
