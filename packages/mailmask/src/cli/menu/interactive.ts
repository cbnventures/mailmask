import { join } from 'node:path';

import { Bootstrap, CLIHeader, Logger } from '@cbnventures/nova/toolkit';
import chalk from 'chalk';
import prompts from 'prompts';

import { APP_NAME } from '../../lib/item.js';
import { getPackageVersion } from '../../lib/package-runtime.js';
import {
  addAlias,
  describeAliasStatus,
  listAliases,
  removeAlias,
  setAliasEnabled,
  setAliasExpiry,
} from '../commands/alias.js';
import { deploy } from '../commands/deploy.js';
import { addDestination, listDestinations, removeDestination } from '../commands/destination.js';
import { addNotifier, listNotifiers, removeNotifier } from '../commands/notifier.js';
import { getSettings, updateSettings } from '../commands/settings.js';

import type {
  Cli_Menu_Interactive_AliasMenu_Action,
  Cli_Menu_Interactive_AliasMenu_ConfigPath,
  Cli_Menu_Interactive_AliasMenu_ErrorMessage,
  Cli_Menu_Interactive_AliasMenu_InMenu,
  Cli_Menu_Interactive_AliasMenu_Response,
  Cli_Menu_Interactive_AliasMenu_Returns,
  Cli_Menu_Interactive_CreateAliasFlow_Alias,
  Cli_Menu_Interactive_CreateAliasFlow_ConfigPath,
  Cli_Menu_Interactive_CreateAliasFlow_Destinations,
  Cli_Menu_Interactive_CreateAliasFlow_Response,
  Cli_Menu_Interactive_CreateAliasFlow_Returns,
  Cli_Menu_Interactive_CreateAliasFlow_Settings,
  Cli_Menu_Interactive_DestinationMenu_Action,
  Cli_Menu_Interactive_DestinationMenu_AddResponse,
  Cli_Menu_Interactive_DestinationMenu_ConfigPath,
  Cli_Menu_Interactive_DestinationMenu_Destinations,
  Cli_Menu_Interactive_DestinationMenu_ErrorMessage,
  Cli_Menu_Interactive_DestinationMenu_InMenu,
  Cli_Menu_Interactive_DestinationMenu_RemoveResponse,
  Cli_Menu_Interactive_DestinationMenu_Response,
  Cli_Menu_Interactive_DestinationMenu_Returns,
  Cli_Menu_Interactive_InteractiveMenu_Action,
  Cli_Menu_Interactive_InteractiveMenu_ConfigDirResponse,
  Cli_Menu_Interactive_InteractiveMenu_ConfigDirs,
  Cli_Menu_Interactive_InteractiveMenu_ConfigPath,
  Cli_Menu_Interactive_InteractiveMenu_ErrorMessage,
  Cli_Menu_Interactive_InteractiveMenu_FirstConfigDir,
  Cli_Menu_Interactive_InteractiveMenu_Header,
  Cli_Menu_Interactive_InteractiveMenu_Response,
  Cli_Menu_Interactive_InteractiveMenu_Returns,
  Cli_Menu_Interactive_InteractiveMenu_Running,
  Cli_Menu_Interactive_InteractiveMenu_Version,
  Cli_Menu_Interactive_ModifyAliasFlow_Action,
  Cli_Menu_Interactive_ModifyAliasFlow_Aliases,
  Cli_Menu_Interactive_ModifyAliasFlow_ConfigPath,
  Cli_Menu_Interactive_ModifyAliasFlow_ExpiresAt,
  Cli_Menu_Interactive_ModifyAliasFlow_Now,
  Cli_Menu_Interactive_ModifyAliasFlow_Response,
  Cli_Menu_Interactive_ModifyAliasFlow_Returns,
  Cli_Menu_Interactive_NotifierMenu_Action,
  Cli_Menu_Interactive_NotifierMenu_ConfigPath,
  Cli_Menu_Interactive_NotifierMenu_ErrorMessage,
  Cli_Menu_Interactive_NotifierMenu_InMenu,
  Cli_Menu_Interactive_NotifierMenu_Notifiers,
  Cli_Menu_Interactive_NotifierMenu_NtfyResponse,
  Cli_Menu_Interactive_NotifierMenu_ProxyResponse,
  Cli_Menu_Interactive_NotifierMenu_RemoveResponse,
  Cli_Menu_Interactive_NotifierMenu_Response,
  Cli_Menu_Interactive_NotifierMenu_Returns,
  Cli_Menu_Interactive_NotifierMenu_Target,
  Cli_Menu_Interactive_PrintAliases_Aliases,
  Cli_Menu_Interactive_PrintAliases_ConfigPath,
  Cli_Menu_Interactive_PrintAliases_LabelSuffix,
  Cli_Menu_Interactive_PrintAliases_Now,
  Cli_Menu_Interactive_PrintAliases_Returns,
  Cli_Menu_Interactive_PrintAliases_Settings,
  Cli_Menu_Interactive_PrintAliases_Status,
  Cli_Menu_Interactive_SettingsFlow_ConfigPath,
  Cli_Menu_Interactive_SettingsFlow_CurrentSettings,
  Cli_Menu_Interactive_SettingsFlow_ErrorMessage,
  Cli_Menu_Interactive_SettingsFlow_Response,
  Cli_Menu_Interactive_SettingsFlow_Returns,
  Cli_Menu_Interactive_SplitList_Returns,
  Cli_Menu_Interactive_SplitList_Value,
} from '../../types/cli/menu/interactive.d.ts';

