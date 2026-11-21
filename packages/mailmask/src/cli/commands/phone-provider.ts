import { getPhoneProviderAdapter } from '../../lib/phone-provider.js';
import { configSchema, phoneProviderSchema } from '../../lib/schema.js';
import { loadConfig, saveConfig } from './config-io.js';

import type {
  Cli_Commands_PhoneProvider_AddPhoneProvider_Config,
  Cli_Commands_PhoneProvider_AddPhoneProvider_ConfigPath,
  Cli_Commands_PhoneProvider_AddPhoneProvider_Parsed,
  Cli_Commands_PhoneProvider_AddPhoneProvider_PhoneProviders,
  Cli_Commands_PhoneProvider_AddPhoneProvider_Provider,
  Cli_Commands_PhoneProvider_AddPhoneProvider_Returns,
  Cli_Commands_PhoneProvider_CheckPhoneProvider_ConfigPath,
  Cli_Commands_PhoneProvider_CheckPhoneProvider_Name,
  Cli_Commands_PhoneProvider_CheckPhoneProvider_Provider,
  Cli_Commands_PhoneProvider_CheckPhoneProvider_Returns,
  Cli_Commands_PhoneProvider_ConnectPhoneProviders_BaseUrl,
  Cli_Commands_PhoneProvider_ConnectPhoneProviders_Config,
  Cli_Commands_PhoneProvider_ConnectPhoneProviders_ConfigPath,
  Cli_Commands_PhoneProvider_ConnectPhoneProviders_Connected,
  Cli_Commands_PhoneProvider_ConnectPhoneProviders_Numbers,
  Cli_Commands_PhoneProvider_ConnectPhoneProviders_PhoneAliases,
  Cli_Commands_PhoneProvider_ConnectPhoneProviders_Returns,
  Cli_Commands_PhoneProvider_FindPhoneProvider_ConfigPath,
  Cli_Commands_PhoneProvider_FindPhoneProvider_Name,
  Cli_Commands_PhoneProvider_FindPhoneProvider_Provider,
  Cli_Commands_PhoneProvider_FindPhoneProvider_Returns,
  Cli_Commands_PhoneProvider_ListPhoneProviders_ConfigPath,
  Cli_Commands_PhoneProvider_ListPhoneProviders_Returns,
  Cli_Commands_PhoneProvider_RemovePhoneProvider_Config,
  Cli_Commands_PhoneProvider_RemovePhoneProvider_ConfigPath,
  Cli_Commands_PhoneProvider_RemovePhoneProvider_Filtered,
  Cli_Commands_PhoneProvider_RemovePhoneProvider_Name,
  Cli_Commands_PhoneProvider_RemovePhoneProvider_PhoneProviders,
  Cli_Commands_PhoneProvider_RemovePhoneProvider_ReferencingNumbers,
  Cli_Commands_PhoneProvider_RemovePhoneProvider_Returns,
} from '../../types/cli/commands/phone-provider.d.ts';

/**
 * CLI - Commands - Phone Provider - Add Phone Provider.
 *
 * Validates and saves a Telnyx or Plivo account after checking that its name
 * is not already used. Credentials stay in the config, like notifier tokens.
 *
 * @param {Cli_Commands_PhoneProvider_AddPhoneProvider_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneProvider_AddPhoneProvider_Provider}   provider   - Provider.
 *
 * @returns {Cli_Commands_PhoneProvider_AddPhoneProvider_Returns}
 *
 * @since 1.2.0
 */
function addPhoneProvider(configPath: Cli_Commands_PhoneProvider_AddPhoneProvider_ConfigPath, provider: Cli_Commands_PhoneProvider_AddPhoneProvider_Provider): Cli_Commands_PhoneProvider_AddPhoneProvider_Returns {
  const config: Cli_Commands_PhoneProvider_AddPhoneProvider_Config = configSchema.parse(loadConfig(configPath));
  const parsed: Cli_Commands_PhoneProvider_AddPhoneProvider_Parsed = phoneProviderSchema.parse(provider);
  const phoneProviders: Cli_Commands_PhoneProvider_AddPhoneProvider_PhoneProviders = config['phone_providers'] ?? [];

  if (phoneProviders.some((existingProvider) => existingProvider['name'] === parsed['name']) === true) {
    throw new Error(`Phone provider "${parsed['name']}" already exists.`);
  }

  Reflect.set(config, 'phone_providers', [
    ...phoneProviders,
    parsed,
  ]);

  saveConfig(configPath, config);

  return;
}

/**
 * CLI - Commands - Phone Provider - List Phone Providers.
 *
 * Loads the configuration file and returns every phone provider so callers
 * can display them or pick one for a phone alias.
 *
 * @param {Cli_Commands_PhoneProvider_ListPhoneProviders_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Commands_PhoneProvider_ListPhoneProviders_Returns}
 *
 * @since 1.2.0
 */
function listPhoneProviders(configPath: Cli_Commands_PhoneProvider_ListPhoneProviders_ConfigPath): Cli_Commands_PhoneProvider_ListPhoneProviders_Returns {
  return configSchema.parse(loadConfig(configPath))['phone_providers'] ?? [];
}

/**
 * CLI - Commands - Phone Provider - Remove Phone Provider.
 *
 * Removes a phone provider by name. Refuses while a phone alias still uses
 * it, so no number is left without credentials to forward its texts.
 *
 * @param {Cli_Commands_PhoneProvider_RemovePhoneProvider_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneProvider_RemovePhoneProvider_Name}       name       - Name.
 *
 * @returns {Cli_Commands_PhoneProvider_RemovePhoneProvider_Returns}
 *
 * @since 1.2.0
 */
