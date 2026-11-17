import { spawnSync } from 'node:child_process';
import { resolveMx } from 'node:dns/promises';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Bootstrap, Logger } from '@cbnventures/nova/toolkit';
import chalk from 'chalk';
import prompts from 'prompts';

import { APP_NAME } from '../../lib/item.js';
import { getWranglerCliPath } from '../../lib/package-runtime.js';
import { LIB_REGEX_SURROUNDING_QUOTES } from '../../lib/regex.js';
import {
  cloudflareCatchAllSchema,
  cloudflareDestinationAddressesSchema,
  cloudflareEmailRoutingSettingsSchema,
  cloudflareEnvelopeSchema,
  cloudflareRoutingRulesSchema,
  cloudflareWorkerDomainsSchema,
  cloudflareZonesSchema,
} from '../../lib/schema.js';
import { describeAliasStatus, listAliases } from './alias.js';
import { listDestinations } from './destination.js';
import { generateWranglerToml, getWranglerTomlPath } from './generate.js';
import { listNotifiers } from './notifier.js';
import { getSettings } from './settings.js';
import { validateConfig } from './validate.js';

import type {
  Cli_Commands_Deploy_ApplyRoutingRules_BaseDomain,
  Cli_Commands_Deploy_ApplyRoutingRules_Plan,
  Cli_Commands_Deploy_ApplyRoutingRules_Returns,
  Cli_Commands_Deploy_ApplyRoutingRules_Token,
  Cli_Commands_Deploy_ApplyRoutingRules_WorkerName,
  Cli_Commands_Deploy_ApplyRoutingRules_ZoneId,
  Cli_Commands_Deploy_AttachCustomDomains_AccountId,
  Cli_Commands_Deploy_AttachCustomDomains_ErrorMessage,
  Cli_Commands_Deploy_AttachCustomDomains_Hostnames,
  Cli_Commands_Deploy_AttachCustomDomains_Returns,
  Cli_Commands_Deploy_AttachCustomDomains_Token,
  Cli_Commands_Deploy_AttachCustomDomains_WorkerName,
  Cli_Commands_Deploy_AttachCustomDomains_ZoneId,
  Cli_Commands_Deploy_BuildRoutingRule_Address,
  Cli_Commands_Deploy_BuildRoutingRule_Returns,
  Cli_Commands_Deploy_BuildRoutingRule_WorkerName,
  Cli_Commands_Deploy_CloudflareRequest_Body,
  Cli_Commands_Deploy_CloudflareRequest_Envelope,
  Cli_Commands_Deploy_CloudflareRequest_ErrorDetails,
  Cli_Commands_Deploy_CloudflareRequest_Method,
  Cli_Commands_Deploy_CloudflareRequest_Path,
  Cli_Commands_Deploy_CloudflareRequest_Response,
  Cli_Commands_Deploy_CloudflareRequest_ResponseData,
  Cli_Commands_Deploy_CloudflareRequest_Returns,
  Cli_Commands_Deploy_CloudflareRequest_Token,
  Cli_Commands_Deploy_Deploy_AccountId,
  Cli_Commands_Deploy_Deploy_ConfigPath,
  Cli_Commands_Deploy_Deploy_Interactive,
  Cli_Commands_Deploy_Deploy_MissingHostnames,
  Cli_Commands_Deploy_Deploy_Result,
  Cli_Commands_Deploy_Deploy_Returns,
  Cli_Commands_Deploy_Deploy_Routing,
  Cli_Commands_Deploy_Deploy_RoutingPlan,
  Cli_Commands_Deploy_Deploy_Settings,
  Cli_Commands_Deploy_Deploy_Token,
  Cli_Commands_Deploy_Deploy_WranglerTomlPath,
  Cli_Commands_Deploy_Deploy_ZoneInfo,
  Cli_Commands_Deploy_DeployWorker_DeployResult,
  Cli_Commands_Deploy_DeployWorker_Returns,
  Cli_Commands_Deploy_DeployWorker_WranglerCliPath,
  Cli_Commands_Deploy_DeployWorker_WranglerTomlPath,
  Cli_Commands_Deploy_EnableSubaddressing_Returns,
  Cli_Commands_Deploy_EnableSubaddressing_Routing,
  Cli_Commands_Deploy_EnableSubaddressing_Token,
  Cli_Commands_Deploy_EnableSubaddressing_ZoneId,
  Cli_Commands_Deploy_EnsureDestinationAddresses_AccountId,
  Cli_Commands_Deploy_EnsureDestinationAddresses_ConfigPath,
  Cli_Commands_Deploy_EnsureDestinationAddresses_DestinationEmails,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Destinations,
  Cli_Commands_Deploy_EnsureDestinationAddresses_EmailNotifierEmails,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Emails,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Existing,
  Cli_Commands_Deploy_EnsureDestinationAddresses_ExistingAddresses,
  Cli_Commands_Deploy_EnsureDestinationAddresses_NormalizedEmail,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Page,
  Cli_Commands_Deploy_EnsureDestinationAddresses_PageAddresses,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Pending,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Result,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Returns,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Token,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_BaseDomain,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_MxRecords,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Result,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName,
  Cli_Commands_Deploy_FindMissingPermissions_AccountId,
  Cli_Commands_Deploy_FindMissingPermissions_Missing,
  Cli_Commands_Deploy_FindMissingPermissions_Probes,
  Cli_Commands_Deploy_FindMissingPermissions_Returns,
  Cli_Commands_Deploy_FindMissingPermissions_Token,
  Cli_Commands_Deploy_FindMissingPermissions_ZoneId,
  Cli_Commands_Deploy_GetLiteralAddress_Matcher,
  Cli_Commands_Deploy_GetLiteralAddress_Returns,
  Cli_Commands_Deploy_GetLiteralAddress_Rule,
  Cli_Commands_Deploy_GetZoneInfo_BaseDomain,
  Cli_Commands_Deploy_GetZoneInfo_Candidates,
  Cli_Commands_Deploy_GetZoneInfo_FirstZone,
  Cli_Commands_Deploy_GetZoneInfo_Parts,
  Cli_Commands_Deploy_GetZoneInfo_Result,
  Cli_Commands_Deploy_GetZoneInfo_Returns,
  Cli_Commands_Deploy_GetZoneInfo_Token,
  Cli_Commands_Deploy_GetZoneInfo_Zones,
  Cli_Commands_Deploy_HasPermission_Path,
  Cli_Commands_Deploy_HasPermission_Returns,
  Cli_Commands_Deploy_HasPermission_Token,
  Cli_Commands_Deploy_ListRoutingRules_Page,
  Cli_Commands_Deploy_ListRoutingRules_PageRules,
  Cli_Commands_Deploy_ListRoutingRules_Result,
  Cli_Commands_Deploy_ListRoutingRules_Returns,
  Cli_Commands_Deploy_ListRoutingRules_Rules,
  Cli_Commands_Deploy_ListRoutingRules_Token,
  Cli_Commands_Deploy_ListRoutingRules_ZoneId,
  Cli_Commands_Deploy_LoadEnvToken_Content,
  Cli_Commands_Deploy_LoadEnvToken_EnvValue,
  Cli_Commands_Deploy_LoadEnvToken_Match,
  Cli_Commands_Deploy_LoadEnvToken_Returns,
  Cli_Commands_Deploy_LoadEnvToken_Value,
  Cli_Commands_Deploy_PlanCustomDomains_AccountId,
  Cli_Commands_Deploy_PlanCustomDomains_BaseDomain,
  Cli_Commands_Deploy_PlanCustomDomains_Conflicts,
  Cli_Commands_Deploy_PlanCustomDomains_Domains,
  Cli_Commands_Deploy_PlanCustomDomains_Existing,
  Cli_Commands_Deploy_PlanCustomDomains_Hostnames,
  Cli_Commands_Deploy_PlanCustomDomains_MissingHostnames,
  Cli_Commands_Deploy_PlanCustomDomains_NormalizedBaseDomain,
  Cli_Commands_Deploy_PlanCustomDomains_Result,
  Cli_Commands_Deploy_PlanCustomDomains_Returns,
  Cli_Commands_Deploy_PlanCustomDomains_Token,
  Cli_Commands_Deploy_PlanCustomDomains_WorkerName,
  Cli_Commands_Deploy_PlanCustomDomains_ZoneId,
  Cli_Commands_Deploy_PlanRoutingRules_Aliases,
  Cli_Commands_Deploy_PlanRoutingRules_BaseDomain,
  Cli_Commands_Deploy_PlanRoutingRules_DomainRuleCount,
  Cli_Commands_Deploy_PlanRoutingRules_DomainSuffix,
  Cli_Commands_Deploy_PlanRoutingRules_IsCurrent,
  Cli_Commands_Deploy_PlanRoutingRules_OtherRules,
  Cli_Commands_Deploy_PlanRoutingRules_OwnedAction,
  Cli_Commands_Deploy_PlanRoutingRules_OwnedAddress,
  Cli_Commands_Deploy_PlanRoutingRules_OwnedRule,
  Cli_Commands_Deploy_PlanRoutingRules_OwnedRules,
  Cli_Commands_Deploy_PlanRoutingRules_OwnerPrefix,
  Cli_Commands_Deploy_PlanRoutingRules_Plan,
  Cli_Commands_Deploy_PlanRoutingRules_ProjectedRuleCount,
  Cli_Commands_Deploy_PlanRoutingRules_Returns,
  Cli_Commands_Deploy_PlanRoutingRules_Rules,
  Cli_Commands_Deploy_PlanRoutingRules_Token,
  Cli_Commands_Deploy_PlanRoutingRules_WantedAddresses,
  Cli_Commands_Deploy_PlanRoutingRules_WorkerName,
  Cli_Commands_Deploy_PlanRoutingRules_ZoneId,
  Cli_Commands_Deploy_PrintAliasSummary_Aliases,
  Cli_Commands_Deploy_PrintAliasSummary_ConfigPath,
  Cli_Commands_Deploy_PrintAliasSummary_Now,
  Cli_Commands_Deploy_PrintAliasSummary_Returns,
  Cli_Commands_Deploy_PrintAliasSummary_Settings,
  Cli_Commands_Deploy_PrintAliasSummary_Status,
  Cli_Commands_Deploy_PrintAliasSummary_StatusDescription,
  Cli_Commands_Deploy_PromptForApiToken_PromptResult,
  Cli_Commands_Deploy_PromptForApiToken_Returns,
  Cli_Commands_Deploy_PromptForApiToken_Token,
  Cli_Commands_Deploy_ReleaseCatchAll_CatchAll,
  Cli_Commands_Deploy_ReleaseCatchAll_PointsAtWorker,
  Cli_Commands_Deploy_ReleaseCatchAll_Result,
  Cli_Commands_Deploy_ReleaseCatchAll_Returns,
  Cli_Commands_Deploy_ReleaseCatchAll_Token,
  Cli_Commands_Deploy_ReleaseCatchAll_WorkerName,
  Cli_Commands_Deploy_ReleaseCatchAll_ZoneId,
  Cli_Commands_Deploy_ResolveApiToken_EnvToken,
  Cli_Commands_Deploy_ResolveApiToken_Interactive,
  Cli_Commands_Deploy_ResolveApiToken_Returns,
  Cli_Commands_Deploy_SaveEnvToken_Content,
  Cli_Commands_Deploy_SaveEnvToken_Regex,
  Cli_Commands_Deploy_SaveEnvToken_Returns,
  Cli_Commands_Deploy_SaveEnvToken_Token,
  Cli_Commands_Deploy_VerifyApiToken_Envelope,
  Cli_Commands_Deploy_VerifyApiToken_Response,
  Cli_Commands_Deploy_VerifyApiToken_ResponseData,
  Cli_Commands_Deploy_VerifyApiToken_Returns,
  Cli_Commands_Deploy_VerifyApiToken_Token,
  Cli_Commands_Deploy_VerifyPermissions_AccountId,
  Cli_Commands_Deploy_VerifyPermissions_Interactive,
  Cli_Commands_Deploy_VerifyPermissions_Missing,
  Cli_Commands_Deploy_VerifyPermissions_MissingMessage,
  Cli_Commands_Deploy_VerifyPermissions_PromptResult,
  Cli_Commands_Deploy_VerifyPermissions_Returns,
  Cli_Commands_Deploy_VerifyPermissions_Token,
  Cli_Commands_Deploy_VerifyPermissions_ZoneId,
} from '../../types/cli/commands/deploy.d.ts';

