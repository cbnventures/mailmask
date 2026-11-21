import type { MockInstance } from 'vitest';

import type {
  Shared_CloudflareCatchAll,
  Shared_CloudflareEmailSendingSetup,
  Shared_CloudflareRoutingRule,
  Shared_CloudflareWorkersPlan,
  Shared_CloudflareZone,
} from '../../shared.d.ts';

/**
 * Tests - Lib - Cloudflare - Adapter - Onboards The Domain To Email Sending And Adds Only Missing Records.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_ZoneRecord = Record<string, unknown>;

export type Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_ZoneRecords = Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_ZoneRecord[];

export type Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Onboarded = boolean;

export type Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Url = URL;

export type Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Method = string;

export type Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Setup = { [Key in keyof Shared_CloudflareEmailSendingSetup]: Shared_CloudflareEmailSendingSetup[Key] };

/**
 * Tests - Lib - Cloudflare - Adapter - Probes Billing Read Only When Asked.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_Adapter_ProbesBillingReadOnlyWhenAsked_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - Lib - Cloudflare - Adapter - Probes Email Sending And Dns Permissions Only When Asked.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_Adapter_ProbesEmailSendingAndDnsPermissionsOnlyWhenAsked_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - Lib - Cloudflare - Adapter - Reads Account Resources.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_Adapter_ReadsAccountResources_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Lib_Cloudflare_Adapter_ReadsAccountResources_Zone = Shared_CloudflareZone | undefined;

/**
 * Tests - Lib - Cloudflare - Adapter - Reads Routing Rules As Mailmask Rules.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_Adapter_ReadsRoutingRulesAsMailmaskRules_Rules = Shared_CloudflareRoutingRule[];

/**
 * Tests - Lib - Cloudflare - Adapter - Reads The Catch All Workers.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_Adapter_ReadsTheCatchAllWorkers_CatchAll = { [Key in keyof Shared_CloudflareCatchAll]: Shared_CloudflareCatchAll[Key] };

/**
 * Tests - Lib - Cloudflare - Adapter - Reads The Workers Plan From The Account Subscriptions.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_Adapter_ReadsTheWorkersPlanFromTheAccountSubscriptions_Plan = Shared_CloudflareWorkersPlan;

/**
 * Tests - Lib - Cloudflare - Adapter - Reports An Unreadable Workers Plan As Unknown.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_Adapter_ReportsAnUnreadableWorkersPlanAsUnknown_Plan = Shared_CloudflareWorkersPlan;

/**
 * Tests - Lib - Cloudflare - Adapter - Treats A Token Check That Cannot Reach Cloudflare As Invalid.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_Adapter_TreatsATokenCheckThatCannotReachCloudflareAsInvalid_Valid = boolean;

/**
 * Tests - Lib - Cloudflare - Cloudflare Response.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Cloudflare_CloudflareResponse_Result = unknown;

export type Tests_Lib_Cloudflare_CloudflareResponse_Returns = Response;
