import type {
  Lib_Schema_ConfigSchema,
  Lib_Schema_DestinationConfig,
  Lib_Schema_PhoneAliasConfig,
} from '../lib/schema.d.ts';
import type { Shared_PhoneRouteDecision } from '../shared.d.ts';

/**
 * Worker - Phone Router - Resolve Phone Route.
 *
 * @since 1.2.0
 */
export type Worker_PhoneRouter_ResolvePhoneRoute_Recipient = string;

export type Worker_PhoneRouter_ResolvePhoneRoute_Recipients = Worker_PhoneRouter_ResolvePhoneRoute_Recipient[];

export type Worker_PhoneRouter_ResolvePhoneRoute_Sender = string;

export type Worker_PhoneRouter_ResolvePhoneRoute_Text = string;

export type Worker_PhoneRouter_ResolvePhoneRoute_ProviderName = string;

export type Worker_PhoneRouter_ResolvePhoneRoute_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Worker_PhoneRouter_ResolvePhoneRoute_Now = number;

export type Worker_PhoneRouter_ResolvePhoneRoute_Returns = Shared_PhoneRouteDecision;

export type Worker_PhoneRouter_ResolvePhoneRoute_PhoneAlias = Lib_Schema_PhoneAliasConfig | undefined;

export type Worker_PhoneRouter_ResolvePhoneRoute_ExpiresAt = string | undefined;

export type Worker_PhoneRouter_ResolvePhoneRoute_Destination = Lib_Schema_DestinationConfig | undefined;

export type Worker_PhoneRouter_ResolvePhoneRoute_OutboundMatch = RegExpMatchArray | null;

export type Worker_PhoneRouter_ResolvePhoneRoute_BlockedSenders = string[];

export type Worker_PhoneRouter_ResolvePhoneRoute_AllowedSenders = string[] | undefined;
