import { readFileSync, writeFileSync } from 'node:fs';

import { Logger } from '@cbnventures/nova/toolkit';

import type {
  Cli_Commands_ConfigIo_DropRetiredSettings_ConfigPath,
  Cli_Commands_ConfigIo_DropRetiredSettings_Parsed,
  Cli_Commands_ConfigIo_DropRetiredSettings_RetiredKeys,
  Cli_Commands_ConfigIo_DropRetiredSettings_Returns,
  Cli_Commands_ConfigIo_DropRetiredSettings_Settings,
  Cli_Commands_ConfigIo_LoadConfig_ConfigPath,
  Cli_Commands_ConfigIo_LoadConfig_Parsed,
  Cli_Commands_ConfigIo_LoadConfig_Returns,
  Cli_Commands_ConfigIo_NormalizeConfig_Config,
  Cli_Commands_ConfigIo_NormalizeConfig_Returns,
  Cli_Commands_ConfigIo_NormalizeConfig_SortedAliases,
  Cli_Commands_ConfigIo_NormalizeConfig_SortedDestinations,
  Cli_Commands_ConfigIo_NoticedConfigPaths,
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
 * @since 1.1.0
 */
function loadConfig(configPath: Cli_Commands_ConfigIo_LoadConfig_ConfigPath): Cli_Commands_ConfigIo_LoadConfig_Returns {
  const parsed: Cli_Commands_ConfigIo_LoadConfig_Parsed = JSON.parse(readFileSync(configPath, 'utf-8'));

  dropRetiredSettings(configPath, parsed);

  return parsed;
}

/**
 * CLI - Commands - Config IO - Noticed Config Paths.
 *
 * Config files that already printed the retired settings notice, so a command
 * that loads the same config many times only prints it once.
 *
 * @since 1.1.0
 */
const noticedConfigPaths: Cli_Commands_ConfigIo_NoticedConfigPaths = new Set();

/**
 * CLI - Commands - Config IO - Drop Retired Settings.
 *
 * Removes settings that older releases wrote, such as unknown_alias_action, so a
 * config from before 1.1.0 still loads. The next save leaves them out for good.
 *
 * @param {Cli_Commands_ConfigIo_DropRetiredSettings_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_ConfigIo_DropRetiredSettings_Parsed}     parsed     - Parsed.
 *
 * @returns {Cli_Commands_ConfigIo_DropRetiredSettings_Returns}
 *
 * @since 1.1.0
 */
function dropRetiredSettings(configPath: Cli_Commands_ConfigIo_DropRetiredSettings_ConfigPath, parsed: Cli_Commands_ConfigIo_DropRetiredSettings_Parsed): Cli_Commands_ConfigIo_DropRetiredSettings_Returns {
  if (typeof parsed !== 'object' || parsed === null) {
    return;
  }

  const settings: Cli_Commands_ConfigIo_DropRetiredSettings_Settings = Reflect.get(parsed, 'settings');

  if (typeof settings !== 'object' || settings === null) {
    return;
  }

  const retiredKeys: Cli_Commands_ConfigIo_DropRetiredSettings_RetiredKeys = [
    'unknown_alias_action',
    'default_destination',
  ].filter((key) => Reflect.has(settings, key) === true);

  if (retiredKeys.length === 0) {
    return;
  }

  for (const retiredKey of retiredKeys) {
    Reflect.deleteProperty(settings, retiredKey);
  }

  if (noticedConfigPaths.has(configPath) === false) {
    noticedConfigPaths.add(configPath);

    Logger.warn(`Ignoring ${retiredKeys.join(' and ')} in "${configPath}": Cloudflare now rejects mail to addresses that are not aliases, and the next save removes the old value.`);
  }

  return;
}

/**
 * CLI - Commands - Config IO - Normalize Config.
 *
 * Reorders top-level keys to match the interactive menu order
 * and sorts destinations by name and aliases by address.
 *
 * @returns {Cli_Commands_ConfigIo_NormalizeConfig_Returns}
 *
 * @since 0.0.1
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
 * @since 0.0.1
 */
function saveConfig(configPath: Cli_Commands_ConfigIo_SaveConfig_ConfigPath, config: Cli_Commands_ConfigIo_SaveConfig_Config): Cli_Commands_ConfigIo_SaveConfig_Returns {
  writeFileSync(configPath, `${JSON.stringify(normalizeConfig(config), null, 2)}\n`);

  return;
}

export {
  loadConfig,
  saveConfig,
};
