import type { Lib_Schema_ConfigSchema } from '../../lib/schema.d.ts';
import type { Shared_PhoneRouteDecision } from '../../shared.d.ts';

/**
 * Tests - Worker - Phone Router.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneRouter_Now = number;

export type Tests_Worker_PhoneRouter_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Phone Router - Resolve Phone Route - Applies Blocked Senders Before Allowed Senders.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneRouter_ResolvePhoneRoute_AppliesBlockedSendersBeforeAllowedSenders_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Phone Router - Resolve Phone Route - Forwards An Active Number To The Destination Phone.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneRouter_ResolvePhoneRoute_ForwardsAnActiveNumberToTheDestinationPhone_Decision = Shared_PhoneRouteDecision;

/**
 * Tests - Worker - Phone Router - Resolve Phone Route - Refuses Unknown Disabled Expired And Misconfigured Numbers.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneRouter_ResolvePhoneRoute_RefusesUnknownDisabledExpiredAndMisconfiguredNumbers_UnknownDecision = Shared_PhoneRouteDecision;

/**
 * Tests - Worker - Phone Router - Resolve Phone Route - Sends Texts From The Destination Phone Through The Alias.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneRouter_ResolvePhoneRoute_SendsTextsFromTheDestinationPhoneThroughTheAlias_Decision = Shared_PhoneRouteDecision;
