import type { KeyPairKeyObjectResult } from 'node:crypto';

import type { MockInstance } from 'vitest';

import type { Lib_Schema_PhoneProviderConfig, Lib_Schema_TelnyxProviderConfig } from '../../lib/schema.d.ts';
import type {
  Shared_PhoneAvailableNumber,
  Shared_PhoneInboundMessage,
  Shared_PhoneWebhook,
} from '../../shared.d.ts';

/**
 * Tests - Lib - Telnyx.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_Now = number;

export type Tests_Lib_Telnyx_Provider = { [Key in keyof Lib_Schema_TelnyxProviderConfig]: Lib_Schema_TelnyxProviderConfig[Key] };

export type Tests_Lib_Telnyx_InboundBody = string;

/**
 * Tests - Lib - Telnyx - Buy Number - Orders The Number And Returns The Order Status.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_BuyNumber_OrdersTheNumberAndReturnsTheOrderStatus_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Lib_Telnyx_BuyNumber_OrdersTheNumberAndReturnsTheOrderStatus_RequestBody = Record<string, unknown>;

/**
 * Tests - Lib - Telnyx - Connect Numbers - Creates The Messaging Profile And Assigns Every Number.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_ConnectNumbers_CreatesTheMessagingProfileAndAssignsEveryNumber_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Lib_Telnyx_ConnectNumbers_CreatesTheMessagingProfileAndAssignsEveryNumber_Connected = Lib_Schema_PhoneProviderConfig & {};

export type Tests_Lib_Telnyx_ConnectNumbers_CreatesTheMessagingProfileAndAssignsEveryNumber_ProfileBody = Record<string, unknown>;

/**
 * Tests - Lib - Telnyx - Connect Numbers - Limits The Profile To The Configured Destination Countries.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_ConnectNumbers_LimitsTheProfileToTheConfiguredDestinationCountries_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Lib_Telnyx_ConnectNumbers_LimitsTheProfileToTheConfiguredDestinationCountries_ProfileBody = Record<string, unknown>;

/**
 * Tests - Lib - Telnyx - Parse Inbound Message - Ignores Status Events And Broken Bodies.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_ParseInboundMessage_IgnoresStatusEventsAndBrokenBodies_StatusBody = string;

/**
 * Tests - Lib - Telnyx - Parse Inbound Message - Reads The Sender Recipients Text And Media.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_ParseInboundMessage_ReadsTheSenderRecipientsTextAndMedia_Message = Shared_PhoneInboundMessage | undefined;

/**
 * Tests - Lib - Telnyx - Release Number - Looks Up The Number Id And Deletes It.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_ReleaseNumber_LooksUpTheNumberIDAndDeletesIt_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - Lib - Telnyx - Search Numbers - Searches Sms Numbers In An Area Code.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_SearchNumbers_SearchesSMSNumbersInAnAreaCode_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Lib_Telnyx_SearchNumbers_SearchesSMSNumbersInAnAreaCode_Numbers = Shared_PhoneAvailableNumber[];

export type Tests_Lib_Telnyx_SearchNumbers_SearchesSMSNumbersInAnAreaCode_RequestUrl = URL;

/**
 * Tests - Lib - Telnyx - Send Message - Posts The Forwarded Text With Its Media.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_SendMessage_PostsTheForwardedTextWithItsMedia_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Lib_Telnyx_SendMessage_PostsTheForwardedTextWithItsMedia_RequestInit = RequestInit | undefined;

export type Tests_Lib_Telnyx_SendMessage_PostsTheForwardedTextWithItsMedia_RequestBody = Record<string, unknown>;

/**
 * Tests - Lib - Telnyx - Sign Webhook.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_SignWebhook_Body = string;

export type Tests_Lib_Telnyx_SignWebhook_Timestamp = string;

export type Tests_Lib_Telnyx_SignWebhook_Returns_Provider = Lib_Schema_TelnyxProviderConfig;

export type Tests_Lib_Telnyx_SignWebhook_Returns_Webhook = Shared_PhoneWebhook;

export type Tests_Lib_Telnyx_SignWebhook_Returns = Promise<{
  provider: Tests_Lib_Telnyx_SignWebhook_Returns_Provider;
  webhook: Tests_Lib_Telnyx_SignWebhook_Returns_Webhook;
}>;

export type Tests_Lib_Telnyx_SignWebhook_KeyPair = KeyPairKeyObjectResult;

export type Tests_Lib_Telnyx_SignWebhook_PublicKey = string;

export type Tests_Lib_Telnyx_SignWebhook_Signature = string;

/**
 * Tests - Lib - Telnyx - Verify Webhook - Accepts A Valid Signature.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_VerifyWebhook_AcceptsAValidSignature_Signed_Provider = Lib_Schema_TelnyxProviderConfig;

export type Tests_Lib_Telnyx_VerifyWebhook_AcceptsAValidSignature_Signed_Webhook = Shared_PhoneWebhook;

export type Tests_Lib_Telnyx_VerifyWebhook_AcceptsAValidSignature_Signed = {
  provider: Tests_Lib_Telnyx_VerifyWebhook_AcceptsAValidSignature_Signed_Provider;
  webhook: Tests_Lib_Telnyx_VerifyWebhook_AcceptsAValidSignature_Signed_Webhook;
};

/**
 * Tests - Lib - Telnyx - Verify Webhook - Refuses Missing Headers And Bad Public Keys.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_VerifyWebhook_RefusesMissingHeadersAndBadPublicKeys_Signed_Provider = Lib_Schema_TelnyxProviderConfig;

export type Tests_Lib_Telnyx_VerifyWebhook_RefusesMissingHeadersAndBadPublicKeys_Signed_Webhook = Shared_PhoneWebhook;

export type Tests_Lib_Telnyx_VerifyWebhook_RefusesMissingHeadersAndBadPublicKeys_Signed = {
  provider: Tests_Lib_Telnyx_VerifyWebhook_RefusesMissingHeadersAndBadPublicKeys_Signed_Provider;
  webhook: Tests_Lib_Telnyx_VerifyWebhook_RefusesMissingHeadersAndBadPublicKeys_Signed_Webhook;
};

/**
 * Tests - Lib - Telnyx - Verify Webhook - Refuses Stale Timestamps.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_VerifyWebhook_RefusesStaleTimestamps_Signed_Provider = Lib_Schema_TelnyxProviderConfig;

export type Tests_Lib_Telnyx_VerifyWebhook_RefusesStaleTimestamps_Signed_Webhook = Shared_PhoneWebhook;

export type Tests_Lib_Telnyx_VerifyWebhook_RefusesStaleTimestamps_Signed = {
  provider: Tests_Lib_Telnyx_VerifyWebhook_RefusesStaleTimestamps_Signed_Provider;
  webhook: Tests_Lib_Telnyx_VerifyWebhook_RefusesStaleTimestamps_Signed_Webhook;
};

/**
 * Tests - Lib - Telnyx - Verify Webhook - Refuses Tampered Bodies And Other Keys.
 *
 * @since 1.2.0
 */
export type Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_Signed_Provider = Lib_Schema_TelnyxProviderConfig;

export type Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_Signed_Webhook = Shared_PhoneWebhook;

export type Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_Signed = {
  provider: Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_Signed_Provider;
  webhook: Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_Signed_Webhook;
};

export type Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_OtherSigned_Provider = Lib_Schema_TelnyxProviderConfig;

export type Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_OtherSigned_Webhook = Shared_PhoneWebhook;

export type Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_OtherSigned = {
  provider: Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_OtherSigned_Provider;
  webhook: Tests_Lib_Telnyx_VerifyWebhook_RefusesTamperedBodiesAndOtherKeys_OtherSigned_Webhook;
};
