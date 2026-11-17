import type { Logger } from '@cbnventures/nova/toolkit';
import type { MockInstance } from 'vitest';

/**
 * Tests - CLI - Commands - Validate.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Validate_TestConfigPath = string;

export type Tests_Cli_Commands_Validate_SampleConfigPath = string;

export type Tests_Cli_Commands_Validate_BaseSettings_WorkerName = string;

export type Tests_Cli_Commands_Validate_BaseSettings_BaseDomain = string;

export type Tests_Cli_Commands_Validate_BaseSettings_Subaddressing = boolean;

export type Tests_Cli_Commands_Validate_BaseSettings_AddAliasHeaders = boolean;

export type Tests_Cli_Commands_Validate_BaseSettings = {
  worker_name: Tests_Cli_Commands_Validate_BaseSettings_WorkerName;
  base_domain: Tests_Cli_Commands_Validate_BaseSettings_BaseDomain;
  subaddressing: Tests_Cli_Commands_Validate_BaseSettings_Subaddressing;
  add_alias_headers: Tests_Cli_Commands_Validate_BaseSettings_AddAliasHeaders;
};

/**
 * Tests - CLI - Commands - Validate - Validate Config - Accepts The Sample Config.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result_Valid = boolean;

export type Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result_Errors = string[];

export type Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result = {
  valid: Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result_Valid;
  errors: Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result_Errors;
};

/**
 * Tests - CLI - Commands - Validate - Validate Config - Ignores Retired Unknown Address Settings With One Notice.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_WarnSpy = MockInstance<typeof Logger['warn']>;

export type Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_FirstResult_Valid = boolean;

export type Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_FirstResult_Errors = string[];

export type Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_FirstResult = {
  valid: Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_FirstResult_Valid;
  errors: Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_FirstResult_Errors;
};

export type Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_SecondResult_Valid = boolean;

export type Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_SecondResult_Errors = string[];

export type Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_SecondResult = {
  valid: Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_SecondResult_Valid;
  errors: Tests_Cli_Commands_Validate_ValidateConfig_IgnoresRetiredUnknownAddressSettingsWithOneNotice_SecondResult_Errors;
};

/**
 * Tests - CLI - Commands - Validate - Validate Config - Reports Missing Destinations And Duplicate Aliases.
 *
 * @since 0.0.1
 */
export type Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result_Valid = boolean;

export type Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result_Errors = string[];

export type Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result = {
  valid: Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result_Valid;
  errors: Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result_Errors;
};
