import { mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import {
  dirname, relative, resolve, sep,
} from 'node:path';

import { getWorkerEntryPath } from '../../lib/package-runtime.js';
import { configSchema } from '../../lib/schema.js';
import { loadConfig } from './config-io.js';

import type {
  Cli_Commands_Generate_GenerateWranglerToml_AccountId,
  Cli_Commands_Generate_GenerateWranglerToml_BundleConfigPath,
  Cli_Commands_Generate_GenerateWranglerToml_BundleDir,
  Cli_Commands_Generate_GenerateWranglerToml_BundleEntryPath,
  Cli_Commands_Generate_GenerateWranglerToml_CompatibilityDate,
  Cli_Commands_Generate_GenerateWranglerToml_Config,
  Cli_Commands_Generate_GenerateWranglerToml_ConfigPath,
  Cli_Commands_Generate_GenerateWranglerToml_EmailDestinations,
  Cli_Commands_Generate_GenerateWranglerToml_EntryLines,
  Cli_Commands_Generate_GenerateWranglerToml_Lines,
  Cli_Commands_Generate_GenerateWranglerToml_OutputDir,
  Cli_Commands_Generate_GenerateWranglerToml_OutputPath,
  Cli_Commands_Generate_GenerateWranglerToml_RealBundleDir,
  Cli_Commands_Generate_GenerateWranglerToml_Returns,
  Cli_Commands_Generate_GenerateWranglerToml_Settings,
  Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryImport,
  Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryImportPath,
  Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryPath,
  Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryRelativePath,
  Cli_Commands_Generate_GetWranglerTomlPath_ConfigPath,
  Cli_Commands_Generate_GetWranglerTomlPath_Returns,
} from '../../types/cli/commands/generate.d.ts';

/**
 * CLI - Commands - Generate - Bundle Directory.
 *
 * Folder beside wrangler.toml that holds the generated Worker entry and config. It sits
 * inside .wrangler, which projects already ignore, so tokens in the config stay out of Git.
 *
 * @since 1.0.0
 */
const BUNDLE_DIRECTORY = '.wrangler/mailmask';

/**
 * CLI - Commands - Generate - Get Wrangler Toml Path.
 *
 * Places wrangler.toml beside the config file it is built from, so a config in the
 * repository and one in the user config directory each keep their own Worker files.
 *
 * @param {Cli_Commands_Generate_GetWranglerTomlPath_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Commands_Generate_GetWranglerTomlPath_Returns}
 *
 * @since 1.0.0
 */
function getWranglerTomlPath(configPath: Cli_Commands_Generate_GetWranglerTomlPath_ConfigPath): Cli_Commands_Generate_GetWranglerTomlPath_Returns {
  return resolve(dirname(configPath), 'wrangler.toml');
}

/**
 * CLI - Commands - Generate - Wrangler Toml.
 *
 * Builds a wrangler.toml plus a Worker entry and config file for Wrangler to bundle
 * together. The config ships inside the Worker instead of vars, which are capped at 5 KB.
 *
 * @param {Cli_Commands_Generate_GenerateWranglerToml_ConfigPath} configPath   - Config path.
 * @param {Cli_Commands_Generate_GenerateWranglerToml_OutputPath} [outputPath] - Output path.
 * @param {Cli_Commands_Generate_GenerateWranglerToml_AccountId}  [accountId]  - Account id.
 *
 * @returns {Cli_Commands_Generate_GenerateWranglerToml_Returns}
 *
 * @since UNRELEASED
 */
function generateWranglerToml(configPath: Cli_Commands_Generate_GenerateWranglerToml_ConfigPath, outputPath: Cli_Commands_Generate_GenerateWranglerToml_OutputPath = getWranglerTomlPath(configPath), accountId?: Cli_Commands_Generate_GenerateWranglerToml_AccountId): Cli_Commands_Generate_GenerateWranglerToml_Returns {
  const config: Cli_Commands_Generate_GenerateWranglerToml_Config = configSchema.parse(loadConfig(configPath));
  const settings: Cli_Commands_Generate_GenerateWranglerToml_Settings = config['settings'];
  const compatibilityDate: Cli_Commands_Generate_GenerateWranglerToml_CompatibilityDate = new Date().toISOString().slice(0, 10);
  const outputDir: Cli_Commands_Generate_GenerateWranglerToml_OutputDir = dirname(outputPath);
  const bundleDir: Cli_Commands_Generate_GenerateWranglerToml_BundleDir = resolve(outputDir, BUNDLE_DIRECTORY);
  const bundleConfigPath: Cli_Commands_Generate_GenerateWranglerToml_BundleConfigPath = resolve(bundleDir, 'config.json');
  const bundleEntryPath: Cli_Commands_Generate_GenerateWranglerToml_BundleEntryPath = resolve(bundleDir, 'worker.js');
  const emailDestinations: Cli_Commands_Generate_GenerateWranglerToml_EmailDestinations = [...new Set(config['notifiers'].filter((notifier) => notifier['type'] === 'email').map((notifier) => notifier['to']))];

  mkdirSync(bundleDir, { recursive: true });

  // Wrangler bundles from real paths, so measure the import from the real folder in case of symlinks.
  const realBundleDir: Cli_Commands_Generate_GenerateWranglerToml_RealBundleDir = realpathSync(bundleDir);
  const workerEntryPath: Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryPath = realpathSync(getWorkerEntryPath());
  const workerEntryRelativePath: Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryRelativePath = relative(realBundleDir, workerEntryPath);
  const workerEntryImportPath: Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryImportPath = workerEntryRelativePath.split(sep).join('/');
  const workerEntryImport: Cli_Commands_Generate_GenerateWranglerToml_WorkerEntryImport = JSON.stringify((workerEntryImportPath.startsWith('.') === true) ? workerEntryImportPath : `./${workerEntryImportPath}`);

  const entryLines: Cli_Commands_Generate_GenerateWranglerToml_EntryLines = [
    '// Generated by Mailmask. "mm generate" and "mm deploy" rewrite this file.',
    `import { createWorker } from ${workerEntryImport};`,
    '',
    'import config from "./config.json";',
    '',
    'export default createWorker(config);',
  ];

  const lines: Cli_Commands_Generate_GenerateWranglerToml_Lines = [
    `name = "${settings['worker_name']}"`,
    `main = "${BUNDLE_DIRECTORY}/worker.js"`,
    `compatibility_date = "${compatibilityDate}"`,
    ...((accountId !== undefined) ? [`account_id = "${accountId}"`] : []),
    'workers_dev = false',
    'preview_urls = false',
    '',
    '#######################',
    '#### Email Routing ####',
    '#######################',
    `# The deploy command points the catch-all for "${settings['base_domain']}" at this Worker.`,
    ...((emailDestinations.length === 0) ? [] : [
      '',
      '[[send_email]]',
      'name = "MAILMASK_EMAIL"',
      `allowed_destination_addresses = ${JSON.stringify(emailDestinations)}`,
    ]),
    '',
    '################',
    '#### Config ####',
    '################',
    `# The config ships inside the Worker from ${BUNDLE_DIRECTORY}/config.json, not as vars.`,
  ];

  writeFileSync(bundleConfigPath, `${JSON.stringify(config, null, 2)}\n`);

  writeFileSync(bundleEntryPath, `${entryLines.join('\n')}\n`);

  writeFileSync(outputPath, `${lines.join('\n')}\n`);

  return;
}

export {
  generateWranglerToml,
  getWranglerTomlPath,
};
