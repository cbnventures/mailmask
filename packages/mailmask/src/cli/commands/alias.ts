import { randomInt } from 'node:crypto';

import { wordlist } from '@scure/bip39/wordlists/english.js';

import { LIB_REGEX_DURATION } from '../../lib/regex.js';
import { aliasSchema, configSchema } from '../../lib/schema.js';
import { loadConfig, saveConfig } from './config-io.js';

import type {
  Cli_Commands_Alias_AddAlias_Address,
  Cli_Commands_Alias_AddAlias_Alias,
  Cli_Commands_Alias_AddAlias_Config,
  Cli_Commands_Alias_AddAlias_ConfigPath,
  Cli_Commands_Alias_AddAlias_ExistingAddresses,
  Cli_Commands_Alias_AddAlias_ExpiresAt,
  Cli_Commands_Alias_AddAlias_Options,
  Cli_Commands_Alias_AddAlias_Returns,
  Cli_Commands_Alias_DescribeAliasStatus_Alias,
  Cli_Commands_Alias_DescribeAliasStatus_Now,
  Cli_Commands_Alias_DescribeAliasStatus_Returns,
  Cli_Commands_Alias_FindAlias_Address,
  Cli_Commands_Alias_FindAlias_Alias,
  Cli_Commands_Alias_FindAlias_Config,
  Cli_Commands_Alias_FindAlias_Returns,
  Cli_Commands_Alias_GenerateAddress_Returns,
  Cli_Commands_Alias_GenerateAddress_Style,
  Cli_Commands_Alias_GenerateAddress_Suffix,
  Cli_Commands_Alias_GenerateAddress_Words,
  Cli_Commands_Alias_ListAliases_ConfigPath,
  Cli_Commands_Alias_ListAliases_Returns,
  Cli_Commands_Alias_ParseExpiry_Amount,
  Cli_Commands_Alias_ParseExpiry_Match,
  Cli_Commands_Alias_ParseExpiry_Now,
  Cli_Commands_Alias_ParseExpiry_Parsed,
  Cli_Commands_Alias_ParseExpiry_Returns,
  Cli_Commands_Alias_ParseExpiry_Unit,
  Cli_Commands_Alias_ParseExpiry_UnitMilliseconds,
  Cli_Commands_Alias_ParseExpiry_Value,
  Cli_Commands_Alias_RemoveAlias_Address,
  Cli_Commands_Alias_RemoveAlias_Config,
  Cli_Commands_Alias_RemoveAlias_ConfigPath,
  Cli_Commands_Alias_RemoveAlias_Filtered,
  Cli_Commands_Alias_RemoveAlias_Returns,
  Cli_Commands_Alias_SetAliasEnabled_Address,
  Cli_Commands_Alias_SetAliasEnabled_Alias,
  Cli_Commands_Alias_SetAliasEnabled_Config,
  Cli_Commands_Alias_SetAliasEnabled_ConfigPath,
  Cli_Commands_Alias_SetAliasEnabled_Enabled,
  Cli_Commands_Alias_SetAliasEnabled_Returns,
  Cli_Commands_Alias_SetAliasExpiry_Address,
  Cli_Commands_Alias_SetAliasExpiry_Alias,
  Cli_Commands_Alias_SetAliasExpiry_Config,
  Cli_Commands_Alias_SetAliasExpiry_ConfigPath,
  Cli_Commands_Alias_SetAliasExpiry_Expires,
  Cli_Commands_Alias_SetAliasExpiry_ExpiresAt,
  Cli_Commands_Alias_SetAliasExpiry_Returns,
} from '../../types/cli/commands/alias.d.ts';

/**
 * CLI - Commands - Alias - Random Alphabet.
 *
 * Characters used for random-style aliases. Visually ambiguous
 * characters (l, o, 0, 1) are left out so addresses are easy to read.
 *
 * @since 0.0.1
 */
const RANDOM_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';

