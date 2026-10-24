import { randomUUID } from 'node:crypto';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  afterEach, describe, expect, it,
} from 'vitest';

import { validateConfig } from '../../../cli/commands/validate.js';

import type {
  Tests_Cli_Commands_Validate_BaseSettings,
  Tests_Cli_Commands_Validate_SampleConfigPath,
  Tests_Cli_Commands_Validate_TestConfigPath,
  Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result,
  Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result,
  Tests_Cli_Commands_Validate_ValidateConfig_RequiresADefaultDestinationWhenForwardingUnknownMail_Result,
} from '../../../types/tests/cli/commands/validate.test.d.ts';

const testConfigPath: Tests_Cli_Commands_Validate_TestConfigPath = join(tmpdir(), `mailmask-test-validate-${randomUUID()}.json`);

const sampleConfigPath: Tests_Cli_Commands_Validate_SampleConfigPath = join(dirname(fileURLToPath(import.meta.url)), '../../../../../../config.sample.json');

const baseSettings: Tests_Cli_Commands_Validate_BaseSettings = {
  worker_name: 'mailmask',
  base_domain: 'mail.example.com',
  unknown_alias_action: 'reject',
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

  it('requires a default destination when forwarding unknown mail', () => {
    writeFileSync(testConfigPath, JSON.stringify({
      destinations: [],
      aliases: [],
      notifiers: [],
      settings: {
        ...baseSettings,
        unknown_alias_action: 'forward',
      },
    }));

    const result: Tests_Cli_Commands_Validate_ValidateConfig_RequiresADefaultDestinationWhenForwardingUnknownMail_Result = validateConfig(testConfigPath);

    expect(result['errors'][0]).toContain('default_destination');

    return;
  });

  return;
});
