import { getPhoneProviderAdapter } from '../../lib/phone-provider.js';
import { normalizePhoneNumber } from '../../lib/phone.js';
import { configSchema, phoneAliasSchema } from '../../lib/schema.js';
import { parseExpiry } from './alias.js';
import { loadConfig, saveConfig } from './config-io.js';
import { findPhoneProvider } from './phone-provider.js';

import type {
  Cli_Commands_PhoneAlias_AddPhoneAlias_Config,
  Cli_Commands_PhoneAlias_AddPhoneAlias_ConfigPath,
  Cli_Commands_PhoneAlias_AddPhoneAlias_Destination,
  Cli_Commands_PhoneAlias_AddPhoneAlias_ExpiresAt,
  Cli_Commands_PhoneAlias_AddPhoneAlias_Number,
  Cli_Commands_PhoneAlias_AddPhoneAlias_Options,
  Cli_Commands_PhoneAlias_AddPhoneAlias_Owned,
  Cli_Commands_PhoneAlias_AddPhoneAlias_PhoneAlias,
  Cli_Commands_PhoneAlias_AddPhoneAlias_PhoneAliases,
  Cli_Commands_PhoneAlias_AddPhoneAlias_Provider,
  Cli_Commands_PhoneAlias_AddPhoneAlias_Returns,
  Cli_Commands_PhoneAlias_AddPhoneAlias_Status,
  Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_Now,
  Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_PhoneAlias,
  Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_Returns,
  Cli_Commands_PhoneAlias_FindPhoneAlias_Config,
  Cli_Commands_PhoneAlias_FindPhoneAlias_NormalizedNumber,
  Cli_Commands_PhoneAlias_FindPhoneAlias_Number,
  Cli_Commands_PhoneAlias_FindPhoneAlias_PhoneAlias,
  Cli_Commands_PhoneAlias_FindPhoneAlias_Returns,
  Cli_Commands_PhoneAlias_ListPhoneAliases_ConfigPath,
  Cli_Commands_PhoneAlias_ListPhoneAliases_Returns,
  Cli_Commands_PhoneAlias_ReleasePhoneAlias_ConfigPath,
  Cli_Commands_PhoneAlias_ReleasePhoneAlias_Number,
  Cli_Commands_PhoneAlias_ReleasePhoneAlias_PhoneAlias,
  Cli_Commands_PhoneAlias_ReleasePhoneAlias_Provider,
  Cli_Commands_PhoneAlias_ReleasePhoneAlias_Returns,
  Cli_Commands_PhoneAlias_RemovePhoneAlias_Config,
  Cli_Commands_PhoneAlias_RemovePhoneAlias_ConfigPath,
  Cli_Commands_PhoneAlias_RemovePhoneAlias_Number,
  Cli_Commands_PhoneAlias_RemovePhoneAlias_PhoneAlias,
  Cli_Commands_PhoneAlias_RemovePhoneAlias_Returns,
  Cli_Commands_PhoneAlias_SearchPhoneNumbers_ConfigPath,
  Cli_Commands_PhoneAlias_SearchPhoneNumbers_Provider,
  Cli_Commands_PhoneAlias_SearchPhoneNumbers_ProviderName,
  Cli_Commands_PhoneAlias_SearchPhoneNumbers_Returns,
  Cli_Commands_PhoneAlias_SearchPhoneNumbers_Search,
  Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Config,
  Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_ConfigPath,
  Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Enabled,
  Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Number,
  Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_PhoneAlias,
  Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Returns,
  Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Config,
  Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_ConfigPath,
  Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Expires,
  Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_ExpiresAt,
  Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Number,
  Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_PhoneAlias,
  Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Returns,
} from '../../types/cli/commands/phone-alias.d.ts';

/**
 * CLI - Commands - Phone Alias - Add Phone Alias.
 *
 * Creates a phone alias from a number the provider account already has, or
 * buys the number first when asked. Every check runs before anything is bought.
 *
 * @param {Cli_Commands_PhoneAlias_AddPhoneAlias_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneAlias_AddPhoneAlias_Options}    options    - Options.
 *
 * @returns {Cli_Commands_PhoneAlias_AddPhoneAlias_Returns}
 *
 * @since 1.2.0
 */