/**
 * CLI - Commands - Deploy - Cloudflare API Base.
 *
 * Base URL for the Cloudflare v4 REST API used by every
 * authenticated request made during the deployment pipeline.
 *
 * @since 0.0.1
 */
const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

/**
 * CLI - Commands - Deploy - Config Dir.
 *
 * Absolute path to the per-user configuration directory that
 * stores the persisted Cloudflare API token and related files.
 *
 * @since 0.0.1
 */
const configDir = Bootstrap.getConfigDir(APP_NAME);

/**
 * CLI - Commands - Deploy - Env File Path.
 *
 * Absolute path to the dotenv file inside the configuration
 * directory where the Cloudflare API token is written.
 *
 * @since 0.0.1
 */
const envFilePath = resolve(configDir, '.env');

/**
 * CLI - Commands - Deploy - Env Token Key.
 *
 * Environment variable name under which the Cloudflare API
 * token is stored and later read back during deployment.
 *
 * @since 0.0.1
 */
const ENV_TOKEN_KEY = 'CLOUDFLARE_API_TOKEN';

/**
 * CLI - Commands - Deploy - Routing Rule Name Prefix.
 *
 * Starts the name of every routing rule deploy creates, followed by the Worker
 * name, so deploy only ever changes or removes the rules that it owns.
 *
 * @since 1.1.0
 */
const ROUTING_RULE_NAME_PREFIX = 'mailmask:';

/**
 * CLI - Commands - Deploy - Routing Rule Limit.
 *
 * Cloudflare's limit on Email Routing rules per domain, checked before deploy
 * adds alias rules so it stops with a clear message instead of failing midway.
 *
 * @since 1.1.0
 */
const ROUTING_RULE_LIMIT = 200;

/**
 * CLI - Commands - Deploy - Routing Rule Address Limit.
 *
 * Longest address a literal Email Routing matcher accepts, so an alias that
 * can't get a rule is caught before deploy changes anything.
 *
 * @since 1.1.0
 */
const ROUTING_RULE_ADDRESS_LIMIT = 90;

/**
 * CLI - Commands - Deploy - Deploy.
 *
 * Orchestrates the full deployment pipeline: authentication, validation,
 * destination registration, Worker deployment, custom domains, and one
 * Email Routing rule per enabled alias that sends its mail to the Worker.
 *
 * @param {Cli_Commands_Deploy_Deploy_ConfigPath}  configPath    - Config path.
 * @param {Cli_Commands_Deploy_Deploy_Interactive} [interactive] - Interactive.
 *
 * @returns {Cli_Commands_Deploy_Deploy_Returns}
 *
 * @since 1.1.0
 */