/**
 * CLI - Menu - Interactive - Menu.
 *
 * Orchestrates the top-level interactive CLI menu loop and
 * dispatches selections to the alias, destination, notifier, and settings flows.
 *
 * @param {Cli_Menu_Interactive_InteractiveMenu_ConfigDirs} configDirs - Config dirs.
 *
 * @returns {Cli_Menu_Interactive_InteractiveMenu_Returns}
 *
 * @since 0.0.1
 */
async function interactiveMenu(configDirs: Cli_Menu_Interactive_InteractiveMenu_ConfigDirs): Cli_Menu_Interactive_InteractiveMenu_Returns {
  const version: Cli_Menu_Interactive_InteractiveMenu_Version = getPackageVersion();
  const header: Cli_Menu_Interactive_InteractiveMenu_Header = CLIHeader.render([
    chalk.magentaBright(`Mailmask v${version}`),
    chalk.dim('A CBN Ventures Creation'),
  ], {
    style: 'round',
    width: 50,
    marginBottom: 1,
  });

  process.stdout.write(`${header}\n`);

  let configPath: Cli_Menu_Interactive_InteractiveMenu_ConfigPath = join(Bootstrap.getConfigDir(APP_NAME), 'config.json');
  const firstConfigDir: Cli_Menu_Interactive_InteractiveMenu_FirstConfigDir = configDirs[0];

  if (configDirs.length > 1) {
    const configDirResponse: Cli_Menu_Interactive_InteractiveMenu_ConfigDirResponse = await prompts({
      type: 'select',
      name: 'dir',
      message: chalk.cyan('Multiple config files found. Which one?'),
      choices: configDirs.map((configDir) => ({
        title: join(configDir, 'config.json'),
        value: configDir,
      })),
    });

    if (configDirResponse['dir'] === undefined) {
      return;
    }

    configPath = join(configDirResponse['dir'], 'config.json');
  } else if (firstConfigDir !== undefined) {
    configPath = join(firstConfigDir, 'config.json');
  }

  let running: Cli_Menu_Interactive_InteractiveMenu_Running = true;

  while (running === true) {
    const response: Cli_Menu_Interactive_InteractiveMenu_Response = await prompts({
      type: 'select',
      name: 'action',
      message: chalk.cyan('What would you like to do?'),
      choices: [
        {
          title: 'Manage Aliases',
          value: 'aliases',
        },
        {
          title: 'Manage Destinations',
          value: 'destinations',
        },
        {
          title: 'Manage Notifiers',
          value: 'notifiers',
        },
        {
          title: 'Settings',
          value: 'settings',
        },
        {
          title: 'Deploy',
          value: 'deploy',
        },
        {
          title: 'Exit',
          value: 'exit',
        },
      ],
    });
    const action: Cli_Menu_Interactive_InteractiveMenu_Action = response['action'];

    if (action === undefined || action === 'exit') {
      running = false;

      break;
    }

    try {
      if (action === 'aliases') {
        await aliasMenu(configPath);
      } else if (action === 'destinations') {
        await destinationMenu(configPath);
      } else if (action === 'notifiers') {
        await notifierMenu(configPath);
      } else if (action === 'settings') {
        await settingsFlow(configPath);
      } else if (action === 'deploy') {
        await deploy(configPath, true);
      }
    } catch (error) {
      const errorMessage: Cli_Menu_Interactive_InteractiveMenu_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      Logger.error(`Error: ${errorMessage}`);
    }
  }

  return;
}