async function addPhoneAlias(configPath: Cli_Commands_PhoneAlias_AddPhoneAlias_ConfigPath, options: Cli_Commands_PhoneAlias_AddPhoneAlias_Options): Cli_Commands_PhoneAlias_AddPhoneAlias_Returns {
  const config: Cli_Commands_PhoneAlias_AddPhoneAlias_Config = configSchema.parse(loadConfig(configPath));
  const provider: Cli_Commands_PhoneAlias_AddPhoneAlias_Provider = findPhoneProvider(configPath, options['provider']);
  const destination: Cli_Commands_PhoneAlias_AddPhoneAlias_Destination = config['destinations'].find((configDestination) => configDestination['name'] === options['destination']);
  const phoneAliases: Cli_Commands_PhoneAlias_AddPhoneAlias_PhoneAliases = config['phone_aliases'] ?? [];
  const number: Cli_Commands_PhoneAlias_AddPhoneAlias_Number = normalizePhoneNumber(options['number']);

  if (destination === undefined) {
    throw new Error(`Destination "${options['destination']}" does not exist.`);
  }

  if (destination['phone'] === undefined) {
    throw new Error(`Destination "${options['destination']}" has no phone number. Run "mm destination phone ${options['destination']} <number>" first.`);
  }

  if (destination['phone'] === number) {
    throw new Error(`"${number}" is the destination's own phone number, so it cannot also be a phone alias.`);
  }

  if (phoneAliases.some((phoneAlias) => phoneAlias['number'] === number) === true) {
    throw new Error(`Phone alias "${number}" already exists.`);
  }

  const expiresAt: Cli_Commands_PhoneAlias_AddPhoneAlias_ExpiresAt = parseExpiry(options['expires'], Date.now());
  const phoneAlias: Cli_Commands_PhoneAlias_AddPhoneAlias_PhoneAlias = phoneAliasSchema.parse({
    number,
    provider: provider['name'],
    destination: destination['name'],
    ...((options['label'] !== undefined) ? { label: options['label'] } : {}),
    enabled: true,
    ...((expiresAt !== undefined) ? { expires_at: expiresAt } : {}),
    ...((options['allowedSenders'] !== undefined && options['allowedSenders'].length > 0) ? { allowed_senders: options['allowedSenders'] } : {}),
    ...((options['blockedSenders'] !== undefined && options['blockedSenders'].length > 0) ? { blocked_senders: options['blockedSenders'] } : {}),
  });
  let status: Cli_Commands_PhoneAlias_AddPhoneAlias_Status = 'attached';

  if (options['buy'] === true) {
    status = await getPhoneProviderAdapter(provider['type']).buyNumber(provider, number);
  } else {
    const owned: Cli_Commands_PhoneAlias_AddPhoneAlias_Owned = await getPhoneProviderAdapter(provider['type']).ownsNumber(provider, number);

    if (owned === false) {
      throw new Error(`"${number}" is not on the "${provider['name']}" account. Search with "mm phone search ${provider['name']}" and add it with --buy, or buy it in the provider's dashboard first.`);
    }
  }

  Reflect.set(config, 'phone_aliases', [
    ...phoneAliases,
    phoneAlias,
  ]);

  saveConfig(configPath, config);

  return {
    phoneAlias,
    status,
  };
}

/**
 * CLI - Commands - Phone Alias - Search Phone Numbers.
 *
 * Lists numbers a provider can sell, so the user can pick one to buy with
 * "mm phone add --buy". Searching never buys anything.
 *
 * @param {Cli_Commands_PhoneAlias_SearchPhoneNumbers_ConfigPath}   configPath   - Config path.
 * @param {Cli_Commands_PhoneAlias_SearchPhoneNumbers_ProviderName} providerName - Provider name.
 * @param {Cli_Commands_PhoneAlias_SearchPhoneNumbers_Search}       search       - Search.
 *
 * @returns {Cli_Commands_PhoneAlias_SearchPhoneNumbers_Returns}
 *
 * @since 1.2.0
 */
