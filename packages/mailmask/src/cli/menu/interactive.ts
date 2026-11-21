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
import {
  addPhoneAlias,
  describePhoneAliasStatus,
  listPhoneAliases,
  releasePhoneAlias,
  removePhoneAlias,
  searchPhoneNumbers,
  setPhoneAliasEnabled,
  setPhoneAliasExpiry,
} from '../commands/phone-alias.js';
import {
  addPhoneProvider,
  checkPhoneProvider,
  listPhoneProviders,
  removePhoneProvider,
} from '../commands/phone-provider.js';
import { getSettings, updateSettings } from '../commands/settings.js';

import type {
  Cli_Menu_Interactive_AddPhoneProviderFlow_ConfigPath,
  Cli_Menu_Interactive_AddPhoneProviderFlow_DestinationCountries,
  Cli_Menu_Interactive_AddPhoneProviderFlow_ErrorMessage,
  Cli_Menu_Interactive_AddPhoneProviderFlow_Name,
  Cli_Menu_Interactive_AddPhoneProviderFlow_Response,
  Cli_Menu_Interactive_AddPhoneProviderFlow_Returns,
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
  Cli_Menu_Interactive_CreatePhoneAliasFlow_AvailableNumbers,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_ConfigPath,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_DetailsResponse,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_ExistingResponse,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_Number,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneDestinations,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneProviders,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneResult,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_PickResponse,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_Returns,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_SearchResponse,
  Cli_Menu_Interactive_CreatePhoneAliasFlow_SourceResponse,
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
  Cli_Menu_Interactive_ModifyPhoneAliasFlow_Action,
  Cli_Menu_Interactive_ModifyPhoneAliasFlow_ConfigPath,
  Cli_Menu_Interactive_ModifyPhoneAliasFlow_ExpiresAt,
  Cli_Menu_Interactive_ModifyPhoneAliasFlow_Now,
  Cli_Menu_Interactive_ModifyPhoneAliasFlow_PhoneAliases,
  Cli_Menu_Interactive_ModifyPhoneAliasFlow_Response,
  Cli_Menu_Interactive_ModifyPhoneAliasFlow_Returns,
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
  Cli_Menu_Interactive_PhoneAliasMenu_Action,
  Cli_Menu_Interactive_PhoneAliasMenu_ConfigPath,
  Cli_Menu_Interactive_PhoneAliasMenu_ErrorMessage,
  Cli_Menu_Interactive_PhoneAliasMenu_InMenu,
  Cli_Menu_Interactive_PhoneAliasMenu_Response,
  Cli_Menu_Interactive_PhoneAliasMenu_Returns,
  Cli_Menu_Interactive_PhoneProviderMenu_Action,
  Cli_Menu_Interactive_PhoneProviderMenu_ConfigPath,
  Cli_Menu_Interactive_PhoneProviderMenu_ErrorMessage,
  Cli_Menu_Interactive_PhoneProviderMenu_InMenu,
  Cli_Menu_Interactive_PhoneProviderMenu_PhoneProviders,
  Cli_Menu_Interactive_PhoneProviderMenu_RemoveResponse,
  Cli_Menu_Interactive_PhoneProviderMenu_Response,
  Cli_Menu_Interactive_PhoneProviderMenu_Returns,
  Cli_Menu_Interactive_PrintAliases_Aliases,
  Cli_Menu_Interactive_PrintAliases_ConfigPath,
  Cli_Menu_Interactive_PrintAliases_LabelSuffix,
  Cli_Menu_Interactive_PrintAliases_Now,
  Cli_Menu_Interactive_PrintAliases_Returns,
  Cli_Menu_Interactive_PrintAliases_Settings,
  Cli_Menu_Interactive_PrintAliases_Status,
  Cli_Menu_Interactive_PrintPhoneAliases_ConfigPath,
  Cli_Menu_Interactive_PrintPhoneAliases_LabelSuffix,
  Cli_Menu_Interactive_PrintPhoneAliases_Now,
  Cli_Menu_Interactive_PrintPhoneAliases_PhoneAliases,
  Cli_Menu_Interactive_PrintPhoneAliases_Returns,
  Cli_Menu_Interactive_PrintPhoneAliases_Status,
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
 * Orchestrates the top-level interactive CLI menu loop and dispatches selections to
 * the alias, phone alias, phone provider, destination, notifier, and settings flows.
 *
 * @param {Cli_Menu_Interactive_InteractiveMenu_ConfigDirs} configDirs - Config dirs.
 *
 * @returns {Cli_Menu_Interactive_InteractiveMenu_Returns}
 *
 * @since 1.2.0
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
          title: 'Manage Phone Aliases',
          value: 'phone-aliases',
        },
        {
          title: 'Manage Phone Providers',
          value: 'phone-providers',
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
      } else if (action === 'phone-aliases') {
        await phoneAliasMenu(configPath);
      } else if (action === 'phone-providers') {
        await phoneProviderMenu(configPath);
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
 * CLI - Menu - Interactive - Phone Alias Menu.
 *
 * Presents the phone alias sub-menu in a loop for adding, listing, enabling,
 * disabling, re-dating, removing, and releasing phone aliases.
 *
 * @param {Cli_Menu_Interactive_PhoneAliasMenu_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_PhoneAliasMenu_Returns}
 *
 * @since 1.2.0
 */
async function phoneAliasMenu(configPath: Cli_Menu_Interactive_PhoneAliasMenu_ConfigPath): Cli_Menu_Interactive_PhoneAliasMenu_Returns {
  let inMenu: Cli_Menu_Interactive_PhoneAliasMenu_InMenu = true;

  while (inMenu === true) {
    const response: Cli_Menu_Interactive_PhoneAliasMenu_Response = await prompts({
      type: 'select',
      name: 'action',
      message: chalk.cyan('Manage Phone Aliases'),
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
          title: 'Modify',
          value: 'modify',
        },
        {
          title: 'Back',
          value: 'back',
        },
      ],
    });
    const action: Cli_Menu_Interactive_PhoneAliasMenu_Action = response['action'];

    if (action === undefined || action === 'back') {
      inMenu = false;

      break;
    }

    try {
      if (action === 'add') {
        await createPhoneAliasFlow(configPath);
      } else if (action === 'list') {
        printPhoneAliases(configPath);
      } else if (action === 'modify') {
        await modifyPhoneAliasFlow(configPath);
      }
    } catch (error) {
      const errorMessage: Cli_Menu_Interactive_PhoneAliasMenu_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      Logger.error(`Error: ${errorMessage}`);
    }
  }

  return;
}

