import { randomUUID } from 'node:crypto';
import { readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  afterEach, describe, expect, it,
} from 'vitest';

import { generateWranglerToml } from '../../../cli/commands/generate.js';

import type {
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesVarsAndDisablesPublicUrls_OutputPath,
  Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesVarsAndDisablesPublicUrls_Toml,
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

  it('writes vars and disables public urls', () => {
    const outputPath: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesVarsAndDisablesPublicUrls_OutputPath = join(outputDir, 'wrangler.toml');

    generateWranglerToml(sampleConfigPath, outputPath, 'account-123');

    const toml: Tests_Cli_Commands_Generate_GenerateWranglerToml_WritesVarsAndDisablesPublicUrls_Toml = readFileSync(outputPath, 'utf-8');

    expect(toml).toContain('name = "mailmask"');

    expect(toml).toContain('account_id = "account-123"');

    expect(toml).toContain('workers_dev = false');

    expect(toml).toContain('SETTINGS = ');

    expect(toml).toContain('DESTINATIONS = ');

    expect(toml).toContain('ALIASES_PARTS = "1"');

    expect(toml).toContain('ALIASES_1 = ');

    expect(toml).not.toContain('routes');

    return;
  });

  return;
});
