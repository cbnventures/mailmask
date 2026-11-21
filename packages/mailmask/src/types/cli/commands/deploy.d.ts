import type {
  Lib_Schema_AliasConfig,
  Lib_Schema_DestinationConfig,
  Lib_Schema_PhoneAliasConfig,
  Lib_Schema_SettingsConfig,
} from '../../lib/schema.d.ts';
import type {
  Shared_CloudflareCatchAll,
  Shared_CloudflareDestinationAddress,
  Shared_CloudflareEmailRouting,
  Shared_CloudflareEmailSendingSetup,
  Shared_CloudflareEmailSendingSetup_Records,
  Shared_CloudflareRoutingRule,
  Shared_CloudflareWorkerDomain,
  Shared_CloudflareWorkersPlan,
  Shared_CloudflareZone,
  Shared_RoutingRulePlan,
} from '../../shared.d.ts';
import type { Cli_Commands_Validate_ValidateConfig_Returns } from './validate.d.ts';

/**
 * CLI - Commands - Deploy - Apply Routing Rules.
 *
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_ApplyRoutingRules_Token = string;

export type Cli_Commands_Deploy_ApplyRoutingRules_ZoneId = string;

export type Cli_Commands_Deploy_ApplyRoutingRules_WorkerName = string;

export type Cli_Commands_Deploy_ApplyRoutingRules_BaseDomain = string;

export type Cli_Commands_Deploy_ApplyRoutingRules_Plan = { [Key in keyof Shared_RoutingRulePlan]: Shared_RoutingRulePlan[Key] };

export type Cli_Commands_Deploy_ApplyRoutingRules_Returns = Promise<void>;

/**
 * CLI - Commands - Deploy - Attach Custom Domains.
 *
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_AttachCustomDomains_Token = string;

export type Cli_Commands_Deploy_AttachCustomDomains_AccountId = string;

export type Cli_Commands_Deploy_AttachCustomDomains_ZoneId = string;

export type Cli_Commands_Deploy_AttachCustomDomains_WorkerName = string;

export type Cli_Commands_Deploy_AttachCustomDomains_Hostname = string;

export type Cli_Commands_Deploy_AttachCustomDomains_Hostnames = Cli_Commands_Deploy_AttachCustomDomains_Hostname[];

export type Cli_Commands_Deploy_AttachCustomDomains_Returns = Promise<void>;

export type Cli_Commands_Deploy_AttachCustomDomains_ErrorMessage = string;

/**
 * CLI - Commands - Deploy - Build Deploy Warnings.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_BuildDeployWarnings_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Commands_Deploy_BuildDeployWarnings_EmailSendingReady = boolean;

export type Cli_Commands_Deploy_BuildDeployWarnings_HasPhoneAliases = boolean;

export type Cli_Commands_Deploy_BuildDeployWarnings_HasPlivo = boolean;

export type Cli_Commands_Deploy_BuildDeployWarnings_WorkersPlan = Shared_CloudflareWorkersPlan;

export type Cli_Commands_Deploy_BuildDeployWarnings_PendingRecord = string;

export type Cli_Commands_Deploy_BuildDeployWarnings_PendingRecords = Cli_Commands_Deploy_BuildDeployWarnings_PendingRecord[];

export type Cli_Commands_Deploy_BuildDeployWarnings_Returns = string[];

export type Cli_Commands_Deploy_BuildDeployWarnings_SendingWarning = string;

export type Cli_Commands_Deploy_BuildDeployWarnings_SendingWarnings = Cli_Commands_Deploy_BuildDeployWarnings_SendingWarning[];

/**
 * CLI - Commands - Deploy - Build Routing Rule Name.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_BuildRoutingRuleName_WorkerName = string;

export type Cli_Commands_Deploy_BuildRoutingRuleName_Address = string;

export type Cli_Commands_Deploy_BuildRoutingRuleName_Returns = string;

/**
 * CLI - Commands - Deploy - Check Email Sending Records.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_CheckEmailSendingRecords_BaseDomain = string;

export type Cli_Commands_Deploy_CheckEmailSendingRecords_Records = Shared_CloudflareEmailSendingSetup_Records;

export type Cli_Commands_Deploy_CheckEmailSendingRecords_Returns = Promise<Cli_Commands_Deploy_CheckEmailSendingRecords_PendingRecords>;

export type Cli_Commands_Deploy_CheckEmailSendingRecords_PendingRecord = string;

export type Cli_Commands_Deploy_CheckEmailSendingRecords_PendingRecords = Cli_Commands_Deploy_CheckEmailSendingRecords_PendingRecord[];

/**
 * CLI - Commands - Deploy - Deploy.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_Deploy_ConfigPath = string;

export type Cli_Commands_Deploy_Deploy_Interactive = boolean;

export type Cli_Commands_Deploy_Deploy_Returns = Promise<void>;

export type Cli_Commands_Deploy_Deploy_Token = string;

export type Cli_Commands_Deploy_Deploy_Result = { [Key in keyof Cli_Commands_Validate_ValidateConfig_Returns]: Cli_Commands_Validate_ValidateConfig_Returns[Key] };

export type Cli_Commands_Deploy_Deploy_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Commands_Deploy_Deploy_ZoneInfo = { [Key in keyof Shared_CloudflareZone]: Shared_CloudflareZone[Key] };

export type Cli_Commands_Deploy_Deploy_AccountId = string;

export type Cli_Commands_Deploy_Deploy_Routing = { [Key in keyof Shared_CloudflareEmailRouting]: Shared_CloudflareEmailRouting[Key] };

export type Cli_Commands_Deploy_Deploy_MissingHostname = string;

export type Cli_Commands_Deploy_Deploy_MissingHostnames = Cli_Commands_Deploy_Deploy_MissingHostname[];

export type Cli_Commands_Deploy_Deploy_RoutingPlan = { [Key in keyof Shared_RoutingRulePlan]: Shared_RoutingRulePlan[Key] };

export type Cli_Commands_Deploy_Deploy_WranglerTomlPath = string;

export type Cli_Commands_Deploy_Deploy_EmailSendingReady = boolean;

export type Cli_Commands_Deploy_Deploy_PendingRecord = string;

export type Cli_Commands_Deploy_Deploy_PendingRecords = Cli_Commands_Deploy_Deploy_PendingRecord[];

export type Cli_Commands_Deploy_Deploy_WorkersPlan = Shared_CloudflareWorkersPlan;

export type Cli_Commands_Deploy_Deploy_SendingRecords = Shared_CloudflareEmailSendingSetup_Records | undefined;

export type Cli_Commands_Deploy_Deploy_ConnectedProvider = string;

export type Cli_Commands_Deploy_Deploy_ConnectedProviders = Cli_Commands_Deploy_Deploy_ConnectedProvider[];

/**
 * CLI - Commands - Deploy - Enable Subaddressing.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_EnableSubaddressing_Token = string;

export type Cli_Commands_Deploy_EnableSubaddressing_ZoneId = string;

export type Cli_Commands_Deploy_EnableSubaddressing_Routing = { [Key in keyof Shared_CloudflareEmailRouting]: Shared_CloudflareEmailRouting[Key] };

export type Cli_Commands_Deploy_EnableSubaddressing_Returns = Promise<void>;

/**
 * CLI - Commands - Deploy - Ensure Destination Addresses.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_EnsureDestinationAddresses_ConfigPath = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Token = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_AccountId = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Returns = Promise<void>;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Destinations = Array<Lib_Schema_DestinationConfig>;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_DestinationEmail = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_DestinationEmails = Cli_Commands_Deploy_EnsureDestinationAddresses_DestinationEmail[];

export type Cli_Commands_Deploy_EnsureDestinationAddresses_EmailNotifierEmail = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_EmailNotifierEmails = Cli_Commands_Deploy_EnsureDestinationAddresses_EmailNotifierEmail[];

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Email = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Emails = Cli_Commands_Deploy_EnsureDestinationAddresses_Email[];

export type Cli_Commands_Deploy_EnsureDestinationAddresses_ExistingAddresses = Shared_CloudflareDestinationAddress[];

export type Cli_Commands_Deploy_EnsureDestinationAddresses_PendingEmail = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Pending = Cli_Commands_Deploy_EnsureDestinationAddresses_PendingEmail[];

export type Cli_Commands_Deploy_EnsureDestinationAddresses_NormalizedEmail = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Existing = Shared_CloudflareDestinationAddress | undefined;

/**
 * CLI - Commands - Deploy - Ensure Email Routing Enabled.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_BaseDomain = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns = Promise<Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing>;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing = { [Key in keyof Shared_CloudflareEmailRouting]: Shared_CloudflareEmailRouting[Key] };

/**
 * CLI - Commands - Deploy - Get Zone Info.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_GetZoneInfo_Token = string;

export type Cli_Commands_Deploy_GetZoneInfo_BaseDomain = string;

export type Cli_Commands_Deploy_GetZoneInfo_Returns = Promise<Shared_CloudflareZone>;

export type Cli_Commands_Deploy_GetZoneInfo_Parts = string[];

export type Cli_Commands_Deploy_GetZoneInfo_Candidate = string;

export type Cli_Commands_Deploy_GetZoneInfo_Candidates = Cli_Commands_Deploy_GetZoneInfo_Candidate[];

export type Cli_Commands_Deploy_GetZoneInfo_Zone = Shared_CloudflareZone | undefined;

/**
 * CLI - Commands - Deploy - Load Env Token.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_LoadEnvToken_Returns = string | undefined;

export type Cli_Commands_Deploy_LoadEnvToken_EnvValue = string | undefined;

export type Cli_Commands_Deploy_LoadEnvToken_Content = string;

export type Cli_Commands_Deploy_LoadEnvToken_Match = RegExpMatchArray | null;

export type Cli_Commands_Deploy_LoadEnvToken_Value = string;

/**
 * CLI - Commands - Deploy - Plan Custom Domains.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_PlanCustomDomains_Token = string;

export type Cli_Commands_Deploy_PlanCustomDomains_AccountId = string;

export type Cli_Commands_Deploy_PlanCustomDomains_ZoneId = string;

export type Cli_Commands_Deploy_PlanCustomDomains_WorkerName = string;

export type Cli_Commands_Deploy_PlanCustomDomains_BaseDomain = string;

export type Cli_Commands_Deploy_PlanCustomDomains_Returns = Promise<Cli_Commands_Deploy_PlanCustomDomains_MissingHostnames>;

export type Cli_Commands_Deploy_PlanCustomDomains_NormalizedBaseDomain = string;

export type Cli_Commands_Deploy_PlanCustomDomains_Hostname = string;

export type Cli_Commands_Deploy_PlanCustomDomains_Hostnames = Cli_Commands_Deploy_PlanCustomDomains_Hostname[];

export type Cli_Commands_Deploy_PlanCustomDomains_Domains = Shared_CloudflareWorkerDomain[];

export type Cli_Commands_Deploy_PlanCustomDomains_MissingHostname = string;

export type Cli_Commands_Deploy_PlanCustomDomains_MissingHostnames = Cli_Commands_Deploy_PlanCustomDomains_MissingHostname[];

export type Cli_Commands_Deploy_PlanCustomDomains_Conflict = string;

export type Cli_Commands_Deploy_PlanCustomDomains_Conflicts = Cli_Commands_Deploy_PlanCustomDomains_Conflict[];

export type Cli_Commands_Deploy_PlanCustomDomains_Existing = Shared_CloudflareWorkerDomain | undefined;

/**
 * CLI - Commands - Deploy - Plan Routing Rules.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_PlanRoutingRules_Token = string;

export type Cli_Commands_Deploy_PlanRoutingRules_ZoneId = string;

export type Cli_Commands_Deploy_PlanRoutingRules_WorkerName = string;

export type Cli_Commands_Deploy_PlanRoutingRules_BaseDomain = string;

export type Cli_Commands_Deploy_PlanRoutingRules_Aliases = Array<Lib_Schema_AliasConfig>;

export type Cli_Commands_Deploy_PlanRoutingRules_Returns = Promise<Cli_Commands_Deploy_PlanRoutingRules_Plan>;

export type Cli_Commands_Deploy_PlanRoutingRules_Rules = Shared_CloudflareRoutingRule[];

export type Cli_Commands_Deploy_PlanRoutingRules_OwnerPrefix = string;

export type Cli_Commands_Deploy_PlanRoutingRules_DomainSuffix = string;

export type Cli_Commands_Deploy_PlanRoutingRules_OwnedRules = Shared_CloudflareRoutingRule[];

export type Cli_Commands_Deploy_PlanRoutingRules_OtherRules = Shared_CloudflareRoutingRule[];

export type Cli_Commands_Deploy_PlanRoutingRules_WantedAddress = string;

export type Cli_Commands_Deploy_PlanRoutingRules_WantedAddresses = Cli_Commands_Deploy_PlanRoutingRules_WantedAddress[];

export type Cli_Commands_Deploy_PlanRoutingRules_Plan = { [Key in keyof Shared_RoutingRulePlan]: Shared_RoutingRulePlan[Key] };

export type Cli_Commands_Deploy_PlanRoutingRules_OwnedRule = Shared_CloudflareRoutingRule | undefined;

export type Cli_Commands_Deploy_PlanRoutingRules_OwnedAddress = string | undefined;

export type Cli_Commands_Deploy_PlanRoutingRules_DomainRuleCount = number;

export type Cli_Commands_Deploy_PlanRoutingRules_ProjectedRuleCount = number;

/**
 * CLI - Commands - Deploy - Print Alias Summary.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_PrintAliasSummary_ConfigPath = string;

export type Cli_Commands_Deploy_PrintAliasSummary_Returns = void;

export type Cli_Commands_Deploy_PrintAliasSummary_Aliases = Array<Lib_Schema_AliasConfig>;

export type Cli_Commands_Deploy_PrintAliasSummary_PhoneAliases = Array<Lib_Schema_PhoneAliasConfig>;

export type Cli_Commands_Deploy_PrintAliasSummary_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Commands_Deploy_PrintAliasSummary_Now = number;

export type Cli_Commands_Deploy_PrintAliasSummary_StatusDescription = string;

export type Cli_Commands_Deploy_PrintAliasSummary_Status = string;

export type Cli_Commands_Deploy_PrintAliasSummary_PhoneStatus = string;

/**
 * CLI - Commands - Deploy - Print Deploy Warnings.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_PrintDeployWarnings_ConfigPath = string;

export type Cli_Commands_Deploy_PrintDeployWarnings_EmailSendingReady = boolean;

export type Cli_Commands_Deploy_PrintDeployWarnings_WorkersPlan = Shared_CloudflareWorkersPlan;

export type Cli_Commands_Deploy_PrintDeployWarnings_PendingRecord = string;

export type Cli_Commands_Deploy_PrintDeployWarnings_PendingRecords = Cli_Commands_Deploy_PrintDeployWarnings_PendingRecord[];

export type Cli_Commands_Deploy_PrintDeployWarnings_Returns = void;

export type Cli_Commands_Deploy_PrintDeployWarnings_Warning = string;

export type Cli_Commands_Deploy_PrintDeployWarnings_Warnings = Cli_Commands_Deploy_PrintDeployWarnings_Warning[];

/**
 * CLI - Commands - Deploy - Prompt For Api Token.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_PromptForApiToken_Returns = Promise<string>;

export type Cli_Commands_Deploy_PromptForApiToken_PromptResult_ApiToken = string | undefined;

export type Cli_Commands_Deploy_PromptForApiToken_PromptResult = {
  apiToken: Cli_Commands_Deploy_PromptForApiToken_PromptResult_ApiToken;
};

export type Cli_Commands_Deploy_PromptForApiToken_Token = string;

/**
 * CLI - Commands - Deploy - Release Catch All.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_ReleaseCatchAll_Token = string;

export type Cli_Commands_Deploy_ReleaseCatchAll_ZoneId = string;

export type Cli_Commands_Deploy_ReleaseCatchAll_WorkerName = string;

export type Cli_Commands_Deploy_ReleaseCatchAll_Returns = Promise<void>;

export type Cli_Commands_Deploy_ReleaseCatchAll_CatchAll = { [Key in keyof Shared_CloudflareCatchAll]: Shared_CloudflareCatchAll[Key] };

/**
 * CLI - Commands - Deploy - Resolve Api Token.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_ResolveApiToken_Interactive = boolean;

export type Cli_Commands_Deploy_ResolveApiToken_Returns = Promise<string>;

export type Cli_Commands_Deploy_ResolveApiToken_EnvToken = string | undefined;

/**
 * CLI - Commands - Deploy - Save Env Token.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_SaveEnvToken_Token = string;

export type Cli_Commands_Deploy_SaveEnvToken_Returns = void;

export type Cli_Commands_Deploy_SaveEnvToken_Content = string;

export type Cli_Commands_Deploy_SaveEnvToken_Regex = RegExp;

/**
 * CLI - Commands - Deploy - Set Up Email Sending.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_SetUpEmailSending_Token = string;

export type Cli_Commands_Deploy_SetUpEmailSending_ZoneId = string;

export type Cli_Commands_Deploy_SetUpEmailSending_ZoneName = string;

export type Cli_Commands_Deploy_SetUpEmailSending_BaseDomain = string;

export type Cli_Commands_Deploy_SetUpEmailSending_Returns = Promise<Shared_CloudflareEmailSendingSetup_Records | undefined>;

export type Cli_Commands_Deploy_SetUpEmailSending_Setup = { [Key in keyof Shared_CloudflareEmailSendingSetup]: Shared_CloudflareEmailSendingSetup[Key] };

export type Cli_Commands_Deploy_SetUpEmailSending_ErrorMessage = string;

/**
 * CLI - Commands - Deploy - Verify Permissions.
 *
 * @since 1.2.0
 */
export type Cli_Commands_Deploy_VerifyPermissions_Token = string;

export type Cli_Commands_Deploy_VerifyPermissions_ZoneId = string;

export type Cli_Commands_Deploy_VerifyPermissions_AccountId = string;

export type Cli_Commands_Deploy_VerifyPermissions_Interactive = boolean;

export type Cli_Commands_Deploy_VerifyPermissions_EmailSending = boolean;

export type Cli_Commands_Deploy_VerifyPermissions_Returns = Promise<string>;

export type Cli_Commands_Deploy_VerifyPermissions_Permission = string;

export type Cli_Commands_Deploy_VerifyPermissions_Missing = Cli_Commands_Deploy_VerifyPermissions_Permission[];

export type Cli_Commands_Deploy_VerifyPermissions_MissingMessage = string;

export type Cli_Commands_Deploy_VerifyPermissions_PromptResult_Ready = boolean | undefined;

export type Cli_Commands_Deploy_VerifyPermissions_PromptResult = {
  ready: Cli_Commands_Deploy_VerifyPermissions_PromptResult_Ready;
};
