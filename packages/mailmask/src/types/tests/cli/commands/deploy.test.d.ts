import type { resolveMx } from 'node:dns/promises';

import type { Mock, MockInstance } from 'vitest';

import type { Cli_Commands_Deploy_PlanRoutingRules_Plan } from '../../../cli/commands/deploy.d.ts';
import type {
  Lib_Schema_AliasConfig,
  Lib_Schema_CloudflareEmailRoutingSettings,
  Lib_Schema_CloudflareRoutingRule,
} from '../../../lib/schema.d.ts';

/**
 * Tests - CLI - Commands - Deploy.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_Alias = Lib_Schema_AliasConfig & {};

export type Tests_Cli_Commands_Deploy_Aliases = Tests_Cli_Commands_Deploy_Alias[];

/**
 * Tests - CLI - Commands - Deploy - Apply Routing Rules - Creates Updates And Deletes From The Plan.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_ApplyRoutingRules_CreatesUpdatesAndDeletesFromThePlan_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - CLI - Commands - Deploy - Attach Custom Domains - Attaches Each Missing Host To The Worker.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_AttachCustomDomains_AttachesEachMissingHostToTheWorker_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - CLI - Commands - Deploy - Attach Custom Domains - Warns And Continues When Cloudflare Refuses A Host.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_AttachCustomDomains_WarnsAndContinuesWhenCloudflareRefusesAHost_CallCount = number;

export type Tests_Cli_Commands_Deploy_AttachCustomDomains_WarnsAndContinuesWhenCloudflareRefusesAHost_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - CLI - Commands - Deploy - Cloudflare Response.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_CloudflareResponse_Success = boolean;

export type Tests_Cli_Commands_Deploy_CloudflareResponse_Result = unknown;

export type Tests_Cli_Commands_Deploy_CloudflareResponse_Returns = Response;

/**
 * Tests - CLI - Commands - Deploy - Describe Requests.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_DescribeRequests_Calls = MockInstance<typeof fetch>['mock']['calls'];

export type Tests_Cli_Commands_Deploy_DescribeRequests_Returns_Entry_Request = string;

export type Tests_Cli_Commands_Deploy_DescribeRequests_Returns_Entry_Body = unknown;

export type Tests_Cli_Commands_Deploy_DescribeRequests_Returns_Entry = {
  request: Tests_Cli_Commands_Deploy_DescribeRequests_Returns_Entry_Request;
  body: Tests_Cli_Commands_Deploy_DescribeRequests_Returns_Entry_Body;
};

export type Tests_Cli_Commands_Deploy_DescribeRequests_Returns = Tests_Cli_Commands_Deploy_DescribeRequests_Returns_Entry[];

export type Tests_Cli_Commands_Deploy_DescribeRequests_Init = RequestInit | undefined;

export type Tests_Cli_Commands_Deploy_DescribeRequests_Method = string;

/**
 * Tests - CLI - Commands - Deploy - Enable Subaddressing - Turns Subaddressing On Only When Cloudflare Has It Off.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_EnableSubaddressing_TurnsSubaddressingOnOnlyWhenCloudflareHasItOff_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - CLI - Commands - Deploy - Ensure Email Routing Enabled - Accepts A Subdomain Whose Mx Records Point To Cloudflare.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_EnsureEmailRoutingEnabled_AcceptsASubdomainWhoseMxRecordsPointToCloudflare_Routing = { [Key in keyof Lib_Schema_CloudflareEmailRoutingSettings]: Lib_Schema_CloudflareEmailRoutingSettings[Key] };

/**
 * Tests - CLI - Commands - Deploy - Ensure Email Routing Enabled - Stops For An Apex Without Email Routing.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_EnsureEmailRoutingEnabled_StopsForAnApexWithoutEmailRouting_RoutingCheck = Promise<Lib_Schema_CloudflareEmailRoutingSettings>;

/**
 * Tests - CLI - Commands - Deploy - Ensure Email Routing Enabled - Stops For A Subdomain Without Cloudflare Mx Records.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_EnsureEmailRoutingEnabled_StopsForASubdomainWithoutCloudflareMxRecords_RoutingCheck = Promise<Lib_Schema_CloudflareEmailRoutingSettings>;

/**
 * Tests - CLI - Commands - Deploy - Find Missing Permissions - Names Each Missing Permission.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Case_Permission = string;

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Case_FailingPath = string;

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Case_FailingPaths = Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Case_FailingPath[];

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Case = {
  permission: Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Case_Permission;
  failingPaths: Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Case_FailingPaths;
};

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Cases = Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Case[];

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Permission = string;

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Missing = Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Permission[];

/**
 * Tests - CLI - Commands - Deploy - Find Missing Permissions - Names Each Permission Once When Every Probe Fails.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachPermissionOnceWhenEveryProbeFails_Permission = string;

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachPermissionOnceWhenEveryProbeFails_Missing = Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachPermissionOnceWhenEveryProbeFails_Permission[];

/**
 * Tests - CLI - Commands - Deploy - Find Missing Permissions - Returns Nothing When Every Probe Succeeds.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Permission = string;

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Missing = Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Permission[];

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Path = string;

export type Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Paths = Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Path[];

/**
 * Tests - CLI - Commands - Deploy - Get Request Path.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_GetRequestPath_Input = Parameters<typeof fetch>[0];

export type Tests_Cli_Commands_Deploy_GetRequestPath_Returns = string;

export type Tests_Cli_Commands_Deploy_GetRequestPath_Url = URL;

/**
 * Tests - CLI - Commands - Deploy - Node Dns Promises.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_NodeDnsPromises_ResolveMxMock = Mock<typeof resolveMx>;

/**
 * Tests - CLI - Commands - Deploy - Owned Rule.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_OwnedRule_Id = string;

export type Tests_Cli_Commands_Deploy_OwnedRule_WorkerName = string;

export type Tests_Cli_Commands_Deploy_OwnedRule_Address = string;

export type Tests_Cli_Commands_Deploy_OwnedRule_Returns = { [Key in keyof Lib_Schema_CloudflareRoutingRule]: Lib_Schema_CloudflareRoutingRule[Key] };

/**
 * Tests - CLI - Commands - Deploy - Plan Custom Domains - Reruns Without Changes Once Both Hosts Are Attached.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanCustomDomains_RerunsWithoutChangesOnceBothHostsAreAttached_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Cli_Commands_Deploy_PlanCustomDomains_RerunsWithoutChangesOnceBothHostsAreAttached_MissingHostname = string;

export type Tests_Cli_Commands_Deploy_PlanCustomDomains_RerunsWithoutChangesOnceBothHostsAreAttached_MissingHostnames = Tests_Cli_Commands_Deploy_PlanCustomDomains_RerunsWithoutChangesOnceBothHostsAreAttached_MissingHostname[];

/**
 * Tests - CLI - Commands - Deploy - Plan Custom Domains - Returns Both Hosts When None Are Attached.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_MissingHostname = string;

export type Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_MissingHostnames = Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_MissingHostname[];

export type Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_RequestUrlEntry = string;

export type Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_RequestUrl = Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_RequestUrlEntry[];

/**
 * Tests - CLI - Commands - Deploy - Plan Custom Domains - Returns Only The Missing Host When One Is Attached.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsOnlyTheMissingHostWhenOneIsAttached_MissingHostname = string;

export type Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsOnlyTheMissingHostWhenOneIsAttached_MissingHostnames = Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsOnlyTheMissingHostWhenOneIsAttached_MissingHostname[];

/**
 * Tests - CLI - Commands - Deploy - Plan Custom Domains - Stops Before Any Change When Another Worker Owns A Host.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanCustomDomains_StopsBeforeAnyChangeWhenAnotherWorkerOwnsAHost_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - CLI - Commands - Deploy - Plan Routing Rules - Creates A Rule For Each Enabled Alias.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanRoutingRules_CreatesARuleForEachEnabledAlias_Plan = { [Key in keyof Cli_Commands_Deploy_PlanRoutingRules_Plan]: Cli_Commands_Deploy_PlanRoutingRules_Plan[Key] };

/**
 * Tests - CLI - Commands - Deploy - Plan Routing Rules - Keeps Two Workers On One Zone Apart.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanRoutingRules_KeepsTwoWorkersOnOneZoneApart_Plan = { [Key in keyof Cli_Commands_Deploy_PlanRoutingRules_Plan]: Cli_Commands_Deploy_PlanRoutingRules_Plan[Key] };

/**
 * Tests - CLI - Commands - Deploy - Plan Routing Rules - Never Touches Rules It Did Not Create.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanRoutingRules_NeverTouchesRulesItDidNotCreate_Plan = { [Key in keyof Cli_Commands_Deploy_PlanRoutingRules_Plan]: Cli_Commands_Deploy_PlanRoutingRules_Plan[Key] };

/**
 * Tests - CLI - Commands - Deploy - Plan Routing Rules - Reruns Without Changes Once The Rules Match.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanRoutingRules_RerunsWithoutChangesOnceTheRulesMatch_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Cli_Commands_Deploy_PlanRoutingRules_RerunsWithoutChangesOnceTheRulesMatch_Plan = { [Key in keyof Cli_Commands_Deploy_PlanRoutingRules_Plan]: Cli_Commands_Deploy_PlanRoutingRules_Plan[Key] };

/**
 * Tests - CLI - Commands - Deploy - Plan Routing Rules - Stops Before The Rule Limit Counting Rules Others Own.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanRoutingRules_StopsBeforeTheRuleLimitCountingRulesOthersOwn_OtherRule = Lib_Schema_CloudflareRoutingRule & {};

export type Tests_Cli_Commands_Deploy_PlanRoutingRules_StopsBeforeTheRuleLimitCountingRulesOthersOwn_OtherRules = Tests_Cli_Commands_Deploy_PlanRoutingRules_StopsBeforeTheRuleLimitCountingRulesOthersOwn_OtherRule[];

/**
 * Tests - CLI - Commands - Deploy - Plan Routing Rules - Updates Changed Rules And Removes Rules For Gone Or Disabled Aliases.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_PlanRoutingRules_UpdatesChangedRulesAndRemovesRulesForGoneOrDisabledAliases_Plan = { [Key in keyof Cli_Commands_Deploy_PlanRoutingRules_Plan]: Cli_Commands_Deploy_PlanRoutingRules_Plan[Key] };

/**
 * Tests - CLI - Commands - Deploy - Release Catch All - Leaves A Catch All That Points Elsewhere Alone.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_ReleaseCatchAll_LeavesACatchAllThatPointsElsewhereAlone_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - CLI - Commands - Deploy - Release Catch All - Migrates A 1.0.0 Zone Whose Catch All Points At This Worker.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_Method = string;

export type Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_Path = string;

export type Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_Plan = { [Key in keyof Cli_Commands_Deploy_PlanRoutingRules_Plan]: Cli_Commands_Deploy_PlanRoutingRules_Plan[Key] };

/**
 * Tests - CLI - Commands - Deploy - Rules Response.
 *
 * @since 1.1.0
 */
export type Tests_Cli_Commands_Deploy_RulesResponse_Input = Parameters<typeof fetch>[0];

export type Tests_Cli_Commands_Deploy_RulesResponse_Rule = Lib_Schema_CloudflareRoutingRule & {};

export type Tests_Cli_Commands_Deploy_RulesResponse_Rules = Tests_Cli_Commands_Deploy_RulesResponse_Rule[];

export type Tests_Cli_Commands_Deploy_RulesResponse_Returns = Response;

export type Tests_Cli_Commands_Deploy_RulesResponse_Page = number;
