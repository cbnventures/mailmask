import { randomUUID } from 'node:crypto';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import {
  addNotifier, listNotifiers, removeNotifier, testNotifier,
} from '../../../cli/commands/notifier.js';

import type {
  Tests_Cli_Commands_Notifier_BaseConfig,
  Tests_Cli_Commands_Notifier_NotifierCommands_AddsListsTestsAndRemovesEveryNotifierType_FetchSpy,
  Tests_Cli_Commands_Notifier_NotifierCommands_AddsListsTestsAndRemovesEveryNotifierType_HttpNotifiers,
  Tests_Cli_Commands_Notifier_NotifierCommands_ConfigJson,
  Tests_Cli_Commands_Notifier_Notifiers,
  Tests_Cli_Commands_Notifier_TestConfigPath,
} from '../../../types/tests/cli/commands/notifier.test.d.ts';

const testConfigPath: Tests_Cli_Commands_Notifier_TestConfigPath = join(tmpdir(), `mailmask-test-notifier-${randomUUID()}.json`);

const baseConfig: Tests_Cli_Commands_Notifier_BaseConfig = {
  destinations: [],
  aliases: [],
  notifiers: [],
  settings: {
    worker_name: 'mailmask',
    base_domain: 'mail.example.com',
    subaddressing: true,
    add_alias_headers: true,
  },
};

const notifiers: Tests_Cli_Commands_Notifier_Notifiers = [
  {
    type: 'apprise',
    name: 'apprise',
    url: 'https://apprise.example.com/notify',
    urls: 'discord://target',
  },
  {
    type: 'discord',
    name: 'discord',
    webhook_url: 'https://discord.com/api/webhooks/one/two',
  },
  {
    type: 'email',
    name: 'email',
    from: 'mailmask@example.com',
    to: 'owner@example.com',
  },
  {
    type: 'gotify',
    name: 'gotify',
    url: 'https://gotify.example.com',
    token: 'token',
  },
  {
    type: 'matrix',
    name: 'matrix',
    homeserver_url: 'https://matrix.example.com',
    room_id: '!room:example.com',
    access_token: 'token',
  },
  {
    type: 'ntfy',
    name: 'ntfy',
    server: 'https://ntfy.example.com',
    topic: 'mailmask',
    token: 'tk_token',
  },
  {
    type: 'ntfy-reverse-proxy',
    name: 'proxy',
    url: 'https://proxy.example.com/mailmask',
  },
  {
    type: 'pushover',
    name: 'pushover',
    user_key: 'user',
    app_token: 'token',
  },
  {
    type: 'slack',
    name: 'slack',
    webhook_url: 'https://hooks.slack.com/services/one/two/three',
  },
  {
    type: 'telegram',
    name: 'telegram',
    bot_token: 'token',
    chat_id: '-100123',
  },
  {
    type: 'webhook',
    name: 'webhook',
    url: 'https://webhook.example.com/mailmask',
    token: 'token',
  },
];

/**
 * Tests - CLI - Commands - Notifier - Notifier Commands.
 *
 * @since 1.0.0
 */
describe('notifier commands', () => {
  beforeEach(() => {
    const configJson: Tests_Cli_Commands_Notifier_NotifierCommands_ConfigJson = JSON.stringify(baseConfig, null, 2);

    writeFileSync(testConfigPath, configJson);

    return;
  });

  afterEach(() => {
    vi.restoreAllMocks();

    if (existsSync(testConfigPath) === true) {
      unlinkSync(testConfigPath);
    }

    return;
  });

  it('adds, lists, tests, and removes every notifier type', async () => {
    for (const notifier of notifiers) {
      addNotifier(testConfigPath, notifier);
    }

    expect(listNotifiers(testConfigPath).map((notifier) => notifier['type'])).toEqual(notifiers.map((notifier) => notifier['type']));

    const fetchSpy: Tests_Cli_Commands_Notifier_NotifierCommands_AddsListsTestsAndRemovesEveryNotifierType_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    const httpNotifiers: Tests_Cli_Commands_Notifier_NotifierCommands_AddsListsTestsAndRemovesEveryNotifierType_HttpNotifiers = notifiers.filter((notifier) => notifier['type'] !== 'email');

    for (const notifier of httpNotifiers) {
      await testNotifier(testConfigPath, notifier['name']);
    }

    expect(fetchSpy).toHaveBeenCalledTimes(10);

    await expect(testNotifier(testConfigPath, 'email')).rejects.toThrow('only a Cloudflare send_email binding');

    for (const notifier of notifiers) {
      removeNotifier(testConfigPath, notifier['name']);
    }

    expect(listNotifiers(testConfigPath)).toHaveLength(0);

    return;
  });

  it('rejects duplicate names, missing names, and failed test requests', async () => {
    addNotifier(testConfigPath, notifiers[0]!);

    expect(() => addNotifier(testConfigPath, notifiers[0]!)).toThrow('already exists');

    await expect(testNotifier(testConfigPath, 'missing')).rejects.toThrow('does not exist');

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('failed', { status: 503 }));

    await expect(testNotifier(testConfigPath, 'apprise')).rejects.toThrow('HTTP 503');

    return;
  });

  return;
});