/**
 * CLI - Menu - Interactive - Alias Menu.
 *
 * Presents the alias sub-menu in a loop for creating, listing,
 * enabling, disabling, re-dating, and removing aliases.
 *
 * @param {Cli_Menu_Interactive_AliasMenu_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_AliasMenu_Returns}
 *
 * @since 0.0.1
 */
async function aliasMenu(configPath: Cli_Menu_Interactive_AliasMenu_ConfigPath): Cli_Menu_Interactive_AliasMenu_Returns {
  let inMenu: Cli_Menu_Interactive_AliasMenu_InMenu = true;

  while (inMenu === true) {
    const response: Cli_Menu_Interactive_AliasMenu_Response = await prompts({
      type: 'select',
      name: 'action',
      message: chalk.cyan('Manage Aliases'),
      choices: [
        {
          title: 'Create',
          value: 'create',
        },
        {
          title: 'List',
          value: 'list',
        },
        {
          title: 'Modify',
          value: 'modify',
        },
        {
          title: 'Back',
          value: 'back',
        },
      ],
    });
    const action: Cli_Menu_Interactive_AliasMenu_Action = response['action'];

    if (action === undefined || action === 'back') {
      inMenu = false;

      break;
    }

    try {
      if (action === 'create') {
        await createAliasFlow(configPath);
      } else if (action === 'list') {
        printAliases(configPath);
      } else if (action === 'modify') {
        await modifyAliasFlow(configPath);
      }
    } catch (error) {
      const errorMessage: Cli_Menu_Interactive_AliasMenu_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      Logger.error(`Error: ${errorMessage}`);
    }
  }

  return;
}

/**
 * CLI - Menu - Interactive - Create Alias Flow.
 *
 * Prompts for the alias style or custom address, destination, label,
 * expiry, and sender rules, then creates the alias.
 *
 * @param {Cli_Menu_Interactive_CreateAliasFlow_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_CreateAliasFlow_Returns}
 *
 * @since 0.0.1
 */
async function createAliasFlow(configPath: Cli_Menu_Interactive_CreateAliasFlow_ConfigPath): Cli_Menu_Interactive_CreateAliasFlow_Returns {
  const destinations: Cli_Menu_Interactive_CreateAliasFlow_Destinations = listDestinations(configPath);
  const settings: Cli_Menu_Interactive_CreateAliasFlow_Settings = getSettings(configPath);

  if (destinations.length === 0) {
    Logger.warn('Add a destination first. Aliases need an inbox to forward to.');

    return;
  }

  const response: Cli_Menu_Interactive_CreateAliasFlow_Response = await prompts([
    {
      type: 'select',
      name: 'style',
      message: 'Address:',
      choices: [
        {
          title: 'Two random words (e.g. velvet-harbor-42)',
          value: 'words',
        },
        {
          title: 'Random characters (e.g. k7mq2xv9pa)',
          value: 'random',
        },
        {
          title: 'Custom',
          value: 'custom',
        },
      ],
    },
    {
      type: (previous) => (previous === 'custom') ? 'text' : null,
      name: 'address',
      message: `Custom address (before @${settings['base_domain']}):`,
      validate: (value) => value.trim().length > 0 || 'Address is required',
    },
    {
      type: 'select',
      name: 'destination',
      message: 'Forward to:',
      choices: destinations.map((destination) => ({
        title: `${destination['name']} (${destination['email']})`,
        value: destination['name'],
      })),
    },
    {
      type: 'text',
      name: 'label',
      message: 'Label (where you used it, optional):',
    },
    {
      type: 'text',
      name: 'expires',
      message: 'Expires (e.g. 30m, 7d, 2026-12-31, or "never"):',
      initial: 'never',
    },
    {
      type: 'text',
      name: 'allowedSenders',
      message: 'Only accept from (comma-separated, optional, e.g. *@shop.com):',
    },
  ]);

  // Prompts stops early on cancel, leaving the last answer unset.
  if (response['allowedSenders'] === undefined) {
    return;
  }

  const alias: Cli_Menu_Interactive_CreateAliasFlow_Alias = addAlias(configPath, {
    address: (response['style'] === 'custom') ? response['address'] : undefined,
    style: (response['style'] === 'random') ? 'random' : 'words',
    destination: response['destination'],
    label: (typeof response['label'] === 'string' && response['label'].trim() !== '') ? response['label'].trim() : undefined,
    expires: response['expires'],
    allowedSenders: splitList(response['allowedSenders']),
    blockedSenders: undefined,
  });

  Logger.info(`Created ${chalk.green(`${alias['address']}@${settings['base_domain']}`)}. Deploy to start receiving mail.`);

  return;
}

