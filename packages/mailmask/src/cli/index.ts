#!/usr/bin/env node
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { Bootstrap, Logger } from '@cbnventures/nova/toolkit';
import { Command } from 'commander';

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
import { addDestination, listDestinations, removeDestination } from './commands/destination.js';
import { generateWranglerToml } from './commands/generate.js';
import { addNotifier, listNotifiers, removeNotifier } from './commands/notifier.js';
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
  Cli_Index_Main_ConfigDirs,
  Cli_Index_Main_ConfigPath,
  Cli_Index_Main_DestinationCommand,
  Cli_Index_Main_ExpiresAt,
  Cli_Index_Main_ListSettings,
  Cli_Index_Main_Message,
  Cli_Index_Main_NotifierCommand,
  Cli_Index_Main_Now,
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
 * @since UNRELEASED
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
 * @since UNRELEASED
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
 * @since UNRELEASED
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
 * @since UNRELEASED
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
 * @since UNRELEASED
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

  aliasCommand
    .command('add')
    .description('Create an alias')
    .requiredOption('-d, --destination <name>', 'Destination to forward to')
    .option('-a, --address <address>', 'Custom address (otherwise one is generated)')
    .option('-s, --style <style>', 'Generated address style: words or random', 'words')
    .option('-l, --label <label>', 'Where you used this alias')
    .option('-e, --expires <when>', 'Expiry: 30m, 12h, 7d, 4w, an ISO date, or never')
    .option('--allow <senders>', 'Comma-separated senders allowed to write (e.g. *@shop.com)')
    .option('--block <senders>', 'Comma-separated senders to refuse')
    .action((options) => {
      const alias: Cli_Index_Main_Alias = addAlias(configPath, {
        address: options['address'],
        style: (options['style'] === 'random') ? 'random' : 'words',
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
    .action((name, email) => {
      addDestination(configPath, {
        name,
        email,
      });

      Logger.info(`Destination "${name}" added. Cloudflare will email it a verification link on the next deploy.`);

      return;
    });

  destinationCommand
    .command('list')
    .description('List destination inboxes')
    .action(() => {
      for (const destination of listDestinations(configPath)) {
        process.stdout.write(`${destination['name']}\t${destination['email']}\n`);
      }

      return;
    });

  destinationCommand
    .command('remove <name>')
    .description('Remove a destination inbox')
    .action((name) => {
      removeDestination(configPath, name);

      Logger.info(`Destination "${name}" removed.`);

      return;
    });

  const notifierCommand: Cli_Index_Main_NotifierCommand = new Command('notifier').description('Manage notifiers for refused mail');

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

  program.addCommand(aliasCommand);
  program.addCommand(destinationCommand);
  program.addCommand(notifierCommand);

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
      }

      return;
    });

  program
    .command('generate')
    .description('Generate wrangler.toml')
    .action(() => {
      generateWranglerToml(configPath);

      Logger.info('wrangler.toml generated successfully.');

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
