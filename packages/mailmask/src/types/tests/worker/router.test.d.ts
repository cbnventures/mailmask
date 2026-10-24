import type { Lib_Schema_ConfigSchema } from '../../lib/schema.d.ts';
import type { Shared_RouteDecision } from '../../shared.d.ts';

/**
 * Tests - Worker - Router.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_Now = number;

export type Tests_Worker_Router_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Router - Matches Sender - Matches Exact Addresses Case Insensitively.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_MatchesSender_MatchesExactAddressesCaseInsensitively_Matched = boolean;

/**
 * Tests - Worker - Router - Matches Sender - Matches Whole Domain Wildcards Only.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_MatchesSender_MatchesWholeDomainWildcardsOnly_Matched = boolean;

/**
 * Tests - Worker - Router - Resolve Route - Applies Blocked Senders Before Allowed Senders.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_ResolveRoute_AppliesBlockedSendersBeforeAllowedSenders_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Router - Resolve Route - Does Not Strip Tags When Subaddressing Is Off.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_ResolveRoute_DoesNotStripTagsWhenSubaddressingIsOff_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Router - Resolve Route - Drops Refusals When The Unknown Alias Action Is Drop.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_ResolveRoute_DropsRefusalsWhenTheUnknownAliasActionIsDrop_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Router - Resolve Route - Forwards An Active Alias To Its Destination.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_ResolveRoute_ForwardsAnActiveAliasToItsDestination_Decision = Shared_RouteDecision;

/**
 * Tests - Worker - Router - Resolve Route - Forwards Unknown Recipients But Never Disabled Aliases.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_ResolveRoute_ForwardsUnknownRecipientsButNeverDisabledAliases_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Router - Resolve Route - Ignores Case And Strips Subaddress Tags.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_ResolveRoute_IgnoresCaseAndStripsSubaddressTags_Decision = Shared_RouteDecision;

/**
 * Tests - Worker - Router - Resolve Route - Refuses Disabled Expired And Foreign Recipients.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Router_ResolveRoute_RefusesDisabledExpiredAndForeignRecipients_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };
