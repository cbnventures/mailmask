import type { SpawnSyncReturns } from 'node:child_process';
import type { MxRecord } from 'node:dns';

import type { z } from 'zod';

import type {
  Lib_Schema_AliasConfig,
  Lib_Schema_CloudflareCatchAll,
  Lib_Schema_CloudflareDestinationAddress,
  Lib_Schema_CloudflareDestinationAddresses,
  Lib_Schema_CloudflareEmailRoutingSettings,
  Lib_Schema_CloudflareEnvelope,
  Lib_Schema_CloudflareRoutingRule,
  Lib_Schema_CloudflareRoutingRuleAction,
  Lib_Schema_CloudflareRoutingRuleMatcher,
  Lib_Schema_CloudflareRoutingRules,
  Lib_Schema_CloudflareWorkerDomain,
  Lib_Schema_CloudflareWorkerDomains,
  Lib_Schema_CloudflareZone,
  Lib_Schema_CloudflareZones,
  Lib_Schema_DestinationConfig,
  Lib_Schema_SettingsConfig,
} from '../../lib/schema.d.ts';
import type { Shared_RoutingRulePlan } from '../../shared.d.ts';
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
 * CLI - Commands - Deploy - Build Routing Rule.
 *
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_BuildRoutingRule_WorkerName = string;

export type Cli_Commands_Deploy_BuildRoutingRule_Address = string;

export type Cli_Commands_Deploy_BuildRoutingRule_Returns = Record<string, unknown>;

/**
 * CLI - Commands - Deploy - Cloudflare Request.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_CloudflareRequest_Token = string;

export type Cli_Commands_Deploy_CloudflareRequest_Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Cli_Commands_Deploy_CloudflareRequest_Path = string;

export type Cli_Commands_Deploy_CloudflareRequest_Body = Record<string, unknown> | undefined;

export type Cli_Commands_Deploy_CloudflareRequest_Returns = Promise<unknown>;

export type Cli_Commands_Deploy_CloudflareRequest_Response = Response;

export type Cli_Commands_Deploy_CloudflareRequest_ResponseData = unknown;

export type Cli_Commands_Deploy_CloudflareRequest_Envelope = { [Key in keyof Lib_Schema_CloudflareEnvelope]: Lib_Schema_CloudflareEnvelope[Key] };

export type Cli_Commands_Deploy_CloudflareRequest_ErrorDetails = string;

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

export type Cli_Commands_Deploy_Deploy_ZoneInfo_ZoneId = string;

export type Cli_Commands_Deploy_Deploy_ZoneInfo_AccountId = string;

export type Cli_Commands_Deploy_Deploy_ZoneInfo_ZoneName = string;

export type Cli_Commands_Deploy_Deploy_ZoneInfo = {
  zoneId: Cli_Commands_Deploy_Deploy_ZoneInfo_ZoneId;
  accountId: Cli_Commands_Deploy_Deploy_ZoneInfo_AccountId;
  zoneName: Cli_Commands_Deploy_Deploy_ZoneInfo_ZoneName;
};

export type Cli_Commands_Deploy_Deploy_AccountId = string;

export type Cli_Commands_Deploy_Deploy_Routing = { [Key in keyof Lib_Schema_CloudflareEmailRoutingSettings]: Lib_Schema_CloudflareEmailRoutingSettings[Key] };

export type Cli_Commands_Deploy_Deploy_MissingHostname = string;

export type Cli_Commands_Deploy_Deploy_MissingHostnames = Cli_Commands_Deploy_Deploy_MissingHostname[];

export type Cli_Commands_Deploy_Deploy_RoutingPlan = { [Key in keyof Shared_RoutingRulePlan]: Shared_RoutingRulePlan[Key] };

export type Cli_Commands_Deploy_Deploy_WranglerTomlPath = string;

/**
 * CLI - Commands - Deploy - Deploy Worker.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_DeployWorker_WranglerTomlPath = string;

export type Cli_Commands_Deploy_DeployWorker_Returns = void;

export type Cli_Commands_Deploy_DeployWorker_WranglerCliPath = string;

export type Cli_Commands_Deploy_DeployWorker_DeployResult = SpawnSyncReturns<string>;

/**
 * CLI - Commands - Deploy - Enable Subaddressing.
 *
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_EnableSubaddressing_Token = string;

export type Cli_Commands_Deploy_EnableSubaddressing_ZoneId = string;

export type Cli_Commands_Deploy_EnableSubaddressing_Routing = { [Key in keyof Lib_Schema_CloudflareEmailRoutingSettings]: Lib_Schema_CloudflareEmailRoutingSettings[Key] };

export type Cli_Commands_Deploy_EnableSubaddressing_Returns = Promise<void>;

/**
 * CLI - Commands - Deploy - Ensure Destination Addresses.
 *
 * @since 1.0.0
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

export type Cli_Commands_Deploy_EnsureDestinationAddresses_ExistingAddresses = { [Key in keyof Lib_Schema_CloudflareDestinationAddresses]: Lib_Schema_CloudflareDestinationAddresses[Key] };

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Page = number;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_PageAddresses = { [Key in keyof Lib_Schema_CloudflareDestinationAddresses]: Lib_Schema_CloudflareDestinationAddresses[Key] };

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Result = unknown;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_PendingEmail = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Pending = Cli_Commands_Deploy_EnsureDestinationAddresses_PendingEmail[];

export type Cli_Commands_Deploy_EnsureDestinationAddresses_NormalizedEmail = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Existing = Lib_Schema_CloudflareDestinationAddress | undefined;

/**
 * CLI - Commands - Deploy - Ensure Email Routing Enabled.
 *
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_BaseDomain = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns = Promise<Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing>;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Result = unknown;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing = { [Key in keyof Lib_Schema_CloudflareEmailRoutingSettings]: Lib_Schema_CloudflareEmailRoutingSettings[Key] };

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_MxRecords = MxRecord[];

/**
 * CLI - Commands - Deploy - Find Missing Permissions.
 *
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_FindMissingPermissions_Token = string;

export type Cli_Commands_Deploy_FindMissingPermissions_ZoneId = string;

export type Cli_Commands_Deploy_FindMissingPermissions_AccountId = string;

export type Cli_Commands_Deploy_FindMissingPermissions_Returns = Promise<Cli_Commands_Deploy_FindMissingPermissions_Missing>;

export type Cli_Commands_Deploy_FindMissingPermissions_Probe_Permission = string;

export type Cli_Commands_Deploy_FindMissingPermissions_Probe_Path = string;

export type Cli_Commands_Deploy_FindMissingPermissions_Probe = {
  permission: Cli_Commands_Deploy_FindMissingPermissions_Probe_Permission;
  path: Cli_Commands_Deploy_FindMissingPermissions_Probe_Path;
};

export type Cli_Commands_Deploy_FindMissingPermissions_Probes = Cli_Commands_Deploy_FindMissingPermissions_Probe[];

export type Cli_Commands_Deploy_FindMissingPermissions_Permission = string;

export type Cli_Commands_Deploy_FindMissingPermissions_Missing = Cli_Commands_Deploy_FindMissingPermissions_Permission[];

/**
 * CLI - Commands - Deploy - Get Literal Address.
 *
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_GetLiteralAddress_Rule = { [Key in keyof Lib_Schema_CloudflareRoutingRule]: Lib_Schema_CloudflareRoutingRule[Key] };

export type Cli_Commands_Deploy_GetLiteralAddress_Returns = string | undefined;

export type Cli_Commands_Deploy_GetLiteralAddress_Matcher = Lib_Schema_CloudflareRoutingRuleMatcher | undefined;

/**
 * CLI - Commands - Deploy - Get Zone Info.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_GetZoneInfo_Token = string;

export type Cli_Commands_Deploy_GetZoneInfo_BaseDomain = string;

export type Cli_Commands_Deploy_GetZoneInfo_Returns = Promise<Cli_Commands_Deploy_GetZoneInfo_ZoneInfo>;

export type Cli_Commands_Deploy_GetZoneInfo_ZoneInfo_ZoneId = string;

export type Cli_Commands_Deploy_GetZoneInfo_ZoneInfo_AccountId = string;

export type Cli_Commands_Deploy_GetZoneInfo_ZoneInfo_ZoneName = string;

export type Cli_Commands_Deploy_GetZoneInfo_ZoneInfo = {
  zoneId: Cli_Commands_Deploy_GetZoneInfo_ZoneInfo_ZoneId;
  accountId: Cli_Commands_Deploy_GetZoneInfo_ZoneInfo_AccountId;
  zoneName: Cli_Commands_Deploy_GetZoneInfo_ZoneInfo_ZoneName;
};

export type Cli_Commands_Deploy_GetZoneInfo_Parts = string[];

export type Cli_Commands_Deploy_GetZoneInfo_Candidate = string;

export type Cli_Commands_Deploy_GetZoneInfo_Candidates = Cli_Commands_Deploy_GetZoneInfo_Candidate[];

export type Cli_Commands_Deploy_GetZoneInfo_Result = unknown;

export type Cli_Commands_Deploy_GetZoneInfo_Zones = { [Key in keyof Lib_Schema_CloudflareZones]: Lib_Schema_CloudflareZones[Key] };

export type Cli_Commands_Deploy_GetZoneInfo_FirstZone = Lib_Schema_CloudflareZone | undefined;

/**
 * CLI - Commands - Deploy - Has Permission.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_HasPermission_Token = string;

export type Cli_Commands_Deploy_HasPermission_Path = string;

export type Cli_Commands_Deploy_HasPermission_Returns = Promise<boolean>;

/**
 * CLI - Commands - Deploy - List Routing Rules.
 *
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_ListRoutingRules_Token = string;

export type Cli_Commands_Deploy_ListRoutingRules_ZoneId = string;

export type Cli_Commands_Deploy_ListRoutingRules_Returns = Promise<Cli_Commands_Deploy_ListRoutingRules_Rules>;

export type Cli_Commands_Deploy_ListRoutingRules_Rules = { [Key in keyof Lib_Schema_CloudflareRoutingRules]: Lib_Schema_CloudflareRoutingRules[Key] };

export type Cli_Commands_Deploy_ListRoutingRules_Page = number;

export type Cli_Commands_Deploy_ListRoutingRules_PageRules = { [Key in keyof Lib_Schema_CloudflareRoutingRules]: Lib_Schema_CloudflareRoutingRules[Key] };

export type Cli_Commands_Deploy_ListRoutingRules_Result = unknown;

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
 * @since 1.1.0
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

export type Cli_Commands_Deploy_PlanCustomDomains_Result = unknown;

export type Cli_Commands_Deploy_PlanCustomDomains_Domains = { [Key in keyof Lib_Schema_CloudflareWorkerDomains]: Lib_Schema_CloudflareWorkerDomains[Key] };

export type Cli_Commands_Deploy_PlanCustomDomains_MissingHostname = string;

export type Cli_Commands_Deploy_PlanCustomDomains_MissingHostnames = Cli_Commands_Deploy_PlanCustomDomains_MissingHostname[];

export type Cli_Commands_Deploy_PlanCustomDomains_Conflict = string;

export type Cli_Commands_Deploy_PlanCustomDomains_Conflicts = Cli_Commands_Deploy_PlanCustomDomains_Conflict[];

export type Cli_Commands_Deploy_PlanCustomDomains_Existing = Lib_Schema_CloudflareWorkerDomain | undefined;

/**
 * CLI - Commands - Deploy - Plan Routing Rules.
 *
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_PlanRoutingRules_Token = string;

export type Cli_Commands_Deploy_PlanRoutingRules_ZoneId = string;

export type Cli_Commands_Deploy_PlanRoutingRules_WorkerName = string;

export type Cli_Commands_Deploy_PlanRoutingRules_BaseDomain = string;

export type Cli_Commands_Deploy_PlanRoutingRules_Aliases = Array<Lib_Schema_AliasConfig>;

export type Cli_Commands_Deploy_PlanRoutingRules_Returns = Promise<Cli_Commands_Deploy_PlanRoutingRules_Plan>;

export type Cli_Commands_Deploy_PlanRoutingRules_Rules = { [Key in keyof Lib_Schema_CloudflareRoutingRules]: Lib_Schema_CloudflareRoutingRules[Key] };

export type Cli_Commands_Deploy_PlanRoutingRules_OwnerPrefix = string;

export type Cli_Commands_Deploy_PlanRoutingRules_DomainSuffix = string;

export type Cli_Commands_Deploy_PlanRoutingRules_OwnedRules = { [Key in keyof Lib_Schema_CloudflareRoutingRules]: Lib_Schema_CloudflareRoutingRules[Key] };

export type Cli_Commands_Deploy_PlanRoutingRules_OtherRules = { [Key in keyof Lib_Schema_CloudflareRoutingRules]: Lib_Schema_CloudflareRoutingRules[Key] };

export type Cli_Commands_Deploy_PlanRoutingRules_WantedAddress = string;

export type Cli_Commands_Deploy_PlanRoutingRules_WantedAddresses = Cli_Commands_Deploy_PlanRoutingRules_WantedAddress[];

export type Cli_Commands_Deploy_PlanRoutingRules_Plan = { [Key in keyof Shared_RoutingRulePlan]: Shared_RoutingRulePlan[Key] };

export type Cli_Commands_Deploy_PlanRoutingRules_OwnedRule = Lib_Schema_CloudflareRoutingRule | undefined;

export type Cli_Commands_Deploy_PlanRoutingRules_OwnedAction = Lib_Schema_CloudflareRoutingRuleAction | undefined;

export type Cli_Commands_Deploy_PlanRoutingRules_IsCurrent = boolean;

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

export type Cli_Commands_Deploy_PrintAliasSummary_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Cli_Commands_Deploy_PrintAliasSummary_Now = number;

export type Cli_Commands_Deploy_PrintAliasSummary_StatusDescription = string;

export type Cli_Commands_Deploy_PrintAliasSummary_Status = string;

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
 * @since 1.1.0
 */
export type Cli_Commands_Deploy_ReleaseCatchAll_Token = string;

export type Cli_Commands_Deploy_ReleaseCatchAll_ZoneId = string;

export type Cli_Commands_Deploy_ReleaseCatchAll_WorkerName = string;

export type Cli_Commands_Deploy_ReleaseCatchAll_Returns = Promise<void>;

export type Cli_Commands_Deploy_ReleaseCatchAll_Result = unknown;

export type Cli_Commands_Deploy_ReleaseCatchAll_CatchAll = { [Key in keyof Lib_Schema_CloudflareCatchAll]: Lib_Schema_CloudflareCatchAll[Key] };

export type Cli_Commands_Deploy_ReleaseCatchAll_PointsAtWorker = boolean;

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
 * CLI - Commands - Deploy - Verify Api Token.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_VerifyApiToken_Token = string;

export type Cli_Commands_Deploy_VerifyApiToken_Returns = Promise<boolean>;

export type Cli_Commands_Deploy_VerifyApiToken_Response = Response;

export type Cli_Commands_Deploy_VerifyApiToken_ResponseData = unknown;

export type Cli_Commands_Deploy_VerifyApiToken_Envelope = z.ZodSafeParseResult<Lib_Schema_CloudflareEnvelope>;

/**
 * CLI - Commands - Deploy - Verify Permissions.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_VerifyPermissions_Token = string;

export type Cli_Commands_Deploy_VerifyPermissions_ZoneId = string;

export type Cli_Commands_Deploy_VerifyPermissions_AccountId = string;

export type Cli_Commands_Deploy_VerifyPermissions_Interactive = boolean;

export type Cli_Commands_Deploy_VerifyPermissions_Returns = Promise<string>;

export type Cli_Commands_Deploy_VerifyPermissions_Permission = string;

export type Cli_Commands_Deploy_VerifyPermissions_Missing = Cli_Commands_Deploy_VerifyPermissions_Permission[];

export type Cli_Commands_Deploy_VerifyPermissions_MissingMessage = string;

export type Cli_Commands_Deploy_VerifyPermissions_PromptResult_Ready = boolean | undefined;

export type Cli_Commands_Deploy_VerifyPermissions_PromptResult = {
  ready: Cli_Commands_Deploy_VerifyPermissions_PromptResult_Ready;
};