/**
 * CLI - Menu - Interactive - Modify Alias Flow.
 *
 * Lets the user pick an alias and enable, disable, change the
 * expiry of, or remove it.
 *
 * @param {Cli_Menu_Interactive_ModifyAliasFlow_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_ModifyAliasFlow_Returns}
 *
 * @since 0.0.1
 */
async function modifyAliasFlow(configPath: Cli_Menu_Interactive_ModifyAliasFlow_ConfigPath): Cli_Menu_Interactive_ModifyAliasFlow_Returns {
  const aliases: Cli_Menu_Interactive_ModifyAliasFlow_Aliases = listAliases(configPath);
  const now: Cli_Menu_Interactive_ModifyAliasFlow_Now = Date.now();

  if (aliases.length === 0) {
    Logger.info('No aliases yet.');

    return;
  }

  const response: Cli_Menu_Interactive_ModifyAliasFlow_Response = await prompts([
    {
      type: 'autocomplete',
      name: 'address',
      message: 'Alias:',
      choices: aliases.map((alias) => ({
        title: `${alias['address']} [${describeAliasStatus(alias, now)}]`,
        value: alias['address'],
      })),
    },
    {
      type: 'select',
      name: 'action',
      message: 'Action:',
      choices: [
        {
          title: 'Enable',
          value: 'enable',
        },
        {
          title: 'Disable',
          value: 'disable',
        },
        {
          title: 'Change expiry',
          value: 'expiry',
        },
        {
          title: 'Remove',
          value: 'remove',
        },
      ],
    },
    {
      type: (previous) => (previous === 'expiry') ? 'text' : null,
      name: 'expires',
      message: 'Expires (e.g. 30m, 7d, 2026-12-31, or "never"):',
      initial: 'never',
    },
    {
      type: (_previous, values) => (values['action'] === 'remove') ? 'confirm' : null,
      name: 'confirmed',
      message: 'Remove this alias?',
      initial: false,
    },
  ]);

  if (response['address'] === undefined) {
    return;
  }

  const action: Cli_Menu_Interactive_ModifyAliasFlow_Action = response['action'];

  switch (action) {
    case 'enable':
    case 'disable': {
      setAliasEnabled(configPath, response['address'], action === 'enable');

      Logger.info(`Alias "${response['address']}" ${action}d. Deploy to apply.`);
      break;
    }

    case 'expiry': {
      if (response['expires'] === undefined) {
        break;
      }

      const expiresAt: Cli_Menu_Interactive_ModifyAliasFlow_ExpiresAt = setAliasExpiry(configPath, response['address'], response['expires']);

      Logger.info(`Alias "${response['address']}" now expires: ${expiresAt ?? 'never'}. Deploy to apply.`);
      break;
    }

    case 'remove': {
      if (response['confirmed'] === true) {
        removeAlias(configPath, response['address']);

        Logger.info(`Alias "${response['address']}" removed. Deploy to apply.`);
      }
      break;
    }

    default: {
      break;
    }
  }

  return;
}