async function deploy(configPath: Cli_Commands_Deploy_Deploy_ConfigPath, interactive: Cli_Commands_Deploy_Deploy_Interactive = false): Cli_Commands_Deploy_Deploy_Returns {
  // Step 1: Resolve API token.
  Logger.info('Checking authentication...');

  const token: Cli_Commands_Deploy_Deploy_Token = await resolveApiToken(interactive);

  Reflect.set(process.env, ENV_TOKEN_KEY, token);

  Logger.info('Authenticated.');

  // Step 2: Validate config.
  Logger.info('Validating config...');

  const result: Cli_Commands_Deploy_Deploy_Result = validateConfig(configPath);

  if (result['valid'] === false) {
    Logger.error('Config is invalid:');

    for (const error of result['errors']) {
      Logger.error(`  - ${error}`);
    }

    process.exitCode = 1;

    return;
  }

  Logger.info('Config is valid.');

  // Step 3: Locate the zone and verify permissions.
  const settings: Cli_Commands_Deploy_Deploy_Settings = getSettings(configPath);

  Logger.info('Verifying API token permissions...');

  const zoneInfo: Cli_Commands_Deploy_Deploy_ZoneInfo = await getZoneInfo(token, settings['base_domain']);
  const accountId: Cli_Commands_Deploy_Deploy_AccountId = await verifyPermissions(token, zoneInfo['zoneId'], zoneInfo['accountId'], interactive);

  Logger.info('Permissions verified.');

  // Step 4: Make sure Email Routing receives mail for the base domain.
  const routing: Cli_Commands_Deploy_Deploy_Routing = await ensureEmailRoutingEnabled(token, zoneInfo['zoneId'], zoneInfo['zoneName'], settings['base_domain']);

  // Step 5: Check the custom domains and routing rules before anything changes on Cloudflare.
  Logger.info('Checking custom domains...');

  const missingHostnames: Cli_Commands_Deploy_Deploy_MissingHostnames = await planCustomDomains(token, accountId, zoneInfo['zoneId'], settings['worker_name'], settings['base_domain']);

  Logger.info('Checking routing rules...');

  const routingPlan: Cli_Commands_Deploy_Deploy_RoutingPlan = await planRoutingRules(token, zoneInfo['zoneId'], settings['worker_name'], settings['base_domain'], listAliases(configPath));

  // Step 6: Register destination addresses.
  Logger.info('Checking destination addresses...');

  await ensureDestinationAddresses(configPath, token, accountId);

  // Step 7: Generate wrangler.toml.
  Logger.info('Generating wrangler.toml...');

  const wranglerTomlPath: Cli_Commands_Deploy_Deploy_WranglerTomlPath = getWranglerTomlPath(configPath);

  generateWranglerToml(configPath, wranglerTomlPath, accountId);

  Logger.info(`Generated "wrangler.toml" at "${wranglerTomlPath}".`);

  // Step 8: Deploy worker.
  Logger.info('Deploying worker...');

  deployWorker(wranglerTomlPath);

  Logger.info('Worker deployed.');

  // Step 9: Attach the base domain and its www host to the Worker.
  await attachCustomDomains(token, accountId, zoneInfo['zoneId'], settings['worker_name'], missingHostnames);

  // Step 10: Let Email Routing match "alias+tag@" to the alias rule.
  if (settings['subaddressing'] === true) {
    await enableSubaddressing(token, zoneInfo['zoneId'], routing);
  }

  // Step 11: Send each enabled alias to the Worker, then hand back a catch-all from 1.0.0.
  await applyRoutingRules(token, zoneInfo['zoneId'], settings['worker_name'], settings['base_domain'], routingPlan);

  await releaseCatchAll(token, zoneInfo['zoneId'], settings['worker_name']);

  // Step 12: Print alias summary.
  printAliasSummary(configPath);

  Logger.info('Deploy complete.');

  return;
}

/**
 * CLI - Commands - Deploy - Resolve API Token.
 *
 * Checks for a saved token in the env file and falls back
 * to an interactive prompt when no valid token is available.
 *
 * @param {Cli_Commands_Deploy_ResolveApiToken_Interactive} interactive - Interactive.
 *
 * @returns {Cli_Commands_Deploy_ResolveApiToken_Returns}
 *
 * @since 0.0.1
 */
async function resolveApiToken(interactive: Cli_Commands_Deploy_ResolveApiToken_Interactive): Cli_Commands_Deploy_ResolveApiToken_Returns {
  const envToken: Cli_Commands_Deploy_ResolveApiToken_EnvToken = loadEnvToken();

  if (envToken !== undefined) {
    if (await verifyApiToken(envToken) === true) {
      return envToken;
    }

    if (interactive === false) {
      throw new Error('API token in .env is invalid or expired. Update the CLOUDFLARE_API_TOKEN value in your .env file.');
    }

    Logger.warn('Saved API token in .env is invalid or expired.');
  } else {
    if (interactive === false) {
      throw new Error('No API token found. Create a .env file with CLOUDFLARE_API_TOKEN=<your-token> or run "mm" for guided setup.');
    }

    Logger.warn('No API token found. Let\'s set one up.');
  }

  return promptForApiToken();
}

/**
 * CLI - Commands - Deploy - Verify API Token.
 *
 * Calls the Cloudflare token verify endpoint to confirm
 * the token is valid and has not expired.
 *
 * @param {Cli_Commands_Deploy_VerifyApiToken_Token} token - Token.
 *
 * @returns {Cli_Commands_Deploy_VerifyApiToken_Returns}
 *
 * @since 0.0.1
 */
