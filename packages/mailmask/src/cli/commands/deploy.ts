import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Bootstrap, Logger } from '@cbnventures/nova/toolkit';
import chalk from 'chalk';
import prompts from 'prompts';

import { APP_NAME } from '../../lib/item.js';
import { LIB_REGEX_SURROUNDING_QUOTES } from '../../lib/regex.js';
import {
  cloudflareCatchAllSchema,
  cloudflareDestinationAddressesSchema,
  cloudflareEmailRoutingSettingsSchema,
  cloudflareEnvelopeSchema,
  cloudflareZonesSchema,
} from '../../lib/schema.js';
import { listAliases } from './alias.js';
import { listDestinations } from './destination.js';
import { generateWranglerToml } from './generate.js';
import { getSettings } from './settings.js';
import { validateConfig } from './validate.js';

import type {
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
  Cli_Commands_Deploy_Deploy_ProjectRoot,
  Cli_Commands_Deploy_Deploy_Result,
  Cli_Commands_Deploy_Deploy_Returns,
  Cli_Commands_Deploy_Deploy_Settings,
  Cli_Commands_Deploy_Deploy_Token,
  Cli_Commands_Deploy_Deploy_WranglerTomlPath,
  Cli_Commands_Deploy_Deploy_ZoneInfo,
  Cli_Commands_Deploy_DeployWorker_DeployResult,
  Cli_Commands_Deploy_DeployWorker_ProjectRoot,
  Cli_Commands_Deploy_DeployWorker_Returns,
  Cli_Commands_Deploy_DeployWorker_WranglerTomlPath,
  Cli_Commands_Deploy_EnsureDestinationAddresses_AccountId,
  Cli_Commands_Deploy_EnsureDestinationAddresses_ConfigPath,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Destinations,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Existing,
  Cli_Commands_Deploy_EnsureDestinationAddresses_ExistingAddresses,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Pending,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Result,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Returns,
  Cli_Commands_Deploy_EnsureDestinationAddresses_Token,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Result,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId,
  Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName,
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
  Cli_Commands_Deploy_LoadEnvToken_Content,
  Cli_Commands_Deploy_LoadEnvToken_EnvValue,
  Cli_Commands_Deploy_LoadEnvToken_Match,
  Cli_Commands_Deploy_LoadEnvToken_Returns,
  Cli_Commands_Deploy_LoadEnvToken_Value,
  Cli_Commands_Deploy_PrintAliasSummary_Aliases,
  Cli_Commands_Deploy_PrintAliasSummary_ConfigPath,
  Cli_Commands_Deploy_PrintAliasSummary_Returns,
  Cli_Commands_Deploy_PrintAliasSummary_Settings,
  Cli_Commands_Deploy_PrintAliasSummary_Status,
  Cli_Commands_Deploy_PromptForApiToken_PromptResult,
  Cli_Commands_Deploy_PromptForApiToken_Returns,
  Cli_Commands_Deploy_PromptForApiToken_Token,
  Cli_Commands_Deploy_ResolveApiToken_EnvToken,
  Cli_Commands_Deploy_ResolveApiToken_Interactive,
  Cli_Commands_Deploy_ResolveApiToken_Returns,
  Cli_Commands_Deploy_SaveEnvToken_Content,
  Cli_Commands_Deploy_SaveEnvToken_Regex,
  Cli_Commands_Deploy_SaveEnvToken_Returns,
  Cli_Commands_Deploy_SaveEnvToken_Token,
  Cli_Commands_Deploy_SetCatchAll_ActionValue,
  Cli_Commands_Deploy_SetCatchAll_CatchAll,
  Cli_Commands_Deploy_SetCatchAll_PointsAtWorker,
  Cli_Commands_Deploy_SetCatchAll_PreviousTarget,
  Cli_Commands_Deploy_SetCatchAll_Result,
  Cli_Commands_Deploy_SetCatchAll_Returns,
  Cli_Commands_Deploy_SetCatchAll_Token,
  Cli_Commands_Deploy_SetCatchAll_WorkerName,
  Cli_Commands_Deploy_SetCatchAll_ZoneId,
  Cli_Commands_Deploy_VerifyApiToken_Envelope,
  Cli_Commands_Deploy_VerifyApiToken_Response,
  Cli_Commands_Deploy_VerifyApiToken_ResponseData,
  Cli_Commands_Deploy_VerifyApiToken_Returns,
  Cli_Commands_Deploy_VerifyApiToken_Token,
  Cli_Commands_Deploy_VerifyPermissions_AccountId,
  Cli_Commands_Deploy_VerifyPermissions_HasDestinationAddresses,
  Cli_Commands_Deploy_VerifyPermissions_HasEmailRoutingRules,
  Cli_Commands_Deploy_VerifyPermissions_HasWorkersScripts,
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
 * CLI - Commands - Deploy - Deploy.
 *
 * Orchestrates the full deployment pipeline: authentication, validation,
 * destination address registration, Worker deployment, and pointing the
 * zone's Email Routing catch-all at the Worker.
 *
 * @param {Cli_Commands_Deploy_Deploy_ConfigPath}  configPath    - Config path.
 * @param {Cli_Commands_Deploy_Deploy_Interactive} [interactive] - Interactive.
 *
 * @returns {Cli_Commands_Deploy_Deploy_Returns}
 *
 * @since 0.0.1
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

    return;
  }

  Logger.info('Config is valid.');

  // Step 3: Locate the zone and verify permissions.
  const settings: Cli_Commands_Deploy_Deploy_Settings = getSettings(configPath);

  Logger.info('Verifying API token permissions...');

  const zoneInfo: Cli_Commands_Deploy_Deploy_ZoneInfo = await getZoneInfo(token, settings['base_domain']);
  const accountId: Cli_Commands_Deploy_Deploy_AccountId = await verifyPermissions(token, zoneInfo['zoneId'], zoneInfo['accountId'], interactive);

  Logger.info('Permissions verified.');

  // Step 4: Make sure Email Routing is on for the zone.
  await ensureEmailRoutingEnabled(token, zoneInfo['zoneId'], zoneInfo['zoneName']);

  // Step 5: Register destination addresses.
  Logger.info('Checking destination addresses...');

  await ensureDestinationAddresses(configPath, token, accountId);

  // Step 6: Generate wrangler.toml.
  Logger.info('Generating wrangler.toml...');

  const projectRoot: Cli_Commands_Deploy_Deploy_ProjectRoot = Bootstrap.getProjectRoot() ?? process.cwd();
  const wranglerTomlPath: Cli_Commands_Deploy_Deploy_WranglerTomlPath = resolve(projectRoot, 'wrangler.toml');

  generateWranglerToml(configPath, wranglerTomlPath, accountId);

  Logger.info('wrangler.toml generated.');

  // Step 7: Deploy worker.
  Logger.info('Deploying worker...');

  deployWorker();

  Logger.info('Worker deployed.');

  // Step 8: Point the catch-all at the Worker.
  await setCatchAll(token, zoneInfo['zoneId'], settings['worker_name']);

  // Step 9: Print alias summary.
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
 * @since 0.0.1
 */