/**
 * CLI - Menu - Interactive - Destination Menu.
 *
 * Presents the destination sub-menu for adding, listing, and
 * removing the real inboxes that aliases forward to.
 *
 * @param {Cli_Menu_Interactive_DestinationMenu_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_DestinationMenu_Returns}
 *
 * @since 0.0.1
 */
async function destinationMenu(configPath: Cli_Menu_Interactive_DestinationMenu_ConfigPath): Cli_Menu_Interactive_DestinationMenu_Returns {
  let inMenu: Cli_Menu_Interactive_DestinationMenu_InMenu = true;

  while (inMenu === true) {
    const response: Cli_Menu_Interactive_DestinationMenu_Response = await prompts({
      type: 'select',
      name: 'action',
      message: chalk.cyan('Manage Destinations'),
      choices: [
        {
          title: 'Add',
          value: 'add',
        },
        {
          title: 'List',
          value: 'list',
        },
        {
          title: 'Remove',
          value: 'remove',
        },
        {
          title: 'Back',
          value: 'back',
        },
      ],
    });
    const action: Cli_Menu_Interactive_DestinationMenu_Action = response['action'];

    if (action === undefined || action === 'back') {
      inMenu = false;

      break;
    }

    try {
      const destinations: Cli_Menu_Interactive_DestinationMenu_Destinations = listDestinations(configPath);

      if (action === 'list') {
        if (destinations.length === 0) {
          Logger.info('No destinations yet.');
        }

        for (const destination of destinations) {
          process.stdout.write(`  ${chalk.cyan(destination['name'])}  ${destination['email']}\n`);
        }
      } else if (action === 'add') {
        const addResponse: Cli_Menu_Interactive_DestinationMenu_AddResponse = await prompts([
          {
            type: 'text',
            name: 'name',
            message: 'Short name (e.g. personal):',
            validate: (value) => value.trim().length > 0 || 'Name is required',
          },
          {
            type: 'text',
            name: 'email',
            message: 'Real inbox address:',
            validate: (value) => value.trim().length > 0 || 'Email is required',
          },
        ]);

        if (addResponse['name'] !== undefined && addResponse['email'] !== undefined) {
          addDestination(configPath, {
            name: addResponse['name'].trim(),
            email: addResponse['email'],
          });

          Logger.info(`Destination "${addResponse['name']}" added. Cloudflare will email it a verification link on the next deploy.`);
        }
      } else if (action === 'remove' && destinations.length > 0) {
        const removeResponse: Cli_Menu_Interactive_DestinationMenu_RemoveResponse = await prompts({
          type: 'select',
          name: 'name',
          message: 'Destination to remove:',
          choices: destinations.map((destination) => ({
            title: `${destination['name']} (${destination['email']})`,
            value: destination['name'],
          })),
        });

        if (removeResponse['name'] !== undefined) {
          removeDestination(configPath, removeResponse['name']);

          Logger.info(`Destination "${removeResponse['name']}" removed.`);
        }
      }
    } catch (error) {
      const errorMessage: Cli_Menu_Interactive_DestinationMenu_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      Logger.error(`Error: ${errorMessage}`);
    }
  }

  return;
}

/**
 * CLI - Menu - Interactive - Notifier Menu.
 *
 * Presents the notifier sub-menu for adding, listing, and removing the
 * ntfy topics and Reverse Proxy for ntfy contexts that receive notices.
 *
 * @param {Cli_Menu_Interactive_NotifierMenu_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_NotifierMenu_Returns}
 *
 * @since 0.0.1
 */