async function verifyApiToken(token: Cli_Commands_Deploy_VerifyApiToken_Token): Cli_Commands_Deploy_VerifyApiToken_Returns {
  try {
    const response: Cli_Commands_Deploy_VerifyApiToken_Response = await fetch(`${CLOUDFLARE_API_BASE}/user/tokens/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const responseData: Cli_Commands_Deploy_VerifyApiToken_ResponseData = await response.json();
    const envelope: Cli_Commands_Deploy_VerifyApiToken_Envelope = cloudflareEnvelopeSchema.safeParse(responseData);

    return envelope['success'] === true && envelope['data']['success'] === true;
  } catch {
    return false;
  }
}

/**
 * CLI - Commands - Deploy - Verify Permissions.
 *
 * Probes the Cloudflare API for each permission scope the deploy needs
 * and, in interactive mode, waits for the user to fix missing ones.
 *
 * @param {Cli_Commands_Deploy_VerifyPermissions_Token}       token       - Token.
 * @param {Cli_Commands_Deploy_VerifyPermissions_ZoneId}      zoneId      - Zone id.
 * @param {Cli_Commands_Deploy_VerifyPermissions_AccountId}   accountId   - Account id.
 * @param {Cli_Commands_Deploy_VerifyPermissions_Interactive} interactive - Interactive.
 *
 * @returns {Cli_Commands_Deploy_VerifyPermissions_Returns}
 *
 * @since 1.1.0
 */
async function verifyPermissions(token: Cli_Commands_Deploy_VerifyPermissions_Token, zoneId: Cli_Commands_Deploy_VerifyPermissions_ZoneId, accountId: Cli_Commands_Deploy_VerifyPermissions_AccountId, interactive: Cli_Commands_Deploy_VerifyPermissions_Interactive): Cli_Commands_Deploy_VerifyPermissions_Returns {
  const missing: Cli_Commands_Deploy_VerifyPermissions_Missing = await findMissingPermissions(token, zoneId, accountId);

  if (missing.length === 0) {
    return accountId;
  }

  if (interactive === false) {
    const missingMessage: Cli_Commands_Deploy_VerifyPermissions_MissingMessage = [
      'API token is missing permissions:',
      ...missing.map((permission) => `  - ${permission}`),
      '',
      'Update your token at https://dash.cloudflare.com/profile/api-tokens',
    ].join('\n');

    throw new Error(missingMessage);
  }

  Logger.warn('API token is missing the following permissions:');
  Logger.warn('');

  for (const permission of missing) {
    Logger.warn(`  - ${permission}`);
  }

  Logger.warn('');

  Logger.info('  1. Go to https://dash.cloudflare.com/profile/api-tokens');
  Logger.info('  2. Find your token -> ... -> Edit');
  Logger.info('  3. For each missing permission, search for its permission group under "Account policy" or "Zone policy" (the first part above) and tick Read or Edit (the last part)');
  Logger.info('  4. Click "Continue to summary" then "Update Token"');
  Logger.info('');

  const promptResult: Cli_Commands_Deploy_VerifyPermissions_PromptResult = await prompts({
    type: 'confirm',
    name: 'ready',
    message: 'Done? Press enter to retry.',
    initial: true,
  });

  if (promptResult['ready'] !== true) {
    throw new Error('Deploy cancelled. Please update your API token permissions and try again.');
  }

  return verifyPermissions(token, zoneId, accountId, interactive);
}

/**
 * CLI - Commands - Deploy - Find Missing Permissions.
 *
 * Reads every Cloudflare endpoint deploy calls and names the permission group
 * behind each one the token can't reach, so a gap shows before anything changes.
 *
 * @param {Cli_Commands_Deploy_FindMissingPermissions_Token}     token     - Token.
 * @param {Cli_Commands_Deploy_FindMissingPermissions_ZoneId}    zoneId    - Zone id.
 * @param {Cli_Commands_Deploy_FindMissingPermissions_AccountId} accountId - Account id.
 *
 * @returns {Cli_Commands_Deploy_FindMissingPermissions_Returns}
 *
 * @since 1.1.0
 */
async function findMissingPermissions(token: Cli_Commands_Deploy_FindMissingPermissions_Token, zoneId: Cli_Commands_Deploy_FindMissingPermissions_ZoneId, accountId: Cli_Commands_Deploy_FindMissingPermissions_AccountId): Cli_Commands_Deploy_FindMissingPermissions_Returns {
  const probes: Cli_Commands_Deploy_FindMissingPermissions_Probes = [
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
  ];
  const missing: Cli_Commands_Deploy_FindMissingPermissions_Missing = [];

  for (const probe of probes) {
    if (missing.includes(probe['permission']) === true) {
      continue;
    }

    if (await hasPermission(token, probe['path']) === false) {
      missing.push(probe['permission']);
    }
  }

  return missing;
}

/**
 * CLI - Commands - Deploy - Has Permission.
 *
 * Issues a read request against a Cloudflare endpoint and reports
 * whether the token was allowed to perform it.
 *
 * @param {Cli_Commands_Deploy_HasPermission_Token} token - Token.
 * @param {Cli_Commands_Deploy_HasPermission_Path}  path  - Path.
 *
 * @returns {Cli_Commands_Deploy_HasPermission_Returns}
 *
 * @since 0.0.1
 */
async function hasPermission(token: Cli_Commands_Deploy_HasPermission_Token, path: Cli_Commands_Deploy_HasPermission_Path): Cli_Commands_Deploy_HasPermission_Returns {
  try {
    await cloudflareRequest(token, 'GET', path, undefined);

    return true;
  } catch {
    return false;
  }
}

/**
 * CLI - Commands - Deploy - Prompt For API Token.
 *
 * Walks the user through creating a Cloudflare API token
 * and saves the validated result to the local env file.
 *
 * @returns {Cli_Commands_Deploy_PromptForApiToken_Returns}
 *
 * @since 1.1.0
 */
async function promptForApiToken(): Cli_Commands_Deploy_PromptForApiToken_Returns {
  Logger.info('');
  Logger.info('You need a Cloudflare API token to deploy the Worker and manage Email Routing.');
  Logger.info('');
  Logger.info('  1. Go to https://dash.cloudflare.com/profile/api-tokens');
  Logger.info('  2. Click "Create Token", then start from scratch with a custom token');
  Logger.info('  3. Name the token (e.g. "Mailmask")');
  Logger.info('  4. Under "Account policy", select your account, then search for each permission group and tick:');
  Logger.info('     - Workers Scripts: Edit');
  Logger.info('     - Email Routing Addresses: Edit');
  Logger.info('  5. Under "Zone policy", select the zone that holds your base domain, then search for each permission group and tick:');
  Logger.info('     - Zone Settings: Edit');
  Logger.info('     - Email Routing Rules: Edit');
  Logger.info('     - Workers Routes: Edit');
  Logger.info('  6. Click "Continue to summary" then "Create Token"');
  Logger.info('  7. Copy the generated token');
  Logger.info('');

  const promptResult: Cli_Commands_Deploy_PromptForApiToken_PromptResult = await prompts({
    type: 'password',
    name: 'apiToken',
    message: 'Paste your API token:',
    validate: (value) => value.trim().length > 0 || 'Token is required',
  });

  if (promptResult['apiToken'] === undefined) {
    throw new Error('API token is required to deploy.');
  }

  const token: Cli_Commands_Deploy_PromptForApiToken_Token = promptResult['apiToken'].trim();

  if (await verifyApiToken(token) === false) {
    throw new Error('API token is invalid. Please check the token and try again.');
  }

  saveEnvToken(token);

  Logger.info('API token saved to .env file.');

  return token;
}

/**
 * CLI - Commands - Deploy - Cloudflare Request.
 *
 * Sends an authenticated request to the Cloudflare v4 API, validates the
 * response envelope, and returns the unvalidated result payload. Throws
 * with the API error details when the request does not succeed.
 *
 * @param {Cli_Commands_Deploy_CloudflareRequest_Token}  token  - Token.
 * @param {Cli_Commands_Deploy_CloudflareRequest_Method} method - Method.
 * @param {Cli_Commands_Deploy_CloudflareRequest_Path}   path   - Path.
 * @param {Cli_Commands_Deploy_CloudflareRequest_Body}   body   - Body.
 *
 * @returns {Cli_Commands_Deploy_CloudflareRequest_Returns}
 *
 * @since 0.0.1
 */
async function cloudflareRequest(token: Cli_Commands_Deploy_CloudflareRequest_Token, method: Cli_Commands_Deploy_CloudflareRequest_Method, path: Cli_Commands_Deploy_CloudflareRequest_Path, body: Cli_Commands_Deploy_CloudflareRequest_Body): Cli_Commands_Deploy_CloudflareRequest_Returns {
  const response: Cli_Commands_Deploy_CloudflareRequest_Response = await fetch(`${CLOUDFLARE_API_BASE}${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    ...((body !== undefined) ? { body: JSON.stringify(body) } : {}),
  });
  const responseData: Cli_Commands_Deploy_CloudflareRequest_ResponseData = await response.json();
  const envelope: Cli_Commands_Deploy_CloudflareRequest_Envelope = cloudflareEnvelopeSchema.parse(responseData);

  if (response['ok'] === false || envelope['success'] === false) {
    let errorDetails: Cli_Commands_Deploy_CloudflareRequest_ErrorDetails = `HTTP ${String(response['status'])}`;

    if (envelope['errors'] !== undefined && envelope['errors'].length > 0) {
      errorDetails = envelope['errors'].map((error) => `${String(error['code'])}: ${error['message']}`).join(', ');
    }

    throw new Error(`Cloudflare API ${method} ${path} failed: ${errorDetails}`);
  }

  return envelope['result'];
}

/**
 * CLI - Commands - Deploy - Get Zone Info.
 *
 * Walks progressively shorter domain segments to find the
 * matching Cloudflare zone and returns its ID and account ID.
 *
 * @param {Cli_Commands_Deploy_GetZoneInfo_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_GetZoneInfo_BaseDomain} baseDomain - Base domain.
 *
 * @returns {Cli_Commands_Deploy_GetZoneInfo_Returns}
 *
 * @since 0.0.1
 */
async function getZoneInfo(token: Cli_Commands_Deploy_GetZoneInfo_Token, baseDomain: Cli_Commands_Deploy_GetZoneInfo_BaseDomain): Cli_Commands_Deploy_GetZoneInfo_Returns {
  // e.g., "mail.example.co.uk" -> try "mail.example.co.uk", then "example.co.uk", then "co.uk".
  const parts: Cli_Commands_Deploy_GetZoneInfo_Parts = baseDomain.split('.');
  const candidates: Cli_Commands_Deploy_GetZoneInfo_Candidates = parts.slice(0, parts.length - 1).map((_unused, i) => parts.slice(i).join('.'));

  for (const candidate of candidates) {
    let result: Cli_Commands_Deploy_GetZoneInfo_Result = undefined;

    try {
      result = await cloudflareRequest(token, 'GET', `/zones?name=${candidate}`, undefined);
    } catch {
      continue;
    }

    const zones: Cli_Commands_Deploy_GetZoneInfo_Zones = cloudflareZonesSchema.parse(result);
    const firstZone: Cli_Commands_Deploy_GetZoneInfo_FirstZone = zones[0];

    if (firstZone !== undefined) {
      return {
        zoneId: firstZone['id'],
        accountId: firstZone['account']['id'],
        zoneName: firstZone['name'],
      };
    }
  }

  throw new Error(`Failed to find Cloudflare zone for "${baseDomain}". Is the domain added to your Cloudflare account?`);
}

/**
 * CLI - Commands - Deploy - Ensure Email Routing Enabled.
 *
 * Confirms Email Routing receives mail for the base domain: the zone setting for
 * an apex, or Cloudflare's MX records for a subdomain. Enabling either changes
 * DNS, so the deploy stops and points the user at the dashboard instead.
 *
 * @param {Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId}     zoneId     - Zone id.
 * @param {Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName}   zoneName   - Zone name.
 * @param {Cli_Commands_Deploy_EnsureEmailRoutingEnabled_BaseDomain} baseDomain - Base domain.
 *
 * @returns {Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns}
 *
 * @since 1.1.0
 */
async function ensureEmailRoutingEnabled(token: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token, zoneId: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId, zoneName: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName, baseDomain: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_BaseDomain): Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns {
  const result: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Result = await cloudflareRequest(token, 'GET', `/zones/${zoneId}/email/routing`, undefined);
  const routing: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing = cloudflareEmailRoutingSettingsSchema.parse(result);

  if (baseDomain === zoneName) {
    if (routing['enabled'] === false) {
      throw new Error(`Email Routing is not enabled for "${zoneName}". In the Cloudflare dashboard, open Email Routing for the domain, go to Settings > DNS records, and select "Add missing records" so the MX and SPF records are added, then deploy again.`);
    }

    return routing;
  }

  let mxRecords: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_MxRecords = [];

  try {
    mxRecords = await resolveMx(baseDomain);
  } catch {
    mxRecords = [];
  }

  // Cloudflare adds the route1, route2, and route3 .mx.cloudflare.net records when a subdomain joins Email Routing.
  if (mxRecords.some((mxRecord) => mxRecord['exchange'].toLowerCase().endsWith('.mx.cloudflare.net') === true) === false) {
    throw new Error(`Email Routing is not set up for the subdomain "${baseDomain}". In the Cloudflare dashboard, open Email Routing for "${zoneName}", go to Settings > Subdomains, add "${baseDomain}" so Cloudflare adds its records, and deploy again once its MX records point to Cloudflare.`);
  }

  return routing;
}

/**
 * CLI - Commands - Deploy - Enable Subaddressing.
 *
 * Turns on Email Routing subaddressing so "alias+tag@" matches the alias rule. It
 * is a zone setting, not DNS, and deploy never turns it off when config says no.
 *
 * @param {Cli_Commands_Deploy_EnableSubaddressing_Token}   token   - Token.
 * @param {Cli_Commands_Deploy_EnableSubaddressing_ZoneId}  zoneId  - Zone id.
 * @param {Cli_Commands_Deploy_EnableSubaddressing_Routing} routing - Routing.
 *
 * @returns {Cli_Commands_Deploy_EnableSubaddressing_Returns}
 *
 * @since 1.1.0
 */
async function enableSubaddressing(token: Cli_Commands_Deploy_EnableSubaddressing_Token, zoneId: Cli_Commands_Deploy_EnableSubaddressing_ZoneId, routing: Cli_Commands_Deploy_EnableSubaddressing_Routing): Cli_Commands_Deploy_EnableSubaddressing_Returns {
  if (routing['support_subaddress'] === true) {
    return;
  }

  await cloudflareRequest(token, 'PATCH', `/zones/${zoneId}/email/routing`, { support_subaddress: true });

  Logger.info('Turned on Email Routing subaddressing so "alias+tag@" reaches the alias.');

  return;
}

/**
 * CLI - Commands - Deploy - Get Literal Address.
 *
 * Returns the lowercased address a routing rule matches when it is a single
 * literal "to" matcher, which is the only kind of rule deploy creates.
 *
 * @param {Cli_Commands_Deploy_GetLiteralAddress_Rule} rule - Rule.
 *
 * @returns {Cli_Commands_Deploy_GetLiteralAddress_Returns}
 *
 * @since 1.1.0
 */
function getLiteralAddress(rule: Cli_Commands_Deploy_GetLiteralAddress_Rule): Cli_Commands_Deploy_GetLiteralAddress_Returns {
  const matcher: Cli_Commands_Deploy_GetLiteralAddress_Matcher = rule['matchers'][0];

  if (
    rule['matchers'].length !== 1
    || matcher === undefined
    || matcher['type'] !== 'literal'
    || matcher['field'] !== 'to'
    || matcher['value'] === undefined
  ) {
    return undefined;
  }

  return matcher['value'].toLowerCase();
}

/**
 * CLI - Commands - Deploy - List Routing Rules.
 *
 * Reads every Email Routing rule on the zone, page by page, so deploy can tell the
 * rules it owns apart from ones the user or another Worker created.
 *
 * @param {Cli_Commands_Deploy_ListRoutingRules_Token}  token  - Token.
 * @param {Cli_Commands_Deploy_ListRoutingRules_ZoneId} zoneId - Zone id.
 *
 * @returns {Cli_Commands_Deploy_ListRoutingRules_Returns}
 *
 * @since 1.1.0
 */
async function listRoutingRules(token: Cli_Commands_Deploy_ListRoutingRules_Token, zoneId: Cli_Commands_Deploy_ListRoutingRules_ZoneId): Cli_Commands_Deploy_ListRoutingRules_Returns {
  const rules: Cli_Commands_Deploy_ListRoutingRules_Rules = [];
  let page: Cli_Commands_Deploy_ListRoutingRules_Page = 1;
  let pageRules: Cli_Commands_Deploy_ListRoutingRules_PageRules = [];

  do {
    const result: Cli_Commands_Deploy_ListRoutingRules_Result = await cloudflareRequest(token, 'GET', `/zones/${zoneId}/email/routing/rules?page=${String(page)}&per_page=50`, undefined);

    pageRules = cloudflareRoutingRulesSchema.parse(result);
    rules.push(...pageRules);
    page += 1;
  } while (pageRules.length === 50);

  return rules;
}

/**
 * CLI - Commands - Deploy - Plan Routing Rules.
 *
 * Works out which alias rules to create, update, and delete for this Worker, and
 * stops before any change when the domain would pass Cloudflare's rule limit.
 *
 * @param {Cli_Commands_Deploy_PlanRoutingRules_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_PlanRoutingRules_ZoneId}     zoneId     - Zone id.
 * @param {Cli_Commands_Deploy_PlanRoutingRules_WorkerName} workerName - Worker name.
 * @param {Cli_Commands_Deploy_PlanRoutingRules_BaseDomain} baseDomain - Base domain.
 * @param {Cli_Commands_Deploy_PlanRoutingRules_Aliases}    aliases    - Aliases.
 *
 * @returns {Cli_Commands_Deploy_PlanRoutingRules_Returns}
 *
 * @since 1.1.0
 */
async function planRoutingRules(token: Cli_Commands_Deploy_PlanRoutingRules_Token, zoneId: Cli_Commands_Deploy_PlanRoutingRules_ZoneId, workerName: Cli_Commands_Deploy_PlanRoutingRules_WorkerName, baseDomain: Cli_Commands_Deploy_PlanRoutingRules_BaseDomain, aliases: Cli_Commands_Deploy_PlanRoutingRules_Aliases): Cli_Commands_Deploy_PlanRoutingRules_Returns {
  const rules: Cli_Commands_Deploy_PlanRoutingRules_Rules = await listRoutingRules(token, zoneId);
  const ownerPrefix: Cli_Commands_Deploy_PlanRoutingRules_OwnerPrefix = `${ROUTING_RULE_NAME_PREFIX}${workerName}:`;
  const domainSuffix: Cli_Commands_Deploy_PlanRoutingRules_DomainSuffix = `@${baseDomain.toLowerCase()}`;
  const ownedRules: Cli_Commands_Deploy_PlanRoutingRules_OwnedRules = rules.filter((rule) => (rule['name'] ?? '').startsWith(ownerPrefix) === true);
  const otherRules: Cli_Commands_Deploy_PlanRoutingRules_OtherRules = rules.filter((rule) => ownedRules.includes(rule) === false);
  const wantedAddresses: Cli_Commands_Deploy_PlanRoutingRules_WantedAddresses = aliases.filter((alias) => alias['enabled'] === true).map((alias) => `${alias['address']}${domainSuffix}`);
  const plan: Cli_Commands_Deploy_PlanRoutingRules_Plan = {
    create: [],
    update: [],
    remove: [],
    skipped: [],
  };

  for (const wantedAddress of wantedAddresses) {
    if (wantedAddress.length > ROUTING_RULE_ADDRESS_LIMIT) {
      throw new Error(`The alias address "${wantedAddress}" is longer than the ${String(ROUTING_RULE_ADDRESS_LIMIT)} characters an Email Routing rule can match. Shorten the alias and deploy again.`);
    }

    const ownedRule: Cli_Commands_Deploy_PlanRoutingRules_OwnedRule = ownedRules.find((rule) => getLiteralAddress(rule) === wantedAddress);

    if (ownedRule !== undefined) {
      const ownedAction: Cli_Commands_Deploy_PlanRoutingRules_OwnedAction = ownedRule['actions'][0];
      const isCurrent: Cli_Commands_Deploy_PlanRoutingRules_IsCurrent = ownedRule['enabled'] === true
        && ownedRule['name'] === `${ownerPrefix}${wantedAddress}`
        && ownedRule['actions'].length === 1
        && ownedAction !== undefined
        && ownedAction['type'] === 'worker'
        && (ownedAction['value'] ?? []).length === 1
        && (ownedAction['value'] ?? []).includes(workerName) === true;

      if (isCurrent === false) {
        plan['update'].push({
          id: ownedRule['id'],
          address: wantedAddress,
        });
      }

      continue;
    }

    // A rule someone else made for the same address wins, so leave it and say so.
    if (otherRules.some((rule) => getLiteralAddress(rule) === wantedAddress) === true) {
      plan['skipped'].push(wantedAddress);

      continue;
    }

    plan['create'].push(wantedAddress);
  }

  for (const ownedRule of ownedRules) {
    const ownedAddress: Cli_Commands_Deploy_PlanRoutingRules_OwnedAddress = getLiteralAddress(ownedRule);

    if (ownedAddress === undefined || wantedAddresses.includes(ownedAddress) === false) {
      plan['remove'].push({
        id: ownedRule['id'],
        address: (ownedAddress !== undefined) ? ownedAddress : ownedRule['id'],
      });
    }
  }

  const domainRuleCount: Cli_Commands_Deploy_PlanRoutingRules_DomainRuleCount = rules.filter((rule) => (getLiteralAddress(rule) ?? '').endsWith(domainSuffix) === true).length;
  const projectedRuleCount: Cli_Commands_Deploy_PlanRoutingRules_ProjectedRuleCount = domainRuleCount + plan['create'].length - plan['remove'].length;

  if (projectedRuleCount > ROUTING_RULE_LIMIT) {
    throw new Error(`Deploy would leave ${String(projectedRuleCount)} Email Routing rules on "${baseDomain}", counting rules other Workers and you created, and Cloudflare allows ${String(ROUTING_RULE_LIMIT)} per domain. Disable or remove ${String(projectedRuleCount - ROUTING_RULE_LIMIT)} aliases and deploy again.`);
  }

  return plan;
}

/**
 * CLI - Commands - Deploy - Apply Routing Rules.
 *
 * Creates, updates, and deletes this Worker's alias rules from the plan. Rules
 * that the user or another Worker created are never changed or removed.
 *
 * @param {Cli_Commands_Deploy_ApplyRoutingRules_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_ApplyRoutingRules_ZoneId}     zoneId     - Zone id.
 * @param {Cli_Commands_Deploy_ApplyRoutingRules_WorkerName} workerName - Worker name.
 * @param {Cli_Commands_Deploy_ApplyRoutingRules_BaseDomain} baseDomain - Base domain.
 * @param {Cli_Commands_Deploy_ApplyRoutingRules_Plan}       plan       - Plan.
 *
 * @returns {Cli_Commands_Deploy_ApplyRoutingRules_Returns}
 *
 * @since 1.1.0
 */
async function applyRoutingRules(token: Cli_Commands_Deploy_ApplyRoutingRules_Token, zoneId: Cli_Commands_Deploy_ApplyRoutingRules_ZoneId, workerName: Cli_Commands_Deploy_ApplyRoutingRules_WorkerName, baseDomain: Cli_Commands_Deploy_ApplyRoutingRules_BaseDomain, plan: Cli_Commands_Deploy_ApplyRoutingRules_Plan): Cli_Commands_Deploy_ApplyRoutingRules_Returns {
  for (const address of plan['create']) {
    await cloudflareRequest(token, 'POST', `/zones/${zoneId}/email/routing/rules`, buildRoutingRule(workerName, address));

    Logger.info(`Added a routing rule that sends "${address}" to the Worker.`);
  }

  for (const rule of plan['update']) {
    await cloudflareRequest(token, 'PUT', `/zones/${zoneId}/email/routing/rules/${rule['id']}`, buildRoutingRule(workerName, rule['address']));

    Logger.info(`Updated the routing rule for "${rule['address']}" so it sends mail to the Worker.`);
  }

  for (const rule of plan['remove']) {
    await cloudflareRequest(token, 'DELETE', `/zones/${zoneId}/email/routing/rules/${rule['id']}`, undefined);

    Logger.info(`Removed the routing rule for "${rule['address']}" because the alias is gone or disabled.`);
  }

  for (const address of plan['skipped']) {
    Logger.warn(`Left "${address}" alone because another Email Routing rule already handles it. Remove that rule in the dashboard to let the Worker receive this alias's mail.`);
  }

  if (
    plan['create'].length === 0
    && plan['update'].length === 0
    && plan['remove'].length === 0
  ) {
    Logger.info(`Routing rules for "${baseDomain}" already match the enabled aliases.`);
  }

  return;
}

/**
 * CLI - Commands - Deploy - Build Routing Rule.
 *
 * Builds the literal rule that sends one alias address to the Worker. The name
 * carries the Worker name so two Mailmask Workers on one zone keep their own.
 *
 * @param {Cli_Commands_Deploy_BuildRoutingRule_WorkerName} workerName - Worker name.
 * @param {Cli_Commands_Deploy_BuildRoutingRule_Address}    address    - Address.
 *
 * @returns {Cli_Commands_Deploy_BuildRoutingRule_Returns}
 *
 * @since 1.1.0
 */
function buildRoutingRule(workerName: Cli_Commands_Deploy_BuildRoutingRule_WorkerName, address: Cli_Commands_Deploy_BuildRoutingRule_Address): Cli_Commands_Deploy_BuildRoutingRule_Returns {
  return {
    name: `${ROUTING_RULE_NAME_PREFIX}${workerName}:${address}`,
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
 * CLI - Commands - Deploy - Release Catch All.
 *
 * Turns off a catch-all that Mailmask 1.0.0 pointed at this Worker, once the alias
 * rules exist. Mail to other addresses is then rejected by Cloudflare itself.
 *
 * @param {Cli_Commands_Deploy_ReleaseCatchAll_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_ReleaseCatchAll_ZoneId}     zoneId     - Zone id.
 * @param {Cli_Commands_Deploy_ReleaseCatchAll_WorkerName} workerName - Worker name.
 *
 * @returns {Cli_Commands_Deploy_ReleaseCatchAll_Returns}
 *
 * @since 1.1.0
 */
async function releaseCatchAll(token: Cli_Commands_Deploy_ReleaseCatchAll_Token, zoneId: Cli_Commands_Deploy_ReleaseCatchAll_ZoneId, workerName: Cli_Commands_Deploy_ReleaseCatchAll_WorkerName): Cli_Commands_Deploy_ReleaseCatchAll_Returns {
  const result: Cli_Commands_Deploy_ReleaseCatchAll_Result = await cloudflareRequest(token, 'GET', `/zones/${zoneId}/email/routing/rules/catch_all`, undefined);
  const catchAll: Cli_Commands_Deploy_ReleaseCatchAll_CatchAll = cloudflareCatchAllSchema.parse(result);
  const pointsAtWorker: Cli_Commands_Deploy_ReleaseCatchAll_PointsAtWorker = catchAll['actions'].some((action) => action['type'] === 'worker' && (action['value'] ?? []).includes(workerName) === true);

  if (pointsAtWorker === false) {
    return;
  }

  // Mailmask 1.0.0 never stored the action it replaced, so there is nothing to restore.
  await cloudflareRequest(token, 'PUT', `/zones/${zoneId}/email/routing/rules/catch_all`, {
    name: catchAll['name'] ?? `${workerName}: catch-all`,
    enabled: false,
    matchers: [{ type: 'all' }],
    actions: [{ type: 'drop' }],
  });

  Logger.info('Turned off the Email Routing catch-all that pointed at the Worker. Each alias now has its own rule, and Cloudflare rejects mail to other addresses.');

  return;
}

/**
 * CLI - Commands - Deploy - Ensure Destination Addresses.
 *
 * Registers every forwarding destination and email-notifier recipient as an
 * Email Routing destination address. Cloudflare emails a verification link
 * for new addresses, and delivery only works once they are verified.
 *
 * @param {Cli_Commands_Deploy_EnsureDestinationAddresses_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Deploy_EnsureDestinationAddresses_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_EnsureDestinationAddresses_AccountId}  accountId  - Account id.
 *
 * @returns {Cli_Commands_Deploy_EnsureDestinationAddresses_Returns}
 *
 * @since 1.0.0
 */
async function ensureDestinationAddresses(configPath: Cli_Commands_Deploy_EnsureDestinationAddresses_ConfigPath, token: Cli_Commands_Deploy_EnsureDestinationAddresses_Token, accountId: Cli_Commands_Deploy_EnsureDestinationAddresses_AccountId): Cli_Commands_Deploy_EnsureDestinationAddresses_Returns {
  const destinations: Cli_Commands_Deploy_EnsureDestinationAddresses_Destinations = listDestinations(configPath);
  const destinationEmails: Cli_Commands_Deploy_EnsureDestinationAddresses_DestinationEmails = destinations.map((destination) => destination['email']);
  const emailNotifierEmails: Cli_Commands_Deploy_EnsureDestinationAddresses_EmailNotifierEmails = listNotifiers(configPath).filter((notifier) => notifier['type'] === 'email').map((notifier) => notifier['to']);
  const emails: Cli_Commands_Deploy_EnsureDestinationAddresses_Emails = [...new Set([
    ...destinationEmails,
    ...emailNotifierEmails,
  ])];
  const existingAddresses: Cli_Commands_Deploy_EnsureDestinationAddresses_ExistingAddresses = [];
  let page: Cli_Commands_Deploy_EnsureDestinationAddresses_Page = 1;
  let pageAddresses: Cli_Commands_Deploy_EnsureDestinationAddresses_PageAddresses = [];

  do {
    const result: Cli_Commands_Deploy_EnsureDestinationAddresses_Result = await cloudflareRequest(token, 'GET', `/accounts/${accountId}/email/routing/addresses?page=${String(page)}&per_page=50`, undefined);

    pageAddresses = cloudflareDestinationAddressesSchema.parse(result);
    existingAddresses.push(...pageAddresses);
    page += 1;
  } while (pageAddresses.length === 50);

  const pending: Cli_Commands_Deploy_EnsureDestinationAddresses_Pending = [];

  for (const email of emails) {
    const normalizedEmail: Cli_Commands_Deploy_EnsureDestinationAddresses_NormalizedEmail = email.toLowerCase();
    const existing: Cli_Commands_Deploy_EnsureDestinationAddresses_Existing = existingAddresses.find((existingAddress) => existingAddress['email'].toLowerCase() === normalizedEmail);

    if (existing === undefined) {
      await cloudflareRequest(token, 'POST', `/accounts/${accountId}/email/routing/addresses`, { email });

      Logger.info(`Registered destination "${email}". Cloudflare sent a verification email to it.`);

      pending.push(email);

      continue;
    }

    if (existing['verified'] === undefined || existing['verified'] === null) {
      pending.push(email);
    }
  }

  if (pending.length > 0) {
    Logger.warn('These destinations are not verified yet. Mail for their aliases will be rejected until you click the link Cloudflare emailed:');

    for (const pendingEmail of pending) {
      Logger.warn(`  - ${pendingEmail}`);
    }
  } else {
    Logger.info('All destination addresses are verified.');
  }

  return;
}

/**
 * CLI - Commands - Deploy - Plan Custom Domains.
 *
 * Lists the zone's Workers custom domains and returns the base domain hosts the
 * Worker still lacks. Stops before any change when another Worker owns a host.
 *
 * @param {Cli_Commands_Deploy_PlanCustomDomains_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_PlanCustomDomains_AccountId}  accountId  - Account id.
 * @param {Cli_Commands_Deploy_PlanCustomDomains_ZoneId}     zoneId     - Zone id.
 * @param {Cli_Commands_Deploy_PlanCustomDomains_WorkerName} workerName - Worker name.
 * @param {Cli_Commands_Deploy_PlanCustomDomains_BaseDomain} baseDomain - Base domain.
 *
 * @returns {Cli_Commands_Deploy_PlanCustomDomains_Returns}
 *
 * @since 1.1.0
 */
async function planCustomDomains(token: Cli_Commands_Deploy_PlanCustomDomains_Token, accountId: Cli_Commands_Deploy_PlanCustomDomains_AccountId, zoneId: Cli_Commands_Deploy_PlanCustomDomains_ZoneId, workerName: Cli_Commands_Deploy_PlanCustomDomains_WorkerName, baseDomain: Cli_Commands_Deploy_PlanCustomDomains_BaseDomain): Cli_Commands_Deploy_PlanCustomDomains_Returns {
  const normalizedBaseDomain: Cli_Commands_Deploy_PlanCustomDomains_NormalizedBaseDomain = baseDomain.toLowerCase();
  const hostnames: Cli_Commands_Deploy_PlanCustomDomains_Hostnames = [
    normalizedBaseDomain,
    `www.${normalizedBaseDomain}`,
  ];
  const result: Cli_Commands_Deploy_PlanCustomDomains_Result = await cloudflareRequest(token, 'GET', `/accounts/${accountId}/workers/domains?zone_id=${zoneId}`, undefined);
  const domains: Cli_Commands_Deploy_PlanCustomDomains_Domains = cloudflareWorkerDomainsSchema.parse(result);
  const missingHostnames: Cli_Commands_Deploy_PlanCustomDomains_MissingHostnames = [];
  const conflicts: Cli_Commands_Deploy_PlanCustomDomains_Conflicts = [];

  for (const hostname of hostnames) {
    const existing: Cli_Commands_Deploy_PlanCustomDomains_Existing = domains.find((domain) => domain['hostname'].toLowerCase() === hostname);

    if (existing === undefined) {
      missingHostnames.push(hostname);

      continue;
    }

    if (existing['service'] !== workerName) {
      conflicts.push(`  - "${hostname}" is attached to the Worker "${existing['service']}"`);
    }
  }

  if (conflicts.length > 0) {
    throw new Error([
      `Custom domains that "${workerName}" needs are attached to another Worker:`,
      ...conflicts,
      '',
      'Deploy never moves a custom domain away from another Worker. Remove the domain from that Worker\'s custom domains in the Cloudflare dashboard, then deploy again.',
    ].join('\n'));
  }

  if (missingHostnames.length === 0) {
    Logger.info('Custom domains already point at the Worker.');
  }

  return missingHostnames;
}

/**
 * CLI - Commands - Deploy - Attach Custom Domains.
 *
 * Attaches each missing host as a Workers custom domain so the service page has
 * an address once workers.dev is off. A host Cloudflare refuses only warns.
 *
 * @param {Cli_Commands_Deploy_AttachCustomDomains_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_AttachCustomDomains_AccountId}  accountId  - Account id.
 * @param {Cli_Commands_Deploy_AttachCustomDomains_ZoneId}     zoneId     - Zone id.
 * @param {Cli_Commands_Deploy_AttachCustomDomains_WorkerName} workerName - Worker name.
 * @param {Cli_Commands_Deploy_AttachCustomDomains_Hostnames}  hostnames  - Hostnames.
 *
 * @returns {Cli_Commands_Deploy_AttachCustomDomains_Returns}
 *
 * @since 1.1.0
 */
async function attachCustomDomains(token: Cli_Commands_Deploy_AttachCustomDomains_Token, accountId: Cli_Commands_Deploy_AttachCustomDomains_AccountId, zoneId: Cli_Commands_Deploy_AttachCustomDomains_ZoneId, workerName: Cli_Commands_Deploy_AttachCustomDomains_WorkerName, hostnames: Cli_Commands_Deploy_AttachCustomDomains_Hostnames): Cli_Commands_Deploy_AttachCustomDomains_Returns {
  for (const hostname of hostnames) {
    try {
      await cloudflareRequest(token, 'PUT', `/accounts/${accountId}/workers/domains`, {
        hostname,
        service: workerName,
        zone_id: zoneId,
      });
    } catch (error) {
      const errorMessage: Cli_Commands_Deploy_AttachCustomDomains_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

      Logger.warn(`Could not attach the custom domain "${hostname}" to the Worker. Cloudflare refuses a host that already has its own DNS records, such as a CNAME or a website's A record. Mail still works; remove those records and deploy again to serve the service page there. (${errorMessage})`);

      continue;
    }

    Logger.info(`Attached the custom domain "${hostname}" to the Worker.`);
  }

  return;
}

/**
 * CLI - Commands - Deploy - Worker.
 *
 * Spawns the Wrangler deploy process with the generated
 * configuration file and aborts on non-zero exit codes.
 *
 * @param {Cli_Commands_Deploy_DeployWorker_WranglerTomlPath} wranglerTomlPath - Wrangler toml path.
 *
 * @returns {Cli_Commands_Deploy_DeployWorker_Returns}
 *
 * @since 0.0.1
 */
function deployWorker(wranglerTomlPath: Cli_Commands_Deploy_DeployWorker_WranglerTomlPath): Cli_Commands_Deploy_DeployWorker_Returns {
  const wranglerCliPath: Cli_Commands_Deploy_DeployWorker_WranglerCliPath = getWranglerCliPath();
  const deployResult: Cli_Commands_Deploy_DeployWorker_DeployResult = spawnSync(process.execPath, [
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
 * CLI - Commands - Deploy - Load Env Token.
 *
 * Reads the local env file and extracts the Cloudflare API
 * token value, stripping surrounding quotes if present.
 *
 * @returns {Cli_Commands_Deploy_LoadEnvToken_Returns}
 *
 * @since 0.0.1
 */
function loadEnvToken(): Cli_Commands_Deploy_LoadEnvToken_Returns {
  const envValue: Cli_Commands_Deploy_LoadEnvToken_EnvValue = process.env[ENV_TOKEN_KEY];

  if (envValue !== undefined && envValue !== '') {
    return envValue;
  }

  if (existsSync(envFilePath) === false) {
    return undefined;
  }

  const content: Cli_Commands_Deploy_LoadEnvToken_Content = readFileSync(envFilePath, 'utf-8');
  const match: Cli_Commands_Deploy_LoadEnvToken_Match = content.match(new RegExp(`^${ENV_TOKEN_KEY}=(.+)$`, 'm'));

  if (match === null || match[1] === undefined) {
    return undefined;
  }

  const value: Cli_Commands_Deploy_LoadEnvToken_Value = match[1].trim().replace(new RegExp(LIB_REGEX_SURROUNDING_QUOTES.source, 'g'), '');

  return (value !== '') ? value : undefined;
}

/**
 * CLI - Commands - Deploy - Save Env Token.
 *
 * Writes or updates the Cloudflare API token in the local
 * env file so subsequent deploys can reuse it automatically.
 *
 * @param {Cli_Commands_Deploy_SaveEnvToken_Token} token - Token.
 *
 * @returns {Cli_Commands_Deploy_SaveEnvToken_Returns}
 *
 * @since 0.0.1
 */
function saveEnvToken(token: Cli_Commands_Deploy_SaveEnvToken_Token): Cli_Commands_Deploy_SaveEnvToken_Returns {
  if (existsSync(envFilePath) === true) {
    let content: Cli_Commands_Deploy_SaveEnvToken_Content = readFileSync(envFilePath, 'utf-8');

    const regex: Cli_Commands_Deploy_SaveEnvToken_Regex = new RegExp(`^${ENV_TOKEN_KEY}=.*$`, 'm');

    if (regex.test(content) === true) {
      content = content.replace(regex, `${ENV_TOKEN_KEY}=${token}`);
    } else {
      content = [
        content.trimEnd(),
        `${ENV_TOKEN_KEY}=${token}`,
        '',
      ].join('\n');
    }

    writeFileSync(envFilePath, content, { mode: parseInt('600', 8) });
  } else {
    writeFileSync(envFilePath, `${ENV_TOKEN_KEY}=${token}\n`, { mode: parseInt('600', 8) });
  }

  return;
}

/**
 * CLI - Commands - Deploy - Print Alias Summary.
 *
 * Logs every configured alias with its full address, destination,
 * and status so the user has a reference after deploying.
 *
 * @param {Cli_Commands_Deploy_PrintAliasSummary_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Commands_Deploy_PrintAliasSummary_Returns}
 *
 * @since 0.0.1
 */
function printAliasSummary(configPath: Cli_Commands_Deploy_PrintAliasSummary_ConfigPath): Cli_Commands_Deploy_PrintAliasSummary_Returns {
  const aliases: Cli_Commands_Deploy_PrintAliasSummary_Aliases = listAliases(configPath);
  const settings: Cli_Commands_Deploy_PrintAliasSummary_Settings = getSettings(configPath);
  const now: Cli_Commands_Deploy_PrintAliasSummary_Now = Date.now();

  if (aliases.length === 0) {
    return;
  }

  process.stdout.write('\n');
  process.stdout.write(`${chalk.bold('Alias reference:')}\n`);
  process.stdout.write('\n');

  for (const alias of aliases) {
    const statusDescription: Cli_Commands_Deploy_PrintAliasSummary_StatusDescription = describeAliasStatus(alias, now);
    const status: Cli_Commands_Deploy_PrintAliasSummary_Status = (statusDescription === 'enabled') ? chalk.green(statusDescription) : chalk.yellow(statusDescription);

    process.stdout.write(`  ${chalk.cyan(`${alias['address']}@${settings['base_domain']}`)} -> ${alias['destination']} (${status})\n`);
  }

  process.stdout.write('\n');

  return;
}

export {
  applyRoutingRules,
  attachCustomDomains,
  deploy,
  enableSubaddressing,
  ensureEmailRoutingEnabled,
  findMissingPermissions,
  planCustomDomains,
  planRoutingRules,
  releaseCatchAll,
};
