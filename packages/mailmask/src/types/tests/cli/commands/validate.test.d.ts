/**
 * Tests - CLI - Commands - Validate.
 *
 * @since UNRELEASED
 */
export type Tests_Cli_Commands_Validate_TestConfigPath = string;

export type Tests_Cli_Commands_Validate_SampleConfigPath = string;

export type Tests_Cli_Commands_Validate_BaseSettings_WorkerName = string;

export type Tests_Cli_Commands_Validate_BaseSettings_BaseDomain = string;

export type Tests_Cli_Commands_Validate_BaseSettings_UnknownAliasAction = string;

export type Tests_Cli_Commands_Validate_BaseSettings_Subaddressing = boolean;

export type Tests_Cli_Commands_Validate_BaseSettings_AddAliasHeaders = boolean;

export type Tests_Cli_Commands_Validate_BaseSettings = {
  worker_name: Tests_Cli_Commands_Validate_BaseSettings_WorkerName;
  base_domain: Tests_Cli_Commands_Validate_BaseSettings_BaseDomain;
  unknown_alias_action: Tests_Cli_Commands_Validate_BaseSettings_UnknownAliasAction;
  subaddressing: Tests_Cli_Commands_Validate_BaseSettings_Subaddressing;
  add_alias_headers: Tests_Cli_Commands_Validate_BaseSettings_AddAliasHeaders;
};

/**
 * Tests - CLI - Commands - Validate - Validate Config - Accepts The Sample Config.
 *
 * @since UNRELEASED
 */
export type Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result_Valid = boolean;

export type Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result_Errors = string[];

export type Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result = {
  valid: Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result_Valid;
  errors: Tests_Cli_Commands_Validate_ValidateConfig_AcceptsTheSampleConfig_Result_Errors;
};

/**
 * Tests - CLI - Commands - Validate - Validate Config - Reports Missing Destinations And Duplicate Aliases.
 *
 * @since UNRELEASED
 */
export type Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result_Valid = boolean;

export type Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result_Errors = string[];

export type Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result = {
  valid: Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result_Valid;
  errors: Tests_Cli_Commands_Validate_ValidateConfig_ReportsMissingDestinationsAndDuplicateAliases_Result_Errors;
};

/**
 * Tests - CLI - Commands - Validate - Validate Config - Requires A Default Destination When Forwarding Unknown Mail.
 *
 * @since UNRELEASED
 */
export type Tests_Cli_Commands_Validate_ValidateConfig_RequiresADefaultDestinationWhenForwardingUnknownMail_Result_Valid = boolean;

export type Tests_Cli_Commands_Validate_ValidateConfig_RequiresADefaultDestinationWhenForwardingUnknownMail_Result_Errors = string[];

export type Tests_Cli_Commands_Validate_ValidateConfig_RequiresADefaultDestinationWhenForwardingUnknownMail_Result = {
  valid: Tests_Cli_Commands_Validate_ValidateConfig_RequiresADefaultDestinationWhenForwardingUnknownMail_Result_Valid;
  errors: Tests_Cli_Commands_Validate_ValidateConfig_RequiresADefaultDestinationWhenForwardingUnknownMail_Result_Errors;
};
