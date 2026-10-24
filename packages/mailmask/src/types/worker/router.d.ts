import type {
  Lib_Schema_AliasConfig,
  Lib_Schema_ConfigSchema,
  Lib_Schema_DestinationConfig,
  Lib_Schema_SettingsConfig,
} from '../lib/schema.d.ts';
import type { Shared_RouteDecision } from '../shared.d.ts';

/**
 * Worker - Router - Matches Sender.
 *
 * @since 0.0.1
 */
export type Worker_Router_MatchesSender_Sender = string;

export type Worker_Router_MatchesSender_Pattern = string;

export type Worker_Router_MatchesSender_Returns = boolean;

export type Worker_Router_MatchesSender_NormalizedPattern = string;

export type Worker_Router_MatchesSender_SenderDomain = string;

/**
 * Worker - Router - Resolve Route.
 *
 * @since 0.0.1
 */
export type Worker_Router_ResolveRoute_Recipient = string;

export type Worker_Router_ResolveRoute_Sender = string;

export type Worker_Router_ResolveRoute_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Worker_Router_ResolveRoute_Now = number;

export type Worker_Router_ResolveRoute_Returns = Shared_RouteDecision;

export type Worker_Router_ResolveRoute_Settings = { [Key in keyof Lib_Schema_SettingsConfig]: Lib_Schema_SettingsConfig[Key] };

export type Worker_Router_ResolveRoute_AtIndex = number;

export type Worker_Router_ResolveRoute_Domain = string;

export type Worker_Router_ResolveRoute_LocalPart = string;

export type Worker_Router_ResolveRoute_RefusalAction = 'reject' | 'drop';

export type Worker_Router_ResolveRoute_PlusIndex = number;

export type Worker_Router_ResolveRoute_Alias = Lib_Schema_AliasConfig | undefined;

export type Worker_Router_ResolveRoute_DefaultDestination = Lib_Schema_DestinationConfig | undefined;

export type Worker_Router_ResolveRoute_ExpiresAt = string | undefined;

export type Worker_Router_ResolveRoute_BlockedSenders = string[];

export type Worker_Router_ResolveRoute_AllowedSenders = string[] | undefined;

export type Worker_Router_ResolveRoute_NormalizedSender = string;

export type Worker_Router_ResolveRoute_Destination = Lib_Schema_DestinationConfig | undefined;
