import {
  buildNotifierRequest,
  buildTestNotification,
  NOTIFICATION_TIMEOUT_MILLISECONDS,
} from '../../lib/notification.js';
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
  Cli_Commands_Notifier_TestNotifier_Config,
  Cli_Commands_Notifier_TestNotifier_ConfigPath,
  Cli_Commands_Notifier_TestNotifier_Controller,
  Cli_Commands_Notifier_TestNotifier_Name,
  Cli_Commands_Notifier_TestNotifier_Notifier,
  Cli_Commands_Notifier_TestNotifier_Request,
  Cli_Commands_Notifier_TestNotifier_Response,
  Cli_Commands_Notifier_TestNotifier_Returns,
  Cli_Commands_Notifier_TestNotifier_TimeoutId,
} from '../../types/cli/commands/notifier.d.ts';

/**
 * CLI - Commands - Notifier - Add Notifier.
 *
 * Validates and saves one of the supported notifier shapes after checking
 * that its name is not already used.
 *
 * @param {Cli_Commands_Notifier_AddNotifier_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Notifier_AddNotifier_Notifier}   notifier   - Notifier.
 *
 * @returns {Cli_Commands_Notifier_AddNotifier_Returns}
 *
 * @since 1.0.0
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
 * @since 0.0.1
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
 * @since 0.0.1
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

/**
 * CLI - Commands - Notifier - Test Notifier.
 *
 * Sends the standard test payload to one HTTP notifier. Email notifications
 * require a deployed Worker's send_email binding and cannot be sent by Node.
 *
 * @param {Cli_Commands_Notifier_TestNotifier_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Notifier_TestNotifier_Name}       name       - Name.
 *
 * @returns {Cli_Commands_Notifier_TestNotifier_Returns}
 *
 * @since 1.0.0
 */
async function testNotifier(configPath: Cli_Commands_Notifier_TestNotifier_ConfigPath, name: Cli_Commands_Notifier_TestNotifier_Name): Cli_Commands_Notifier_TestNotifier_Returns {
  const config: Cli_Commands_Notifier_TestNotifier_Config = configSchema.parse(loadConfig(configPath));
  const notifier: Cli_Commands_Notifier_TestNotifier_Notifier = config['notifiers'].find((configNotifier) => configNotifier['name'] === name);

  if (notifier === undefined) {
    throw new Error(`Notifier "${name}" does not exist.`);
  }

  if (notifier['type'] === 'email') {
    throw new Error('Email notifier tests must run inside the deployed Worker because only a Cloudflare send_email binding can send them.');
  }

  const request: Cli_Commands_Notifier_TestNotifier_Request = buildNotifierRequest(notifier, buildTestNotification());

  if (request === undefined) {
    throw new Error(`Notifier "${name}" does not have an HTTP request.`);
  }

  const controller: Cli_Commands_Notifier_TestNotifier_Controller = new AbortController();
  const timeoutId: Cli_Commands_Notifier_TestNotifier_TimeoutId = setTimeout(() => {
    controller.abort();

    return;
  }, NOTIFICATION_TIMEOUT_MILLISECONDS);

  try {
    const response: Cli_Commands_Notifier_TestNotifier_Response = await fetch(request['url'], {
      method: request['method'],
      headers: request['headers'],
      body: request['body'],
      signal: controller.signal,
    });

    if (response.ok === false) {
      throw new Error(`Notifier "${name}" returned HTTP ${String(response.status)}.`);
    }
  } finally {
    clearTimeout(timeoutId);
  }

  return;
}

export {
  addNotifier,
  listNotifiers,
  removeNotifier,
  testNotifier,
};
