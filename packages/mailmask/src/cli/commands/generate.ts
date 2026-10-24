import { mkdirSync, writeFileSync } from 'node:fs';
import {
  dirname, relative, resolve, sep,
} from 'node:path';

import { Bootstrap } from '@cbnventures/nova/toolkit';

import { getWorkerEntryPath } from '../../lib/package-runtime.js';
import { configSchema } from '../../lib/schema.js';
import { loadConfig } from './config-io.js';

import type {
  Cli_Commands_Generate_DefaultWranglerTomlPath,
  Cli_Commands_Generate_GenerateWranglerToml_AccountId,
  Cli_Commands_Generate_GenerateWranglerToml_AliasesJson,
  Cli_Commands_Generate_GenerateWranglerToml_AliasParts,
  Cli_Commands_Generate_GenerateWranglerToml_CompatibilityDate,
  Cli_Commands_Generate_GenerateWranglerToml_Config,
  Cli_Commands_Generate_GenerateWranglerToml_ConfigPath,
  Cli_Commands_Generate_GenerateWranglerToml_DestinationsJson,
  Cli_Commands_Generate_GenerateWranglerToml_Lines,
  Cli_Commands_Generate_GenerateWranglerToml_NotifiersJson,
  Cli_Commands_Generate_GenerateWranglerToml_OutputDir,
  Cli_Commands_Generate_GenerateWranglerToml_OutputPath,
  Cli_Commands_Generate_GenerateWranglerToml_Returns,
  Cli_Commands_Generate_GenerateWranglerToml_Settings,
  Cli_Commands_Generate_GenerateWranglerToml_SettingsJson,
  Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryConfigPath,
  Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryPath,
  Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryRelativePath,
  Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryToml,
  Cli_Commands_Generate_ProjectRoot,
  Cli_Commands_Generate_SplitByBytes_CharacterBytes,
  Cli_Commands_Generate_SplitByBytes_Current,
  Cli_Commands_Generate_SplitByBytes_CurrentBytes,
  Cli_Commands_Generate_SplitByBytes_MaxBytes,
  Cli_Commands_Generate_SplitByBytes_Parts,
  Cli_Commands_Generate_SplitByBytes_Returns,
  Cli_Commands_Generate_SplitByBytes_Text,
} from '../../types/cli/commands/generate.d.ts';

/**
 * CLI - Commands - Generate - Project Root.
 *
 * Absolute path to the resolved project root, falling back to
 * the current working directory when no root can be detected.
 *
 * @since 0.0.1
 */
const projectRoot: Cli_Commands_Generate_ProjectRoot = Bootstrap.getProjectRoot() ?? process.cwd();

/**
 * CLI - Commands - Generate - Default Wrangler Toml Path.
 *
 * Absolute path to the wrangler.toml written at the project
 * root when no explicit output path is passed to the command.
 *
 * @since 0.0.1
 */
const defaultWranglerTomlPath: Cli_Commands_Generate_DefaultWranglerTomlPath = resolve(projectRoot, 'wrangler.toml');

/**
 * CLI - Commands - Generate - Alias Part Bytes.
 *
 * Maximum UTF-8 size of one ALIASES_n var, kept under Cloudflare's
 * 5 KB per-variable limit with room to spare.
 *
 * @since 0.0.1
 */
const ALIAS_PART_BYTES = 4000;

/**
 * CLI - Commands - Generate - Alias Part Limit.
 *
 * Maximum number of ALIASES_n vars, leaving room under Cloudflare's
 * 64-variable limit for the other vars.
 *
 * @since 0.0.1
 */
const ALIAS_PART_LIMIT = 60;

/**
 * CLI - Commands - Generate - Split By Bytes.
 *
 * Splits text into pieces of at most the given UTF-8 size without
 * cutting a multi-byte character in half.
 *
 * @param {Cli_Commands_Generate_SplitByBytes_Text}     text     - Text.
 * @param {Cli_Commands_Generate_SplitByBytes_MaxBytes} maxBytes - Max bytes.
 *
 * @returns {Cli_Commands_Generate_SplitByBytes_Returns}
 *
 * @since 0.0.1
 */
function splitByBytes(text: Cli_Commands_Generate_SplitByBytes_Text, maxBytes: Cli_Commands_Generate_SplitByBytes_MaxBytes): Cli_Commands_Generate_SplitByBytes_Returns {
  const parts: Cli_Commands_Generate_SplitByBytes_Parts = [];
  let current: Cli_Commands_Generate_SplitByBytes_Current = '';
  let currentBytes: Cli_Commands_Generate_SplitByBytes_CurrentBytes = 0;

  for (const character of text) {
    const characterBytes: Cli_Commands_Generate_SplitByBytes_CharacterBytes = Buffer.byteLength(character);

    if (currentBytes + characterBytes > maxBytes) {
      parts.push(current);

      current = '';
      currentBytes = 0;
    }

    current += character;
    currentBytes += characterBytes;
  }

  parts.push(current);

  return parts;
}