/**
 * CLI - Commands - Alias - Add Alias.
 *
 * Creates an alias with a custom or generated address, resolving the
 * optional expiry, and saves it after checking the destination exists.
 *
 * @param {Cli_Commands_Alias_AddAlias_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Alias_AddAlias_Options}    options    - Options.
 *
 * @returns {Cli_Commands_Alias_AddAlias_Returns}
 *
 * @since 0.0.1
 */
function addAlias(configPath: Cli_Commands_Alias_AddAlias_ConfigPath, options: Cli_Commands_Alias_AddAlias_Options): Cli_Commands_Alias_AddAlias_Returns {
  const config: Cli_Commands_Alias_AddAlias_Config = configSchema.parse(loadConfig(configPath));
  const existingAddresses: Cli_Commands_Alias_AddAlias_ExistingAddresses = new Set(config['aliases'].map((alias) => alias['address']));

  if (config['destinations'].some((destination) => destination['name'] === options['destination']) === false) {
    throw new Error(`Destination "${options['destination']}" does not exist.`);
  }

  let address: Cli_Commands_Alias_AddAlias_Address = (options['address'] !== undefined) ? options['address'].trim().toLowerCase() : generateAddress(options['style']);

  if (options['address'] !== undefined && existingAddresses.has(address) === true) {
    throw new Error(`Alias "${address}" already exists.`);
  }

  while (existingAddresses.has(address) === true) {
    address = generateAddress(options['style']);
  }

  const expiresAt: Cli_Commands_Alias_AddAlias_ExpiresAt = parseExpiry(options['expires'], Date.now());
  const alias: Cli_Commands_Alias_AddAlias_Alias = aliasSchema.parse({
    address,
    destination: options['destination'],
    ...((options['label'] !== undefined) ? { label: options['label'] } : {}),
    enabled: true,
    ...((expiresAt !== undefined) ? { expires_at: expiresAt } : {}),
    ...((options['allowedSenders'] !== undefined && options['allowedSenders'].length > 0) ? { allowed_senders: options['allowedSenders'] } : {}),
    ...((options['blockedSenders'] !== undefined && options['blockedSenders'].length > 0) ? { blocked_senders: options['blockedSenders'] } : {}),
  });

  config['aliases'].push(alias);

  saveConfig(configPath, config);

  return alias;
}

/**
 * CLI - Commands - Alias - List Aliases.
 *
 * Loads the configuration file and returns every alias so
 * callers can display or inspect them.
 *
 * @param {Cli_Commands_Alias_ListAliases_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Commands_Alias_ListAliases_Returns}
 *
 * @since 0.0.1
 */
function listAliases(configPath: Cli_Commands_Alias_ListAliases_ConfigPath): Cli_Commands_Alias_ListAliases_Returns {
  return configSchema.parse(loadConfig(configPath))['aliases'];
}

/**
 * CLI - Commands - Alias - Set Alias Enabled.
 *
 * Turns an alias on or off. A disabled alias refuses mail but keeps
 * its address reserved so it can be re-enabled later.
 *
 * @param {Cli_Commands_Alias_SetAliasEnabled_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Alias_SetAliasEnabled_Address}    address    - Address.
 * @param {Cli_Commands_Alias_SetAliasEnabled_Enabled}    enabled    - Enabled.
 *
 * @returns {Cli_Commands_Alias_SetAliasEnabled_Returns}
 *
 * @since 0.0.1
 */
function setAliasEnabled(configPath: Cli_Commands_Alias_SetAliasEnabled_ConfigPath, address: Cli_Commands_Alias_SetAliasEnabled_Address, enabled: Cli_Commands_Alias_SetAliasEnabled_Enabled): Cli_Commands_Alias_SetAliasEnabled_Returns {
  const config: Cli_Commands_Alias_SetAliasEnabled_Config = configSchema.parse(loadConfig(configPath));
  const alias: Cli_Commands_Alias_SetAliasEnabled_Alias = findAlias(config, address);

  Reflect.set(alias, 'enabled', enabled);

  saveConfig(configPath, config);

  return;
}

