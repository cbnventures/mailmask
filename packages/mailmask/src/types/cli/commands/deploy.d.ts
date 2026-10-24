import type { SpawnSyncReturns } from 'node:child_process';

import type { z } from 'zod';

import type {
  Lib_Schema_AliasConfig,
  Lib_Schema_CloudflareCatchAll,
  Lib_Schema_CloudflareDestinationAddress,
  Lib_Schema_CloudflareDestinationAddresses,
  Lib_Schema_CloudflareEmailRoutingSettings,
  Lib_Schema_CloudflareEnvelope,
  Lib_Schema_CloudflareZone,
  Lib_Schema_CloudflareZones,
  Lib_Schema_DestinationConfig,
  Lib_Schema_SettingsConfig,
} from '../../lib/schema.d.ts';
import type { Cli_Commands_Validate_ValidateConfig_Returns } from './validate.d.ts';

/**
 * CLI - Commands - Deploy - Cloudflare Request.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_CloudflareRequest_Token = string;

export type Cli_Commands_Deploy_CloudflareRequest_Method = 'GET' | 'POST' | 'PUT';

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

export type Cli_Commands_Deploy_Deploy_ProjectRoot = string;

export type Cli_Commands_Deploy_Deploy_WranglerTomlPath = string;

/**
 * CLI - Commands - Deploy - Deploy Worker.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_DeployWorker_Returns = void;

export type Cli_Commands_Deploy_DeployWorker_ProjectRoot = string;

export type Cli_Commands_Deploy_DeployWorker_WranglerTomlPath = string;

export type Cli_Commands_Deploy_DeployWorker_DeployResult = SpawnSyncReturns<string>;

/**
 * CLI - Commands - Deploy - Ensure Destination Addresses.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_EnsureDestinationAddresses_ConfigPath = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Token = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_AccountId = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Returns = Promise<void>;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Destinations = Array<Lib_Schema_DestinationConfig>;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Result = unknown;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_ExistingAddresses = { [Key in keyof Lib_Schema_CloudflareDestinationAddresses]: Lib_Schema_CloudflareDestinationAddresses[Key] };

export type Cli_Commands_Deploy_EnsureDestinationAddresses_PendingEmail = string;

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Pending = Cli_Commands_Deploy_EnsureDestinationAddresses_PendingEmail[];

export type Cli_Commands_Deploy_EnsureDestinationAddresses_Existing = Lib_Schema_CloudflareDestinationAddress | undefined;

/**
 * CLI - Commands - Deploy - Ensure Email Routing Enabled.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Token = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneId = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_ZoneName = string;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Returns = Promise<void>;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Result = unknown;

export type Cli_Commands_Deploy_EnsureEmailRoutingEnabled_Routing = { [Key in keyof Lib_Schema_CloudflareEmailRoutingSettings]: Lib_Schema_CloudflareEmailRoutingSettings[Key] };

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
 * CLI - Commands - Deploy - Print Alias Summary.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_PrintAliasSummary_ConfigPath = string;

export type Cli_Commands_Deploy_PrintAliasSummary_Returns = void;

export type Cli_Commands_Deploy_PrintAliasSummary_Aliases = Array<Lib_Schema_AliasConfig>;

export type Cli_Commands_Deploy_PrintAliasSummary_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

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
 * CLI - Commands - Deploy - Set Catch All.
 *
 * @since 0.0.1
 */
export type Cli_Commands_Deploy_SetCatchAll_Token = string;

export type Cli_Commands_Deploy_SetCatchAll_ZoneId = string;

export type Cli_Commands_Deploy_SetCatchAll_WorkerName = string;

export type Cli_Commands_Deploy_SetCatchAll_Returns = Promise<void>;

export type Cli_Commands_Deploy_SetCatchAll_Result = unknown;

export type Cli_Commands_Deploy_SetCatchAll_CatchAll = { [Key in keyof Lib_Schema_CloudflareCatchAll]: Lib_Schema_CloudflareCatchAll[Key] };

export type Cli_Commands_Deploy_SetCatchAll_PointsAtWorker = boolean;

export type Cli_Commands_Deploy_SetCatchAll_ActionValue = string[];

export type Cli_Commands_Deploy_SetCatchAll_PreviousTarget = string;

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

export type Cli_Commands_Deploy_VerifyPermissions_HasWorkersScripts = boolean;

export type Cli_Commands_Deploy_VerifyPermissions_HasDestinationAddresses = boolean;

export type Cli_Commands_Deploy_VerifyPermissions_HasEmailRoutingRules = boolean;

export type Cli_Commands_Deploy_VerifyPermissions_Permission = string;

export type Cli_Commands_Deploy_VerifyPermissions_Missing = Cli_Commands_Deploy_VerifyPermissions_Permission[];

export type Cli_Commands_Deploy_VerifyPermissions_MissingMessage = string;

export type Cli_Commands_Deploy_VerifyPermissions_PromptResult_Ready = boolean | undefined;

export type Cli_Commands_Deploy_VerifyPermissions_PromptResult = {
  ready: Cli_Commands_Deploy_VerifyPermissions_PromptResult_Ready;
};
