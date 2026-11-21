import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Bootstrap, Logger } from '@cbnventures/nova/toolkit';
import chalk from 'chalk';
import prompts from 'prompts';

import { Runner as CloudflareAdapter } from '../../lib/cloudflare.js';
import { APP_NAME } from '../../lib/item.js';
import { Runner as PublicDnsAdapter } from '../../lib/public-dns.js';
import { LIB_REGEX_SURROUNDING_QUOTES } from '../../lib/regex.js';
import { describeAliasStatus, listAliases } from './alias.js';
import { listDestinations } from './destination.js';
import { generateWranglerToml, getWranglerTomlPath } from './generate.js';
import { listNotifiers } from './notifier.js';
import { describePhoneAliasStatus, listPhoneAliases } from './phone-alias.js';
import { connectPhoneProviders, listPhoneProviders } from './phone-provider.js';
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
  Cli_Commands_Deploy_BuildDeployWarnings_EmailSendingReady,
  Cli_Commands_Deploy_BuildDeployWarnings_HasPhoneAliases,
  Cli_Commands_Deploy_BuildDeployWarnings_HasPlivo,
  Cli_Commands_Deploy_BuildDeployWarnings_PendingRecords,
  Cli_Commands_Deploy_BuildDeployWarnings_Returns,
  Cli_Commands_Deploy_BuildDeployWarnings_SendingWarnings,
  Cli_Commands_Deploy_BuildDeployWarnings_Settings,
  Cli_Commands_Deploy_BuildDeployWarnings_WorkersPlan,
  Cli_Commands_Deploy_BuildRoutingRuleName_Address,
  Cli_Commands_Deploy_BuildRoutingRuleName_Returns,
  Cli_Commands_Deploy_BuildRoutingRuleName_WorkerName,
  Cli_Commands_Deploy_CheckEmailSendingRecords_BaseDomain,
  Cli_Commands_Deploy_CheckEmailSendingRecords_PendingRecords,
  Cli_Commands_Deploy_CheckEmailSendingRecords_Records,
  Cli_Commands_Deploy_CheckEmailSendingRecords_Returns,
  Cli_Commands_Deploy_Deploy_AccountId,
  Cli_Commands_Deploy_Deploy_ConfigPath,
  Cli_Commands_Deploy_Deploy_ConnectedProviders,
  Cli_Commands_Deploy_Deploy_EmailSendingReady,
  Cli_Commands_Deploy_Deploy_Interactive,
  Cli_Commands_Deploy_Deploy_MissingHostnames,
  Cli_Commands_Deploy_Deploy_PendingRecords,
  Cli_Commands_Deploy_Deploy_Result,
  Cli_Commands_Deploy_Deploy_Returns,
  Cli_Commands_Deploy_Deploy_Routing,
  Cli_Commands_Deploy_Deploy_RoutingPlan,
  Cli_Commands_Deploy_Deploy_SendingRecords,
  Cli_Commands_Deploy_Deploy_Settings,
  Cli_Commands_Deploy_Deploy_Token,
  Cli_Commands_Deploy_Deploy_WorkersPlan,
  Cli_Commands_Deploy_Deploy_WranglerTomlPath,
  Cli_Commands_Deploy_Deploy_ZoneInfo,
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
  Cli_Commands_Deploy_EnsureDestinationAddresses_Pending,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Returns,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Token,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_BaseDomain,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName,
  Cli_Commands_Deploy_GetZoneInfo_BaseDomain,
  Cli_Commands_Deploy_GetZoneInfo_Candidates,
  Cli_Commands_Deploy_GetZoneInfo_Parts,
  Cli_Commands_Deploy_GetZoneInfo_Returns,
  Cli_Commands_Deploy_GetZoneInfo_Token,
  Cli_Commands_Deploy_GetZoneInfo_Zone,
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
  Cli_Commands_Deploy_PlanCustomDomains_Returns,
  Cli_Commands_Deploy_PlanCustomDomains_Token,
  Cli_Commands_Deploy_PlanCustomDomains_WorkerName,
  Cli_Commands_Deploy_PlanCustomDomains_ZoneId,
  Cli_Commands_Deploy_PlanRoutingRules_Aliases,
  Cli_Commands_Deploy_PlanRoutingRules_BaseDomain,
  Cli_Commands_Deploy_PlanRoutingRules_DomainRuleCount,
  Cli_Commands_Deploy_PlanRoutingRules_DomainSuffix,
  Cli_Commands_Deploy_PlanRoutingRules_OtherRules,
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
  Cli_Commands_Deploy_PrintAliasSummary_PhoneAliases,
  Cli_Commands_Deploy_PrintAliasSummary_PhoneStatus,
  Cli_Commands_Deploy_PrintAliasSummary_Returns,
  Cli_Commands_Deploy_PrintAliasSummary_Settings,
  Cli_Commands_Deploy_PrintAliasSummary_Status,
  Cli_Commands_Deploy_PrintAliasSummary_StatusDescription,
  Cli_Commands_Deploy_PrintDeployWarnings_ConfigPath,
  Cli_Commands_Deploy_PrintDeployWarnings_EmailSendingReady,
  Cli_Commands_Deploy_PrintDeployWarnings_PendingRecords,
  Cli_Commands_Deploy_PrintDeployWarnings_Returns,
  Cli_Commands_Deploy_PrintDeployWarnings_Warnings,
  Cli_Commands_Deploy_PrintDeployWarnings_WorkersPlan,
  Cli_Commands_Deploy_PromptForApiToken_PromptResult,
  Cli_Commands_Deploy_PromptForApiToken_Returns,
  Cli_Commands_Deploy_PromptForApiToken_Token,
  Cli_Commands_Deploy_ReleaseCatchAll_CatchAll,
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
  Cli_Commands_Deploy_SetUpEmailSending_BaseDomain,
  Cli_Commands_Deploy_SetUpEmailSending_ErrorMessage,
  Cli_Commands_Deploy_SetUpEmailSending_Returns,
  Cli_Commands_Deploy_SetUpEmailSending_Setup,
  Cli_Commands_Deploy_SetUpEmailSending_Token,
  Cli_Commands_Deploy_SetUpEmailSending_ZoneId,
  Cli_Commands_Deploy_SetUpEmailSending_ZoneName,
  Cli_Commands_Deploy_VerifyPermissions_AccountId,
  Cli_Commands_Deploy_VerifyPermissions_EmailSending,
  Cli_Commands_Deploy_VerifyPermissions_Interactive,
  Cli_Commands_Deploy_VerifyPermissions_Missing,
  Cli_Commands_Deploy_VerifyPermissions_MissingMessage,
  Cli_Commands_Deploy_VerifyPermissions_PromptResult,
  Cli_Commands_Deploy_VerifyPermissions_Returns,
  Cli_Commands_Deploy_VerifyPermissions_Token,
  Cli_Commands_Deploy_VerifyPermissions_ZoneId,
} from '../../types/cli/commands/deploy.d.ts';

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
 * destinations, Worker deployment, custom domains, one Email Routing rule per
 * enabled alias, and the webhooks that send phone alias texts to the Worker.
 *
 * @param {Cli_Commands_Deploy_Deploy_ConfigPath}  configPath    - Config path.
 * @param {Cli_Commands_Deploy_Deploy_Interactive} [interactive] - Interactive.
 *
 * @returns {Cli_Commands_Deploy_Deploy_Returns}
 *
 * @since 1.2.0
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
  const accountId: Cli_Commands_Deploy_Deploy_AccountId = await verifyPermissions(token, zoneInfo['zoneId'], zoneInfo['accountId'], interactive, settings['send_from_aliases'] === true);

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

  CloudflareAdapter.deployWorker(wranglerTomlPath);

  Logger.info('Worker deployed.');

  // Step 9: Attach the base domain and its www host to the Worker.
  await attachCustomDomains(token, accountId, zoneInfo['zoneId'], settings['worker_name'], missingHostnames);

  // Step 10: Let Email Routing match "alias+tag@" to the alias rule, which reply addresses need too.
  if (settings['subaddressing'] === true || settings['send_from_aliases'] === true) {
    await enableSubaddressing(token, zoneInfo['zoneId'], routing);
  }

  // Step 11: Send each enabled alias to the Worker, then hand back a catch-all from 1.0.0.
  await applyRoutingRules(token, zoneInfo['zoneId'], settings['worker_name'], settings['base_domain'], routingPlan);

  await releaseCatchAll(token, zoneInfo['zoneId'], settings['worker_name']);

  // Step 12: Onboard the base domain to Email Sending so replies can leave from the aliases, then confirm its records resolve and read the Workers plan.
  let emailSendingReady: Cli_Commands_Deploy_Deploy_EmailSendingReady = false;
  let pendingRecords: Cli_Commands_Deploy_Deploy_PendingRecords = [];
  let workersPlan: Cli_Commands_Deploy_Deploy_WorkersPlan = 'paid';

  if (settings['send_from_aliases'] === true) {
    const sendingRecords: Cli_Commands_Deploy_Deploy_SendingRecords = await setUpEmailSending(token, zoneInfo['zoneId'], zoneInfo['zoneName'], settings['base_domain']);

    if (sendingRecords !== undefined) {
      emailSendingReady = true;
      pendingRecords = await checkEmailSendingRecords(settings['base_domain'], sendingRecords);
    }

    workersPlan = await CloudflareAdapter.getWorkersPlan(token, accountId);
  }

  // Step 13: Point every phone alias number at the Worker's webhook routes on the base domain.
  if (listPhoneAliases(configPath).length > 0) {
    Logger.info('Connecting phone numbers...');

    const connectedProviders: Cli_Commands_Deploy_Deploy_ConnectedProviders = await connectPhoneProviders(configPath, `https://${settings['base_domain']}`);

    Logger.info(`Phone numbers on ${connectedProviders.join(', ')} now send texts to the Worker.`);
  }

  // Step 14: Print alias summary and the caveats that apply to this config.
  printAliasSummary(configPath);

  printDeployWarnings(configPath, emailSendingReady, workersPlan, pendingRecords);

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
    if (await CloudflareAdapter.verifyToken(envToken) === true) {
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
 * CLI - Commands - Deploy - Verify Permissions.
 *
 * Asks the Cloudflare adapter which permission groups the token lacks, including
 * Email Sending, DNS, and Billing when sending from aliases is on, and waits for a fix.
 *
 * @param {Cli_Commands_Deploy_VerifyPermissions_Token}        token        - Token.
 * @param {Cli_Commands_Deploy_VerifyPermissions_ZoneId}       zoneId       - Zone id.
 * @param {Cli_Commands_Deploy_VerifyPermissions_AccountId}    accountId    - Account id.
 * @param {Cli_Commands_Deploy_VerifyPermissions_Interactive}  interactive  - Interactive.
 * @param {Cli_Commands_Deploy_VerifyPermissions_EmailSending} emailSending - Email sending.
 *
 * @returns {Cli_Commands_Deploy_VerifyPermissions_Returns}
 *
 * @since 1.2.0
 */
async function verifyPermissions(token: Cli_Commands_Deploy_VerifyPermissions_Token, zoneId: Cli_Commands_Deploy_VerifyPermissions_ZoneId, accountId: Cli_Commands_Deploy_VerifyPermissions_AccountId, interactive: Cli_Commands_Deploy_VerifyPermissions_Interactive, emailSending: Cli_Commands_Deploy_VerifyPermissions_EmailSending): Cli_Commands_Deploy_VerifyPermissions_Returns {
  const missing: Cli_Commands_Deploy_VerifyPermissions_Missing = await CloudflareAdapter.findMissingPermissions(token, zoneId, accountId, emailSending);

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

  return verifyPermissions(token, zoneId, accountId, interactive, emailSending);
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
  Logger.info('     - Billing: Read (only when sending from aliases is on)');
  Logger.info('  5. Under "Zone policy", select the zone that holds your base domain, then search for each permission group and tick:');
  Logger.info('     - Zone Settings: Edit');
  Logger.info('     - Email Routing Rules: Edit');
  Logger.info('     - Workers Routes: Edit');
  Logger.info('     - Email Sending: Edit and DNS: Edit (only when sending from aliases is on)');
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

  if (await CloudflareAdapter.verifyToken(token) === false) {
    throw new Error('API token is invalid. Please check the token and try again.');
  }

  saveEnvToken(token);

  Logger.info('API token saved to .env file.');

  return token;
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
 * @since 1.2.0
 */
async function getZoneInfo(token: Cli_Commands_Deploy_GetZoneInfo_Token, baseDomain: Cli_Commands_Deploy_GetZoneInfo_BaseDomain): Cli_Commands_Deploy_GetZoneInfo_Returns {
  // e.g., "mail.example.co.uk" -> try "mail.example.co.uk", then "example.co.uk", then "co.uk".
  const parts: Cli_Commands_Deploy_GetZoneInfo_Parts = baseDomain.split('.');
  const candidates: Cli_Commands_Deploy_GetZoneInfo_Candidates = parts.slice(0, parts.length - 1).map((_unused, i) => parts.slice(i).join('.'));

  for (const candidate of candidates) {
    let zone: Cli_Commands_Deploy_GetZoneInfo_Zone = undefined;

    try {
      zone = await CloudflareAdapter.findZone(token, candidate);
    } catch {
      continue;
    }

    if (zone !== undefined) {
      return zone;
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
 * @since 1.2.0
 */
async function ensureEmailRoutingEnabled(token: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token, zoneId: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId, zoneName: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName, baseDomain: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_BaseDomain): Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns {
  const routing: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing = await CloudflareAdapter.getEmailRouting(token, zoneId);

  if (baseDomain === zoneName) {
    if (routing['enabled'] === false) {
      throw new Error(`Email Routing is not enabled for "${zoneName}". In the Cloudflare dashboard, open Email Routing for the domain, go to Settings > DNS records, and select "Add missing records" so the MX and SPF records are added, then deploy again.`);
    }

    return routing;
  }

  if (await CloudflareAdapter.hasEmailRoutingMx(baseDomain) === false) {
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
 * @since 1.2.0
 */
async function enableSubaddressing(token: Cli_Commands_Deploy_EnableSubaddressing_Token, zoneId: Cli_Commands_Deploy_EnableSubaddressing_ZoneId, routing: Cli_Commands_Deploy_EnableSubaddressing_Routing): Cli_Commands_Deploy_EnableSubaddressing_Returns {
  if (routing['subaddressing'] === true) {
    return;
  }

  await CloudflareAdapter.enableSubaddressing(token, zoneId);

  Logger.info('Turned on Email Routing subaddressing so "alias+tag@" reaches the alias.');

  return;
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
 * @since 1.2.0
 */
async function planRoutingRules(token: Cli_Commands_Deploy_PlanRoutingRules_Token, zoneId: Cli_Commands_Deploy_PlanRoutingRules_ZoneId, workerName: Cli_Commands_Deploy_PlanRoutingRules_WorkerName, baseDomain: Cli_Commands_Deploy_PlanRoutingRules_BaseDomain, aliases: Cli_Commands_Deploy_PlanRoutingRules_Aliases): Cli_Commands_Deploy_PlanRoutingRules_Returns {
  const rules: Cli_Commands_Deploy_PlanRoutingRules_Rules = await CloudflareAdapter.listRoutingRules(token, zoneId);
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

    const ownedRule: Cli_Commands_Deploy_PlanRoutingRules_OwnedRule = ownedRules.find((rule) => rule['address'] === wantedAddress);

    if (ownedRule !== undefined) {
      if (
        ownedRule['enabled'] !== true
        || ownedRule['name'] !== buildRoutingRuleName(workerName, wantedAddress)
        || ownedRule['workerName'] !== workerName
      ) {
        plan['update'].push({
          id: ownedRule['id'],
          address: wantedAddress,
        });
      }

      continue;
    }

    // A rule someone else made for the same address wins, so leave it and say so.
    if (otherRules.some((rule) => rule['address'] === wantedAddress) === true) {
      plan['skipped'].push(wantedAddress);

      continue;
    }

    plan['create'].push(wantedAddress);
  }

  for (const ownedRule of ownedRules) {
    const ownedAddress: Cli_Commands_Deploy_PlanRoutingRules_OwnedAddress = ownedRule['address'];

    if (ownedAddress === undefined || wantedAddresses.includes(ownedAddress) === false) {
      plan['remove'].push({
        id: ownedRule['id'],
        address: (ownedAddress !== undefined) ? ownedAddress : ownedRule['id'],
      });
    }
  }

  const domainRuleCount: Cli_Commands_Deploy_PlanRoutingRules_DomainRuleCount = rules.filter((rule) => (rule['address'] ?? '').endsWith(domainSuffix) === true).length;
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
 * @since 1.2.0
 */
async function applyRoutingRules(token: Cli_Commands_Deploy_ApplyRoutingRules_Token, zoneId: Cli_Commands_Deploy_ApplyRoutingRules_ZoneId, workerName: Cli_Commands_Deploy_ApplyRoutingRules_WorkerName, baseDomain: Cli_Commands_Deploy_ApplyRoutingRules_BaseDomain, plan: Cli_Commands_Deploy_ApplyRoutingRules_Plan): Cli_Commands_Deploy_ApplyRoutingRules_Returns {
  for (const address of plan['create']) {
    await CloudflareAdapter.createRoutingRule(token, zoneId, buildRoutingRuleName(workerName, address), address, workerName);

    Logger.info(`Added a routing rule that sends "${address}" to the Worker.`);
  }

  for (const rule of plan['update']) {
    await CloudflareAdapter.updateRoutingRule(token, zoneId, rule['id'], buildRoutingRuleName(workerName, rule['address']), rule['address'], workerName);

    Logger.info(`Updated the routing rule for "${rule['address']}" so it sends mail to the Worker.`);
  }

  for (const rule of plan['remove']) {
    await CloudflareAdapter.deleteRoutingRule(token, zoneId, rule['id']);

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
 * CLI - Commands - Deploy - Build Routing Rule Name.
 *
 * Builds the name of the rule for one alias address. It carries the Worker name
 * so two Mailmask Workers on one zone keep their own rules apart.
 *
 * @param {Cli_Commands_Deploy_BuildRoutingRuleName_WorkerName} workerName - Worker name.
 * @param {Cli_Commands_Deploy_BuildRoutingRuleName_Address}    address    - Address.
 *
 * @returns {Cli_Commands_Deploy_BuildRoutingRuleName_Returns}
 *
 * @since 1.2.0
 */
function buildRoutingRuleName(workerName: Cli_Commands_Deploy_BuildRoutingRuleName_WorkerName, address: Cli_Commands_Deploy_BuildRoutingRuleName_Address): Cli_Commands_Deploy_BuildRoutingRuleName_Returns {
  return `${ROUTING_RULE_NAME_PREFIX}${workerName}:${address}`;
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
 * @since 1.2.0
 */
async function releaseCatchAll(token: Cli_Commands_Deploy_ReleaseCatchAll_Token, zoneId: Cli_Commands_Deploy_ReleaseCatchAll_ZoneId, workerName: Cli_Commands_Deploy_ReleaseCatchAll_WorkerName): Cli_Commands_Deploy_ReleaseCatchAll_Returns {
  const catchAll: Cli_Commands_Deploy_ReleaseCatchAll_CatchAll = await CloudflareAdapter.getCatchAll(token, zoneId);

  if (catchAll['workerNames'].includes(workerName) === false) {
    return;
  }

  // Mailmask 1.0.0 never stored the action it replaced, so there is nothing to restore.
  await CloudflareAdapter.disableCatchAll(token, zoneId, catchAll['name'] ?? `${workerName}: catch-all`);

  Logger.info('Turned off the Email Routing catch-all that pointed at the Worker. Each alias now has its own rule, and Cloudflare rejects mail to other addresses.');

  return;
}

/**
 * CLI - Commands - Deploy - Set Up Email Sending.
 *
 * Onboards the base domain to Cloudflare Email Sending and adds its DNS records,
 * returning the records it expects. A refusal only warns and returns undefined.
 *
 * @param {Cli_Commands_Deploy_SetUpEmailSending_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_SetUpEmailSending_ZoneId}     zoneId     - Zone id.
 * @param {Cli_Commands_Deploy_SetUpEmailSending_ZoneName}   zoneName   - Zone name.
 * @param {Cli_Commands_Deploy_SetUpEmailSending_BaseDomain} baseDomain - Base domain.
 *
 * @returns {Cli_Commands_Deploy_SetUpEmailSending_Returns}
 *
 * @since 1.2.0
 */
async function setUpEmailSending(token: Cli_Commands_Deploy_SetUpEmailSending_Token, zoneId: Cli_Commands_Deploy_SetUpEmailSending_ZoneId, zoneName: Cli_Commands_Deploy_SetUpEmailSending_ZoneName, baseDomain: Cli_Commands_Deploy_SetUpEmailSending_BaseDomain): Cli_Commands_Deploy_SetUpEmailSending_Returns {
  Logger.info('Checking Email Sending...');

  try {
    const setup: Cli_Commands_Deploy_SetUpEmailSending_Setup = await CloudflareAdapter.ensureEmailSendingDomain(token, zoneId, zoneName, baseDomain);

    if (setup['created'] === true) {
      Logger.info(`Onboarded "${baseDomain}" to Cloudflare Email Sending.`);
    }

    for (const addedRecord of setup['addedRecords']) {
      Logger.info(`Added the Email Sending DNS record ${addedRecord}.`);
    }

    if (setup['created'] === false && setup['addedRecords'].length === 0) {
      Logger.info(`Email Sending is already set up for "${baseDomain}".`);
    }

    return setup['records'];
  } catch (error) {
    const errorMessage: Cli_Commands_Deploy_SetUpEmailSending_ErrorMessage = (error instanceof Error) ? error['message'] : String(error);

    Logger.warn(`Could not set up Cloudflare Email Sending for "${baseDomain}", so replies to outside addresses will bounce. Mail still forwards. (${errorMessage})`);

    return undefined;
  }
}

/**
 * CLI - Commands - Deploy - Check Email Sending Records.
 *
 * Waits a short, bounded time for the Email Sending records to resolve on public
 * DNS, because Cloudflare's API has no verified state, and returns those still pending.
 *
 * @param {Cli_Commands_Deploy_CheckEmailSendingRecords_BaseDomain} baseDomain - Base domain.
 * @param {Cli_Commands_Deploy_CheckEmailSendingRecords_Records}    records    - Records.
 *
 * @returns {Cli_Commands_Deploy_CheckEmailSendingRecords_Returns}
 *
 * @since 1.2.0
 */
async function checkEmailSendingRecords(baseDomain: Cli_Commands_Deploy_CheckEmailSendingRecords_BaseDomain, records: Cli_Commands_Deploy_CheckEmailSendingRecords_Records): Cli_Commands_Deploy_CheckEmailSendingRecords_Returns {
  Logger.info('Checking that the Email Sending DNS records resolve publicly...');

  const pendingRecords: Cli_Commands_Deploy_CheckEmailSendingRecords_PendingRecords = await PublicDnsAdapter.findPendingRecords(records);

  if (pendingRecords.length === 0) {
    Logger.info(`Email Sending DNS records for "${baseDomain}" resolve publicly.`);
  }

  return pendingRecords;
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
 * @since 1.2.0
 */
async function ensureDestinationAddresses(configPath: Cli_Commands_Deploy_EnsureDestinationAddresses_ConfigPath, token: Cli_Commands_Deploy_EnsureDestinationAddresses_Token, accountId: Cli_Commands_Deploy_EnsureDestinationAddresses_AccountId): Cli_Commands_Deploy_EnsureDestinationAddresses_Returns {
  const destinations: Cli_Commands_Deploy_EnsureDestinationAddresses_Destinations = listDestinations(configPath);
  const destinationEmails: Cli_Commands_Deploy_EnsureDestinationAddresses_DestinationEmails = destinations.map((destination) => destination['email']);
  const emailNotifierEmails: Cli_Commands_Deploy_EnsureDestinationAddresses_EmailNotifierEmails = listNotifiers(configPath).filter((notifier) => notifier['type'] === 'email').map((notifier) => notifier['to']);
  const emails: Cli_Commands_Deploy_EnsureDestinationAddresses_Emails = [...new Set([
    ...destinationEmails,
    ...emailNotifierEmails,
  ])];
  const existingAddresses: Cli_Commands_Deploy_EnsureDestinationAddresses_ExistingAddresses = await CloudflareAdapter.listDestinationAddresses(token, accountId);
  const pending: Cli_Commands_Deploy_EnsureDestinationAddresses_Pending = [];

  for (const email of emails) {
    const normalizedEmail: Cli_Commands_Deploy_EnsureDestinationAddresses_NormalizedEmail = email.toLowerCase();
    const existing: Cli_Commands_Deploy_EnsureDestinationAddresses_Existing = existingAddresses.find((existingAddress) => existingAddress['email'].toLowerCase() === normalizedEmail);

    if (existing === undefined) {
      await CloudflareAdapter.createDestinationAddress(token, accountId, email);

      Logger.info(`Registered destination "${email}". Cloudflare sent a verification email to it.`);

      pending.push(email);

      continue;
    }

    if (existing['verified'] === false) {
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
 * @since 1.2.0
 */
async function planCustomDomains(token: Cli_Commands_Deploy_PlanCustomDomains_Token, accountId: Cli_Commands_Deploy_PlanCustomDomains_AccountId, zoneId: Cli_Commands_Deploy_PlanCustomDomains_ZoneId, workerName: Cli_Commands_Deploy_PlanCustomDomains_WorkerName, baseDomain: Cli_Commands_Deploy_PlanCustomDomains_BaseDomain): Cli_Commands_Deploy_PlanCustomDomains_Returns {
  const normalizedBaseDomain: Cli_Commands_Deploy_PlanCustomDomains_NormalizedBaseDomain = baseDomain.toLowerCase();
  const hostnames: Cli_Commands_Deploy_PlanCustomDomains_Hostnames = [
    normalizedBaseDomain,
    `www.${normalizedBaseDomain}`,
  ];
  const domains: Cli_Commands_Deploy_PlanCustomDomains_Domains = await CloudflareAdapter.listWorkerDomains(token, accountId, zoneId);
  const missingHostnames: Cli_Commands_Deploy_PlanCustomDomains_MissingHostnames = [];
  const conflicts: Cli_Commands_Deploy_PlanCustomDomains_Conflicts = [];

  for (const hostname of hostnames) {
    const existing: Cli_Commands_Deploy_PlanCustomDomains_Existing = domains.find((domain) => domain['hostname'].toLowerCase() === hostname);

    if (existing === undefined) {
      missingHostnames.push(hostname);

      continue;
    }

    if (existing['workerName'] !== workerName) {
      conflicts.push(`  - "${hostname}" is attached to the Worker "${existing['workerName']}"`);
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
 * @since 1.2.0
 */
async function attachCustomDomains(token: Cli_Commands_Deploy_AttachCustomDomains_Token, accountId: Cli_Commands_Deploy_AttachCustomDomains_AccountId, zoneId: Cli_Commands_Deploy_AttachCustomDomains_ZoneId, workerName: Cli_Commands_Deploy_AttachCustomDomains_WorkerName, hostnames: Cli_Commands_Deploy_AttachCustomDomains_Hostnames): Cli_Commands_Deploy_AttachCustomDomains_Returns {
  for (const hostname of hostnames) {
    try {
      await CloudflareAdapter.attachWorkerDomain(token, accountId, zoneId, hostname, workerName);
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
 * Logs every configured email and phone alias with its destination and
 * status so the user has a reference after deploying.
 *
 * @param {Cli_Commands_Deploy_PrintAliasSummary_ConfigPath} configPath - Config path.
 *
 * @returns {Cli_Commands_Deploy_PrintAliasSummary_Returns}
 *
 * @since 1.2.0
 */
function printAliasSummary(configPath: Cli_Commands_Deploy_PrintAliasSummary_ConfigPath): Cli_Commands_Deploy_PrintAliasSummary_Returns {
  const aliases: Cli_Commands_Deploy_PrintAliasSummary_Aliases = listAliases(configPath);
  const phoneAliases: Cli_Commands_Deploy_PrintAliasSummary_PhoneAliases = listPhoneAliases(configPath);
  const settings: Cli_Commands_Deploy_PrintAliasSummary_Settings = getSettings(configPath);
  const now: Cli_Commands_Deploy_PrintAliasSummary_Now = Date.now();

  if (aliases.length === 0 && phoneAliases.length === 0) {
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

  for (const phoneAlias of phoneAliases) {
    const phoneStatus: Cli_Commands_Deploy_PrintAliasSummary_PhoneStatus = describePhoneAliasStatus(phoneAlias, now);

    process.stdout.write(`  ${chalk.cyan(phoneAlias['number'])} -> ${phoneAlias['destination']} (${chalk.yellow(phoneStatus)})\n`);
  }

  process.stdout.write('\n');

  return;
}

/**
 * CLI - Commands - Deploy - Print Deploy Warnings.
 *
 * Prints the caveats that apply to the deployed config, so limits of sending
 * from aliases and of phone aliases show up in the terminal, not only the docs.
 *
 * @param {Cli_Commands_Deploy_PrintDeployWarnings_ConfigPath}        configPath        - Config path.
 * @param {Cli_Commands_Deploy_PrintDeployWarnings_EmailSendingReady} emailSendingReady - Email sending ready.
 * @param {Cli_Commands_Deploy_PrintDeployWarnings_WorkersPlan}       workersPlan       - Workers plan.
 * @param {Cli_Commands_Deploy_PrintDeployWarnings_PendingRecords}    pendingRecords    - Pending records.
 *
 * @returns {Cli_Commands_Deploy_PrintDeployWarnings_Returns}
 *
 * @since 1.2.0
 */
function printDeployWarnings(configPath: Cli_Commands_Deploy_PrintDeployWarnings_ConfigPath, emailSendingReady: Cli_Commands_Deploy_PrintDeployWarnings_EmailSendingReady, workersPlan: Cli_Commands_Deploy_PrintDeployWarnings_WorkersPlan, pendingRecords: Cli_Commands_Deploy_PrintDeployWarnings_PendingRecords): Cli_Commands_Deploy_PrintDeployWarnings_Returns {
  const warnings: Cli_Commands_Deploy_PrintDeployWarnings_Warnings = buildDeployWarnings(getSettings(configPath), emailSendingReady, listPhoneAliases(configPath).length > 0, listPhoneProviders(configPath).some((phoneProvider) => phoneProvider['type'] === 'plivo'), workersPlan, pendingRecords);

  for (const warning of warnings) {
    Logger.warn(warning);
  }

  return;
}

/**
 * CLI - Commands - Deploy - Build Deploy Warnings.
 *
 * Builds the short, factual caveats for a config: sending from aliases, its Email
 * Sending setup and records, the Workers plan, phone alias texts, and Plivo countries.
 *
 * @param {Cli_Commands_Deploy_BuildDeployWarnings_Settings}          settings          - Settings.
 * @param {Cli_Commands_Deploy_BuildDeployWarnings_EmailSendingReady} emailSendingReady - Email sending ready.
 * @param {Cli_Commands_Deploy_BuildDeployWarnings_HasPhoneAliases}   hasPhoneAliases   - Has phone aliases.
 * @param {Cli_Commands_Deploy_BuildDeployWarnings_HasPlivo}          hasPlivo          - Has plivo.
 * @param {Cli_Commands_Deploy_BuildDeployWarnings_WorkersPlan}       workersPlan       - Workers plan.
 * @param {Cli_Commands_Deploy_BuildDeployWarnings_PendingRecords}    pendingRecords    - Pending records.
 *
 * @returns {Cli_Commands_Deploy_BuildDeployWarnings_Returns}
 *
 * @since 1.2.0
 */
function buildDeployWarnings(settings: Cli_Commands_Deploy_BuildDeployWarnings_Settings, emailSendingReady: Cli_Commands_Deploy_BuildDeployWarnings_EmailSendingReady, hasPhoneAliases: Cli_Commands_Deploy_BuildDeployWarnings_HasPhoneAliases, hasPlivo: Cli_Commands_Deploy_BuildDeployWarnings_HasPlivo, workersPlan: Cli_Commands_Deploy_BuildDeployWarnings_WorkersPlan, pendingRecords: Cli_Commands_Deploy_BuildDeployWarnings_PendingRecords): Cli_Commands_Deploy_BuildDeployWarnings_Returns {
  const sendingWarnings: Cli_Commands_Deploy_BuildDeployWarnings_SendingWarnings = [];

  if (emailSendingReady === false) {
    sendingWarnings.push(`Email Sending is not set up for "${settings['base_domain']}" (see the warning above), so replies to outside addresses bounce. Fix that and deploy again.`);
  } else if (pendingRecords.length > 0) {
    sendingWarnings.push(`Email Sending is set up for "${settings['base_domain']}", but these DNS records don't resolve publicly yet: ${pendingRecords.join(', ')}. Replies can bounce until they do; deploy again later to check.`);
  }

  if (workersPlan === 'free') {
    sendingWarnings.push('This account is on Workers Free, so replies to outside addresses bounce. Upgrade to Workers Paid to send them.');
  }

  if (workersPlan === 'unknown') {
    sendingWarnings.push('Could not read this account\'s Workers plan from Cloudflare. If replies bounce, upgrade to Workers Paid.');
  }

  return [
    ...((settings['send_from_aliases'] === true) ? [
      'Sending from aliases is on. Use Reply, not Reply All: Reply All mails the other recipients straight from your real address.',
      ...sendingWarnings,
    ] : []),
    ...((hasPhoneAliases === true) ? ['A text from a destination phone is sent on from its phone alias based on the caller number the provider reports, and carrier caller ID can be spoofed.'] : []),
    ...((hasPlivo === true) ? ['Plivo sets the countries a number can text in its console (Messaging > Settings > Geo Permissions). Mailmask cannot change that list.'] : []),
  ];
}

export {
  applyRoutingRules,
  attachCustomDomains,
  buildDeployWarnings,
  deploy,
  enableSubaddressing,
  ensureEmailRoutingEnabled,
  planCustomDomains,
  planRoutingRules,
  releaseCatchAll,
};