/**
 * CLI - Commands - Alias - Set Alias Expiry.
 *
 * Sets or clears the expiry of an alias. Accepts a relative duration
 * ("7d"), an ISO date, or "never" to keep the alias indefinitely.
 *
 * @param {Cli_Commands_Alias_SetAliasExpiry_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Alias_SetAliasExpiry_Address}    address    - Address.
 * @param {Cli_Commands_Alias_SetAliasExpiry_Expires}    expires    - Expires.
 *
 * @returns {Cli_Commands_Alias_SetAliasExpiry_Returns}
 *
 * @since 0.0.1
 */
function setAliasExpiry(configPath: Cli_Commands_Alias_SetAliasExpiry_ConfigPath, address: Cli_Commands_Alias_SetAliasExpiry_Address, expires: Cli_Commands_Alias_SetAliasExpiry_Expires): Cli_Commands_Alias_SetAliasExpiry_Returns {
  const config: Cli_Commands_Alias_SetAliasExpiry_Config = configSchema.parse(loadConfig(configPath));
  const alias: Cli_Commands_Alias_SetAliasExpiry_Alias = findAlias(config, address);
  const expiresAt: Cli_Commands_Alias_SetAliasExpiry_ExpiresAt = parseExpiry(expires, Date.now());

  if (expiresAt === undefined) {
    Reflect.deleteProperty(alias, 'expires_at');
  } else {
    Reflect.set(alias, 'expires_at', expiresAt);
  }

  saveConfig(configPath, config);

  return expiresAt;
}

/**
 * CLI - Commands - Alias - Remove Alias.
 *
 * Deletes an alias by address. Once deployed, mail to the address is
 * handled like any other unknown recipient.
 *
 * @param {Cli_Commands_Alias_RemoveAlias_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Alias_RemoveAlias_Address}    address    - Address.
 *
 * @returns {Cli_Commands_Alias_RemoveAlias_Returns}
 *
 * @since 0.0.1
 */
function removeAlias(configPath: Cli_Commands_Alias_RemoveAlias_ConfigPath, address: Cli_Commands_Alias_RemoveAlias_Address): Cli_Commands_Alias_RemoveAlias_Returns {
  const config: Cli_Commands_Alias_RemoveAlias_Config = configSchema.parse(loadConfig(configPath));
  const filtered: Cli_Commands_Alias_RemoveAlias_Filtered = config['aliases'].filter((alias) => alias['address'] !== address);

  if (filtered.length === config['aliases'].length) {
    throw new Error(`Alias "${address}" does not exist.`);
  }

  Reflect.set(config, 'aliases', filtered);

  saveConfig(configPath, config);

  return;
}

/**
 * CLI - Commands - Alias - Describe Alias Status.
 *
 * Returns a short, human-readable status for an alias at the given
 * moment: "disabled", "expired", "expires <date>", or "active".
 *
 * @param {Cli_Commands_Alias_DescribeAliasStatus_Alias} alias - Alias.
 * @param {Cli_Commands_Alias_DescribeAliasStatus_Now}   now   - Now.
 *
 * @returns {Cli_Commands_Alias_DescribeAliasStatus_Returns}
 *
 * @since 0.0.1
 */
function describeAliasStatus(alias: Cli_Commands_Alias_DescribeAliasStatus_Alias, now: Cli_Commands_Alias_DescribeAliasStatus_Now): Cli_Commands_Alias_DescribeAliasStatus_Returns {
  if (alias['enabled'] === false) {
    return 'disabled';
  }

  if (alias['expires_at'] === undefined) {
    return 'active';
  }

  if (Date.parse(alias['expires_at']) <= now) {
    return 'expired';
  }

  return `expires ${alias['expires_at']}`;
}

/**
 * CLI - Commands - Alias - Find Alias.
 *
 * Looks up an alias by address inside a loaded config and throws
 * when it does not exist, so callers can mutate it in place.
 *
 * @param {Cli_Commands_Alias_FindAlias_Config}  config  - Config.
 * @param {Cli_Commands_Alias_FindAlias_Address} address - Address.
 *
 * @returns {Cli_Commands_Alias_FindAlias_Returns}
 *
 * @since 0.0.1
 */
