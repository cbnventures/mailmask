import { randomUUID } from 'node:crypto';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import {
  addPhoneProvider,
  checkPhoneProvider,
  connectPhoneProviders,
  listPhoneProviders,
  removePhoneProvider,
} from '../../../cli/commands/phone-provider.js';

import type {
  Tests_Cli_Commands_PhoneProvider_BaseConfig,
  Tests_Cli_Commands_PhoneProvider_PhoneProviderCommands_AddsAndRemovesProviders_Providers,
  Tests_Cli_Commands_PhoneProvider_PhoneProviderCommands_ChecksAndConnectsProviders_Connected,
  Tests_Cli_Commands_PhoneProvider_PhoneProviderCommands_ChecksAndConnectsProviders_FetchSpy,
  Tests_Cli_Commands_PhoneProvider_TestConfigPath,
} from '../../../types/tests/cli/commands/phone-provider.test.d.ts';

const testConfigPath: Tests_Cli_Commands_PhoneProvider_TestConfigPath = join(tmpdir(), `mailmask-test-phone-provider-${randomUUID()}.json`);

const baseConfig: Tests_Cli_Commands_PhoneProvider_BaseConfig = {
  destinations: [{
    name: 'personal',
    email: 'me@inbox.test',
    phone: '+15550100300',
  }],
  aliases: [],
  notifiers: [],
  settings: {
    worker_name: 'mailmask',
    base_domain: 'mail.example.com',
    subaddressing: true,
    add_alias_headers: true,
  },
};

/**
 * Tests - CLI - Commands - Phone Provider - Phone Provider Commands.
 *
 * @since 1.2.0
 */
describe('phone provider commands', () => {
  beforeEach(() => {
    writeFileSync(testConfigPath, JSON.stringify(baseConfig));

    return;
  });

  afterEach(() => {
    if (existsSync(testConfigPath) === true) {
      unlinkSync(testConfigPath);
    }

    vi.restoreAllMocks();

    return;
  });

  it('adds and removes providers', () => {
    addPhoneProvider(testConfigPath, {
      type: 'plivo',
      name: 'plivo',
      auth_id: 'MATESTONLY0000000000',
      auth_token: 'test-auth-token-only',
    });

    const providers: Tests_Cli_Commands_PhoneProvider_PhoneProviderCommands_AddsAndRemovesProviders_Providers = listPhoneProviders(testConfigPath);

    expect(providers).toHaveLength(1);

    expect(() => addPhoneProvider(testConfigPath, {
      type: 'plivo',
      name: 'plivo',
      auth_id: 'MATESTONLY0000000000',
      auth_token: 'test-auth-token-only',
    })).toThrow('already exists');

    expect(() => addPhoneProvider(testConfigPath, {
      type: 'telnyx',
      name: 'Bad Name',
      api_key: 'KEY_TEST_ONLY',
      public_key: 'cHVibGljLWtleQ==',
    })).toThrow();

    removePhoneProvider(testConfigPath, 'plivo');

    expect(listPhoneProviders(testConfigPath)).toHaveLength(0);

    expect(() => removePhoneProvider(testConfigPath, 'plivo')).toThrow('does not exist');

    return;
  });

  it('checks and connects providers', async () => {
    writeFileSync(testConfigPath, JSON.stringify({
      ...baseConfig,
      phone_providers: [
        {
          type: 'telnyx',
          name: 'telnyx',
          api_key: 'KEY_TEST_ONLY',
          public_key: 'cHVibGljLWtleS1wbGFjZWhvbGRlci0zMi1ieXRlcyE=',
        },
        {
          type: 'plivo',
          name: 'unused',
          auth_id: 'MATESTONLY0000000000',
          auth_token: 'test-auth-token-only',
        },
      ],
      phone_aliases: [{
        number: '+15550100100',
        provider: 'telnyx',
        destination: 'personal',
        enabled: true,
      }],
    }));

    const fetchSpy: Tests_Cli_Commands_PhoneProvider_PhoneProviderCommands_ChecksAndConnectsProviders_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('{"data":{"id":"profile-1","balance":"1.00"}}', { status: 200 }));

    await checkPhoneProvider(testConfigPath, 'telnyx');

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://api.telnyx.com/v2/balance');

    expect(() => removePhoneProvider(testConfigPath, 'telnyx')).toThrow('is still used by: +15550100100');

    const connected: Tests_Cli_Commands_PhoneProvider_PhoneProviderCommands_ChecksAndConnectsProviders_Connected = await connectPhoneProviders(testConfigPath, 'https://mail.example.com');

    expect(connected).toEqual(['telnyx']);

    expect(listPhoneProviders(testConfigPath)).toEqual([
      {
        type: 'telnyx',
        name: 'telnyx',
        api_key: 'KEY_TEST_ONLY',
        public_key: 'cHVibGljLWtleS1wbGFjZWhvbGRlci0zMi1ieXRlcyE=',
        messaging_profile_id: 'profile-1',
      },
      {
        type: 'plivo',
        name: 'unused',
        auth_id: 'MATESTONLY0000000000',
        auth_token: 'test-auth-token-only',
      },
    ]);

    fetchSpy.mockImplementation(async () => new Response('{"errors":[]}', { status: 401 }));

    await expect(checkPhoneProvider(testConfigPath, 'telnyx')).rejects.toThrow('rejected the API key');

    return;
  });

  return;
});
