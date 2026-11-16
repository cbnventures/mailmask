import { spawnSync } from 'node:child_process';
import {
  mkdtempSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import prompts from 'prompts';
import {
  afterAll, afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

/**
 * Mailmask CLI Test - Config.
 *
 * Models the minimal valid configuration shared by the command and settings
 * tests so checkJs can validate fixture mutations without broad any types.
 *
 * @typedef {{ destinations: Array<{ name: string, email: string }>, aliases: unknown[], notifiers: unknown[], settings: { worker_name: string, base_domain: string, unknown_alias_action: 'reject' | 'drop' | 'forward', default_destination?: string, subaddressing: boolean, add_alias_headers: boolean } }} MailmaskTestConfig
 *
 * @since 0.0.0
 */

/**
 * Mailmask CLI Test - Repository Root.
 *
 * Locates the checkout so spawned CLI processes use the source under test
 * regardless of the temporary working directory assigned to each case.
 *
 * @since 0.0.0
 */
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Mailmask CLI Test - CLI Path.
 *
 * Points at the TypeScript CLI entry so integration assertions exercise the
 * current source instead of a potentially stale build artifact.
 *
 * @since 0.0.0
 */
const cliPath = join(repositoryRoot, 'packages', 'mailmask', 'src', 'cli', 'index.ts');

/**
 * Mailmask CLI Test - TSX Loader Path.
 *
 * Resolves the repository-owned TypeScript loader so subprocesses use the
 * same pinned dependency without opening the TSX CLI's IPC socket.
 *
 * @since 0.0.0
 */
const tsxLoaderPath = createRequire(import.meta.url).resolve('tsx');

/**
 * Mailmask CLI Test - Original Xdg Config Home.
 *
 * Preserves the caller's config lookup environment so the suite can restore
 * it after isolating modules that resolve persistent paths during import.
 *
 * @since 0.0.0
 */
const originalXdgConfigHome = process.env['XDG_CONFIG_HOME'];

/**
 * Mailmask CLI Test - Module Config Directory.
 *
 * Keeps import-time Bootstrap state away from the user's real config
 * directory while still exercising the production path-resolution code.
 *
 * @since 0.0.0
 */
const moduleConfigDirectory = mkdtempSync(join(tmpdir(), 'mailmask-module-test-'));

Reflect.set(process.env, 'XDG_CONFIG_HOME', moduleConfigDirectory);

/**
 * Mailmask CLI Test - Source Modules.
 *
 * Imported after the isolated config directory is active because deploy resolves
 * its persistent token path while the module is initialized.
 *
 * @since 0.0.0
 */
const sourceModules = await Promise.all([
  import('../packages/mailmask/src/cli/commands/deploy.js'),
  import('../packages/mailmask/src/cli/commands/settings.js'),
  import('../packages/mailmask/src/cli/menu/interactive.js'),
]);

/**
 * Mailmask CLI Test - Deploy.
 *
 * Exposes the deploy command from the isolated dynamic import so its invalid
 * configuration exit behavior can be asserted without a Cloudflare deploy.
 *
 * @since 0.0.0
 */
const deploy = sourceModules[0]['deploy'];

/**
 * Mailmask CLI Test - Update Settings.
 *
 * Exposes the settings mutation from the isolated dynamic import so tests can
 * verify that validation completes before the config file is overwritten.
 *
 * @since 0.0.0
 */
const updateSettings = sourceModules[1]['updateSettings'];

/**
 * Mailmask CLI Test - Destination Menu.
 *
 * Exposes the interactive destination menu so injected prompt answers can
 * verify the reminder printed after a successful removal.
 *
 * @since 0.0.0
 */
const destinationMenu = sourceModules[2]['destinationMenu'];

/**
 * Mailmask CLI Test - Settings Flow.
 *
 * Exposes the interactive settings flow so injected prompt answers can verify
 * the deploy reminder printed after valid settings are saved.
 *
 * @since 0.0.0
 */
const settingsFlow = sourceModules[2]['settingsFlow'];

/**
 * Mailmask CLI Test - Test Directory.
 *
 * Holds the per-test working directory containing the configuration consumed
 * by direct calls and spawned CLI processes.
 *
 * @since 0.0.0
 */
let testDirectory = '';

/**
 * Mailmask CLI Test - Config Path.
 *
 * Tracks the config fixture inside the current temporary directory so every
 * command under test reads and writes the same isolated file.
 *
 * @since 0.0.0
 */
let configPath = '';

/**
 * Mailmask CLI Test - Original API Token.
 *
 * Preserves any token inherited by the test runner so deploy authentication
 * can be stubbed temporarily without leaking environment changes.
 *
 * @since 0.0.0
 */
let originalApiToken = /** @type {string | undefined} */ (undefined);

/**
 * Mailmask CLI Test - Create Config.
 *
 * Creates a minimal valid configuration that individual cases can mutate
 * before invoking validation or settings persistence.
 *
 * @returns {MailmaskTestConfig}
 *
 * @since 0.0.0
 */
function createConfig() {
  return {
    destinations: [{
      name: 'personal',
      email: 'person@example.net',
    }],
    aliases: [],
    notifiers: [],
    settings: {
      worker_name: 'mailmask',
      base_domain: 'example.com',
      unknown_alias_action: 'reject',
      subaddressing: true,
      add_alias_headers: true,
    },
  };
}

/**
 * Mailmask CLI Test - Save Config.
 *
 * Writes a configuration fixture using the same formatted JSON shape users
 * edit, allowing tests to assert that failed updates leave bytes unchanged.
 *
 * @param {MailmaskTestConfig} config - Config.
 *
 * @returns {void}
 *
 * @since 0.0.0
 */
function saveConfig(config) {
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

  return;
}

/**
 * Mailmask CLI Test - Run CLI.
 *
 * Launches the source CLI in the current fixture directory with its platform
 * config directory isolated from the user's real files.
 *
 * @param {string[]} args - Args.
 *
 * @returns {import('node:child_process').SpawnSyncReturns<string>}
 *
 * @since 0.0.0
 */
function runCli(args) {
  return spawnSync(process.execPath, [
    '--import',
    tsxLoaderPath,
    cliPath,
    ...args,
  ], {
    cwd: testDirectory,
    encoding: 'utf-8',
    env: {
      ...process.env,
      NO_COLOR: '1',
      XDG_CONFIG_HOME: join(testDirectory, 'xdg'),
    },
  });
}

afterAll(() => {
  if (originalXdgConfigHome === undefined) {
    Reflect.deleteProperty(process.env, 'XDG_CONFIG_HOME');
  } else {
    Reflect.set(process.env, 'XDG_CONFIG_HOME', originalXdgConfigHome);
  }

  rmSync(moduleConfigDirectory, {
    recursive: true,
    force: true,
  });

  return;
});

beforeEach(() => {
  testDirectory = mkdtempSync(join(tmpdir(), 'mailmask-cli-test-'));
  configPath = join(testDirectory, 'config.json');
  originalApiToken = process.env['CLOUDFLARE_API_TOKEN'];

  saveConfig(createConfig());

  return;
});

afterEach(() => {
  if (originalApiToken === undefined) {
    Reflect.deleteProperty(process.env, 'CLOUDFLARE_API_TOKEN');
  } else {
    Reflect.set(process.env, 'CLOUDFLARE_API_TOKEN', originalApiToken);
  }

  rmSync(testDirectory, {
    recursive: true,
    force: true,
  });

  return;
});

describe('Mailmask CLI behavior', () => {
  it('exits with status 1 when validate finds an invalid config', () => {
    const config = createConfig();

    Reflect.set(config['settings'], 'worker_name', 'Invalid Worker');

    saveConfig(config);

    const result = runCli(['validate']);

    expect(result['status']).toBe(1);

    expect(`${result['stdout']}${result['stderr']}`).toContain('Config is invalid');

    return;
  });

  it('sets exitCode to 1 when deploy finds an invalid config', async () => {
    const config = createConfig();

    Reflect.set(config['settings'], 'base_domain', 'INVALID DOMAIN');

    saveConfig(config);

    Reflect.set(process.env, 'CLOUDFLARE_API_TOKEN', 'test-token');

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      success: true,
      result: { status: 'active' },
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));

    await deploy(configPath);

    expect(process.exitCode).toBe(1);

    return;
  });

  it('rejects invalid settings without changing the file', () => {
    const originalConfig = readFileSync(configPath, 'utf-8');

    expect(() => updateSettings(configPath, { worker_name: 'Invalid Worker' })).toThrow('worker_name');

    expect(() => updateSettings(configPath, { base_domain: 'INVALID DOMAIN' })).toThrow('base_domain');

    expect(() => updateSettings(configPath, {
      unknown_alias_action: 'forward',
      default_destination: undefined,
    })).toThrow('default_destination');

    expect(readFileSync(configPath, 'utf-8')).toBe(originalConfig);

    return;
  });

  it('prints deploy reminders after destination removal and settings changes', async () => {
    const stdoutWrite = vi.mocked(process.stdout.write);

    prompts.inject([
      'remove',
      'personal',
      'back',
    ]);

    await destinationMenu(configPath);

    prompts.inject([
      'mailmask',
      'example.com',
      'reject',
      true,
      true,
    ]);

    await settingsFlow(configPath);

    const output = stdoutWrite.mock.calls.flat().join('');

    expect(output).toContain('Destination "personal" removed. Run "mm deploy" to apply.');

    expect(output).toContain('Settings updated. Run "mm deploy" to apply.');

    return;
  });

  it('prints a deploy reminder after direct destination removal', () => {
    const result = runCli([
      'destination',
      'remove',
      'personal',
    ]);

    expect(result['status']).toBe(0);

    expect(`${result['stdout']}${result['stderr']}`).toContain('Destination "personal" removed. Run "mm deploy" to apply.');

    return;
  });

  it('rejects unknown generated alias styles', () => {
    const result = runCli([
      'alias',
      'add',
      '--destination',
      'personal',
      '--style',
      'typo',
    ]);

    expect(result['status']).toBe(1);

    expect(`${result['stdout']}${result['stderr']}`).toContain('Allowed choices are words, random');

    return;
  });

  return;
});
