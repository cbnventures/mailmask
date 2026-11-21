import type { z } from 'zod';

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
} from '../shared.d.ts';
import type {
  Lib_Schema_CloudflareCatchAll,
  Lib_Schema_CloudflareDestinationAddresses,
  Lib_Schema_CloudflareDnsRecords,
  Lib_Schema_CloudflareEmailRoutingSettings,
  Lib_Schema_CloudflareEnvelope,
  Lib_Schema_CloudflareRoutingRule,
  Lib_Schema_CloudflareRoutingRuleAction,
  Lib_Schema_CloudflareRoutingRuleMatcher,
  Lib_Schema_CloudflareRoutingRules,
  Lib_Schema_CloudflareSendingSubdomain,
  Lib_Schema_CloudflareSendingSubdomains,
  Lib_Schema_CloudflareSubscriptions,
  Lib_Schema_CloudflareWorkerDomains,
  Lib_Schema_CloudflareZone,
  Lib_Schema_CloudflareZones,
} from './schema.d.ts';

/**
 * Lib - Cloudflare - Runner - Attach Worker Domain.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_AttachWorkerDomain_Token = string;

export type Lib_Cloudflare_Runner_AttachWorkerDomain_AccountId = string;

export type Lib_Cloudflare_Runner_AttachWorkerDomain_ZoneId = string;

export type Lib_Cloudflare_Runner_AttachWorkerDomain_Hostname = string;

export type Lib_Cloudflare_Runner_AttachWorkerDomain_WorkerName = string;

export type Lib_Cloudflare_Runner_AttachWorkerDomain_Returns = Promise<void>;

/**
 * Lib - Cloudflare - Runner - Build Routing Rule Body.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_BuildRoutingRuleBody_Name = string;

export type Lib_Cloudflare_Runner_BuildRoutingRuleBody_Address = string;

export type Lib_Cloudflare_Runner_BuildRoutingRuleBody_WorkerName = string;

export type Lib_Cloudflare_Runner_BuildRoutingRuleBody_Returns = Record<string, unknown>;

/**
 * Lib - Cloudflare - Runner - Create Destination Address.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_CreateDestinationAddress_Token = string;

export type Lib_Cloudflare_Runner_CreateDestinationAddress_AccountId = string;

export type Lib_Cloudflare_Runner_CreateDestinationAddress_Email = string;

export type Lib_Cloudflare_Runner_CreateDestinationAddress_Returns = Promise<void>;

/**
 * Lib - Cloudflare - Runner - Create Routing Rule.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_CreateRoutingRule_Token = string;

export type Lib_Cloudflare_Runner_CreateRoutingRule_ZoneId = string;

export type Lib_Cloudflare_Runner_CreateRoutingRule_Name = string;

export type Lib_Cloudflare_Runner_CreateRoutingRule_Address = string;

export type Lib_Cloudflare_Runner_CreateRoutingRule_WorkerName = string;

export type Lib_Cloudflare_Runner_CreateRoutingRule_Returns = Promise<void>;

/**
 * Lib - Cloudflare - Runner - Delete Routing Rule.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_DeleteRoutingRule_Token = string;

export type Lib_Cloudflare_Runner_DeleteRoutingRule_ZoneId = string;

export type Lib_Cloudflare_Runner_DeleteRoutingRule_Id = string;

export type Lib_Cloudflare_Runner_DeleteRoutingRule_Returns = Promise<void>;

/**
 * Lib - Cloudflare - Runner - Deploy Worker.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_DeployWorker_WranglerTomlPath = string;

export type Lib_Cloudflare_Runner_DeployWorker_Returns = void;

export type Lib_Cloudflare_Runner_DeployWorker_WranglerCliPath = string;

export type Lib_Cloudflare_Runner_DeployWorker_DeployResult_Status = number | null;

export type Lib_Cloudflare_Runner_DeployWorker_DeployResult = {
  status: Lib_Cloudflare_Runner_DeployWorker_DeployResult_Status;
};

/**
 * Lib - Cloudflare - Runner - Disable Catch All.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_DisableCatchAll_Token = string;

export type Lib_Cloudflare_Runner_DisableCatchAll_ZoneId = string;

export type Lib_Cloudflare_Runner_DisableCatchAll_Name = string;

export type Lib_Cloudflare_Runner_DisableCatchAll_Returns = Promise<void>;

/**
 * Lib - Cloudflare - Runner - Enable Subaddressing.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_EnableSubaddressing_Token = string;

export type Lib_Cloudflare_Runner_EnableSubaddressing_ZoneId = string;

export type Lib_Cloudflare_Runner_EnableSubaddressing_Returns = Promise<void>;

/**
 * Lib - Cloudflare - Runner - Ensure Email Sending Domain.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Token = string;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ZoneId = string;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ZoneName = string;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Domain = string;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Returns = Promise<Shared_CloudflareEmailSendingSetup>;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_NormalizedDomain = string;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ListResult = unknown;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Subdomains = { [Key in keyof Lib_Schema_CloudflareSendingSubdomains]: Lib_Schema_CloudflareSendingSubdomains[Key] };

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Subdomain = Lib_Schema_CloudflareSendingSubdomain | undefined;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Created = boolean;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_CreateResult = unknown;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExpectedResult = unknown;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExpectedRecords = { [Key in keyof Lib_Schema_CloudflareDnsRecords]: Lib_Schema_CloudflareDnsRecords[Key] };

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_AddedRecord = string;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_AddedRecords = Lib_Cloudflare_Runner_EnsureEmailSendingDomain_AddedRecord[];

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Records = Shared_CloudflareEmailSendingSetup_Records;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_RecordName = string;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExistingResult = unknown;

export type Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExistingRecords = { [Key in keyof Lib_Schema_CloudflareDnsRecords]: Lib_Schema_CloudflareDnsRecords[Key] };

/**
 * Lib - Cloudflare - Runner - Find Missing Permissions.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_FindMissingPermissions_Token = string;

export type Lib_Cloudflare_Runner_FindMissingPermissions_ZoneId = string;

export type Lib_Cloudflare_Runner_FindMissingPermissions_AccountId = string;

export type Lib_Cloudflare_Runner_FindMissingPermissions_EmailSending = boolean;

export type Lib_Cloudflare_Runner_FindMissingPermissions_Returns = Promise<Lib_Cloudflare_Runner_FindMissingPermissions_Missing>;

export type Lib_Cloudflare_Runner_FindMissingPermissions_Probe_Permission = string;

export type Lib_Cloudflare_Runner_FindMissingPermissions_Probe_Path = string;

export type Lib_Cloudflare_Runner_FindMissingPermissions_Probe = {
  permission: Lib_Cloudflare_Runner_FindMissingPermissions_Probe_Permission;
  path: Lib_Cloudflare_Runner_FindMissingPermissions_Probe_Path;
};

export type Lib_Cloudflare_Runner_FindMissingPermissions_Probes = Lib_Cloudflare_Runner_FindMissingPermissions_Probe[];

export type Lib_Cloudflare_Runner_FindMissingPermissions_Permission = string;

export type Lib_Cloudflare_Runner_FindMissingPermissions_Missing = Lib_Cloudflare_Runner_FindMissingPermissions_Permission[];

/**
 * Lib - Cloudflare - Runner - Find Zone.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_FindZone_Token = string;

export type Lib_Cloudflare_Runner_FindZone_Name = string;

export type Lib_Cloudflare_Runner_FindZone_Returns = Promise<Shared_CloudflareZone | undefined>;

export type Lib_Cloudflare_Runner_FindZone_Result = unknown;

export type Lib_Cloudflare_Runner_FindZone_Zones = { [Key in keyof Lib_Schema_CloudflareZones]: Lib_Schema_CloudflareZones[Key] };

export type Lib_Cloudflare_Runner_FindZone_FirstZone = Lib_Schema_CloudflareZone | undefined;

/**
 * Lib - Cloudflare - Runner - Get Catch All.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_GetCatchAll_Token = string;

export type Lib_Cloudflare_Runner_GetCatchAll_ZoneId = string;

export type Lib_Cloudflare_Runner_GetCatchAll_Returns = Promise<Shared_CloudflareCatchAll>;

export type Lib_Cloudflare_Runner_GetCatchAll_Result = unknown;

export type Lib_Cloudflare_Runner_GetCatchAll_CatchAll = { [Key in keyof Lib_Schema_CloudflareCatchAll]: Lib_Schema_CloudflareCatchAll[Key] };

/**
 * Lib - Cloudflare - Runner - Get Email Routing.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_GetEmailRouting_Token = string;

export type Lib_Cloudflare_Runner_GetEmailRouting_ZoneId = string;

export type Lib_Cloudflare_Runner_GetEmailRouting_Returns = Promise<Shared_CloudflareEmailRouting>;

export type Lib_Cloudflare_Runner_GetEmailRouting_Result = unknown;

export type Lib_Cloudflare_Runner_GetEmailRouting_Routing = { [Key in keyof Lib_Schema_CloudflareEmailRoutingSettings]: Lib_Schema_CloudflareEmailRoutingSettings[Key] };

/**
 * Lib - Cloudflare - Runner - Get Workers Plan.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_GetWorkersPlan_Token = string;

export type Lib_Cloudflare_Runner_GetWorkersPlan_AccountId = string;

export type Lib_Cloudflare_Runner_GetWorkersPlan_Returns = Promise<Shared_CloudflareWorkersPlan>;

export type Lib_Cloudflare_Runner_GetWorkersPlan_Result = unknown;

export type Lib_Cloudflare_Runner_GetWorkersPlan_Subscriptions = { [Key in keyof Lib_Schema_CloudflareSubscriptions]: Lib_Schema_CloudflareSubscriptions[Key] };

export type Lib_Cloudflare_Runner_GetWorkersPlan_Paid = boolean;

export type Lib_Cloudflare_Runner_GetWorkersPlan_Words = string;

export type Lib_Cloudflare_Runner_GetWorkersPlan_Ended = boolean;

/**
 * Lib - Cloudflare - Runner - Has Email Routing Mx.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_HasEmailRoutingMx_Domain = string;

export type Lib_Cloudflare_Runner_HasEmailRoutingMx_Returns = Promise<boolean>;

export type Lib_Cloudflare_Runner_HasEmailRoutingMx_MxRecord_Exchange = string;

export type Lib_Cloudflare_Runner_HasEmailRoutingMx_MxRecord_Priority = number;

export type Lib_Cloudflare_Runner_HasEmailRoutingMx_MxRecord = {
  exchange: Lib_Cloudflare_Runner_HasEmailRoutingMx_MxRecord_Exchange;
  priority: Lib_Cloudflare_Runner_HasEmailRoutingMx_MxRecord_Priority;
};

export type Lib_Cloudflare_Runner_HasEmailRoutingMx_MxRecords = Lib_Cloudflare_Runner_HasEmailRoutingMx_MxRecord[];

/**
 * Lib - Cloudflare - Runner - Has Permission.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_HasPermission_Token = string;

export type Lib_Cloudflare_Runner_HasPermission_Path = string;

export type Lib_Cloudflare_Runner_HasPermission_Returns = Promise<boolean>;

/**
 * Lib - Cloudflare - Runner - List Destination Addresses.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_ListDestinationAddresses_Token = string;

export type Lib_Cloudflare_Runner_ListDestinationAddresses_AccountId = string;

export type Lib_Cloudflare_Runner_ListDestinationAddresses_Returns = Promise<Lib_Cloudflare_Runner_ListDestinationAddresses_Addresses>;

export type Lib_Cloudflare_Runner_ListDestinationAddresses_Addresses = Shared_CloudflareDestinationAddress[];

export type Lib_Cloudflare_Runner_ListDestinationAddresses_Page = number;

export type Lib_Cloudflare_Runner_ListDestinationAddresses_PageAddresses = { [Key in keyof Lib_Schema_CloudflareDestinationAddresses]: Lib_Schema_CloudflareDestinationAddresses[Key] };

export type Lib_Cloudflare_Runner_ListDestinationAddresses_Result = unknown;

/**
 * Lib - Cloudflare - Runner - List Routing Rules.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_ListRoutingRules_Token = string;

export type Lib_Cloudflare_Runner_ListRoutingRules_ZoneId = string;

export type Lib_Cloudflare_Runner_ListRoutingRules_Returns = Promise<Lib_Cloudflare_Runner_ListRoutingRules_Rules>;

export type Lib_Cloudflare_Runner_ListRoutingRules_Rules = Shared_CloudflareRoutingRule[];

export type Lib_Cloudflare_Runner_ListRoutingRules_Page = number;

export type Lib_Cloudflare_Runner_ListRoutingRules_PageRules = { [Key in keyof Lib_Schema_CloudflareRoutingRules]: Lib_Schema_CloudflareRoutingRules[Key] };

export type Lib_Cloudflare_Runner_ListRoutingRules_Result = unknown;

/**
 * Lib - Cloudflare - Runner - List Worker Domains.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_ListWorkerDomains_Token = string;

export type Lib_Cloudflare_Runner_ListWorkerDomains_AccountId = string;

export type Lib_Cloudflare_Runner_ListWorkerDomains_ZoneId = string;

export type Lib_Cloudflare_Runner_ListWorkerDomains_Returns = Promise<Shared_CloudflareWorkerDomain[]>;

export type Lib_Cloudflare_Runner_ListWorkerDomains_Result = unknown;

export type Lib_Cloudflare_Runner_ListWorkerDomains_Domains = { [Key in keyof Lib_Schema_CloudflareWorkerDomains]: Lib_Schema_CloudflareWorkerDomains[Key] };

/**
 * Lib - Cloudflare - Runner - Normalize Record Content.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_NormalizeRecordContent_Content = string;

export type Lib_Cloudflare_Runner_NormalizeRecordContent_Returns = string;

export type Lib_Cloudflare_Runner_NormalizeRecordContent_Unquoted = string;

/**
 * Lib - Cloudflare - Runner - Request.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_Request_Token = string;

export type Lib_Cloudflare_Runner_Request_Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type Lib_Cloudflare_Runner_Request_Path = string;

export type Lib_Cloudflare_Runner_Request_Body = Record<string, unknown> | undefined;

export type Lib_Cloudflare_Runner_Request_Returns = Promise<unknown>;

export type Lib_Cloudflare_Runner_Request_Response = Response;

export type Lib_Cloudflare_Runner_Request_ResponseData = unknown;

export type Lib_Cloudflare_Runner_Request_Envelope = { [Key in keyof Lib_Schema_CloudflareEnvelope]: Lib_Schema_CloudflareEnvelope[Key] };

export type Lib_Cloudflare_Runner_Request_ErrorDetails = string;

/**
 * Lib - Cloudflare - Runner - To Record Name.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_ToRecordName_Name = string;

export type Lib_Cloudflare_Runner_ToRecordName_ZoneName = string;

export type Lib_Cloudflare_Runner_ToRecordName_Returns = string;

export type Lib_Cloudflare_Runner_ToRecordName_NormalizedName = string;

export type Lib_Cloudflare_Runner_ToRecordName_NormalizedZoneName = string;

/**
 * Lib - Cloudflare - Runner - To Routing Rule.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_ToRoutingRule_Rule = { [Key in keyof Lib_Schema_CloudflareRoutingRule]: Lib_Schema_CloudflareRoutingRule[Key] };

export type Lib_Cloudflare_Runner_ToRoutingRule_Returns = Shared_CloudflareRoutingRule;

export type Lib_Cloudflare_Runner_ToRoutingRule_Matcher = Lib_Schema_CloudflareRoutingRuleMatcher | undefined;

export type Lib_Cloudflare_Runner_ToRoutingRule_Action = Lib_Schema_CloudflareRoutingRuleAction | undefined;

export type Lib_Cloudflare_Runner_ToRoutingRule_ActionValue = string;

export type Lib_Cloudflare_Runner_ToRoutingRule_ActionValues = Lib_Cloudflare_Runner_ToRoutingRule_ActionValue[];

export type Lib_Cloudflare_Runner_ToRoutingRule_Address = string | undefined;

export type Lib_Cloudflare_Runner_ToRoutingRule_WorkerName = string | undefined;

/**
 * Lib - Cloudflare - Runner - Update Routing Rule.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_UpdateRoutingRule_Token = string;

export type Lib_Cloudflare_Runner_UpdateRoutingRule_ZoneId = string;

export type Lib_Cloudflare_Runner_UpdateRoutingRule_Id = string;

export type Lib_Cloudflare_Runner_UpdateRoutingRule_Name = string;

export type Lib_Cloudflare_Runner_UpdateRoutingRule_Address = string;

export type Lib_Cloudflare_Runner_UpdateRoutingRule_WorkerName = string;

export type Lib_Cloudflare_Runner_UpdateRoutingRule_Returns = Promise<void>;

/**
 * Lib - Cloudflare - Runner - Verify Token.
 *
 * @since 1.2.0
 */
export type Lib_Cloudflare_Runner_VerifyToken_Token = string;

export type Lib_Cloudflare_Runner_VerifyToken_Returns = Promise<boolean>;

export type Lib_Cloudflare_Runner_VerifyToken_Response = Response;

export type Lib_Cloudflare_Runner_VerifyToken_ResponseData = unknown;

export type Lib_Cloudflare_Runner_VerifyToken_Envelope = z.ZodSafeParseResult<Lib_Schema_CloudflareEnvelope>;