function removePhoneProvider(configPath: Cli_Commands_PhoneProvider_RemovePhoneProvider_ConfigPath, name: Cli_Commands_PhoneProvider_RemovePhoneProvider_Name): Cli_Commands_PhoneProvider_RemovePhoneProvider_Returns {
  const config: Cli_Commands_PhoneProvider_RemovePhoneProvider_Config = configSchema.parse(loadConfig(configPath));
  const phoneProviders: Cli_Commands_PhoneProvider_RemovePhoneProvider_PhoneProviders = config['phone_providers'] ?? [];
  const filtered: Cli_Commands_PhoneProvider_RemovePhoneProvider_Filtered = phoneProviders.filter((phoneProvider) => phoneProvider['name'] !== name);

  if (filtered.length === phoneProviders.length) {
    throw new Error(`Phone provider "${name}" does not exist.`);
  }

  const referencingNumbers: Cli_Commands_PhoneProvider_RemovePhoneProvider_ReferencingNumbers = (config['phone_aliases'] ?? []).filter((phoneAlias) => phoneAlias['provider'] === name).map((phoneAlias) => phoneAlias['number']);

  if (referencingNumbers.length > 0) {
    throw new Error(`Phone provider "${name}" is still used by: ${referencingNumbers.join(', ')}.`);
  }

  Reflect.set(config, 'phone_providers', filtered);

  saveConfig(configPath, config);

  return;
}

/**
 * CLI - Commands - Phone Provider - Check Phone Provider.
 *
 * Calls the provider with the saved credentials so a wrong key or token shows
 * up before deploy. It reads account details only and changes nothing.
 *
 * @param {Cli_Commands_PhoneProvider_CheckPhoneProvider_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneProvider_CheckPhoneProvider_Name}       name       - Name.
 *
 * @returns {Cli_Commands_PhoneProvider_CheckPhoneProvider_Returns}
 *
 * @since 1.2.0
 */
async function checkPhoneProvider(configPath: Cli_Commands_PhoneProvider_CheckPhoneProvider_ConfigPath, name: Cli_Commands_PhoneProvider_CheckPhoneProvider_Name): Cli_Commands_PhoneProvider_CheckPhoneProvider_Returns {
  const provider: Cli_Commands_PhoneProvider_CheckPhoneProvider_Provider = findPhoneProvider(configPath, name);

  await getPhoneProviderAdapter(provider['type']).checkCredentials(provider);

  return;
}

/**
 * CLI - Commands - Phone Provider - Connect Phone Providers.
 *
 * Points every phone alias number at the Worker's webhook routes, one provider
 * at a time, and saves the messaging profile or application each one made.
 *
 * @param {Cli_Commands_PhoneProvider_ConnectPhoneProviders_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneProvider_ConnectPhoneProviders_BaseUrl}    baseUrl    - Base url.
 *
 * @returns {Cli_Commands_PhoneProvider_ConnectPhoneProviders_Returns}
 *
 * @since 1.2.0
 */
async function connectPhoneProviders(configPath: Cli_Commands_PhoneProvider_ConnectPhoneProviders_ConfigPath, baseUrl: Cli_Commands_PhoneProvider_ConnectPhoneProviders_BaseUrl): Cli_Commands_PhoneProvider_ConnectPhoneProviders_Returns {
  const config: Cli_Commands_PhoneProvider_ConnectPhoneProviders_Config = configSchema.parse(loadConfig(configPath));
  const phoneAliases: Cli_Commands_PhoneProvider_ConnectPhoneProviders_PhoneAliases = config['phone_aliases'] ?? [];
  const connected: Cli_Commands_PhoneProvider_ConnectPhoneProviders_Connected = await Promise.all((config['phone_providers'] ?? []).map(async (phoneProvider) => {
    const numbers: Cli_Commands_PhoneProvider_ConnectPhoneProviders_Numbers = phoneAliases.filter((phoneAlias) => phoneAlias['provider'] === phoneProvider['name']).map((phoneAlias) => phoneAlias['number']);

    if (numbers.length === 0) {
      return phoneProvider;
    }

    return getPhoneProviderAdapter(phoneProvider['type']).connectNumbers(phoneProvider, numbers, baseUrl);
  }));

  Reflect.set(config, 'phone_providers', connected);

  saveConfig(configPath, config);

  return connected.filter((phoneProvider) => phoneAliases.some((phoneAlias) => phoneAlias['provider'] === phoneProvider['name']) === true).map((phoneProvider) => phoneProvider['name']);
}

/**
 * CLI - Commands - Phone Provider - Find Phone Provider.
 *
 * Looks up a phone provider by name and throws when it does not exist, so
 * every phone command reports a missing provider the same way.
 *
 * @param {Cli_Commands_PhoneProvider_FindPhoneProvider_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_PhoneProvider_FindPhoneProvider_Name}       name       - Name.
 *
 * @returns {Cli_Commands_PhoneProvider_FindPhoneProvider_Returns}
 *
 * @since 1.2.0
 */
function findPhoneProvider(configPath: Cli_Commands_PhoneProvider_FindPhoneProvider_ConfigPath, name: Cli_Commands_PhoneProvider_FindPhoneProvider_Name): Cli_Commands_PhoneProvider_FindPhoneProvider_Returns {
  const provider: Cli_Commands_PhoneProvider_FindPhoneProvider_Provider = listPhoneProviders(configPath).find((phoneProvider) => phoneProvider['name'] === name);

  if (provider === undefined) {
    throw new Error(`Phone provider "${name}" does not exist.`);
  }

  return provider;
}

export {
  addPhoneProvider,
  checkPhoneProvider,
  connectPhoneProviders,
  findPhoneProvider,
  listPhoneProviders,
  removePhoneProvider,
};