async function verifyPermissions(token: Cli_Commands_Deploy_VerifyPermissions_Token, zoneId: Cli_Commands_Deploy_VerifyPermissions_ZoneId, accountId: Cli_Commands_Deploy_VerifyPermissions_AccountId, interactive: Cli_Commands_Deploy_VerifyPermissions_Interactive): Cli_Commands_Deploy_VerifyPermissions_Returns {
  const hasWorkersScripts: Cli_Commands_Deploy_VerifyPermissions_HasWorkersScripts = await hasPermission(token, `/accounts/${accountId}/workers/scripts`);
  const hasDestinationAddresses: Cli_Commands_Deploy_VerifyPermissions_HasDestinationAddresses = await hasPermission(token, `/accounts/${accountId}/email/routing/addresses?per_page=5`);
  const hasEmailRoutingRules: Cli_Commands_Deploy_VerifyPermissions_HasEmailRoutingRules = await hasPermission(token, `/zones/${zoneId}/email/routing/rules/catch_all`);
  const missing: Cli_Commands_Deploy_VerifyPermissions_Missing = [];

  if (hasWorkersScripts === false) {
    missing.push('Account > Workers Scripts > Edit');
  }

  if (hasDestinationAddresses === false) {
    missing.push('Account > Email Routing Addresses > Edit');
  }

  if (hasEmailRoutingRules === false) {
    missing.push('Zone > Email Routing Rules > Edit');
  }

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
  Logger.info('  3. Add the missing permissions listed above');
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
 * @since 0.0.1
 */
async function promptForApiToken(): Cli_Commands_Deploy_PromptForApiToken_Returns {
  Logger.info('');
  Logger.info('You need a Cloudflare API token to deploy the Worker and manage Email Routing.');
  Logger.info('');
  Logger.info('  1. Go to https://dash.cloudflare.com/profile/api-tokens');
  Logger.info('  2. Click "Create Token"');
  Logger.info('  3. Under "Custom token", click "Get started"');
  Logger.info('  4. Name the token (e.g. "Mailmask")');
  Logger.info('  5. Under Permissions, add the following (use "+ Add more" for each):');
  Logger.info('     - Account | Workers Scripts | Edit');
  Logger.info('     - Account | Email Routing Addresses | Edit');
  Logger.info('     - Zone | Email Routing Rules | Edit');
  Logger.info('  6. Under Account Resources, select your account');
  Logger.info('  7. Under Zone Resources, select Specific zone -> your base domain');
  Logger.info('  8. Click "Continue to summary" then "Create Token"');
  Logger.info('  9. Copy the generated token');
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
 * Confirms Email Routing is enabled on the zone. Enabling it adds MX and
 * SPF records, so the deploy stops and points the user at the dashboard
 * instead of changing DNS on its own.
 *
 * @param {Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token}    token    - Token.
 * @param {Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId}   zoneId   - Zone id.
 * @param {Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName} zoneName - Zone name.
 *
 * @returns {Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns}
 *
 * @since 0.0.1
 */
async function ensureEmailRoutingEnabled(token: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token, zoneId: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId, zoneName: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName): Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns {
  const result: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Result = await cloudflareRequest(token, 'GET', `/zones/${zoneId}/email/routing`, undefined);
  const routing: Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing = cloudflareEmailRoutingSettingsSchema.parse(result);

  if (routing['enabled'] === false) {
    throw new Error(`Email Routing is not enabled for "${zoneName}". Enable it in the Cloudflare dashboard (Email > Email Routing) so the MX records are added, then deploy again.`);
  }

  return;
}

/**
 * CLI - Commands - Deploy - Ensure Destination Addresses.
 *
 * Registers every configured destination as an Email Routing destination
 * address. Cloudflare emails a verification link for new addresses, and
 * forwarding to an address only works once it has been verified.
 *
 * @param {Cli_Commands_Deploy_EnsureDestinationAddresses_ConfigPath} configPath - Config path.
 * @param {Cli_Commands_Deploy_EnsureDestinationAddresses_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_EnsureDestinationAddresses_AccountId}  accountId  - Account id.
 *
 * @returns {Cli_Commands_Deploy_EnsureDestinationAddresses_Returns}
 *
 * @since 0.0.1
 */
async function ensureDestinationAddresses(configPath: Cli_Commands_Deploy_EnsureDestinationAddresses_ConfigPath, token: Cli_Commands_Deploy_EnsureDestinationAddresses_Token, accountId: Cli_Commands_Deploy_EnsureDestinationAddresses_AccountId): Cli_Commands_Deploy_EnsureDestinationAddresses_Returns {
  const destinations: Cli_Commands_Deploy_EnsureDestinationAddresses_Destinations = listDestinations(configPath);
  const result: Cli_Commands_Deploy_EnsureDestinationAddresses_Result = await cloudflareRequest(token, 'GET', `/accounts/${accountId}/email/routing/addresses?per_page=50`, undefined);
  const existingAddresses: Cli_Commands_Deploy_EnsureDestinationAddresses_ExistingAddresses = cloudflareDestinationAddressesSchema.parse(result);
  const pending: Cli_Commands_Deploy_EnsureDestinationAddresses_Pending = [];

  for (const destination of destinations) {
    const existing: Cli_Commands_Deploy_EnsureDestinationAddresses_Existing = existingAddresses.find((existingAddress) => existingAddress['email'].toLowerCase() === destination['email'].toLowerCase());

    if (existing === undefined) {
      await cloudflareRequest(token, 'POST', `/accounts/${accountId}/email/routing/addresses`, { email: destination['email'] });

      Logger.info(`Registered destination "${destination['email']}". Cloudflare sent a verification email to it.`);

      pending.push(destination['email']);

      continue;
    }

    if (existing['verified'] === undefined || existing['verified'] === null) {
      pending.push(destination['email']);
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
 * CLI - Commands - Deploy - Set Catch All.
 *
 * Points the zone's Email Routing catch-all rule at the Worker so every
 * address that has no explicit rule reaches the alias router. Existing
 * literal rules keep working because they take precedence.
 *
 * @param {Cli_Commands_Deploy_SetCatchAll_Token}      token      - Token.
 * @param {Cli_Commands_Deploy_SetCatchAll_ZoneId}     zoneId     - Zone id.
 * @param {Cli_Commands_Deploy_SetCatchAll_WorkerName} workerName - Worker name.
 *
 * @returns {Cli_Commands_Deploy_SetCatchAll_Returns}
 *
 * @since 0.0.1
 */
async function setCatchAll(token: Cli_Commands_Deploy_SetCatchAll_Token, zoneId: Cli_Commands_Deploy_SetCatchAll_ZoneId, workerName: Cli_Commands_Deploy_SetCatchAll_WorkerName): Cli_Commands_Deploy_SetCatchAll_Returns {
  const result: Cli_Commands_Deploy_SetCatchAll_Result = await cloudflareRequest(token, 'GET', `/zones/${zoneId}/email/routing/rules/catch_all`, undefined);
  const catchAll: Cli_Commands_Deploy_SetCatchAll_CatchAll = cloudflareCatchAllSchema.parse(result);

  const pointsAtWorker: Cli_Commands_Deploy_SetCatchAll_PointsAtWorker = catchAll['actions'].some((action) => {
    const actionValue: Cli_Commands_Deploy_SetCatchAll_ActionValue = action['value'] ?? [];

    return action['type'] === 'worker' && actionValue.includes(workerName) === true;
  });

  if (catchAll['enabled'] === true && pointsAtWorker === true) {
    Logger.info('Email Routing catch-all already points at the Worker.');

    return;
  }

  const previousTarget: Cli_Commands_Deploy_SetCatchAll_PreviousTarget = catchAll['actions'].map((action) => action['type']).join(', ');

  await cloudflareRequest(token, 'PUT', `/zones/${zoneId}/email/routing/rules/catch_all`, {
    name: `${workerName}: catch-all`,
    enabled: true,
    matchers: [{ type: 'all' }],
    actions: [{
      type: 'worker',
      value: [workerName],
    }],
  });

  Logger.info(`Email Routing catch-all now points at the Worker (previously: ${previousTarget}).`);

  return;
}

/**
 * CLI - Commands - Deploy - Worker.
 *
 * Spawns the Wrangler deploy process with the generated
 * configuration file and aborts on non-zero exit codes.
 *
 * @returns {Cli_Commands_Deploy_DeployWorker_Returns}
 *
 * @since 0.0.1
 */
function deployWorker(): Cli_Commands_Deploy_DeployWorker_Returns {
  const projectRoot: Cli_Commands_Deploy_DeployWorker_ProjectRoot = Bootstrap.getProjectRoot() ?? process.cwd();
  const wranglerTomlPath: Cli_Commands_Deploy_DeployWorker_WranglerTomlPath = resolve(projectRoot, 'wrangler.toml');

  const deployResult: Cli_Commands_Deploy_DeployWorker_DeployResult = spawnSync('npx', [
    'wrangler',
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

  if (aliases.length === 0) {
    return;
  }

  process.stdout.write('\n');
  process.stdout.write(`${chalk.bold('Alias reference:')}\n`);
  process.stdout.write('\n');

  for (const alias of aliases) {
    const status: Cli_Commands_Deploy_PrintAliasSummary_Status = (alias['enabled'] === true) ? chalk.green('enabled') : chalk.yellow('disabled');

    process.stdout.write(`  ${chalk.cyan(`${alias['address']}@${settings['base_domain']}`)} -> ${alias['destination']} (${status})\n`);
  }

  process.stdout.write('\n');

  return;
}

export {
  deploy,
};