/**
 * CLI - Menu - Interactive - Create Phone Alias Flow.
 *
 * Walks through a new phone alias: provider, destination phone, and a number
 * the account has or one found by a search. A purchase is confirmed last.
 *
 * @param {Cli_Menu_Interactive_CreatePhoneAliasFlow_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_CreatePhoneAliasFlow_Returns}
 *
 * @since 1.2.0
 */
async function createPhoneAliasFlow(configPath: Cli_Menu_Interactive_CreatePhoneAliasFlow_ConfigPath): Cli_Menu_Interactive_CreatePhoneAliasFlow_Returns {
  const phoneProviders: Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneProviders = listPhoneProviders(configPath);
  const phoneDestinations: Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneDestinations = listDestinations(configPath).filter((destination) => destination['phone'] !== undefined);

  if (phoneProviders.length === 0) {
    Logger.warn('Add a phone provider first. Phone aliases need a Telnyx or Plivo account.');

    return;
  }

  if (phoneDestinations.length === 0) {
    Logger.warn('Give a destination a phone number first. Phone aliases forward texts to it.');

    return;
  }

  const sourceResponse: Cli_Menu_Interactive_CreatePhoneAliasFlow_SourceResponse = await prompts([
    {
      type: 'select',
      name: 'provider',
      message: 'Phone provider:',
      choices: phoneProviders.map((phoneProvider) => ({
        title: `${phoneProvider['name']} (${phoneProvider['type']})`,
        value: phoneProvider['name'],
      })),
    },
    {
      type: 'select',
      name: 'destination',
      message: 'Forward texts to:',
      choices: phoneDestinations.map((destination) => ({
        title: `${destination['name']} (${destination['phone'] ?? ''})`,
        value: destination['name'],
      })),
    },
    {
      type: 'select',
      name: 'source',
      message: 'Number:',
      choices: [
        {
          title: 'Search for a new number to buy',
          value: 'buy',
        },
        {
          title: 'Use a number the account already has',
          value: 'existing',
        },
      ],
    },
  ]);

  if (sourceResponse['source'] === undefined) {
    return;
  }

  let number: Cli_Menu_Interactive_CreatePhoneAliasFlow_Number = undefined;

  if (sourceResponse['source'] === 'existing') {
    const existingResponse: Cli_Menu_Interactive_CreatePhoneAliasFlow_ExistingResponse = await prompts({
      type: 'text',
      name: 'number',
      message: 'Number on the account (e.g. +15550100100):',
      validate: (value) => value.trim().length > 0 || 'Number is required',
    });

    number = existingResponse['number'];
  } else {
    const searchResponse: Cli_Menu_Interactive_CreatePhoneAliasFlow_SearchResponse = await prompts([
      {
        type: 'text',
        name: 'country',
        message: 'Two-letter country code:',
        initial: 'US',
      },
      {
        type: 'text',
        name: 'areaCode',
        message: 'Area code (optional):',
      },
    ]);

    if (searchResponse['areaCode'] === undefined) {
      return;
    }

    const availableNumbers: Cli_Menu_Interactive_CreatePhoneAliasFlow_AvailableNumbers = await searchPhoneNumbers(configPath, sourceResponse['provider'], {
      countryCode: String(searchResponse['country']).trim().toUpperCase(),
      areaCode: (String(searchResponse['areaCode']).trim() !== '') ? String(searchResponse['areaCode']).trim() : undefined,
      limit: 10,
    });

    if (availableNumbers.length === 0) {
      Logger.info('No numbers found. Try another area code or country.');

      return;
    }

    const pickResponse: Cli_Menu_Interactive_CreatePhoneAliasFlow_PickResponse = await prompts({
      type: 'select',
      name: 'number',
      message: 'Number to buy:',
      choices: availableNumbers.map((availableNumber) => ({
        title: `${availableNumber['number']} (${availableNumber['features'].join(', ')})`,
        value: availableNumber['number'],
      })),
    });

    number = pickResponse['number'];
  }

  if (number === undefined) {
    return;
  }

  const detailsResponse: Cli_Menu_Interactive_CreatePhoneAliasFlow_DetailsResponse = await prompts([
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
      message: 'Only accept from (comma-separated, optional, e.g. +1555*, ACME):',
    },
    {
      type: (sourceResponse['source'] === 'buy') ? 'confirm' : null,
      name: 'confirmed',
      message: `Buy ${number} from "${sourceResponse['provider']}"? This charges your provider account.`,
      initial: false,
    },
  ]);

  // Prompts stops early on cancel, leaving the last answer unset.
  if (detailsResponse['allowedSenders'] === undefined) {
    return;
  }

  if (sourceResponse['source'] === 'buy' && detailsResponse['confirmed'] !== true) {
    Logger.info('Nothing was bought.');

    return;
  }

  const phoneResult: Cli_Menu_Interactive_CreatePhoneAliasFlow_PhoneResult = await addPhoneAlias(configPath, {
    number,
    buy: sourceResponse['source'] === 'buy',
    provider: sourceResponse['provider'],
    destination: sourceResponse['destination'],
    label: (typeof detailsResponse['label'] === 'string' && detailsResponse['label'].trim() !== '') ? detailsResponse['label'].trim() : undefined,
    expires: detailsResponse['expires'],
    allowedSenders: splitList(detailsResponse['allowedSenders']),
    blockedSenders: undefined,
  });

  Logger.info(`Created phone alias ${chalk.green(phoneResult['phoneAlias']['number'])} (${phoneResult['status']}). Deploy to start receiving texts.`);

  return;
}

