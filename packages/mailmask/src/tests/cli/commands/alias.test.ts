import { randomUUID } from 'node:crypto';
import {
  existsSync, readFileSync, unlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  afterEach, beforeEach, describe, expect, it,
} from 'vitest';

import {
  addAlias,
  describeAliasStatus,
  generateAddress,
  listAliases,
  parseExpiry,
  removeAlias,
  setAliasEnabled,
  setAliasExpiry,
} from '../../../cli/commands/alias.js';

import type {
  Tests_Cli_Commands_Alias_AliasCommands_AddsACustomAliasWithAnExpiryAndSenderRules_Alias,
  Tests_Cli_Commands_Alias_AliasCommands_ConfigJson,
  Tests_Cli_Commands_Alias_AliasCommands_DisablesChangesExpiryOfAndRemovesAliases_Aliases,
  Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options,
  Tests_Cli_Commands_Alias_BaseConfig,
  Tests_Cli_Commands_Alias_GenerateAddress_GeneratesWordAndRandomStyles_RandomAddress,
  Tests_Cli_Commands_Alias_GenerateAddress_GeneratesWordAndRandomStyles_WordParts,
  Tests_Cli_Commands_Alias_ParseExpiry_HandlesDurationsDatesAndNever_Now,
  Tests_Cli_Commands_Alias_TestConfigPath,
} from '../../../types/tests/cli/commands/alias.test.d.ts';

const testConfigPath: Tests_Cli_Commands_Alias_TestConfigPath = join(tmpdir(), `mailmask-test-alias-${randomUUID()}.json`);

const baseConfig: Tests_Cli_Commands_Alias_BaseConfig = {
  destinations: [{
    name: 'personal',
    email: 'me@inbox.test',
  }],
  aliases: [],
  notifiers: [],
  settings: {
    worker_name: 'mailmask',
    base_domain: 'mail.example.com',
    unknown_alias_action: 'reject',
    subaddressing: true,
    add_alias_headers: true,
  },
};

/**
 * Tests - CLI - Commands - Alias - Generate Address.
 *
 * @since UNRELEASED
 */
describe('generateAddress', () => {
  it('generates word and random styles', () => {
    const wordParts: Tests_Cli_Commands_Alias_GenerateAddress_GeneratesWordAndRandomStyles_WordParts = generateAddress('words').split('-');
    const randomAddress: Tests_Cli_Commands_Alias_GenerateAddress_GeneratesWordAndRandomStyles_RandomAddress = generateAddress('random');

    expect(wordParts).toHaveLength(3);

    expect(Number(wordParts[2])).toBeGreaterThanOrEqual(10);

    expect(randomAddress).toHaveLength(10);

    expect(randomAddress.toLowerCase()).toBe(randomAddress);

    return;
  });

  return;
});

/**
 * Tests - CLI - Commands - Alias - Parse Expiry.
 *
 * @since UNRELEASED
 */
describe('parseExpiry', () => {
  it('handles durations, dates, and never', () => {
    const now: Tests_Cli_Commands_Alias_ParseExpiry_HandlesDurationsDatesAndNever_Now = Date.parse('2026-10-24T00:00:00.000Z');

    expect(parseExpiry('7d', now)).toBe('2026-10-31T00:00:00.000Z');

    expect(parseExpiry('12h', now)).toBe('2026-10-24T12:00:00.000Z');

    expect(parseExpiry('2026-12-31', now)).toBe('2026-12-31T00:00:00.000Z');

    expect(parseExpiry('never', now)).toBeUndefined();

    expect(parseExpiry(undefined, now)).toBeUndefined();

    expect(() => parseExpiry('soon', now)).toThrow('Invalid expiry');

    expect(() => parseExpiry('0d', now)).toThrow('greater than zero');

    return;
  });

  return;
});

/**
 * Tests - CLI - Commands - Alias - Alias Commands.
 *
 * @since UNRELEASED
 */
describe('alias commands', () => {
  beforeEach(() => {
    const configJson: Tests_Cli_Commands_Alias_AliasCommands_ConfigJson = JSON.stringify(baseConfig, null, 2);

    writeFileSync(testConfigPath, configJson);

    return;
  });

  afterEach(() => {
    if (existsSync(testConfigPath) === true) {
      unlinkSync(testConfigPath);
    }

    return;
  });

  it('adds a custom alias with an expiry and sender rules', () => {
    const alias: Tests_Cli_Commands_Alias_AliasCommands_AddsACustomAliasWithAnExpiryAndSenderRules_Alias = addAlias(testConfigPath, {
      address: 'Trial',
      style: 'words',
      destination: 'personal',
      label: 'Free trial',
      expires: '2026-12-31',
      allowedSenders: ['*@saas.test'],
      blockedSenders: undefined,
    });

    expect(alias['address']).toBe('trial');

    expect(alias['expires_at']).toBe('2026-12-31T00:00:00.000Z');

    expect(listAliases(testConfigPath)).toHaveLength(1);

    return;
  });

  it('rejects duplicates and unknown destinations', () => {
    const options: Tests_Cli_Commands_Alias_AliasCommands_RejectsDuplicatesAndUnknownDestinations_Options = {
      address: 'shop',
      style: 'words',
      destination: 'personal',
      label: undefined,
      expires: undefined,
      allowedSenders: undefined,
      blockedSenders: undefined,
    };

    addAlias(testConfigPath, options);

    expect(() => addAlias(testConfigPath, options)).toThrow('already exists');

    expect(() => addAlias(testConfigPath, {
      ...options,
      address: 'other',
      destination: 'missing',
    })).toThrow('does not exist');

    return;
  });

  it('disables, changes expiry of, and removes aliases', () => {
    addAlias(testConfigPath, {
      address: 'shop',
      style: 'words',
      destination: 'personal',
      label: undefined,
      expires: '7d',
      allowedSenders: undefined,
      blockedSenders: undefined,
    });

    setAliasEnabled(testConfigPath, 'shop', false);

    const aliases: Tests_Cli_Commands_Alias_AliasCommands_DisablesChangesExpiryOfAndRemovesAliases_Aliases = listAliases(testConfigPath);

    expect(aliases.map((alias) => describeAliasStatus(alias, Date.now()))).toStrictEqual(['disabled']);

    setAliasExpiry(testConfigPath, 'shop', 'never');

    expect(readFileSync(testConfigPath, 'utf-8')).not.toContain('expires_at');

    removeAlias(testConfigPath, 'shop');

    expect(listAliases(testConfigPath)).toHaveLength(0);

    expect(() => removeAlias(testConfigPath, 'shop')).toThrow('does not exist');

    return;
  });

  return;
});