function findAlias(config: Cli_Commands_Alias_FindAlias_Config, address: Cli_Commands_Alias_FindAlias_Address): Cli_Commands_Alias_FindAlias_Returns {
  const alias: Cli_Commands_Alias_FindAlias_Alias = config['aliases'].find((configAlias) => configAlias['address'] === address);

  if (alias === undefined) {
    throw new Error(`Alias "${address}" does not exist.`);
  }

  return alias;
}

/**
 * CLI - Commands - Alias - Generate Address.
 *
 * Generates an alias address. The "words" style joins two random words
 * with a two-digit suffix (e.g. "velvet-harbor-42"); the "random" style
 * produces ten characters from an unambiguous alphabet.
 *
 * @param {Cli_Commands_Alias_GenerateAddress_Style} style - Style.
 *
 * @returns {Cli_Commands_Alias_GenerateAddress_Returns}
 *
 * @since 0.0.1
 */
function generateAddress(style: Cli_Commands_Alias_GenerateAddress_Style): Cli_Commands_Alias_GenerateAddress_Returns {
  if (style === 'random') {
    return Array.from({ length: 10 }, () => RANDOM_ALPHABET.charAt(randomInt(RANDOM_ALPHABET.length))).join('');
  }

  const words: Cli_Commands_Alias_GenerateAddress_Words = Array.from({ length: 2 }, () => wordlist.at(randomInt(wordlist.length)) ?? 'abandon');
  const suffix: Cli_Commands_Alias_GenerateAddress_Suffix = String(randomInt(10, 100));

  return [
    ...words,
    suffix,
  ].join('-');
}

/**
 * CLI - Commands - Alias - Parse Expiry.
 *
 * Converts an expiry input into an ISO timestamp. Accepts a relative
 * duration ("30m", "12h", "7d", "4w") counted from now, an ISO date or
 * datetime, or "never"/empty for no expiry.
 *
 * @param {Cli_Commands_Alias_ParseExpiry_Value} value - Value.
 * @param {Cli_Commands_Alias_ParseExpiry_Now}   now   - Now.
 *
 * @returns {Cli_Commands_Alias_ParseExpiry_Returns}
 *
 * @since 0.0.1
 */
function parseExpiry(value: Cli_Commands_Alias_ParseExpiry_Value, now: Cli_Commands_Alias_ParseExpiry_Now): Cli_Commands_Alias_ParseExpiry_Returns {
  if (
    value === undefined
    || value.trim() === ''
    || value.trim().toLowerCase() === 'never'
  ) {
    return undefined;
  }

  const match: Cli_Commands_Alias_ParseExpiry_Match = value.trim().toLowerCase().match(LIB_REGEX_DURATION);

  if (
    match !== null
    && match[1] !== undefined
    && match[2] !== undefined
  ) {
    const amount: Cli_Commands_Alias_ParseExpiry_Amount = parseInt(match[1], 10);
    const unit: Cli_Commands_Alias_ParseExpiry_Unit = match[2];
    const unitMilliseconds: Cli_Commands_Alias_ParseExpiry_UnitMilliseconds = new Map([
      [
        'm',
        60 * 1000,
      ],
      [
        'h',
        60 * 60 * 1000,
      ],
      [
        'd',
        24 * 60 * 60 * 1000,
      ],
      [
        'w',
        7 * 24 * 60 * 60 * 1000,
      ],
    ]);

    if (amount <= 0) {
      throw new Error('Expiry duration must be greater than zero.');
    }

    return new Date(now + (amount * (unitMilliseconds.get(unit) ?? 0))).toISOString();
  }

  const parsed: Cli_Commands_Alias_ParseExpiry_Parsed = Date.parse(value.trim());

  if (Number.isNaN(parsed) === true) {
    throw new Error(`Invalid expiry "${value}". Use a duration like "7d", an ISO date like "2026-12-31", or "never".`);
  }

  return new Date(parsed).toISOString();
}

export {
  addAlias,
  describeAliasStatus,
  generateAddress,
  listAliases,
  parseExpiry,
  removeAlias,
  setAliasEnabled,
  setAliasExpiry,
};