async function searchPhoneNumbers(configPath: Cli_Commands_PhoneAlias_SearchPhoneNumbers_ConfigPath, providerName: Cli_Commands_PhoneAlias_SearchPhoneNumbers_ProviderName, search: Cli_Commands_PhoneAlias_SearchPhoneNumbers_Search): Cli_Commands_PhoneAlias_SearchPhoneNumbers_Returns {
  const provider: Cli_Commands_PhoneAlias_SearchPhoneNumbers_Provider = findPhoneProvider(configPath, providerName);

  return getPhoneProviderAdapter(provider['type']).searchNumbers(provider, search);
}

/**
 * CLI - Commands - Phone Alias - List Phone Aliases.
 *
 * Loads the configuration file and returns every phone alias so callers can
 * display or inspect them.
 *
 * @param {Cli_Commands_PhoneAlias_ListPhoneAliases_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Commands_PhoneAlias_ListPhoneAliases_Returns}
 *
 * @since 1.2.0
 */
function listPhoneAliases(configPath: Cli_Commands_PhoneAlias_ListPhoneAliases_ConfigPath): Cli_Commands_PhoneAlias_ListPhoneAliases_Returns {
  return configSchema.parse(loadConfig(configPath))['phone_aliases'] ?? [];
}

/**
 * CLI - Commands - Phone Alias - Set Phone Alias Enabled.
 *
 * Turns a phone alias on or off. A disabled number drops texts but stays on
 * the provider account, so it can be switched back on later.
 *
 * @param {Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Number}     number     - Number.
 * @param {Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Enabled}    enabled    - Enabled.
 *
 * @returns {Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Returns}
 *
 * @since 1.2.0
 */
function setPhoneAliasEnabled(configPath: Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_ConfigPath, number: Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Number, enabled: Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Enabled): Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Returns {
  const config: Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_Config = configSchema.parse(loadConfig(configPath));
  const phoneAlias: Cli_Commands_PhoneAlias_SetPhoneAliasEnabled_PhoneAlias = findPhoneAlias(config, number);

  Reflect.set(phoneAlias, 'enabled', enabled);

  saveConfig(configPath, config);

  return;
}

/**
 * CLI - Commands - Phone Alias - Set Phone Alias Expiry.
 *
 * Sets or clears when a phone alias stops forwarding. Accepts the same values
 * as email aliases: a duration ("7d"), an ISO date, or "never".
 *
 * @param {Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Number}     number     - Number.
 * @param {Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Expires}    expires    - Expires.
 *
 * @returns {Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Returns}
 *
 * @since 1.2.0
 */
function setPhoneAliasExpiry(configPath: Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_ConfigPath, number: Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Number, expires: Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Expires): Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Returns {
  const config: Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_Config = configSchema.parse(loadConfig(configPath));
  const phoneAlias: Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_PhoneAlias = findPhoneAlias(config, number);
  const expiresAt: Cli_Commands_PhoneAlias_SetPhoneAliasExpiry_ExpiresAt = parseExpiry(expires, Date.now());

  if (expiresAt === undefined) {
    Reflect.deleteProperty(phoneAlias, 'expires_at');
  } else {
    Reflect.set(phoneAlias, 'expires_at', expiresAt);
  }

  saveConfig(configPath, config);

  return expiresAt;
}

/**
 * CLI - Commands - Phone Alias - Remove Phone Alias.
 *
 * Deletes a phone alias from the config but keeps the number on the provider
 * account, for numbers that should go back to another use.
 *
 * @param {Cli_Commands_PhoneAlias_RemovePhoneAlias_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneAlias_RemovePhoneAlias_Number}     number     - Number.
 *
 * @returns {Cli_Commands_PhoneAlias_RemovePhoneAlias_Returns}
 *
 * @since 1.2.0
 */
function removePhoneAlias(configPath: Cli_Commands_PhoneAlias_RemovePhoneAlias_ConfigPath, number: Cli_Commands_PhoneAlias_RemovePhoneAlias_Number): Cli_Commands_PhoneAlias_RemovePhoneAlias_Returns {
  const config: Cli_Commands_PhoneAlias_RemovePhoneAlias_Config = configSchema.parse(loadConfig(configPath));
  const phoneAlias: Cli_Commands_PhoneAlias_RemovePhoneAlias_PhoneAlias = findPhoneAlias(config, number);

  Reflect.set(config, 'phone_aliases', (config['phone_aliases'] ?? []).filter((configPhoneAlias) => configPhoneAlias['number'] !== phoneAlias['number']));

  saveConfig(configPath, config);

  return;
}