/**
 * CLI - Commands - Generate - Wrangler Toml.
 *
 * Builds a wrangler.toml from the current config. Settings, destinations,
 * notifiers, and aliases are passed as JSON vars; aliases are split across numbered
 * vars because Cloudflare limits each var to 5 KB.
 *
 * @param {Cli_Commands_Generate_GenerateWranglerToml_ConfigPath} configPath   - Config path.
 * @param {Cli_Commands_Generate_GenerateWranglerToml_OutputPath} [outputPath] - Output path.
 * @param {Cli_Commands_Generate_GenerateWranglerToml_AccountId}  [accountId]  - Account id.
 *
 * @returns {Cli_Commands_Generate_GenerateWranglerToml_Returns}
 *
 * @since 0.0.1
 */
function generateWranglerToml(configPath: Cli_Commands_Generate_GenerateWranglerToml_ConfigPath, outputPath: Cli_Commands_Generate_GenerateWranglerToml_OutputPath = defaultWranglerTomlPath, accountId?: Cli_Commands_Generate_GenerateWranglerToml_AccountId): Cli_Commands_Generate_GenerateWranglerToml_Returns {
  const config: Cli_Commands_Generate_GenerateWranglerToml_Config = configSchema.parse(loadConfig(configPath));
  const settings: Cli_Commands_Generate_GenerateWranglerToml_Settings = config['settings'];
  const compatibilityDate: Cli_Commands_Generate_GenerateWranglerToml_CompatibilityDate = new Date().toISOString().slice(0, 10);
  const outputDir: Cli_Commands_Generate_GenerateWranglerToml_OutputDir = dirname(outputPath);
  const workerEntryPath: Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryPath = getWorkerEntryPath();
  const workerEntryRelativePath: Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryRelativePath = relative(outputDir, workerEntryPath);
  const workerEntryConfigPath: Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryConfigPath = workerEntryRelativePath.split(sep).join('/');
  const workerEntryToml: Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryToml = JSON.stringify(workerEntryConfigPath);
  const settingsJson: Cli_Commands_Generate_GenerateWranglerToml_SettingsJson = JSON.stringify(settings);
  const destinationsJson: Cli_Commands_Generate_GenerateWranglerToml_DestinationsJson = JSON.stringify(config['destinations']);
  const notifiersJson: Cli_Commands_Generate_GenerateWranglerToml_NotifiersJson = JSON.stringify(config['notifiers']);
  const aliasesJson: Cli_Commands_Generate_GenerateWranglerToml_AliasesJson = JSON.stringify(config['aliases']);
  const aliasParts: Cli_Commands_Generate_GenerateWranglerToml_AliasParts = splitByBytes(aliasesJson, ALIAS_PART_BYTES);

  if (aliasParts.length > ALIAS_PART_LIMIT) {
    throw new Error(`Too many aliases: they need ${String(aliasParts.length)} Worker vars, but at most ${String(ALIAS_PART_LIMIT)} are allowed. Remove unused aliases and try again.`);
  }

  const lines: Cli_Commands_Generate_GenerateWranglerToml_Lines = [
    `name = "${settings['worker_name']}"`,
    `main = ${workerEntryToml}`,
    `compatibility_date = "${compatibilityDate}"`,
    ...((accountId !== undefined) ? [`account_id = "${accountId}"`] : []),
    'workers_dev = false',
    'preview_urls = false',
    '',
    '#######################',
    '#### Email Routing ####',
    '#######################',
    `# The deploy command points the catch-all for "${settings['base_domain']}" at this Worker.`,
    '',
    '##############',
    '#### Vars ####',
    '##############',
    '[vars]',
    `SETTINGS = ${JSON.stringify(settingsJson)}`,
    `DESTINATIONS = ${JSON.stringify(destinationsJson)}`,
    `NOTIFIERS = ${JSON.stringify(notifiersJson)}`,
    `ALIASES_PARTS = "${String(aliasParts.length)}"`,
    ...aliasParts.map((aliasPart, index) => `ALIASES_${String(index + 1)} = ${JSON.stringify(aliasPart)}`),
  ];

  mkdirSync(outputDir, { recursive: true });

  writeFileSync(outputPath, `${lines.join('\n')}\n`);

  return;
}

export {
  generateWranglerToml,
};
