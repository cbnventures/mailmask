#!/usr/bin/env node
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { Bootstrap, Logger } from '@cbnventures/nova/toolkit';
import { Command, Option } from 'commander';

import { APP_NAME } from '../lib/item.js';
import { getConfigSamplePath, getPackageVersion } from '../lib/package-runtime.js';
import {
  addAlias,
  describeAliasStatus,
  listAliases,
  removeAlias,
  setAliasEnabled,
  setAliasExpiry,
} from './commands/alias.js';
import { deploy } from './commands/deploy.js';
import {
  addDestination,
  listDestinations,
  removeDestination,
  setDestinationPhone,
} from './commands/destination.js';
import { generateWranglerToml, getWranglerTomlPath } from './commands/generate.js';
import {
  addNotifier, listNotifiers, removeNotifier, testNotifier,
} from './commands/notifier.js';
import {
  addPhoneAlias,
  describePhoneAliasStatus,
  listPhoneAliases,
  releasePhoneAlias,
  removePhoneAlias,
  searchPhoneNumbers,
  setPhoneAliasEnabled,
  setPhoneAliasExpiry,
} from './commands/phone-alias.js';
import {
  addPhoneProvider,
  checkPhoneProvider,
  connectPhoneProviders,
  listPhoneProviders,
  removePhoneProvider,
} from './commands/phone-provider.js';
import { getSettings } from './commands/settings.js';
import { validateConfig } from './commands/validate.js';
import { interactiveMenu } from './menu/interactive.js';

import type {
  Cli_Index_ConfigDir,
  Cli_Index_ConfigPath,
  Cli_Index_EnvDir,
  Cli_Index_GetConfigFilePath_DefaultDir,
  Cli_Index_GetConfigFilePath_Returns,
  Cli_Index_Main_Alias,
  Cli_Index_Main_AliasCommand,
  Cli_Index_Main_AliasStyleOption,
  Cli_Index_Main_AvailableNumbers,
  Cli_Index_Main_ConfigDirs,
  Cli_Index_Main_ConfigPath,
  Cli_Index_Main_ConnectedProviders,
  Cli_Index_Main_ConnectSettings,
  Cli_Index_Main_DestinationCommand,
  Cli_Index_Main_DestinationCountries,
  Cli_Index_Main_ExpiresAt,
  Cli_Index_Main_ListSettings,
  Cli_Index_Main_Message,
  Cli_Index_Main_NotifierCommand,
  Cli_Index_Main_Now,
  Cli_Index_Main_PhoneCommand,
  Cli_Index_Main_PhoneExpiresAt,
  Cli_Index_Main_PhoneNow,
  Cli_Index_Main_PhoneProviderCommand,
  Cli_Index_Main_PhoneResult,
  Cli_Index_Main_Result,
  Cli_Index_Main_Returns,
  Cli_Index_Main_Settings,
  Cli_Index_Program,
  Cli_Index_SamplePath,
  Cli_Index_SplitSenders_Returns,
  Cli_Index_SplitSenders_Value,
} from '../types/cli/index.d.ts';

/**
 * CLI - Env Dir.
 *
 * Directory that contains the dotenv file, resolved by searching
 * the working directory, project root, and config directory.
 *
 * @since 0.0.1
 */
const envDir: Cli_Index_EnvDir = Bootstrap.resolveFileDir(APP_NAME, '.env', [
  'cwd',
  'project-root',
  'config-dir',
]);

if (envDir !== undefined) {
  Bootstrap.loadEnv(envDir);
}

/**
 * CLI - Get Config File Path.
 *
 * Resolves the configuration file path and copies the sample
 * config into place when no config file exists yet.
 *
 * @returns {Cli_Index_GetConfigFilePath_Returns}
 *
 * @since 0.0.1
 */
