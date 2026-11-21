import { randomUUID } from 'node:crypto';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Logger } from '@cbnventures/nova/toolkit';
import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { validateConfig } from '../../../cli/commands/validate.js';

import type {
  Tests_Cli_Commands_Validate_BaseSettings,
  Tests_Cli_Commands_Validate_SampleConfigPath,
  Tests_Cli_Commands_Validate_TestConfigPath,
  Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result,
  Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_FirstResult,
  Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_SecondResult,
  Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_WarnSpy,
  Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result,
  Tests_Cli_Commands_Validate_ValidateConfig_ReportsPhoneAliasProblems_Result,
} from '../../../types/tests/cli/commands/validate.test.d.ts';

const testConfigPath: Tests_Cli_Commands_Validate_TestConfigPath = join(tmpdir(), `mailmask-test-validate-${randomUUID()}.json`);

const sampleConfigPath: Tests_Cli_Commands_Validate_SampleConfigPath = join(dirname(fileURLToPath(import.meta.url)), '../../../../../../config.sample.json');

const baseSettings: Tests_Cli_Commands_Validate_BaseSettings = {
  worker_name: 'mailmask',
  base_domain: 'mail.example.com',
  subaddressing: true,
  add_alias_headers: true,
};

/**
 * Tests - CLI - Commands - Validate - Config.
 *
 * @since 0.0.1
 */
describe('validateConfig', () => {
  afterEach(() => {
    if (existsSync(testConfigPath) === true) {
      unlinkSync(testConfigPath);
    }

    return;
  });

  it('accepts the sample config', () => {
    const result: Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result = validateConfig(sampleConfigPath);

    expect(result).toStrictEqual({
      valid: true,
      errors: [],
    });

    return;
  });

  it('reports missing destinations and duplicate aliases', () => {
    writeFileSync(testConfigPath, JSON.stringify({
      destinations: [],
      aliases: [
        {
          address: 'shop',
          destination: 'personal',
          enabled: true,
        },
        {
          address: 'shop',
          destination: 'personal',
          enabled: true,
        },
      ],
      notifiers: [],
      settings: baseSettings,
    }));

    const result: Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result = validateConfig(testConfigPath);

    expect(result['valid']).toBe(false);

    expect(result['errors']).toContain('Alias "shop": destination "personal" does not exist (missing).');

    expect(result['errors']).toContain('Duplicate alias address "shop".');

    return;
  });

  it('ignores retired unknown address settings with one notice', () => {
    const warnSpy: Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_WarnSpy = vi.spyOn(Logger, 'warn').mockImplementation(() => undefined);

    writeFileSync(testConfigPath, JSON.stringify({
      destinations: [{
        name: 'personal',
        email: 'me@inbox.test',
      }],
      aliases: [],
      notifiers: [],
      settings: {
        ...baseSettings,
        unknown_alias_action: 'forward',
        default_destination: 'personal',
      },
    }));

    const firstResult: Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_FirstResult = validateConfig(testConfigPath);
    const secondResult: Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_SecondResult = validateConfig(testConfigPath);

    expect(firstResult).toStrictEqual({
      valid: true,
      errors: [],
    });

    expect(secondResult['valid']).toBe(true);

    expect(warnSpy).toHaveBeenCalledTimes(1);

    expect(warnSpy.mock.calls[0]).toEqual([expect.stringContaining('Ignoring unknown_alias_action and default_destination')]);

    vi.restoreAllMocks();

    return;
  });

  it('reports phone alias problems', () => {
    writeFileSync(testConfigPath, JSON.stringify({
      destinations: [
        {
          name: 'personal',
          email: 'me@inbox.test',
          phone: '+15550100101',
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
      phone_aliases: [
        {
          number: '+15550100100',
          provider: 'missing',
          destination: 'inbox-only',
          enabled: true,
        },
        {
          number: '+15550100101',
          provider: 'telnyx',
          destination: 'personal',
          enabled: true,
        },
        {
          number: '+15550100101',
          provider: 'telnyx',
          destination: 'nobody',
          enabled: true,
        },
      ],
      notifiers: [],
      settings: baseSettings,
    }));

    const result: Tests_Cli_Commands_Validate_ValidateConfig_ReportsPhoneAliasProblems_Result = validateConfig(testConfigPath);

    expect(result['valid']).toBe(false);

    expect(result['errors']).toEqual([
      'Phone alias "+15550100100": phone provider "missing" does not exist (missing).',
      'Phone alias "+15550100100": destination "inbox-only" has no phone number to text.',
      'Phone alias "+15550100101" is also a destination phone number.',
      'Duplicate phone alias number "+15550100101".',
      'Phone alias "+15550100101": destination "nobody" does not exist (missing).',
      'Phone alias "+15550100101" is also a destination phone number.',
    ]);

    return;
  });

  return;
});
