import { spawnSync } from 'node:child_process';
import { resolveMx } from 'node:dns/promises';

import { getWranglerCliPath } from './package-runtime.js';
import {
  cloudflareCatchAllSchema,
  cloudflareDestinationAddressesSchema,
  cloudflareDnsRecordsSchema,
  cloudflareEmailRoutingSettingsSchema,
  cloudflareEnvelopeSchema,
  cloudflareRoutingRulesSchema,
  cloudflareSendingSubdomainSchema,
  cloudflareSendingSubdomainsSchema,
  cloudflareSubscriptionsSchema,
  cloudflareWorkerDomainsSchema,
  cloudflareZonesSchema,
} from './schema.js';

import type {
  Lib_Cloudflare_Runner_AttachWorkerDomain_AccountId,
  Lib_Cloudflare_Runner_AttachWorkerDomain_Hostname,
  Lib_Cloudflare_Runner_AttachWorkerDomain_Returns,
  Lib_Cloudflare_Runner_AttachWorkerDomain_Token,
  Lib_Cloudflare_Runner_AttachWorkerDomain_WorkerName,
  Lib_Cloudflare_Runner_AttachWorkerDomain_ZoneId,
  Lib_Cloudflare_Runner_BuildRoutingRuleBody_Address,
  Lib_Cloudflare_Runner_BuildRoutingRuleBody_Name,
  Lib_Cloudflare_Runner_BuildRoutingRuleBody_Returns,
  Lib_Cloudflare_Runner_BuildRoutingRuleBody_WorkerName,
  Lib_Cloudflare_Runner_CreateDestinationAddress_AccountId,
  Lib_Cloudflare_Runner_CreateDestinationAddress_Email,
  Lib_Cloudflare_Runner_CreateDestinationAddress_Returns,
  Lib_Cloudflare_Runner_CreateDestinationAddress_Token,
  Lib_Cloudflare_Runner_CreateRoutingRule_Address,
  Lib_Cloudflare_Runner_CreateRoutingRule_Name,
  Lib_Cloudflare_Runner_CreateRoutingRule_Returns,
  Lib_Cloudflare_Runner_CreateRoutingRule_Token,
  Lib_Cloudflare_Runner_CreateRoutingRule_WorkerName,
  Lib_Cloudflare_Runner_CreateRoutingRule_ZoneId,
  Lib_Cloudflare_Runner_DeleteRoutingRule_Id,
  Lib_Cloudflare_Runner_DeleteRoutingRule_Returns,
  Lib_Cloudflare_Runner_DeleteRoutingRule_Token,
  Lib_Cloudflare_Runner_DeleteRoutingRule_ZoneId,
  Lib_Cloudflare_Runner_DeployWorker_DeployResult,
  Lib_Cloudflare_Runner_DeployWorker_Returns,
  Lib_Cloudflare_Runner_DeployWorker_WranglerCliPath,
  Lib_Cloudflare_Runner_DeployWorker_WranglerTomlPath,
  Lib_Cloudflare_Runner_DisableCatchAll_Name,
  Lib_Cloudflare_Runner_DisableCatchAll_Returns,
  Lib_Cloudflare_Runner_DisableCatchAll_Token,
  Lib_Cloudflare_Runner_DisableCatchAll_ZoneId,
  Lib_Cloudflare_Runner_EnableSubaddressing_Returns,
  Lib_Cloudflare_Runner_EnableSubaddressing_Token,
  Lib_Cloudflare_Runner_EnableSubaddressing_ZoneId,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_AddedRecords,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Created,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_CreateResult,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Domain,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExistingRecords,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExistingResult,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExpectedRecords,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExpectedResult,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ListResult,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_NormalizedDomain,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_RecordName,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Records,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Returns,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Subdomain,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Subdomains,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Token,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ZoneId,
  Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ZoneName,
  Lib_Cloudflare_Runner_FindMissingPermissions_AccountId,
  Lib_Cloudflare_Runner_FindMissingPermissions_EmailSending,
  Lib_Cloudflare_Runner_FindMissingPermissions_Missing,
  Lib_Cloudflare_Runner_FindMissingPermissions_Probes,
  Lib_Cloudflare_Runner_FindMissingPermissions_Returns,
  Lib_Cloudflare_Runner_FindMissingPermissions_Token,
  Lib_Cloudflare_Runner_FindMissingPermissions_ZoneId,
  Lib_Cloudflare_Runner_FindZone_FirstZone,
  Lib_Cloudflare_Runner_FindZone_Name,
  Lib_Cloudflare_Runner_FindZone_Result,
  Lib_Cloudflare_Runner_FindZone_Returns,
  Lib_Cloudflare_Runner_FindZone_Token,
  Lib_Cloudflare_Runner_FindZone_Zones,
  Lib_Cloudflare_Runner_GetCatchAll_CatchAll,
  Lib_Cloudflare_Runner_GetCatchAll_Result,
  Lib_Cloudflare_Runner_GetCatchAll_Returns,
  Lib_Cloudflare_Runner_GetCatchAll_Token,
  Lib_Cloudflare_Runner_GetCatchAll_ZoneId,
  Lib_Cloudflare_Runner_GetEmailRouting_Result,
  Lib_Cloudflare_Runner_GetEmailRouting_Returns,
  Lib_Cloudflare_Runner_GetEmailRouting_Routing,
  Lib_Cloudflare_Runner_GetEmailRouting_Token,
  Lib_Cloudflare_Runner_GetEmailRouting_ZoneId,
  Lib_Cloudflare_Runner_GetWorkersPlan_AccountId,
  Lib_Cloudflare_Runner_GetWorkersPlan_Ended,
  Lib_Cloudflare_Runner_GetWorkersPlan_Paid,
  Lib_Cloudflare_Runner_GetWorkersPlan_Result,
  Lib_Cloudflare_Runner_GetWorkersPlan_Returns,
  Lib_Cloudflare_Runner_GetWorkersPlan_Subscriptions,
  Lib_Cloudflare_Runner_GetWorkersPlan_Token,
  Lib_Cloudflare_Runner_GetWorkersPlan_Words,
  Lib_Cloudflare_Runner_HasEmailRoutingMx_Domain,
  Lib_Cloudflare_Runner_HasEmailRoutingMx_MxRecords,
  Lib_Cloudflare_Runner_HasEmailRoutingMx_Returns,
  Lib_Cloudflare_Runner_HasPermission_Path,
  Lib_Cloudflare_Runner_HasPermission_Returns,
  Lib_Cloudflare_Runner_HasPermission_Token,
  Lib_Cloudflare_Runner_ListDestinationAddresses_AccountId,
  Lib_Cloudflare_Runner_ListDestinationAddresses_Addresses,
  Lib_Cloudflare_Runner_ListDestinationAddresses_Page,
  Lib_Cloudflare_Runner_ListDestinationAddresses_PageAddresses,
  Lib_Cloudflare_Runner_ListDestinationAddresses_Result,
  Lib_Cloudflare_Runner_ListDestinationAddresses_Returns,
  Lib_Cloudflare_Runner_ListDestinationAddresses_Token,
  Lib_Cloudflare_Runner_ListRoutingRules_Page,
  Lib_Cloudflare_Runner_ListRoutingRules_PageRules,
  Lib_Cloudflare_Runner_ListRoutingRules_Result,
  Lib_Cloudflare_Runner_ListRoutingRules_Returns,
  Lib_Cloudflare_Runner_ListRoutingRules_Rules,
  Lib_Cloudflare_Runner_ListRoutingRules_Token,
  Lib_Cloudflare_Runner_ListRoutingRules_ZoneId,
  Lib_Cloudflare_Runner_ListWorkerDomains_AccountId,
  Lib_Cloudflare_Runner_ListWorkerDomains_Domains,
  Lib_Cloudflare_Runner_ListWorkerDomains_Result,
  Lib_Cloudflare_Runner_ListWorkerDomains_Returns,
  Lib_Cloudflare_Runner_ListWorkerDomains_Token,
  Lib_Cloudflare_Runner_ListWorkerDomains_ZoneId,
  Lib_Cloudflare_Runner_NormalizeRecordContent_Content,
  Lib_Cloudflare_Runner_NormalizeRecordContent_Returns,
  Lib_Cloudflare_Runner_NormalizeRecordContent_Unquoted,
  Lib_Cloudflare_Runner_Request_Body,
  Lib_Cloudflare_Runner_Request_Envelope,
  Lib_Cloudflare_Runner_Request_ErrorDetails,
  Lib_Cloudflare_Runner_Request_Method,
  Lib_Cloudflare_Runner_Request_Path,
  Lib_Cloudflare_Runner_Request_Response,
  Lib_Cloudflare_Runner_Request_ResponseData,
  Lib_Cloudflare_Runner_Request_Returns,
  Lib_Cloudflare_Runner_Request_Token,
  Lib_Cloudflare_Runner_ToRecordName_Name,
  Lib_Cloudflare_Runner_ToRecordName_NormalizedName,
  Lib_Cloudflare_Runner_ToRecordName_NormalizedZoneName,
  Lib_Cloudflare_Runner_ToRecordName_Returns,
  Lib_Cloudflare_Runner_ToRecordName_ZoneName,
  Lib_Cloudflare_Runner_ToRoutingRule_Action,
  Lib_Cloudflare_Runner_ToRoutingRule_ActionValues,
  Lib_Cloudflare_Runner_ToRoutingRule_Address,
  Lib_Cloudflare_Runner_ToRoutingRule_Matcher,
  Lib_Cloudflare_Runner_ToRoutingRule_Returns,
  Lib_Cloudflare_Runner_ToRoutingRule_Rule,
  Lib_Cloudflare_Runner_ToRoutingRule_WorkerName,
  Lib_Cloudflare_Runner_UpdateRoutingRule_Address,
  Lib_Cloudflare_Runner_UpdateRoutingRule_Id,
  Lib_Cloudflare_Runner_UpdateRoutingRule_Name,
  Lib_Cloudflare_Runner_UpdateRoutingRule_Returns,
  Lib_Cloudflare_Runner_UpdateRoutingRule_Token,
  Lib_Cloudflare_Runner_UpdateRoutingRule_WorkerName,
  Lib_Cloudflare_Runner_UpdateRoutingRule_ZoneId,
  Lib_Cloudflare_Runner_VerifyToken_Envelope,
  Lib_Cloudflare_Runner_VerifyToken_Response,
  Lib_Cloudflare_Runner_VerifyToken_ResponseData,
  Lib_Cloudflare_Runner_VerifyToken_Returns,
  Lib_Cloudflare_Runner_VerifyToken_Token,
} from '../types/lib/cloudflare.d.ts';