function getConfigFilePath(): Cli_Index_GetConfigFilePath_Returns {
  const configDir: Cli_Index_ConfigDir = Bootstrap.resolveFileDir(APP_NAME, 'config.json', [
    'cwd',
    'project-root',
    'config-dir',
  ]);

  if (configDir !== undefined) {
    return join(configDir, 'config.json');
  }

  const defaultDir: Cli_Index_GetConfigFilePath_DefaultDir = Bootstrap.getConfigDir(APP_NAME);
  const configPath: Cli_Index_ConfigPath = join(defaultDir, 'config.json');
  const samplePath: Cli_Index_SamplePath = getConfigSamplePath();

  if (existsSync(configPath) === false) {
    copyFileSync(samplePath, configPath);
  }

  return configPath;
}

/**
 * CLI - Split Senders.
 *
 * Splits a comma-separated sender option into trimmed rules,
 * returning undefined when the option was not given.
 *
 * @param {Cli_Index_SplitSenders_Value} value - Value.
 *
 * @returns {Cli_Index_SplitSenders_Returns}
 *
 * @since 0.0.1
 */
function splitSenders(value: Cli_Index_SplitSenders_Value): Cli_Index_SplitSenders_Returns {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }

  return value.split(',').map((sender) => sender.trim()).filter((sender) => sender !== '');
}

/**
 * CLI - Program.
 *
 * Creates the top-level Commander program instance used to
 * register all subcommands and parse CLI arguments.
 *
 * @since 0.0.1
 */
const program: Cli_Index_Program = new Command();

program.name('mailmask').alias('mm').description('CLI management tool').version(getPackageVersion());

/**
 * CLI - Main.
 *
 * Bootstraps the CLI by resolving config, registering all
 * subcommands, and dispatching to the interactive menu or parser.
 *
 * @returns {Cli_Index_Main_Returns}
 *
 * @since 0.0.1
 */
