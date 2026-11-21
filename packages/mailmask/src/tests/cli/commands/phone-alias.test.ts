import { randomUUID } from 'node:crypto';
import {
  existsSync, readFileSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';

import {
  addPhoneAlias,
  describePhoneAliasStatus,
  listPhoneAliases,
  releasePhoneAlias,
  removePhoneAlias,
  setPhoneAliasEnabled,
  setPhoneAliasExpiry,
} from '../../../cli/commands/phone-alias.js';

import type {
  Tests_Cli_Commands_PhoneAlias_BaseConfig,
  Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_AttachesANumberTheAccountOwns_PhoneResult,
  Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_FetchSpy,
  Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_PhoneResult,
  Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_DisablesReDatesRemovesAndReleasesPhoneAliases_ConfigJson,
  Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_DisablesReDatesRemovesAndReleasesPhoneAliases_FetchSpy,
  Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_DisablesReDatesRemovesAndReleasesPhoneAliases_PhoneAliases,
  Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_RefusesUnownedNumbersAndDestinationsWithoutAPhone_FetchSpy,
  Tests_Cli_Commands_PhoneAlias_TestConfigPath,
} from '../../../types/tests/cli/commands/phone-alias.test.d.ts';

const testConfigPath: Tests_Cli_Commands_PhoneAlias_TestConfigPath = join(tmpdir(), `mailmask-test-phone-alias-${randomUUID()}.json`);

const baseConfig: Tests_Cli_Commands_PhoneAlias_BaseConfig = {
  destinations: [
    {
      name: 'personal',
      email: 'me@inbox.test',
      phone: '+15550100300',
    },
    {
      name: 'inbox-only',
      email: 'other@inbox.test',
    },
  ],
  aliases: [],
  phone_providers: [{
    type: 'telnyx',
    name: 'telnyx',
    api_key: 'KEY_TEST_ONLY',
    public_key: 'cHVibGljLWtleS1wbGFjZWhvbGRlci0zMi1ieXRlcyE=',
  }],
  notifiers: [],
  settings: {
    worker_name: 'mailmask',
    base_domain: 'mail.example.com',
    subaddressing: true,
    add_alias_headers: true,
  },
};

/**
 * Tests - CLI - Commands - Phone Alias - Phone Alias Commands.
 *
 * @since 1.2.0
 */
describe('phone alias commands', () => {
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

  it('attaches a number the account owns', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response(JSON.stringify({
      data: [{
        id: 'number-1',
        phone_number: '+15550100100',
      }],
    }), { status: 200 }));

    const phoneResult: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_AttachesANumberTheAccountOwns_PhoneResult = await addPhoneAlias(testConfigPath, {
      number: '+1 (555) 010-0100',
      buy: false,
      provider: 'telnyx',
      destination: 'personal',
      label: 'Food delivery',
      expires: '7d',
      allowedSenders: ['+1555*'],
      blockedSenders: undefined,
    });

    expect(phoneResult['status']).toBe('attached');

    expect(phoneResult['phoneAlias']).toMatchObject({
      number: '+15550100100',
      provider: 'telnyx',
      destination: 'personal',
      label: 'Food delivery',
      enabled: true,
      allowed_senders: ['+1555*'],
    });

    expect(listPhoneAliases(testConfigPath)).toHaveLength(1);

    await expect(addPhoneAlias(testConfigPath, {
      number: '+15550100100',
      buy: false,
      provider: 'telnyx',
      destination: 'personal',
      label: undefined,
      expires: undefined,
      allowedSenders: undefined,
      blockedSenders: undefined,
    })).rejects.toThrow('already exists');

    return;
  });

  it('buys a number when asked', async () => {
    const fetchSpy: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      data: {
        id: 'order-1',
        status: 'pending',
      },
    }), { status: 200 }));
    const phoneResult: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_BuysANumberWhenAsked_PhoneResult = await addPhoneAlias(testConfigPath, {
      number: '+15550100400',
      buy: true,
      provider: 'telnyx',
      destination: 'personal',
      label: undefined,
      expires: undefined,
      allowedSenders: undefined,
      blockedSenders: undefined,
    });

    expect(fetchSpy.mock.calls[0]![0]).toBe('https://api.telnyx.com/v2/number_orders');

    expect(phoneResult['status']).toBe('pending');

    expect(listPhoneAliases(testConfigPath)[0]!['number']).toBe('+15550100400');

    return;
  });

  it('refuses unowned numbers and destinations without a phone', async () => {
    const fetchSpy: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_RefusesUnownedNumbersAndDestinationsWithoutAPhone_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('{"data":[]}', { status: 200 }));

    await expect(addPhoneAlias(testConfigPath, {
      number: '+15550100100',
      buy: false,
      provider: 'telnyx',
      destination: 'inbox-only',
      label: undefined,
      expires: undefined,
      allowedSenders: undefined,
      blockedSenders: undefined,
    })).rejects.toThrow('has no phone number');

    await expect(addPhoneAlias(testConfigPath, {
      number: '+15550100300',
      buy: false,
      provider: 'telnyx',
      destination: 'personal',
      label: undefined,
      expires: undefined,
      allowedSenders: undefined,
      blockedSenders: undefined,
    })).rejects.toThrow('destination\'s own phone number');

    await expect(addPhoneAlias(testConfigPath, {
      number: '+15550100100',
      buy: false,
      provider: 'plivo',
      destination: 'personal',
      label: undefined,
      expires: undefined,
      allowedSenders: undefined,
      blockedSenders: undefined,
    })).rejects.toThrow('Phone provider "plivo" does not exist.');

    expect(fetchSpy).not.toHaveBeenCalled();

    await expect(addPhoneAlias(testConfigPath, {
      number: '+15550100100',
      buy: false,
      provider: 'telnyx',
      destination: 'personal',
      label: undefined,
      expires: undefined,
      allowedSenders: undefined,
      blockedSenders: undefined,
    })).rejects.toThrow('is not on the "telnyx" account');

    expect(listPhoneAliases(testConfigPath)).toHaveLength(0);

    return;
  });

  it('disables, re-dates, removes, and releases phone aliases', async () => {
    const configJson: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_DisablesReDatesRemovesAndReleasesPhoneAliases_ConfigJson = JSON.stringify({
      ...baseConfig,
      phone_aliases: [
        {
          number: '+15550100100',
          provider: 'telnyx',
          destination: 'personal',
          enabled: true,
        },
        {
          number: '+15550100101',
          provider: 'telnyx',
          destination: 'personal',
          enabled: true,
        },
      ],
    });

    writeFileSync(testConfigPath, configJson);

    setPhoneAliasEnabled(testConfigPath, '+1 555 010 0100', false);

    expect(setPhoneAliasExpiry(testConfigPath, '+15550100101', '2027-01-01')).toBe('2027-01-01T00:00:00.000Z');

    const phoneAliases: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_DisablesReDatesRemovesAndReleasesPhoneAliases_PhoneAliases = listPhoneAliases(testConfigPath);

    expect(describePhoneAliasStatus(phoneAliases[0]!, Date.now())).toBe('disabled');

    expect(describePhoneAliasStatus(phoneAliases[1]!, Date.parse('2026-11-20T00:00:00.000Z'))).toBe('expires 2027-01-01T00:00:00.000Z');

    expect(describePhoneAliasStatus(phoneAliases[1]!, Date.parse('2027-02-01T00:00:00.000Z'))).toBe('expired');

    removePhoneAlias(testConfigPath, '+15550100101');

    expect(readFileSync(testConfigPath, 'utf-8')).not.toContain('+15550100101');

    const fetchSpy: Tests_Cli_Commands_PhoneAlias_PhoneAliasCommands_DisablesReDatesRemovesAndReleasesPhoneAliases_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (_input, init) => {
      if (init !== undefined && init['method'] === 'DELETE') {
        return new Response(null, { status: 200 });
      }

      return new Response(JSON.stringify({
        data: [{
          id: 'number-1',
          phone_number: '+15550100100',
        }],
      }), { status: 200 });
    });

    await releasePhoneAlias(testConfigPath, '+15550100100');

    expect(fetchSpy.mock.calls.at(-1)![1]!['method']).toBe('DELETE');

    expect(listPhoneAliases(testConfigPath)).toHaveLength(0);

    expect(() => removePhoneAlias(testConfigPath, '+15550100100')).toThrow('does not exist');

    return;
  });

  return;
});
