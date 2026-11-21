import { randomUUID } from 'node:crypto';
import {
  copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import {
  dirname, join, relative, resolve, sep,
} from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  afterEach, describe, expect, it,
} from 'vitest';

import { loadConfig } from '../../../cli/commands/config-io.js';
import { generateWranglerToml, getWranglerTomlPath } from '../../../cli/commands/generate.js';
import { configSchema } from '../../../lib/schema.js';

import type {
  Tests_Cli_Commands_Generate_GenerateWranglerToml_LimitsTheBindingToNotifierAddressesWithoutSendingFromAliases_ConfigPath,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_LimitsTheBindingToNotifierAddressesWithoutSendingFromAliases_SampleConfig,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_LimitsTheBindingToNotifierAddressesWithoutSendingFromAliases_Toml,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_PointsMainAtTheBundledEntryAndDisablesPublicUrls_OutputPath,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_PointsMainAtTheBundledEntryAndDisablesPublicUrls_Toml,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_BundleDir,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_EntryLines,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_ImportPath,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_LinkedDir,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_RealDir,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesNextToTheConfigFileByDefault_ConfigPath,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_BundledConfig,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_BundleDir,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_Entry,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_ExpectedConfig,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_ExpectedImport,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_OutputPath,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_WorkerPath,
  Tests_Cli_Commands_Generate_OutputDir,
  Tests_Cli_Commands_Generate_SampleConfigPath,
} from '../../../types/tests/cli/commands/generate.test.d.ts';

const outputDir: Tests_Cli_Commands_Generate_OutputDir = join(tmpdir(), `mailmask-test-generate-${randomUUID()}`);

const sampleConfigPath: Tests_Cli_Commands_Generate_SampleConfigPath = join(dirname(fileURLToPath(import.meta.url)), '../../../../../../config.sample.json');

/**
 * Tests - CLI - Commands - Generate - Wrangler Toml.
 *
 * @since 0.0.1
 */
describe('generateWranglerToml', () => {
  afterEach(() => {
    rmSync(outputDir, {
      recursive: true,
      force: true,
    });

    return;
  });

  it('points main at the bundled entry and disables public urls', () => {
    const outputPath: Tests_Cli_Commands_Generate_GenerateWranglerToml_PointsMainAtTheBundledEntryAndDisablesPublicUrls_OutputPath = join(outputDir, 'wrangler.toml');

    generateWranglerToml(sampleConfigPath, outputPath, 'account-123');

    const toml: Tests_Cli_Commands_Generate_GenerateWranglerToml_PointsMainAtTheBundledEntryAndDisablesPublicUrls_Toml = readFileSync(outputPath, 'utf-8');

    expect(toml).toContain('name = "mailmask"');

    expect(toml).toContain('main = ".wrangler/mailmask/worker.js"');

    expect(toml).toContain('account_id = "account-123"');

    expect(toml).toContain('workers_dev = false');

    expect(toml).toContain('[[send_email]]');

    expect(toml).toContain('name = "MAILMASK_EMAIL"');

    expect(toml).not.toContain('allowed_destination_addresses');

    expect(toml).not.toContain('[vars]');

    expect(toml).not.toContain('routes');

    return;
  });

  it('limits the binding to notifier addresses without sending from aliases', () => {
    const configPath: Tests_Cli_Commands_Generate_GenerateWranglerToml_LimitsTheBindingToNotifierAddressesWithoutSendingFromAliases_ConfigPath = join(outputDir, 'config.json');
    const sampleConfig: Tests_Cli_Commands_Generate_GenerateWranglerToml_LimitsTheBindingToNotifierAddressesWithoutSendingFromAliases_SampleConfig = configSchema.parse(loadConfig(sampleConfigPath));

    mkdirSync(outputDir, { recursive: true });

    writeFileSync(configPath, JSON.stringify({
      ...sampleConfig,
      settings: {
        ...sampleConfig['settings'],
        send_from_aliases: false,
      },
    }));

    generateWranglerToml(configPath);

    const toml: Tests_Cli_Commands_Generate_GenerateWranglerToml_LimitsTheBindingToNotifierAddressesWithoutSendingFromAliases_Toml = readFileSync(join(outputDir, 'wrangler.toml'), 'utf-8');

    expect(toml).toContain('allowed_destination_addresses = ["you@example.com"]');

    return;
  });

  it('writes the config and an entry that imports the worker', () => {
    const outputPath: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_OutputPath = join(outputDir, 'wrangler.toml');
    const bundleDir: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_BundleDir = join(outputDir, '.wrangler', 'mailmask');

    generateWranglerToml(sampleConfigPath, outputPath);

    const bundledConfig: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_BundledConfig = JSON.parse(readFileSync(join(bundleDir, 'config.json'), 'utf-8'));
    const expectedConfig: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_ExpectedConfig = configSchema.parse(loadConfig(sampleConfigPath));
    const entry: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_Entry = readFileSync(join(bundleDir, 'worker.js'), 'utf-8');
    const workerPath: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_WorkerPath = join(dirname(fileURLToPath(import.meta.url)), '../../../worker/index.ts');
    const expectedImport: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesTheConfigAndAnEntryThatImportsTheWorker_ExpectedImport = relative(realpathSync(bundleDir), workerPath).split(sep).join('/');

    expect(bundledConfig).toEqual(expectedConfig);

    expect(entry).toContain('import { EmailMessage } from "cloudflare:email";');

    expect(entry).toContain(`import { createWorker } from "${expectedImport}";`);

    expect(entry).toContain('import config from "./config.json";');

    expect(entry).toContain('export default createWorker(config, EmailMessage);');

    return;
  });

  it('writes next to the config file by default', () => {
    const configPath: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesNextToTheConfigFileByDefault_ConfigPath = join(outputDir, 'config.json');

    mkdirSync(outputDir, { recursive: true });

    copyFileSync(sampleConfigPath, configPath);

    generateWranglerToml(configPath);

    expect(getWranglerTomlPath(configPath)).toBe(join(outputDir, 'wrangler.toml'));

    expect(existsSync(join(outputDir, 'wrangler.toml'))).toBe(true);

    expect(existsSync(join(outputDir, '.wrangler', 'mailmask', 'worker.js'))).toBe(true);

    return;
  });

  it('resolves the worker import from a symlinked config folder', () => {
    const realDir: Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_RealDir = join(outputDir, 'real', 'nested');
    const linkedDir: Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_LinkedDir = join(outputDir, 'linked');

    mkdirSync(realDir, { recursive: true });

    symlinkSync(realDir, linkedDir, 'junction');

    copyFileSync(sampleConfigPath, join(linkedDir, 'config.json'));

    generateWranglerToml(join(linkedDir, 'config.json'));

    const bundleDir: Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_BundleDir = realpathSync(join(linkedDir, '.wrangler', 'mailmask'));
    const entryLines: Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_EntryLines = readFileSync(join(bundleDir, 'worker.js'), 'utf-8').split('\n');
    const importPath: Tests_Cli_Commands_Generate_GenerateWranglerToml_ResolvesTheWorkerImportFromASymlinkedConfigFolder_ImportPath = (entryLines.find((entryLine) => entryLine.startsWith('import { createWorker }') === true) ?? '').split('"')[1] ?? '';

    expect(existsSync(resolve(bundleDir, importPath))).toBe(true);

    return;
  });

  return;
});