async function main(): Cli_Index_Main_Returns {
  if (process.argv['length'] <= 2) {
    getConfigFilePath();

    const configDirs: Cli_Index_Main_ConfigDirs = Bootstrap.resolveFileDirs(APP_NAME, 'config.json', [
      'cwd',
      'project-root',
      'config-dir',
    ]);

    await interactiveMenu(configDirs);

    return;
  }

  const configPath: Cli_Index_Main_ConfigPath = getConfigFilePath();

  const aliasCommand: Cli_Index_Main_AliasCommand = new Command('alias').description('Manage aliases');
  const aliasStyleOption: Cli_Index_Main_AliasStyleOption = new Option('-s, --style <style>', 'Generated address style: words or random').choices([
    'words',
    'random',
  ]).default('words');

  aliasCommand
    .command('add')
    .description('Create an alias')
    .requiredOption('-d, --destination <name>', 'Destination to forward to')
    .option('-a, --address <address>', 'Custom address (otherwise one is generated)')
    .addOption(aliasStyleOption)
    .option('-l, --label <label>', 'Where you used this alias')
    .option('-e, --expires <when>', 'Expiry: 30m, 12h, 7d, 4w, an ISO date, or never')
    .option('--allow <senders>', 'Comma-separated senders allowed to write (e.g. *@shop.com)')
    .option('--block <senders>', 'Comma-separated senders to refuse')
    .action((options) => {
      const alias: Cli_Index_Main_Alias = addAlias(configPath, {
        address: options['address'],
        style: options['style'],
        destination: options['destination'],
        label: options['label'],
        expires: options['expires'],
        allowedSenders: splitSenders(options['allow']),
        blockedSenders: splitSenders(options['block']),
      });
      const settings: Cli_Index_Main_Settings = getSettings(configPath);

      Logger.info(`Created ${alias['address']}@${settings['base_domain']}. Run "mm deploy" to apply.`);

      return;
    });

  aliasCommand
    .command('list')
    .description('List aliases')
    .action(() => {
      const listSettings: Cli_Index_Main_ListSettings = getSettings(configPath);
      const now: Cli_Index_Main_Now = Date.now();

      for (const alias of listAliases(configPath)) {
        process.stdout.write(`${alias['address']}@${listSettings['base_domain']}\t${alias['destination']}\t${describeAliasStatus(alias, now)}\t${alias['label'] ?? ''}\n`);
      }

      return;
    });

  aliasCommand
    .command('enable <address>')
    .description('Enable an alias')
    .action((address) => {
      setAliasEnabled(configPath, address, true);

      Logger.info(`Alias "${address}" enabled. Run "mm deploy" to apply.`);

      return;
    });

  aliasCommand
    .command('disable <address>')
    .description('Disable an alias')
    .action((address) => {
      setAliasEnabled(configPath, address, false);

      Logger.info(`Alias "${address}" disabled. Run "mm deploy" to apply.`);

      return;
    });

  aliasCommand
    .command('expire <address> <when>')
    .description('Set when an alias expires (30m, 12h, 7d, 4w, an ISO date, or never)')
    .action((address, when) => {
      const expiresAt: Cli_Index_Main_ExpiresAt = setAliasExpiry(configPath, address, when);

      Logger.info(`Alias "${address}" now expires: ${expiresAt ?? 'never'}. Run "mm deploy" to apply.`);

      return;
    });

  aliasCommand
    .command('remove <address>')
    .description('Remove an alias')
    .action((address) => {
      removeAlias(configPath, address);

      Logger.info(`Alias "${address}" removed. Run "mm deploy" to apply.`);

      return;
    });

  const destinationCommand: Cli_Index_Main_DestinationCommand = new Command('destination').description('Manage destination inboxes');

  destinationCommand
    .command('add <name> <email>')
    .description('Add a destination inbox')
    .option('--phone <number>', 'Real phone number that phone aliases text (E.164, e.g. +15550100100)')
    .action((name, email, options) => {
      addDestination(configPath, {
        name,
        email,
        ...((options['phone'] !== undefined) ? { phone: options['phone'] } : {}),
      });

      Logger.info(`Destination "${name}" added. Cloudflare will email it a verification link on the next deploy.`);

      return;
    });

  destinationCommand
    .command('phone <name> <number>')
    .description('Set the real phone number phone aliases text, or "none" to clear it')
    .action((name, number) => {
      setDestinationPhone(configPath, name, (number === 'none') ? undefined : number);

      Logger.info(`Destination "${name}" phone updated. Run "mm deploy" to apply.`);

      return;
    });

  destinationCommand
    .command('list')
    .description('List destination inboxes')
    .action(() => {
      for (const destination of listDestinations(configPath)) {
        process.stdout.write(`${destination['name']}\t${destination['email']}\t${destination['phone'] ?? ''}\n`);
      }

      return;
    });

  destinationCommand
    .command('remove <name>')
    .description('Remove a destination inbox')
    .action((name) => {
      removeDestination(configPath, name);

      Logger.info(`Destination "${name}" removed. Run "mm deploy" to apply.`);

      return;
    });

  const notifierCommand: Cli_Index_Main_NotifierCommand = new Command('notifier').description('Manage notifiers for refused mail');

  notifierCommand
    .command('add-apprise <name>')
    .description('Notify through an Apprise API endpoint')
    .requiredOption('--url <url>', 'Apprise endpoint URL (https://...)')
    .option('--urls <urls>', 'Optional Apprise notification URLs')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'apprise',
        name,
        url: options['url'],
        ...((options['urls'] === undefined) ? {} : { urls: options['urls'] }),
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-discord <name>')
    .description('Notify a Discord channel through an incoming webhook')
    .requiredOption('--webhook-url <url>', 'Discord webhook URL')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'discord',
        name,
        webhook_url: options['webhookUrl'],
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-email <name>')
    .description('Notify by email through a Cloudflare send_email binding')
    .requiredOption('--from <email>', 'Sender on a Cloudflare Email Sending domain')
    .requiredOption('--to <email>', 'Verified destination address')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'email',
        name,
        from: options['from'],
        to: options['to'],
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-gotify <name>')
    .description('Notify a Gotify application')
    .requiredOption('--url <url>', 'Gotify server URL (https://...)')
    .requiredOption('--token <token>', 'Gotify application token')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'gotify',
        name,
        url: options['url'],
        token: options['token'],
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-matrix <name>')
    .description('Notify a Matrix room')
    .requiredOption('--homeserver-url <url>', 'Matrix homeserver URL (https://...)')
    .requiredOption('--room-id <id>', 'Matrix room ID (!room:server)')
    .requiredOption('--access-token <token>', 'Matrix access token')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'matrix',
        name,
        homeserver_url: options['homeserverUrl'],
        room_id: options['roomId'],
        access_token: options['accessToken'],
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-ntfy <name>')
    .description('Notify an ntfy topic directly')
    .requiredOption('--server <url>', 'ntfy server URL (https://...)')
    .requiredOption('--topic <topic>', 'Topic to publish to')
    .requiredOption('--token <token>', 'ntfy access token (tk_...)')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'ntfy',
        name,
        server: options['server'],
        topic: options['topic'],
        token: options['token'],
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-reverse-proxy <name>')
    .description('Notify a Reverse Proxy for ntfy context')
    .requiredOption('--url <url>', 'Context URL (https://...)')
    .option('--token <token>', 'Context token, if the context requires one')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'ntfy-reverse-proxy',
        name,
        url: options['url'],
        ...((options['token'] !== undefined) ? { token: options['token'] } : {}),
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-pushover <name>')
    .description('Notify through Pushover')
    .requiredOption('--user-key <key>', 'Pushover user or group key')
    .requiredOption('--app-token <token>', 'Pushover application API token')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'pushover',
        name,
        user_key: options['userKey'],
        app_token: options['appToken'],
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-slack <name>')
    .description('Notify a Slack channel through an incoming webhook')
    .requiredOption('--webhook-url <url>', 'Slack webhook URL')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'slack',
        name,
        webhook_url: options['webhookUrl'],
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-telegram <name>')
    .description('Notify a Telegram chat through a bot')
    .requiredOption('--bot-token <token>', 'Telegram bot token')
    .requiredOption('--chat-id <id>', 'Telegram chat ID')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'telegram',
        name,
        bot_token: options['botToken'],
        chat_id: options['chatId'],
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('add-webhook <name>')
    .description('Post the Mailmask JSON payload to a webhook')
    .requiredOption('--url <url>', 'Webhook URL (https://...)')
    .option('--token <token>', 'Optional bearer token')
    .action((name, options) => {
      addNotifier(configPath, {
        type: 'webhook',
        name,
        url: options['url'],
        ...((options['token'] === undefined) ? {} : { token: options['token'] }),
      });

      Logger.info(`Notifier "${name}" added. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('list')
    .description('List notifiers')
    .action(() => {
      for (const notifier of listNotifiers(configPath)) {
        process.stdout.write(`${notifier['name']}\t${notifier['type']}\n`);
      }

      return;
    });

  notifierCommand
    .command('remove <name>')
    .description('Remove a notifier')
    .action((name) => {
      removeNotifier(configPath, name);

      Logger.info(`Notifier "${name}" removed. Run "mm deploy" to apply.`);

      return;
    });

  notifierCommand
    .command('test <name>')
    .description('Send a test notification')
    .action(async (name) => {
      await testNotifier(configPath, name);

      Logger.info(`Notifier "${name}" accepted the test notification.`);

      return;
    });

  const phoneCommand: Cli_Index_Main_PhoneCommand = new Command('phone').description('Manage phone aliases');
  const phoneProviderCommand: Cli_Index_Main_PhoneProviderCommand = new Command('provider').description('Manage Telnyx and Plivo accounts');

  phoneProviderCommand
    .command('add-telnyx <name>')
    .description('Add a Telnyx account')
    .requiredOption('--api-key <key>', 'Telnyx API key')
    .requiredOption('--public-key <key>', 'Telnyx public key for webhook signatures (base64)')
    .option('--countries <codes>', 'Comma-separated country codes the numbers may text (default: every country)')
    .action((name, options) => {
      const destinationCountries: Cli_Index_Main_DestinationCountries = splitSenders(options['countries']);

      addPhoneProvider(configPath, {
        type: 'telnyx',
        name,
        api_key: options['apiKey'],
        public_key: options['publicKey'],
        ...((destinationCountries !== undefined && destinationCountries.length > 0) ? { destination_countries: destinationCountries.map((destinationCountry) => destinationCountry.toUpperCase()) } : {}),
      });

      Logger.info(`Phone provider "${name}" added. Run "mm phone provider check ${name}" to test the keys.`);

      return;
    });

  phoneProviderCommand
    .command('add-plivo <name>')
    .description('Add a Plivo account')
    .requiredOption('--auth-id <id>', 'Plivo auth ID')
    .requiredOption('--auth-token <token>', 'Plivo auth token')
    .action((name, options) => {
      addPhoneProvider(configPath, {
        type: 'plivo',
        name,
        auth_id: options['authId'],
        auth_token: options['authToken'],
      });

      Logger.info(`Phone provider "${name}" added. Run "mm phone provider check ${name}" to test the credentials.`);

      return;
    });

  phoneProviderCommand
    .command('list')
    .description('List phone providers')
    .action(() => {
      for (const phoneProvider of listPhoneProviders(configPath)) {
        process.stdout.write(`${phoneProvider['name']}\t${phoneProvider['type']}\n`);
      }

      return;
    });

  phoneProviderCommand
    .command('check <name>')
    .description('Check a phone provider\'s credentials')
    .action(async (name) => {
      await checkPhoneProvider(configPath, name);

      Logger.info(`Phone provider "${name}" accepted the credentials.`);

      return;
    });

  phoneProviderCommand
    .command('connect')
    .description('Point every phone alias number at the deployed Worker')
    .action(async () => {
      const connectSettings: Cli_Index_Main_ConnectSettings = getSettings(configPath);
      const connectedProviders: Cli_Index_Main_ConnectedProviders = await connectPhoneProviders(configPath, `https://${connectSettings['base_domain']}`);

      Logger.info((connectedProviders.length === 0) ? 'No phone aliases to connect.' : `Connected phone numbers on ${connectedProviders.join(', ')}.`);

      return;
    });

  phoneProviderCommand
    .command('remove <name>')
    .description('Remove a phone provider')
    .action((name) => {
      removePhoneProvider(configPath, name);

      Logger.info(`Phone provider "${name}" removed.`);

      return;
    });

  phoneCommand.addCommand(phoneProviderCommand);

  phoneCommand
    .command('search <provider>')
    .description('List numbers a provider can sell (buys nothing)')
    .option('-c, --country <code>', 'Two-letter country code', 'US')
    .option('-a, --area-code <code>', 'Area code to search in')
    .option('-n, --limit <count>', 'Most numbers to list', '10')
    .action(async (provider, options) => {
      const availableNumbers: Cli_Index_Main_AvailableNumbers = await searchPhoneNumbers(configPath, provider, {
        countryCode: String(options['country']).toUpperCase(),
        areaCode: options['areaCode'],
        limit: parseInt(options['limit'], 10),
      });

      for (const availableNumber of availableNumbers) {
        process.stdout.write(`${availableNumber['number']}\t${availableNumber['features'].join(',')}\n`);
      }

      return;
    });

  phoneCommand
    .command('add <number>')
    .description('Create a phone alias from a number on the provider account')
    .requiredOption('-p, --provider <name>', 'Phone provider that owns the number')
    .requiredOption('-d, --destination <name>', 'Destination whose phone receives the texts')
    .option('--buy', 'Buy the number first (charges the provider account)', false)
    .option('-l, --label <label>', 'Where you used this number')
    .option('-e, --expires <when>', 'Expiry: 30m, 12h, 7d, 4w, an ISO date, or never')
    .option('--allow <senders>', 'Comma-separated numbers or sender names allowed to text (e.g. +1555*, ACME)')
    .option('--block <senders>', 'Comma-separated numbers or sender names to drop')
    .option('--yes', 'Confirm the purchase that --buy makes', false)
    .action(async (number, options) => {
      if (options['buy'] === true && options['yes'] !== true) {
        Logger.error(`Buying "${number}" charges the "${options['provider']}" account. Run again with --buy --yes to buy it.`);

        process.exitCode = 1;

        return;
      }

      const phoneResult: Cli_Index_Main_PhoneResult = await addPhoneAlias(configPath, {
        number,
        buy: options['buy'] === true,
        provider: options['provider'],
        destination: options['destination'],
        label: options['label'],
        expires: options['expires'],
        allowedSenders: splitSenders(options['allow']),
        blockedSenders: splitSenders(options['block']),
      });

      Logger.info(`Created phone alias ${phoneResult['phoneAlias']['number']} (${phoneResult['status']}). Run "mm deploy" to apply.`);

      return;
    });

  phoneCommand
    .command('list')
    .description('List phone aliases')
    .action(() => {
      const phoneNow: Cli_Index_Main_PhoneNow = Date.now();

      for (const phoneAlias of listPhoneAliases(configPath)) {
        process.stdout.write(`${phoneAlias['number']}\t${phoneAlias['provider']}\t${phoneAlias['destination']}\t${describePhoneAliasStatus(phoneAlias, phoneNow)}\t${phoneAlias['label'] ?? ''}\n`);
      }

      return;
    });

  phoneCommand
    .command('enable <number>')
    .description('Enable a phone alias')
    .action((number) => {
      setPhoneAliasEnabled(configPath, number, true);

      Logger.info(`Phone alias "${number}" enabled. Run "mm deploy" to apply.`);

      return;
    });

  phoneCommand
    .command('disable <number>')
    .description('Disable a phone alias (the number stays on the account)')
    .action((number) => {
      setPhoneAliasEnabled(configPath, number, false);

      Logger.info(`Phone alias "${number}" disabled. Run "mm deploy" to apply.`);

      return;
    });

  phoneCommand
    .command('expire <number> <when>')
    .description('Set when a phone alias expires (30m, 12h, 7d, 4w, an ISO date, or never)')
    .action((number, when) => {
      const phoneExpiresAt: Cli_Index_Main_PhoneExpiresAt = setPhoneAliasExpiry(configPath, number, when);

      Logger.info(`Phone alias "${number}" now expires: ${phoneExpiresAt ?? 'never'}. Run "mm deploy" to apply.`);

      return;
    });

  phoneCommand
    .command('remove <number>')
    .description('Remove a phone alias but keep the number on the provider account')
    .action((number) => {
      removePhoneAlias(configPath, number);

      Logger.info(`Phone alias "${number}" removed. The number is still on the provider account. Run "mm deploy" to apply.`);

      return;
    });

  phoneCommand
    .command('release <number>')
    .description('Give the number back to the provider and remove the phone alias')
    .option('--yes', 'Confirm the release, which cannot be undone', false)
    .action(async (number, options) => {
      if (options['yes'] !== true) {
        Logger.error(`Releasing "${number}" gives it back to the provider and cannot be undone. Run again with --yes to release it.`);

        process.exitCode = 1;

        return;
      }

      await releasePhoneAlias(configPath, number);

      Logger.info(`Released "${number}" and removed its phone alias. Run "mm deploy" to apply.`);

      return;
    });

  program.addCommand(aliasCommand);
  program.addCommand(destinationCommand);
  program.addCommand(notifierCommand);
  program.addCommand(phoneCommand);

  program
    .command('validate')
    .description('Validate config')
    .action(() => {
      const result: Cli_Index_Main_Result = validateConfig(configPath);

      if (result['valid'] === true) {
        Logger.info('Config is valid.');
      } else {
        Logger.error('Config is invalid:');

        for (const error of result['errors']) {
          const message: Cli_Index_Main_Message = error;

          Logger.error(`  - ${message}`);
        }

        process.exitCode = 1;
      }

      return;
    });

  program
    .command('generate')
    .description('Generate wrangler.toml')
    .action(() => {
      generateWranglerToml(configPath);

      Logger.info(`Generated "wrangler.toml" at "${getWranglerTomlPath(configPath)}".`);

      return;
    });

  program
    .command('deploy')
    .description('Deploy to Cloudflare Workers')
    .action(async () => {
      try {
        await deploy(configPath);
      } catch (error) {
        Logger.error((error instanceof Error) ? error['message'] : String(error));

        process.exitCode = 1;
      }

      return;
    });

  await program.parseAsync(process.argv);

  return;
}

main().catch((error) => {
  Logger.error((error instanceof Error) ? error['message'] : String(error));

  process.exitCode = 1;

  return;
});

export {
  program,
};