async function notifierMenu(configPath: Cli_Menu_Interactive_NotifierMenu_ConfigPath): Cli_Menu_Interactive_NotifierMenu_Returns {
  let inMenu: Cli_Menu_Interactive_NotifierMenu_InMenu = true;

  while (inMenu === true) {
    const response: Cli_Menu_Interactive_NotifierMenu_Response = await prompts({
      type: 'select',
      name: 'action',
      message: chalk.cyan('Manage Notifiers'),
      choices: [
        {
          title: 'Add ntfy topic',
          value: 'ntfy',
        },
        {
          title: 'Add Reverse Proxy for ntfy context',
          value: 'ntfy-reverse-proxy',
        },
        {
          title: 'List',
          value: 'list',
        },
        {
          title: 'Remove',
          value: 'remove',
        },
        {
          title: 'Back',
          value: 'back',
        },
      ],
    });
    const action: Cli_Menu_Interactive_NotifierMenu_Action = response['action'];

    if (action === undefined || action === 'back') {
      inMenu = false;

      break;
    }

    try {
      const notifiers: Cli_Menu_Interactive_NotifierMenu_Notifiers = listNotifiers(configPath);

      if (action === 'list') {
        if (notifiers.length === 0) {
          Logger.info('No notifiers yet.');
        }

        for (const notifier of notifiers) {
          const target: Cli_Menu_Interactive_NotifierMenu_Target = (notifier['type'] === 'ntfy') ? `${notifier['server']} (topic ${notifier['topic']})` : notifier['url'];

          process.stdout.write(`  ${chalk.cyan(notifier['name'])}  ${notifier['type']}  ${target}\n`);
        }
      } else if (action === 'ntfy') {
        const ntfyResponse: Cli_Menu_Interactive_NotifierMenu_NtfyResponse = await prompts([
          {
            type: 'text',
            name: 'name',
            message: 'Name:',
          },
          {
            type: 'text',
            name: 'server',
            message: 'ntfy server URL (https://...):',
          },
          {
            type: 'text',
            name: 'topic',
            message: 'Topic:',
          },
          {
            type: 'password',
            name: 'token',
            message: 'Access token (tk_...):',
          },
        ]);

        if (ntfyResponse['token'] !== undefined) {
          addNotifier(configPath, {
            type: 'ntfy',
            name: ntfyResponse['name'].trim(),
            server: ntfyResponse['server'].trim(),
            topic: ntfyResponse['topic'].trim(),
            token: ntfyResponse['token'].trim(),
          });

          Logger.info(`Notifier "${ntfyResponse['name']}" added. Deploy to apply.`);
        }
      } else if (action === 'ntfy-reverse-proxy') {
        const proxyResponse: Cli_Menu_Interactive_NotifierMenu_ProxyResponse = await prompts([
          {
            type: 'text',
            name: 'name',
            message: 'Name:',
          },
          {
            type: 'text',
            name: 'url',
            message: 'Context URL (https://...):',
          },
          {
            type: 'password',
            name: 'token',
            message: 'Context token (leave empty if none):',
          },
        ]);

        if (proxyResponse['token'] !== undefined) {
          addNotifier(configPath, {
            type: 'ntfy-reverse-proxy',
            name: proxyResponse['name'].trim(),
            url: proxyResponse['url'].trim(),
            ...((proxyResponse['token'].trim() !== '') ? { token: proxyResponse['token'].trim() } : {}),
          });

          Logger.info(`Notifier "${proxyResponse['name']}" added. Deploy to apply.`);
        }
      } else if (action === 'remove' && notifiers.length > 0) {
        const removeResponse: Cli_Menu_Interactive_NotifierMenu_RemoveResponse = await prompts({
          type: 'select',
          name: 'name',
          message: 'Notifier to remove:',
          choices: notifiers.map((notifier) => ({
            title: `${notifier['name']} (${notifier['type']})`,
            value: notifier['name'],
          })),
        });

        if (removeResponse['name'] !== undefined) {
          removeNotifier(configPath, removeResponse['name']);

          Logger.info(`Notifier "${removeResponse['name']}" removed. Deploy to apply.`);
        }
      }
    } catch (error) {
      const errorMessage: Cli_Menu_Interactive_NotifierMenu_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      Logger.error(`Error: ${errorMessage}`);
    }
  }

  return;
}

/**
 * CLI - Menu - Interactive - Settings Flow.
 *
 * Prompts for each global setting with the current value as the
 * default and saves the result to the configuration file.
 *
 * @param {Cli_Menu_Interactive_SettingsFlow_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_SettingsFlow_Returns}
 *
 * @since 0.0.1
 */