/**
 * CLI - Commands - Phone Alias - Release Phone Alias.
 *
 * Gives the number back to the provider, which stops billing for it, and then
 * removes the phone alias. The number cannot be got back once it is released.
 *
 * @param {Cli_Commands_PhoneAlias_ReleasePhoneAlias_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneAlias_ReleasePhoneAlias_Number}     number     - Number.
 *
 * @returns {Cli_Commands_PhoneAlias_ReleasePhoneAlias_Returns}
 *
 * @since 1.2.0
 */
async function releasePhoneAlias(configPath: Cli_Commands_PhoneAlias_ReleasePhoneAlias_ConfigPath, number: Cli_Commands_PhoneAlias_ReleasePhoneAlias_Number): Cli_Commands_PhoneAlias_ReleasePhoneAlias_Returns {
  const phoneAlias: Cli_Commands_PhoneAlias_ReleasePhoneAlias_PhoneAlias = findPhoneAlias(configSchema.parse(loadConfig(configPath)), number);
  const provider: Cli_Commands_PhoneAlias_ReleasePhoneAlias_Provider = findPhoneProvider(configPath, phoneAlias['provider']);

  await getPhoneProviderAdapter(provider['type']).releaseNumber(provider, phoneAlias['number']);

  removePhoneAlias(configPath, phoneAlias['number']);

  return;
}

/**
 * CLI - Commands - Phone Alias - Describe Phone Alias Status.
 *
 * Returns a short, human-readable status for a phone alias at the given
 * moment: "disabled", "expired", "expires <date>", or "active".
 *
 * @param {Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_PhoneAlias} phoneAlias - Phone alias.
 * @param {Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_Now}        now        - Now.
 *
 * @returns {Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_Returns}
 *
 * @since 1.2.0
 */
function describePhoneAliasStatus(phoneAlias: Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_PhoneAlias, now: Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_Now): Cli_Commands_PhoneAlias_DescribePhoneAliasStatus_Returns {
  if (phoneAlias['enabled'] === false) {
    return 'disabled';
  }

  if (phoneAlias['expires_at'] === undefined) {
    return 'active';
  }

  if (Date.parse(phoneAlias['expires_at']) <= now) {
    return 'expired';
  }

  return `expires ${phoneAlias['expires_at']}`;
}

/**
 * CLI - Commands - Phone Alias - Find Phone Alias.
 *
 * Looks up a phone alias by number inside a loaded config, reading the number
 * the way people type it, and throws when it does not exist.
 *
 * @param {Cli_Commands_PhoneAlias_FindPhoneAlias_Config} config - Config.
 * @param {Cli_Commands_PhoneAlias_FindPhoneAlias_Number} number - Number.
 *
 * @returns {Cli_Commands_PhoneAlias_FindPhoneAlias_Returns}
 *
 * @since 1.2.0
 */
function findPhoneAlias(config: Cli_Commands_PhoneAlias_FindPhoneAlias_Config, number: Cli_Commands_PhoneAlias_FindPhoneAlias_Number): Cli_Commands_PhoneAlias_FindPhoneAlias_Returns {
  const normalizedNumber: Cli_Commands_PhoneAlias_FindPhoneAlias_NormalizedNumber = normalizePhoneNumber(number);
  const phoneAlias: Cli_Commands_PhoneAlias_FindPhoneAlias_PhoneAlias = (config['phone_aliases'] ?? []).find((configPhoneAlias) => configPhoneAlias['number'] === normalizedNumber);

  if (phoneAlias === undefined) {
    throw new Error(`Phone alias "${number}" does not exist.`);
  }

  return phoneAlias;
}

export {
  addPhoneAlias,
  describePhoneAliasStatus,
  listPhoneAliases,
  releasePhoneAlias,
  removePhoneAlias,
  searchPhoneNumbers,
  setPhoneAliasEnabled,
  setPhoneAliasExpiry,
};