/**
 * Lib - Cloudflare - API Base.
 *
 * Base URL for the Cloudflare v4 REST API that deploy uses for zones, Email
 * Routing, Email Sending, Workers custom domains, and the account's plan.
 *
 * @since 1.2.0
 */
const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

/**
 * Lib - Cloudflare - Page Size.
 *
 * Number of results Mailmask asks for on each page of a Cloudflare list, so
 * a short page tells it the list has ended.
 *
 * @since 1.2.0
 */
const PAGE_SIZE = 50;

/**
 * Lib - Cloudflare.
 *
 * Adapter for the Cloudflare APIs deploy uses. Request paths, authentication,
 * and response shapes stay here, and deploy only sees Mailmask-owned shapes.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Cloudflare - Verify Token.
   *
   * Calls the token verify endpoint and reports whether the token is valid and
   * active. Network and parsing failures count as an invalid token.
   *
   * @param {Lib_Cloudflare_Runner_VerifyToken_Token} token - Token.
   *
   * @returns {Lib_Cloudflare_Runner_VerifyToken_Returns}
   *
   * @since 1.2.0
   */
  public static async verifyToken(token: Lib_Cloudflare_Runner_VerifyToken_Token): Lib_Cloudflare_Runner_VerifyToken_Returns {
    try {
      const response: Lib_Cloudflare_Runner_VerifyToken_Response = await fetch(`${CLOUDFLARE_API_BASE}/user/tokens/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseData: Lib_Cloudflare_Runner_VerifyToken_ResponseData = await response.json();
      const envelope: Lib_Cloudflare_Runner_VerifyToken_Envelope = cloudflareEnvelopeSchema.safeParse(responseData);

      return envelope['success'] === true && envelope['data']['success'] === true;
    } catch {
      return false;
    }
  }

  /**
   * Lib - Cloudflare - Find Missing Permissions.
   *
   * Reads every endpoint deploy calls and names the permission group behind each
   * one the token can't reach. Email Sending and DNS are only probed when needed.
   *
   * @param {Lib_Cloudflare_Runner_FindMissingPermissions_Token}        token          - Token.
   * @param {Lib_Cloudflare_Runner_FindMissingPermissions_ZoneId}       zoneId         - Zone id.
   * @param {Lib_Cloudflare_Runner_FindMissingPermissions_AccountId}    accountId      - Account id.
   * @param {Lib_Cloudflare_Runner_FindMissingPermissions_EmailSending} [emailSending] - Email sending.
   *
   * @returns {Lib_Cloudflare_Runner_FindMissingPermissions_Returns}
   *
   * @since 1.2.0
   */
  public static async findMissingPermissions(token: Lib_Cloudflare_Runner_FindMissingPermissions_Token, zoneId: Lib_Cloudflare_Runner_FindMissingPermissions_ZoneId, accountId: Lib_Cloudflare_Runner_FindMissingPermissions_AccountId, emailSending: Lib_Cloudflare_Runner_FindMissingPermissions_EmailSending = false): Lib_Cloudflare_Runner_FindMissingPermissions_Returns {
    const probes: Lib_Cloudflare_Runner_FindMissingPermissions_Probes = [
      {
        permission: 'Account > Workers Scripts > Edit',
        path: `/accounts/${accountId}/workers/scripts`,
      },
      {
        permission: 'Account > Workers Scripts > Edit',
        path: `/accounts/${accountId}/workers/domains?zone_id=${zoneId}`,
      },
      {
        permission: 'Account > Email Routing Addresses > Edit',
        path: `/accounts/${accountId}/email/routing/addresses?per_page=5`,
      },
      {
        permission: 'Zone > Zone Settings > Edit',
        path: `/zones/${zoneId}/email/routing`,
      },
      {
        permission: 'Zone > Email Routing Rules > Edit',
        path: `/zones/${zoneId}/email/routing/rules?per_page=5`,
      },
      {
        permission: 'Zone > Email Routing Rules > Edit',
        path: `/zones/${zoneId}/email/routing/rules/catch_all`,
      },
      {
        permission: 'Zone > Workers Routes > Edit',
        path: `/zones/${zoneId}/workers/routes`,
      },
      ...((emailSending === true) ? [
        {
          permission: 'Zone > Email Sending > Edit',
          path: `/zones/${zoneId}/email/sending/subdomains`,
        },
        {
          permission: 'Zone > DNS > Edit',
          path: `/zones/${zoneId}/dns_records?per_page=5`,
        },
        {
          permission: 'Account > Billing > Read',
          path: `/accounts/${accountId}/subscriptions`,
        },
      ] : []),
    ];
    const missing: Lib_Cloudflare_Runner_FindMissingPermissions_Missing = [];

    for (const probe of probes) {
      if (missing.includes(probe['permission']) === true) {
        continue;
      }

      if (await Runner.hasPermission(token, probe['path']) === false) {
        missing.push(probe['permission']);
      }
    }

    return missing;
  }

  /**
   * Lib - Cloudflare - Find Zone.
   *
   * Looks up a zone by exact name and returns its IDs and name, or undefined when
   * the account has no zone with that name. API failures throw.
   *
   * @param {Lib_Cloudflare_Runner_FindZone_Token} token - Token.
   * @param {Lib_Cloudflare_Runner_FindZone_Name}  name  - Name.
   *
   * @returns {Lib_Cloudflare_Runner_FindZone_Returns}
   *
   * @since 1.2.0
   */
  public static async findZone(token: Lib_Cloudflare_Runner_FindZone_Token, name: Lib_Cloudflare_Runner_FindZone_Name): Lib_Cloudflare_Runner_FindZone_Returns {
    const result: Lib_Cloudflare_Runner_FindZone_Result = await Runner.request(token, 'GET', `/zones?name=${name}`, undefined);
    const zones: Lib_Cloudflare_Runner_FindZone_Zones = cloudflareZonesSchema.parse(result);
    const firstZone: Lib_Cloudflare_Runner_FindZone_FirstZone = zones[0];

    if (firstZone === undefined) {
      return undefined;
    }

    return {
      zoneId: firstZone['id'],
      accountId: firstZone['account']['id'],
      zoneName: firstZone['name'],
    };
  }

  /**
   * Lib - Cloudflare - Get Email Routing.
   *
   * Reads the zone's Email Routing settings: whether it receives mail and whether
   * "alias+tag@" already matches alias rules.
   *
   * @param {Lib_Cloudflare_Runner_GetEmailRouting_Token}  token  - Token.
   * @param {Lib_Cloudflare_Runner_GetEmailRouting_ZoneId} zoneId - Zone id.
   *
   * @returns {Lib_Cloudflare_Runner_GetEmailRouting_Returns}
   *
   * @since 1.2.0
   */
  public static async getEmailRouting(token: Lib_Cloudflare_Runner_GetEmailRouting_Token, zoneId: Lib_Cloudflare_Runner_GetEmailRouting_ZoneId): Lib_Cloudflare_Runner_GetEmailRouting_Returns {
    const result: Lib_Cloudflare_Runner_GetEmailRouting_Result = await Runner.request(token, 'GET', `/zones/${zoneId}/email/routing`, undefined);
    const routing: Lib_Cloudflare_Runner_GetEmailRouting_Routing = cloudflareEmailRoutingSettingsSchema.parse(result);

    return {
      enabled: routing['enabled'],
      subaddressing: routing['support_subaddress'] === true,
    };
  }

  /**
   * Lib - Cloudflare - Enable Subaddressing.
   *
   * Turns on the zone's Email Routing subaddressing so "alias+tag@" matches the
   * alias rule. It is a zone setting, not a DNS change.
   *
   * @param {Lib_Cloudflare_Runner_EnableSubaddressing_Token}  token  - Token.
   * @param {Lib_Cloudflare_Runner_EnableSubaddressing_ZoneId} zoneId - Zone id.
   *
   * @returns {Lib_Cloudflare_Runner_EnableSubaddressing_Returns}
   *
   * @since 1.2.0
   */
  public static async enableSubaddressing(token: Lib_Cloudflare_Runner_EnableSubaddressing_Token, zoneId: Lib_Cloudflare_Runner_EnableSubaddressing_ZoneId): Lib_Cloudflare_Runner_EnableSubaddressing_Returns {
    await Runner.request(token, 'PATCH', `/zones/${zoneId}/email/routing`, { support_subaddress: true });

    return;
  }

  /**
   * Lib - Cloudflare - Has Email Routing Mx.
   *
   * Reports whether a domain's MX records point at Cloudflare Email Routing, which
   * adds route1, route2, and route3 ".mx.cloudflare.net" when a subdomain joins.
   *
   * @param {Lib_Cloudflare_Runner_HasEmailRoutingMx_Domain} domain - Domain.
   *
   * @returns {Lib_Cloudflare_Runner_HasEmailRoutingMx_Returns}
   *
   * @since 1.2.0
   */
  public static async hasEmailRoutingMx(domain: Lib_Cloudflare_Runner_HasEmailRoutingMx_Domain): Lib_Cloudflare_Runner_HasEmailRoutingMx_Returns {
    let mxRecords: Lib_Cloudflare_Runner_HasEmailRoutingMx_MxRecords = [];

    try {
      mxRecords = await resolveMx(domain);
    } catch {
      mxRecords = [];
    }

    return mxRecords.some((mxRecord) => mxRecord['exchange'].toLowerCase().endsWith('.mx.cloudflare.net') === true);
  }

  /**
   * Lib - Cloudflare - List Routing Rules.
   *
   * Reads every Email Routing rule on the zone, page by page, as the literal address
   * each one matches and the single Worker it sends to, when it does.
   *
   * @param {Lib_Cloudflare_Runner_ListRoutingRules_Token}  token  - Token.
   * @param {Lib_Cloudflare_Runner_ListRoutingRules_ZoneId} zoneId - Zone id.
   *
   * @returns {Lib_Cloudflare_Runner_ListRoutingRules_Returns}
   *
   * @since 1.2.0
   */
  public static async listRoutingRules(token: Lib_Cloudflare_Runner_ListRoutingRules_Token, zoneId: Lib_Cloudflare_Runner_ListRoutingRules_ZoneId): Lib_Cloudflare_Runner_ListRoutingRules_Returns {
    const rules: Lib_Cloudflare_Runner_ListRoutingRules_Rules = [];
    let page: Lib_Cloudflare_Runner_ListRoutingRules_Page = 1;
    let pageRules: Lib_Cloudflare_Runner_ListRoutingRules_PageRules = [];

    do {
      const result: Lib_Cloudflare_Runner_ListRoutingRules_Result = await Runner.request(token, 'GET', `/zones/${zoneId}/email/routing/rules?page=${String(page)}&per_page=${String(PAGE_SIZE)}`, undefined);

      pageRules = cloudflareRoutingRulesSchema.parse(result);
      rules.push(...pageRules.map((pageRule) => Runner.toRoutingRule(pageRule)));
      page += 1;
    } while (pageRules.length === PAGE_SIZE);

    return rules;
  }

  /**
   * Lib - Cloudflare - Create Routing Rule.
   *
   * Adds a literal rule that sends one address to a Worker under the given name,
   * which the caller uses to recognise its own rules later.
   *
   * @param {Lib_Cloudflare_Runner_CreateRoutingRule_Token}      token      - Token.
   * @param {Lib_Cloudflare_Runner_CreateRoutingRule_ZoneId}     zoneId     - Zone id.
   * @param {Lib_Cloudflare_Runner_CreateRoutingRule_Name}       name       - Name.
   * @param {Lib_Cloudflare_Runner_CreateRoutingRule_Address}    address    - Address.
   * @param {Lib_Cloudflare_Runner_CreateRoutingRule_WorkerName} workerName - Worker name.
   *
   * @returns {Lib_Cloudflare_Runner_CreateRoutingRule_Returns}
   *
   * @since 1.2.0
   */
  public static async createRoutingRule(token: Lib_Cloudflare_Runner_CreateRoutingRule_Token, zoneId: Lib_Cloudflare_Runner_CreateRoutingRule_ZoneId, name: Lib_Cloudflare_Runner_CreateRoutingRule_Name, address: Lib_Cloudflare_Runner_CreateRoutingRule_Address, workerName: Lib_Cloudflare_Runner_CreateRoutingRule_WorkerName): Lib_Cloudflare_Runner_CreateRoutingRule_Returns {
    await Runner.request(token, 'POST', `/zones/${zoneId}/email/routing/rules`, Runner.buildRoutingRuleBody(name, address, workerName));

    return;
  }

  /**
   * Lib - Cloudflare - Update Routing Rule.
   *
   * Rewrites an existing rule so it is enabled, carries the given name, and sends
   * its one address to the Worker.
   *
   * @param {Lib_Cloudflare_Runner_UpdateRoutingRule_Token}      token      - Token.
   * @param {Lib_Cloudflare_Runner_UpdateRoutingRule_ZoneId}     zoneId     - Zone id.
   * @param {Lib_Cloudflare_Runner_UpdateRoutingRule_Id}         id         - Id.
   * @param {Lib_Cloudflare_Runner_UpdateRoutingRule_Name}       name       - Name.
   * @param {Lib_Cloudflare_Runner_UpdateRoutingRule_Address}    address    - Address.
   * @param {Lib_Cloudflare_Runner_UpdateRoutingRule_WorkerName} workerName - Worker name.
   *
   * @returns {Lib_Cloudflare_Runner_UpdateRoutingRule_Returns}
   *
   * @since 1.2.0
   */
  public static async updateRoutingRule(token: Lib_Cloudflare_Runner_UpdateRoutingRule_Token, zoneId: Lib_Cloudflare_Runner_UpdateRoutingRule_ZoneId, id: Lib_Cloudflare_Runner_UpdateRoutingRule_Id, name: Lib_Cloudflare_Runner_UpdateRoutingRule_Name, address: Lib_Cloudflare_Runner_UpdateRoutingRule_Address, workerName: Lib_Cloudflare_Runner_UpdateRoutingRule_WorkerName): Lib_Cloudflare_Runner_UpdateRoutingRule_Returns {
    await Runner.request(token, 'PUT', `/zones/${zoneId}/email/routing/rules/${id}`, Runner.buildRoutingRuleBody(name, address, workerName));

    return;
  }

  /**
   * Lib - Cloudflare - Delete Routing Rule.
   *
   * Removes one Email Routing rule by ID, after which Cloudflare rejects mail to
   * its address unless another rule matches it.
   *
   * @param {Lib_Cloudflare_Runner_DeleteRoutingRule_Token}  token  - Token.
   * @param {Lib_Cloudflare_Runner_DeleteRoutingRule_ZoneId} zoneId - Zone id.
   * @param {Lib_Cloudflare_Runner_DeleteRoutingRule_Id}     id     - Id.
   *
   * @returns {Lib_Cloudflare_Runner_DeleteRoutingRule_Returns}
   *
   * @since 1.2.0
   */
  public static async deleteRoutingRule(token: Lib_Cloudflare_Runner_DeleteRoutingRule_Token, zoneId: Lib_Cloudflare_Runner_DeleteRoutingRule_ZoneId, id: Lib_Cloudflare_Runner_DeleteRoutingRule_Id): Lib_Cloudflare_Runner_DeleteRoutingRule_Returns {
    await Runner.request(token, 'DELETE', `/zones/${zoneId}/email/routing/rules/${id}`, undefined);

    return;
  }

  /**
   * Lib - Cloudflare - Get Catch All.
   *
   * Reads the zone's catch-all rule as its name and the Workers it sends to, so
   * deploy can tell whether Mailmask 1.0.0 pointed it at this Worker.
   *
   * @param {Lib_Cloudflare_Runner_GetCatchAll_Token}  token  - Token.
   * @param {Lib_Cloudflare_Runner_GetCatchAll_ZoneId} zoneId - Zone id.
   *
   * @returns {Lib_Cloudflare_Runner_GetCatchAll_Returns}
   *
   * @since 1.2.0
   */
  public static async getCatchAll(token: Lib_Cloudflare_Runner_GetCatchAll_Token, zoneId: Lib_Cloudflare_Runner_GetCatchAll_ZoneId): Lib_Cloudflare_Runner_GetCatchAll_Returns {
    const result: Lib_Cloudflare_Runner_GetCatchAll_Result = await Runner.request(token, 'GET', `/zones/${zoneId}/email/routing/rules/catch_all`, undefined);
    const catchAll: Lib_Cloudflare_Runner_GetCatchAll_CatchAll = cloudflareCatchAllSchema.parse(result);

    return {
      name: catchAll['name'],
      workerNames: catchAll['actions'].filter((action) => action['type'] === 'worker').flatMap((action) => action['value'] ?? []),
    };
  }

  /**
   * Lib - Cloudflare - Disable Catch All.
   *
   * Turns the zone's catch-all off with a drop action, so Cloudflare rejects mail
   * for addresses that have no rule of their own.
   *
   * @param {Lib_Cloudflare_Runner_DisableCatchAll_Token}  token  - Token.
   * @param {Lib_Cloudflare_Runner_DisableCatchAll_ZoneId} zoneId - Zone id.
   * @param {Lib_Cloudflare_Runner_DisableCatchAll_Name}   name   - Name.
   *
   * @returns {Lib_Cloudflare_Runner_DisableCatchAll_Returns}
   *
   * @since 1.2.0
   */
  public static async disableCatchAll(token: Lib_Cloudflare_Runner_DisableCatchAll_Token, zoneId: Lib_Cloudflare_Runner_DisableCatchAll_ZoneId, name: Lib_Cloudflare_Runner_DisableCatchAll_Name): Lib_Cloudflare_Runner_DisableCatchAll_Returns {
    await Runner.request(token, 'PUT', `/zones/${zoneId}/email/routing/rules/catch_all`, {
      name,
      enabled: false,
      matchers: [{ type: 'all' }],
      actions: [{ type: 'drop' }],
    });

    return;
  }

  /**
   * Lib - Cloudflare - Ensure Email Sending Domain.
   *
   * Onboards a domain to Email Sending when it isn't yet, then adds each DNS record
   * Email Sending expects that the zone lacks. Running it again changes nothing.
   *
   * @param {Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Token}    token    - Token.
   * @param {Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ZoneId}   zoneId   - Zone id.
   * @param {Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ZoneName} zoneName - Zone name.
   * @param {Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Domain}   domain   - Domain.
   *
   * @returns {Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Returns}
   *
   * @since 1.2.0
   */
  public static async ensureEmailSendingDomain(token: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Token, zoneId: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ZoneId, zoneName: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ZoneName, domain: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Domain): Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Returns {
    const normalizedDomain: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_NormalizedDomain = domain.toLowerCase();
    const listResult: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ListResult = await Runner.request(token, 'GET', `/zones/${zoneId}/email/sending/subdomains`, undefined);
    const subdomains: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Subdomains = cloudflareSendingSubdomainsSchema.parse(listResult ?? []);
    let subdomain: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Subdomain = subdomains.find((existingSubdomain) => existingSubdomain['name'].toLowerCase() === normalizedDomain);
    let created: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Created = false;

    // Creating a domain that exists but is turned off turns sending back on for it.
    if (subdomain === undefined || subdomain['enabled'] === false) {
      const createResult: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_CreateResult = await Runner.request(token, 'POST', `/zones/${zoneId}/email/sending/subdomains`, { name: normalizedDomain });

      subdomain = cloudflareSendingSubdomainSchema.parse(createResult);
      created = true;
    }

    const expectedResult: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExpectedResult = await Runner.request(token, 'GET', `/zones/${zoneId}/email/sending/subdomains/${encodeURIComponent(subdomain['tag'])}/dns`, undefined);
    const expectedRecords: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExpectedRecords = cloudflareDnsRecordsSchema.parse(expectedResult ?? []);
    const addedRecords: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_AddedRecords = [];
    const records: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_Records = [];

    for (const expectedRecord of expectedRecords) {
      const recordName: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_RecordName = Runner.toRecordName(expectedRecord['name'], zoneName);

      // Any DMARC record counts, because an existing one is kept rather than replaced.
      records.push({
        type: expectedRecord['type'],
        name: recordName,
        content: (recordName.startsWith('_dmarc.') === true) ? undefined : expectedRecord['content'],
      });

      const existingResult: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExistingResult = await Runner.request(token, 'GET', `/zones/${zoneId}/dns_records?type=${encodeURIComponent(expectedRecord['type'])}&name=${encodeURIComponent(recordName)}`, undefined);
      const existingRecords: Lib_Cloudflare_Runner_EnsureEmailSendingDomain_ExistingRecords = cloudflareDnsRecordsSchema.parse(existingResult ?? []);

      // Email Sending only adds a DMARC record when the domain has none, so any existing one is kept.
      if (
        (
          recordName.startsWith('_dmarc.') === true
          && existingRecords.length > 0
        )
        || existingRecords.some((existingRecord) => Runner.normalizeRecordContent(existingRecord['content']) === Runner.normalizeRecordContent(expectedRecord['content'])) === true
      ) {
        continue;
      }

      await Runner.request(token, 'POST', `/zones/${zoneId}/dns_records`, {
        type: expectedRecord['type'],
        name: recordName,
        content: expectedRecord['content'],
        ttl: 1,
        ...((expectedRecord['priority'] !== undefined) ? { priority: expectedRecord['priority'] } : {}),
      });

      addedRecords.push(`${expectedRecord['type']} ${recordName}`);
    }

    return {
      created,
      addedRecords,
      records,
    };
  }

  /**
   * Lib - Cloudflare - Get Workers Plan.
   *
   * Reads the account's subscriptions and reports Workers Paid when any live one
   * names Workers, Workers Free when none does, and unknown when it can't be read.
   *
   * @param {Lib_Cloudflare_Runner_GetWorkersPlan_Token}     token     - Token.
   * @param {Lib_Cloudflare_Runner_GetWorkersPlan_AccountId} accountId - Account id.
   *
   * @returns {Lib_Cloudflare_Runner_GetWorkersPlan_Returns}
   *
   * @since 1.2.0
   */
  public static async getWorkersPlan(token: Lib_Cloudflare_Runner_GetWorkersPlan_Token, accountId: Lib_Cloudflare_Runner_GetWorkersPlan_AccountId): Lib_Cloudflare_Runner_GetWorkersPlan_Returns {
    try {
      const result: Lib_Cloudflare_Runner_GetWorkersPlan_Result = await Runner.request(token, 'GET', `/accounts/${accountId}/subscriptions`, undefined);
      const subscriptions: Lib_Cloudflare_Runner_GetWorkersPlan_Subscriptions = cloudflareSubscriptionsSchema.parse(result ?? []);

      // Cloudflare doesn't document how Workers Paid is named in this list, so any live subscription that mentions Workers counts.
      const paid: Lib_Cloudflare_Runner_GetWorkersPlan_Paid = subscriptions.some((subscription) => {
        const words: Lib_Cloudflare_Runner_GetWorkersPlan_Words = [
          subscription['rate_plan']['id'],
          subscription['rate_plan']['public_name'],
          subscription['product']['name'],
        ].join(' ').toLowerCase();
        const ended: Lib_Cloudflare_Runner_GetWorkersPlan_Ended = [
          'cancelled',
          'expired',
          'failed',
        ].includes(subscription['state'].toLowerCase());

        return words.includes('workers') === true && ended === false;
      });

      return (paid === true) ? 'paid' : 'free';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Lib - Cloudflare - List Destination Addresses.
   *
   * Reads every Email Routing destination address on the account, page by page,
   * with whether each one has been verified.
   *
   * @param {Lib_Cloudflare_Runner_ListDestinationAddresses_Token}     token     - Token.
   * @param {Lib_Cloudflare_Runner_ListDestinationAddresses_AccountId} accountId - Account id.
   *
   * @returns {Lib_Cloudflare_Runner_ListDestinationAddresses_Returns}
   *
   * @since 1.2.0
   */
  public static async listDestinationAddresses(token: Lib_Cloudflare_Runner_ListDestinationAddresses_Token, accountId: Lib_Cloudflare_Runner_ListDestinationAddresses_AccountId): Lib_Cloudflare_Runner_ListDestinationAddresses_Returns {
    const addresses: Lib_Cloudflare_Runner_ListDestinationAddresses_Addresses = [];
    let page: Lib_Cloudflare_Runner_ListDestinationAddresses_Page = 1;
    let pageAddresses: Lib_Cloudflare_Runner_ListDestinationAddresses_PageAddresses = [];

    do {
      const result: Lib_Cloudflare_Runner_ListDestinationAddresses_Result = await Runner.request(token, 'GET', `/accounts/${accountId}/email/routing/addresses?page=${String(page)}&per_page=${String(PAGE_SIZE)}`, undefined);

      pageAddresses = cloudflareDestinationAddressesSchema.parse(result);
      addresses.push(...pageAddresses.map((pageAddress) => ({
        email: pageAddress['email'],
        verified: pageAddress['verified'] !== undefined && pageAddress['verified'] !== null,
      })));
      page += 1;
    } while (pageAddresses.length === PAGE_SIZE);

    return addresses;
  }

  /**
   * Lib - Cloudflare - Create Destination Address.
   *
   * Registers an Email Routing destination address, which makes Cloudflare send
   * it a verification email.
   *
   * @param {Lib_Cloudflare_Runner_CreateDestinationAddress_Token}     token     - Token.
   * @param {Lib_Cloudflare_Runner_CreateDestinationAddress_AccountId} accountId - Account id.
   * @param {Lib_Cloudflare_Runner_CreateDestinationAddress_Email}     email     - Email.
   *
   * @returns {Lib_Cloudflare_Runner_CreateDestinationAddress_Returns}
   *
   * @since 1.2.0
   */
  public static async createDestinationAddress(token: Lib_Cloudflare_Runner_CreateDestinationAddress_Token, accountId: Lib_Cloudflare_Runner_CreateDestinationAddress_AccountId, email: Lib_Cloudflare_Runner_CreateDestinationAddress_Email): Lib_Cloudflare_Runner_CreateDestinationAddress_Returns {
    await Runner.request(token, 'POST', `/accounts/${accountId}/email/routing/addresses`, { email });

    return;
  }

  /**
   * Lib - Cloudflare - List Worker Domains.
   *
   * Reads the zone's Workers custom domains as each hostname and the Worker it
   * belongs to.
   *
   * @param {Lib_Cloudflare_Runner_ListWorkerDomains_Token}     token     - Token.
   * @param {Lib_Cloudflare_Runner_ListWorkerDomains_AccountId} accountId - Account id.
   * @param {Lib_Cloudflare_Runner_ListWorkerDomains_ZoneId}    zoneId    - Zone id.
   *
   * @returns {Lib_Cloudflare_Runner_ListWorkerDomains_Returns}
   *
   * @since 1.2.0
   */
  public static async listWorkerDomains(token: Lib_Cloudflare_Runner_ListWorkerDomains_Token, accountId: Lib_Cloudflare_Runner_ListWorkerDomains_AccountId, zoneId: Lib_Cloudflare_Runner_ListWorkerDomains_ZoneId): Lib_Cloudflare_Runner_ListWorkerDomains_Returns {
    const result: Lib_Cloudflare_Runner_ListWorkerDomains_Result = await Runner.request(token, 'GET', `/accounts/${accountId}/workers/domains?zone_id=${zoneId}`, undefined);
    const domains: Lib_Cloudflare_Runner_ListWorkerDomains_Domains = cloudflareWorkerDomainsSchema.parse(result);

    return domains.map((domain) => ({
      hostname: domain['hostname'],
      workerName: domain['service'],
    }));
  }

  /**
   * Lib - Cloudflare - Attach Worker Domain.
   *
   * Attaches one hostname to a Worker as a custom domain. Cloudflare refuses a
   * host that already has DNS records of its own, and that refusal throws.
   *
   * @param {Lib_Cloudflare_Runner_AttachWorkerDomain_Token}      token      - Token.
   * @param {Lib_Cloudflare_Runner_AttachWorkerDomain_AccountId}  accountId  - Account id.
   * @param {Lib_Cloudflare_Runner_AttachWorkerDomain_ZoneId}     zoneId     - Zone id.
   * @param {Lib_Cloudflare_Runner_AttachWorkerDomain_Hostname}   hostname   - Hostname.
   * @param {Lib_Cloudflare_Runner_AttachWorkerDomain_WorkerName} workerName - Worker name.
   *
   * @returns {Lib_Cloudflare_Runner_AttachWorkerDomain_Returns}
   *
   * @since 1.2.0
   */
  public static async attachWorkerDomain(token: Lib_Cloudflare_Runner_AttachWorkerDomain_Token, accountId: Lib_Cloudflare_Runner_AttachWorkerDomain_AccountId, zoneId: Lib_Cloudflare_Runner_AttachWorkerDomain_ZoneId, hostname: Lib_Cloudflare_Runner_AttachWorkerDomain_Hostname, workerName: Lib_Cloudflare_Runner_AttachWorkerDomain_WorkerName): Lib_Cloudflare_Runner_AttachWorkerDomain_Returns {
    await Runner.request(token, 'PUT', `/accounts/${accountId}/workers/domains`, {
      hostname,
      service: workerName,
      zone_id: zoneId,
    });

    return;
  }

  /**
   * Lib - Cloudflare - Deploy Worker.
   *
   * Runs the bundled Wrangler CLI to publish the Worker from a generated
   * wrangler.toml, and throws when Wrangler exits with an error.
   *
   * @param {Lib_Cloudflare_Runner_DeployWorker_WranglerTomlPath} wranglerTomlPath - Wrangler toml path.
   *
   * @returns {Lib_Cloudflare_Runner_DeployWorker_Returns}
   *
   * @since 1.2.0
   */
  public static deployWorker(wranglerTomlPath: Lib_Cloudflare_Runner_DeployWorker_WranglerTomlPath): Lib_Cloudflare_Runner_DeployWorker_Returns {
    const wranglerCliPath: Lib_Cloudflare_Runner_DeployWorker_WranglerCliPath = getWranglerCliPath();
    const deployResult: Lib_Cloudflare_Runner_DeployWorker_DeployResult = spawnSync(process.execPath, [
      wranglerCliPath,
      'deploy',
      '--config',
      wranglerTomlPath,
    ], {
      encoding: 'utf-8',
      stdio: 'inherit',
    });

    if (deployResult['status'] !== 0) {
      throw new Error('Worker deployment failed.');
    }

    return;
  }

  /**
   * Lib - Cloudflare - Request.
   *
   * Sends an authenticated request to the Cloudflare v4 API, validates the
   * response envelope, and returns the result payload. Throws with the API
   * error details when the request does not succeed.
   *
   * @param {Lib_Cloudflare_Runner_Request_Token}  token  - Token.
   * @param {Lib_Cloudflare_Runner_Request_Method} method - Method.
   * @param {Lib_Cloudflare_Runner_Request_Path}   path   - Path.
   * @param {Lib_Cloudflare_Runner_Request_Body}   body   - Body.
   *
   * @private
   *
   * @returns {Lib_Cloudflare_Runner_Request_Returns}
   *
   * @since 1.2.0
   */
  private static async request(token: Lib_Cloudflare_Runner_Request_Token, method: Lib_Cloudflare_Runner_Request_Method, path: Lib_Cloudflare_Runner_Request_Path, body: Lib_Cloudflare_Runner_Request_Body): Lib_Cloudflare_Runner_Request_Returns {
    const response: Lib_Cloudflare_Runner_Request_Response = await fetch(`${CLOUDFLARE_API_BASE}${path}`, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      ...((body !== undefined) ? { body: JSON.stringify(body) } : {}),
    });
    const responseData: Lib_Cloudflare_Runner_Request_ResponseData = await response.json();
    const envelope: Lib_Cloudflare_Runner_Request_Envelope = cloudflareEnvelopeSchema.parse(responseData);

    if (response['ok'] === false || envelope['success'] === false) {
      let errorDetails: Lib_Cloudflare_Runner_Request_ErrorDetails = `HTTP ${String(response['status'])}`;

      if (
        envelope['errors'] !== undefined
        && envelope['errors'] !== null
        && envelope['errors'].length > 0
      ) {
        errorDetails = envelope['errors'].map((error) => `${String(error['code'])}: ${error['message']}`).join(', ');
      }

      throw new Error(`Cloudflare API ${method} ${path} failed: ${errorDetails}`);
    }

    return envelope['result'];
  }

  /**
   * Lib - Cloudflare - Has Permission.
   *
   * Issues a read request against an endpoint and reports whether the token was
   * allowed to perform it. Network and parsing failures are rethrown.
   *
   * @param {Lib_Cloudflare_Runner_HasPermission_Token} token - Token.
   * @param {Lib_Cloudflare_Runner_HasPermission_Path}  path  - Path.
   *
   * @private
   *
   * @returns {Lib_Cloudflare_Runner_HasPermission_Returns}
   *
   * @since 1.2.0
   */
  private static async hasPermission(token: Lib_Cloudflare_Runner_HasPermission_Token, path: Lib_Cloudflare_Runner_HasPermission_Path): Lib_Cloudflare_Runner_HasPermission_Returns {
    try {
      await Runner.request(token, 'GET', path, undefined);

      return true;
    } catch (error) {
      // Only a request Cloudflare refused means a missing permission. A response
      // mailmask can't read, or a network failure, is reported as itself.
      if (error instanceof Error && error['message'].startsWith('Cloudflare API ') === true) {
        return false;
      }

      throw error;
    }
  }

  /**
   * Lib - Cloudflare - Build Routing Rule Body.
   *
   * Builds the API body for a literal rule that sends one address to a Worker,
   * the only kind of rule Mailmask creates.
   *
   * @param {Lib_Cloudflare_Runner_BuildRoutingRuleBody_Name}       name       - Name.
   * @param {Lib_Cloudflare_Runner_BuildRoutingRuleBody_Address}    address    - Address.
   * @param {Lib_Cloudflare_Runner_BuildRoutingRuleBody_WorkerName} workerName - Worker name.
   *
   * @private
   *
   * @returns {Lib_Cloudflare_Runner_BuildRoutingRuleBody_Returns}
   *
   * @since 1.2.0
   */
  private static buildRoutingRuleBody(name: Lib_Cloudflare_Runner_BuildRoutingRuleBody_Name, address: Lib_Cloudflare_Runner_BuildRoutingRuleBody_Address, workerName: Lib_Cloudflare_Runner_BuildRoutingRuleBody_WorkerName): Lib_Cloudflare_Runner_BuildRoutingRuleBody_Returns {
    return {
      name,
      enabled: true,
      matchers: [{
        type: 'literal',
        field: 'to',
        value: address,
      }],
      actions: [{
        type: 'worker',
        value: [workerName],
      }],
    };
  }

  /**
   * Lib - Cloudflare - Normalize Record Content.
   *
   * Lowercases record content and drops quotes and a trailing dot, so the same TXT
   * or MX value matches however the API happens to format it.
   *
   * @param {Lib_Cloudflare_Runner_NormalizeRecordContent_Content} content - Content.
   *
   * @private
   *
   * @returns {Lib_Cloudflare_Runner_NormalizeRecordContent_Returns}
   *
   * @since 1.2.0
   */
  private static normalizeRecordContent(content: Lib_Cloudflare_Runner_NormalizeRecordContent_Content): Lib_Cloudflare_Runner_NormalizeRecordContent_Returns {
    const unquoted: Lib_Cloudflare_Runner_NormalizeRecordContent_Unquoted = content.replaceAll('"', '').trim().toLowerCase();

    return (unquoted.endsWith('.') === true) ? unquoted.slice(0, -1) : unquoted;
  }

  /**
   * Lib - Cloudflare - To Record Name.
   *
   * Turns a record name from Email Sending, which can be "@" or relative to the
   * zone, into the full lowercase name the DNS records API takes.
   *
   * @param {Lib_Cloudflare_Runner_ToRecordName_Name}     name     - Name.
   * @param {Lib_Cloudflare_Runner_ToRecordName_ZoneName} zoneName - Zone name.
   *
   * @private
   *
   * @returns {Lib_Cloudflare_Runner_ToRecordName_Returns}
   *
   * @since 1.2.0
   */
  private static toRecordName(name: Lib_Cloudflare_Runner_ToRecordName_Name, zoneName: Lib_Cloudflare_Runner_ToRecordName_ZoneName): Lib_Cloudflare_Runner_ToRecordName_Returns {
    const normalizedName: Lib_Cloudflare_Runner_ToRecordName_NormalizedName = name.trim().toLowerCase();
    const normalizedZoneName: Lib_Cloudflare_Runner_ToRecordName_NormalizedZoneName = zoneName.toLowerCase();

    if (normalizedName === '' || normalizedName === '@') {
      return normalizedZoneName;
    }

    if (normalizedName === normalizedZoneName || normalizedName.endsWith(`.${normalizedZoneName}`) === true) {
      return normalizedName;
    }

    return `${normalizedName}.${normalizedZoneName}`;
  }

  /**
   * Lib - Cloudflare - To Routing Rule.
   *
   * Reads a Cloudflare rule as the lowercased address of its single literal "to"
   * matcher and the one Worker its single action sends to, when it has them.
   *
   * @param {Lib_Cloudflare_Runner_ToRoutingRule_Rule} rule - Rule.
   *
   * @private
   *
   * @returns {Lib_Cloudflare_Runner_ToRoutingRule_Returns}
   *
   * @since 1.2.0
   */
  private static toRoutingRule(rule: Lib_Cloudflare_Runner_ToRoutingRule_Rule): Lib_Cloudflare_Runner_ToRoutingRule_Returns {
    const matcher: Lib_Cloudflare_Runner_ToRoutingRule_Matcher = rule['matchers'][0];
    const action: Lib_Cloudflare_Runner_ToRoutingRule_Action = rule['actions'][0];
    const actionValues: Lib_Cloudflare_Runner_ToRoutingRule_ActionValues = (action === undefined) ? [] : (action['value'] ?? []);
    let address: Lib_Cloudflare_Runner_ToRoutingRule_Address = undefined;
    let workerName: Lib_Cloudflare_Runner_ToRoutingRule_WorkerName = undefined;

    if (
      rule['matchers'].length === 1
      && matcher !== undefined
      && matcher['type'] === 'literal'
      && matcher['field'] === 'to'
      && matcher['value'] !== undefined
    ) {
      address = matcher['value'].toLowerCase();
    }

    if (
      rule['actions'].length === 1
      && action !== undefined
      && action['type'] === 'worker'
      && actionValues.length === 1
    ) {
      workerName = actionValues[0];
    }

    return {
      id: rule['id'],
      name: rule['name'],
      enabled: rule['enabled'],
      address,
      workerName,
    };
  }
}