async function settingsFlow(configPath: Cli_Menu_Interactive_SettingsFlow_ConfigPath): Cli_Menu_Interactive_SettingsFlow_Returns {
  const currentSettings: Cli_Menu_Interactive_SettingsFlow_CurrentSettings = getSettings(configPath);
  const response: Cli_Menu_Interactive_SettingsFlow_Response = await prompts([
    {
      type: 'text',
      name: 'worker_name',
      message: 'Worker name:',
      initial: currentSettings['worker_name'],
    },
    {
      type: 'text',
      name: 'base_domain',
      message: 'Email domain (the part after @):',
      initial: currentSettings['base_domain'],
    },
    {
      type: 'select',
      name: 'unknown_alias_action',
      message: 'Mail to addresses that are not aliases:',
      choices: [
        {
          title: 'Reject (sender gets a bounce)',
          value: 'reject',
        },
        {
          title: 'Drop silently',
          value: 'drop',
        },
        {
          title: 'Forward to a default destination',
          value: 'forward',
        },
      ],
      initial: [
        'reject',
        'drop',
        'forward',
      ].indexOf(currentSettings['unknown_alias_action']),
    },
    {
      type: (previous) => (previous === 'forward') ? 'select' : null,
      name: 'default_destination',
      message: 'Default destination:',
      choices: listDestinations(configPath).map((destination) => ({
        title: `${destination['name']} (${destination['email']})`,
        value: destination['name'],
      })),
    },
    {
      type: 'confirm',
      name: 'subaddressing',
      message: 'Treat "alias+tag@" as "alias@"?',
      initial: currentSettings['subaddressing'],
    },
    {
      type: 'confirm',
      name: 'add_alias_headers',
      message: 'Add X-Mailmask-Alias headers to forwarded mail?',
      initial: currentSettings['add_alias_headers'],
    },
  ]);

  // Prompts stops early on cancel, leaving the last answer unset.
  if (response['add_alias_headers'] === undefined) {
    return;
  }

  try {
    updateSettings(configPath, {
      worker_name: response['worker_name'].trim(),
      base_domain: response['base_domain'].trim().toLowerCase(),
      unknown_alias_action: response['unknown_alias_action'],
      default_destination: (response['unknown_alias_action'] === 'forward') ? response['default_destination'] : undefined,
      subaddressing: response['subaddressing'],
      add_alias_headers: response['add_alias_headers'],
    });

    Logger.info('Settings updated.');
  } catch (error) {
    const errorMessage: Cli_Menu_Interactive_SettingsFlow_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

    Logger.error(`Error: ${errorMessage}`);
  }

  return;
}

/**
 * CLI - Menu - Interactive - Print Aliases.
 *
 * Prints every alias with its full address, destination,
 * label, and current status.
 *
 * @param {Cli_Menu_Interactive_PrintAliases_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_PrintAliases_Returns}
 *
 * @since 0.0.1
 */
function printAliases(configPath: Cli_Menu_Interactive_PrintAliases_ConfigPath): Cli_Menu_Interactive_PrintAliases_Returns {
  const aliases: Cli_Menu_Interactive_PrintAliases_Aliases = listAliases(configPath);
  const settings: Cli_Menu_Interactive_PrintAliases_Settings = getSettings(configPath);
  const now: Cli_Menu_Interactive_PrintAliases_Now = Date.now();

  if (aliases.length === 0) {
    Logger.info('No aliases yet.');

    return;
  }

  for (const alias of aliases) {
    const status: Cli_Menu_Interactive_PrintAliases_Status = describeAliasStatus(alias, now);
    const labelSuffix: Cli_Menu_Interactive_PrintAliases_LabelSuffix = (alias['label'] !== undefined) ? chalk.dim(`  ${alias['label']}`) : '';

    process.stdout.write(`  ${chalk.cyan(`${alias['address']}@${settings['base_domain']}`)} -> ${alias['destination']} [${status}]${labelSuffix}\n`);
  }

  return;
}

/**
 * CLI - Menu - Interactive - Split List.
 *
 * Splits a comma-separated prompt answer into trimmed entries,
 * returning undefined when nothing was entered.
 *
 * @param {Cli_Menu_Interactive_SplitList_Value} value - Value.
 *
 * @returns {Cli_Menu_Interactive_SplitList_Returns}
 *
 * @since 0.0.1
 */
function splitList(value: Cli_Menu_Interactive_SplitList_Value): Cli_Menu_Interactive_SplitList_Returns {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  return value.split(',').map((entry) => entry.trim()).filter((entry) => entry !== '');
}

export {
  interactiveMenu,
};
