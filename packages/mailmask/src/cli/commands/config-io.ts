import { readFileSync, writeFileSync } from 'node:fs';

import type {
  Cli_Commands_ConfigIo_LoadConfig_ConfigPath,
  Cli_Commands_ConfigIo_LoadConfig_Returns,
  Cli_Commands_ConfigIo_NormalizeConfig_Config,
  Cli_Commands_ConfigIo_NormalizeConfig_Returns,
  Cli_Commands_ConfigIo_NormalizeConfig_SortedAliases,
  Cli_Commands_ConfigIo_NormalizeConfig_SortedDestinations,
  Cli_Commands_ConfigIo_SaveConfig_Config,
  Cli_Commands_ConfigIo_SaveConfig_ConfigPath,
  Cli_Commands_ConfigIo_SaveConfig_Returns,
} from '../../types/cli/commands/config-io.d.ts';

/**
 * CLI - Commands - Config IO - Load Config.
 *
 * Reads and parses the JSON configuration file from disk. Returns unknown
 * because the parsed JSON has not been schema-validated; callers must run
 * configSchema.parse() or configSchema.safeParse() before operating on the result.
 *
 * @returns {Cli_Commands_ConfigIo_LoadConfig_Returns}
 *
 * @since UNRELEASED
 */
function loadConfig(configPath: Cli_Commands_ConfigIo_LoadConfig_ConfigPath): Cli_Commands_ConfigIo_LoadConfig_Returns {
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

/**
 * CLI - Commands - Config IO - Normalize Config.
 *
 * Reorders top-level keys to match the interactive menu order
 * and sorts destinations by name and aliases by address.
 *
 * @returns {Cli_Commands_ConfigIo_NormalizeConfig_Returns}
 *
 * @since UNRELEASED
 */
function normalizeConfig(config: Cli_Commands_ConfigIo_NormalizeConfig_Config): Cli_Commands_ConfigIo_NormalizeConfig_Returns {
  const sortedDestinations: Cli_Commands_ConfigIo_NormalizeConfig_SortedDestinations = [...config['destinations']].sort(
    (a, b) => a['name'].localeCompare(b['name']),
  );

  const sortedAliases: Cli_Commands_ConfigIo_NormalizeConfig_SortedAliases = [...config['aliases']].sort(
    (a, b) => a['address'].localeCompare(b['address']),
  );

  return {
    destinations: sortedDestinations,
    aliases: sortedAliases,
    notifiers: config['notifiers'],
    settings: config['settings'],
  };
}

/**
 * CLI - Commands - Config IO - Save Config.
 *
 * Normalizes key ordering and serializes the configuration
 * object to JSON, then writes it to disk.
 *
 * @returns {Cli_Commands_ConfigIo_SaveConfig_Returns}
 *
 * @since UNRELEASED
 */
function saveConfig(configPath: Cli_Commands_ConfigIo_SaveConfig_ConfigPath, config: Cli_Commands_ConfigIo_SaveConfig_Config): Cli_Commands_ConfigIo_SaveConfig_Returns {
  writeFileSync(configPath, `${JSON.stringify(normalizeConfig(config), null, 2)}\n`);

  return;
}

export {
  loadConfig,
  saveConfig,
};