/**
 * CLI - Menu - Interactive - Modify Phone Alias Flow.
 *
 * Lets the user pick a phone alias and enable, disable, change the expiry of,
 * remove, or release it. Releasing asks again because it cannot be undone.
 *
 * @param {Cli_Menu_Interactive_ModifyPhoneAliasFlow_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_ModifyPhoneAliasFlow_Returns}
 *
 * @since 1.2.0
 */
async function modifyPhoneAliasFlow(configPath: Cli_Menu_Interactive_ModifyPhoneAliasFlow_ConfigPath): Cli_Menu_Interactive_ModifyPhoneAliasFlow_Returns {
  const phoneAliases: Cli_Menu_Interactive_ModifyPhoneAliasFlow_PhoneAliases = listPhoneAliases(configPath);
  const now: Cli_Menu_Interactive_ModifyPhoneAliasFlow_Now = Date.now();

  if (phoneAliases.length === 0) {
    Logger.info('No phone aliases yet.');

    return;
  }

  const response: Cli_Menu_Interactive_ModifyPhoneAliasFlow_Response = await prompts([
    {
      type: 'autocomplete',
      name: 'number',
      message: 'Phone alias:',
      choices: phoneAliases.map((phoneAlias) => ({
        title: `${phoneAlias['number']} [${describePhoneAliasStatus(phoneAlias, now)}]`,
        value: phoneAlias['number'],
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
          title: 'Remove (keep the number)',
          value: 'remove',
        },
        {
          title: 'Release (give the number back)',
          value: 'release',
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
      type: (_previous, values) => (values['action'] === 'remove' || values['action'] === 'release') ? 'confirm' : null,
      name: 'confirmed',
      message: 'Are you sure? Releasing a number cannot be undone.',
      initial: false,
    },
  ]);

  if (response['number'] === undefined) {
    return;
  }

  const action: Cli_Menu_Interactive_ModifyPhoneAliasFlow_Action = response['action'];

  switch (action) {
    case 'enable':
    case 'disable': {
      setPhoneAliasEnabled(configPath, response['number'], action === 'enable');

      Logger.info(`Phone alias "${response['number']}" ${action}d. Deploy to apply.`);
      break;
    }

    case 'expiry': {
      if (response['expires'] === undefined) {
        break;
      }

      const expiresAt: Cli_Menu_Interactive_ModifyPhoneAliasFlow_ExpiresAt = setPhoneAliasExpiry(configPath, response['number'], response['expires']);

      Logger.info(`Phone alias "${response['number']}" now expires: ${expiresAt ?? 'never'}. Deploy to apply.`);
      break;
    }

    case 'remove': {
      if (response['confirmed'] === true) {
        removePhoneAlias(configPath, response['number']);

        Logger.info(`Phone alias "${response['number']}" removed. The number is still on the provider account. Deploy to apply.`);
      }
      break;
    }

    case 'release': {
      if (response['confirmed'] === true) {
        await releasePhoneAlias(configPath, response['number']);

        Logger.info(`Released "${response['number']}" and removed its phone alias. Deploy to apply.`);
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
 * CLI - Menu - Interactive - Phone Provider Menu.
 *
 * Presents the phone provider sub-menu for adding, listing, and removing the
 * Telnyx and Plivo accounts that phone alias numbers belong to.
 *
 * @param {Cli_Menu_Interactive_PhoneProviderMenu_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_PhoneProviderMenu_Returns}
 *
 * @since 1.2.0
 */
async function phoneProviderMenu(configPath: Cli_Menu_Interactive_PhoneProviderMenu_ConfigPath): Cli_Menu_Interactive_PhoneProviderMenu_Returns {
  let inMenu: Cli_Menu_Interactive_PhoneProviderMenu_InMenu = true;

  while (inMenu === true) {
    const response: Cli_Menu_Interactive_PhoneProviderMenu_Response = await prompts({
      type: 'select',
      name: 'action',
      message: chalk.cyan('Manage Phone Providers'),
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
    const action: Cli_Menu_Interactive_PhoneProviderMenu_Action = response['action'];

    if (action === undefined || action === 'back') {
      inMenu = false;

      break;
    }

    try {
      const phoneProviders: Cli_Menu_Interactive_PhoneProviderMenu_PhoneProviders = listPhoneProviders(configPath);

      if (action === 'add') {
        await addPhoneProviderFlow(configPath);
      } else if (action === 'list') {
        if (phoneProviders.length === 0) {
          Logger.info('No phone providers yet.');
        }

        for (const phoneProvider of phoneProviders) {
          process.stdout.write(`  ${chalk.cyan(phoneProvider['name'])}  ${phoneProvider['type']}\n`);
        }
      } else if (action === 'remove' && phoneProviders.length > 0) {
        const removeResponse: Cli_Menu_Interactive_PhoneProviderMenu_RemoveResponse = await prompts({
          type: 'select',
          name: 'name',
          message: 'Phone provider to remove:',
          choices: phoneProviders.map((phoneProvider) => ({
            title: `${phoneProvider['name']} (${phoneProvider['type']})`,
            value: phoneProvider['name'],
          })),
        });

        if (removeResponse['name'] !== undefined) {
          removePhoneProvider(configPath, removeResponse['name']);

          Logger.info(`Phone provider "${removeResponse['name']}" removed.`);
        }
      }
    } catch (error) {
      const errorMessage: Cli_Menu_Interactive_PhoneProviderMenu_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      Logger.error(`Error: ${errorMessage}`);
    }
  }

  return;
}

/**
 * CLI - Menu - Interactive - Add Phone Provider Flow.
 *
 * Asks for a Telnyx or Plivo account's credentials, saves them, and checks them
 * with the provider so a wrong key shows up right away instead of at deploy.
 *
 * @param {Cli_Menu_Interactive_AddPhoneProviderFlow_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_AddPhoneProviderFlow_Returns}
 *
 * @since 1.2.0
 */
async function addPhoneProviderFlow(configPath: Cli_Menu_Interactive_AddPhoneProviderFlow_ConfigPath): Cli_Menu_Interactive_AddPhoneProviderFlow_Returns {
  const response: Cli_Menu_Interactive_AddPhoneProviderFlow_Response = await prompts([
    {
      type: 'select',
      name: 'type',
      message: 'Provider:',
      choices: [
        {
          title: 'Telnyx',
          value: 'telnyx',
        },
        {
          title: 'Plivo',
          value: 'plivo',
        },
      ],
    },
    {
      type: 'text',
      name: 'name',
      message: 'Short name (e.g. telnyx):',
      initial: (previous) => String(previous),
      validate: (value) => value.trim().length > 0 || 'Name is required',
    },
    {
      type: (_previous, values) => (values['type'] === 'telnyx') ? 'password' : null,
      name: 'apiKey',
      message: 'API key (Keys & Credentials):',
    },
    {
      type: (_previous, values) => (values['type'] === 'telnyx') ? 'text' : null,
      name: 'publicKey',
      message: 'Public key for webhook signatures (base64):',
    },
    {
      type: (_previous, values) => (values['type'] === 'telnyx') ? 'text' : null,
      name: 'countries',
      message: 'Countries the numbers may text (comma-separated codes, empty for every country):',
    },
    {
      type: (_previous, values) => (values['type'] === 'plivo') ? 'text' : null,
      name: 'authId',
      message: 'Auth ID:',
    },
    {
      type: (_previous, values) => (values['type'] === 'plivo') ? 'password' : null,
      name: 'authToken',
      message: 'Auth token:',
    },
  ]);

  // Prompts stops early on cancel, leaving the last answer unset.
  if (response['countries'] === undefined && response['authToken'] === undefined) {
    return;
  }

  const name: Cli_Menu_Interactive_AddPhoneProviderFlow_Name = String(response['name']).trim();

  if (response['type'] === 'telnyx') {
    const destinationCountries: Cli_Menu_Interactive_AddPhoneProviderFlow_DestinationCountries = splitList(response['countries']);

    addPhoneProvider(configPath, {
      type: 'telnyx',
      name,
      api_key: String(response['apiKey']).trim(),
      public_key: String(response['publicKey']).trim(),
      ...((destinationCountries !== undefined) ? { destination_countries: destinationCountries.map((destinationCountry) => destinationCountry.toUpperCase()) } : {}),
    });
  } else {
    addPhoneProvider(configPath, {
      type: 'plivo',
      name,
      auth_id: String(response['authId']).trim(),
      auth_token: String(response['authToken']).trim(),
    });
  }

  Logger.info(`Phone provider "${name}" added. Checking the credentials...`);

  try {
    await checkPhoneProvider(configPath, name);

    Logger.info(`Phone provider "${name}" accepted the credentials.`);
  } catch (error) {
    const errorMessage: Cli_Menu_Interactive_AddPhoneProviderFlow_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

    Logger.warn(`The provider was saved, but the check failed: ${errorMessage}`);
  }

  return;
}

/**
 * CLI - Menu - Interactive - Destination Menu.
 *
 * Presents the destination sub-menu for adding, listing, and removing the
 * real inboxes, and optional real phones, that aliases forward to.
 *
 * @param {Cli_Menu_Interactive_DestinationMenu_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_DestinationMenu_Returns}
 *
 * @since 1.2.0
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
          process.stdout.write(`  ${chalk.cyan(destination['name'])}  ${destination['email']}  ${destination['phone'] ?? ''}\n`);
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
          {
            type: 'text',
            name: 'phone',
            message: 'Real phone number for phone aliases (optional, e.g. +15550100199):',
          },
        ]);

        if (
          addResponse['name'] !== undefined
          && addResponse['email'] !== undefined
          && addResponse['phone'] !== undefined
        ) {
          addDestination(configPath, {
            name: addResponse['name'].trim(),
            email: addResponse['email'],
            ...((addResponse['phone'].trim() !== '') ? { phone: addResponse['phone'].trim() } : {}),
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

          Logger.info(`Destination "${removeResponse['name']}" removed. Run "mm deploy" to apply.`);
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
 * Presents the notifier sub-menu for listing and removing all services and
 * adding the original ntfy integrations. Other services use direct commands.
 *
 * @param {Cli_Menu_Interactive_NotifierMenu_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_NotifierMenu_Returns}
 *
 * @since 1.0.0
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
          process.stdout.write(`  ${chalk.cyan(notifier['name'])}  ${notifier['type']}\n`);
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
 * @since 1.2.0
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
    {
      type: 'confirm',
      name: 'send_from_aliases',
      message: 'Send and reply from aliases?',
      initial: currentSettings['send_from_aliases'] ?? false,
    },
  ]);

  // Prompts stops early on cancel, leaving the last answer unset.
  if (response['send_from_aliases'] === undefined) {
    return;
  }

  try {
    updateSettings(configPath, {
      worker_name: response['worker_name'].trim(),
      base_domain: response['base_domain'].trim().toLowerCase(),
      subaddressing: response['subaddressing'],
      add_alias_headers: response['add_alias_headers'],
      send_from_aliases: response['send_from_aliases'],
    });

    Logger.info('Settings updated. Run "mm deploy" to apply.');
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
 * CLI - Menu - Interactive - Print Phone Aliases.
 *
 * Prints every phone alias with its number, destination, label, and current
 * status.
 *
 * @param {Cli_Menu_Interactive_PrintPhoneAliases_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Menu_Interactive_PrintPhoneAliases_Returns}
 *
 * @since 1.2.0
 */
function printPhoneAliases(configPath: Cli_Menu_Interactive_PrintPhoneAliases_ConfigPath): Cli_Menu_Interactive_PrintPhoneAliases_Returns {
  const phoneAliases: Cli_Menu_Interactive_PrintPhoneAliases_PhoneAliases = listPhoneAliases(configPath);
  const now: Cli_Menu_Interactive_PrintPhoneAliases_Now = Date.now();

  if (phoneAliases.length === 0) {
    Logger.info('No phone aliases yet. Add one with "mm phone add".');

    return;
  }

  for (const phoneAlias of phoneAliases) {
    const status: Cli_Menu_Interactive_PrintPhoneAliases_Status = describePhoneAliasStatus(phoneAlias, now);
    const labelSuffix: Cli_Menu_Interactive_PrintPhoneAliases_LabelSuffix = (phoneAlias['label'] !== undefined) ? chalk.dim(`  ${phoneAlias['label']}`) : '';

    process.stdout.write(`  ${chalk.cyan(phoneAlias['number'])} -> ${phoneAlias['destination']} [${status}]${labelSuffix}\n`);
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
  destinationMenu,
  interactiveMenu,
  settingsFlow,
};
