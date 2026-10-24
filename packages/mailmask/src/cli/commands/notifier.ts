import { configSchema, notifierSchema } from '../../lib/schema.js';
import { loadConfig, saveConfig } from './config-io.js';

import type {
  Cli_Commands_Notifier_AddNotifier_Config,
  Cli_Commands_Notifier_AddNotifier_ConfigPath,
  Cli_Commands_Notifier_AddNotifier_Notifier,
  Cli_Commands_Notifier_AddNotifier_Parsed,
  Cli_Commands_Notifier_AddNotifier_Returns,
  Cli_Commands_Notifier_ListNotifiers_ConfigPath,
  Cli_Commands_Notifier_ListNotifiers_Returns,
  Cli_Commands_Notifier_RemoveNotifier_Config,
  Cli_Commands_Notifier_RemoveNotifier_ConfigPath,
  Cli_Commands_Notifier_RemoveNotifier_Filtered,
  Cli_Commands_Notifier_RemoveNotifier_Name,
  Cli_Commands_Notifier_RemoveNotifier_Returns,
} from '../../types/cli/commands/notifier.d.ts';

/**
 * CLI - Commands - Notifier - Add Notifier.
 *
 * Validates and saves a notifier, either an ntfy topic or a Reverse
 * Proxy for ntfy context, after checking its name is not already used.
 *
 * @param {Cli_Commands_Notifier_AddNotifier_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Notifier_AddNotifier_Notifier}   notifier   - Notifier.
 *
 * @returns {Cli_Commands_Notifier_AddNotifier_Returns}
 *
 * @since UNRELEASED
 */
function addNotifier(configPath: Cli_Commands_Notifier_AddNotifier_ConfigPath, notifier: Cli_Commands_Notifier_AddNotifier_Notifier): Cli_Commands_Notifier_AddNotifier_Returns {
  const config: Cli_Commands_Notifier_AddNotifier_Config = configSchema.parse(loadConfig(configPath));
  const parsed: Cli_Commands_Notifier_AddNotifier_Parsed = notifierSchema.parse(notifier);

  if (config['notifiers'].some((existingNotifier) => existingNotifier['name'] === parsed['name']) === true) {
    throw new Error(`Notifier "${parsed['name']}" already exists.`);
  }

  config['notifiers'].push(parsed);

  saveConfig(configPath, config);

  return;
}

/**
 * CLI - Commands - Notifier - List Notifiers.
 *
 * Loads the configuration file and returns every notifier so callers
 * can display or reference them.
 *
 * @param {Cli_Commands_Notifier_ListNotifiers_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Commands_Notifier_ListNotifiers_Returns}
 *
 * @since UNRELEASED
 */
function listNotifiers(configPath: Cli_Commands_Notifier_ListNotifiers_ConfigPath): Cli_Commands_Notifier_ListNotifiers_Returns {
  return configSchema.parse(loadConfig(configPath))['notifiers'];
}

/**
 * CLI - Commands - Notifier - Remove Notifier.
 *
 * Removes a notifier by name and throws when no notifier with that
 * name exists.
 *
 * @param {Cli_Commands_Notifier_RemoveNotifier_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Notifier_RemoveNotifier_Name}       name       - Name.
 *
 * @returns {Cli_Commands_Notifier_RemoveNotifier_Returns}
 *
 * @since UNRELEASED
 */
function removeNotifier(configPath: Cli_Commands_Notifier_RemoveNotifier_ConfigPath, name: Cli_Commands_Notifier_RemoveNotifier_Name): Cli_Commands_Notifier_RemoveNotifier_Returns {
  const config: Cli_Commands_Notifier_RemoveNotifier_Config = configSchema.parse(loadConfig(configPath));
  const filtered: Cli_Commands_Notifier_RemoveNotifier_Filtered = config['notifiers'].filter((notifier) => notifier['name'] !== name);

  if (filtered.length === config['notifiers'].length) {
    throw new Error(`Notifier "${name}" does not exist.`);
  }

  Reflect.set(config, 'notifiers', filtered);

  saveConfig(configPath, config);

  return;
}

export {
  addNotifier,
  listNotifiers,
  removeNotifier,
};
