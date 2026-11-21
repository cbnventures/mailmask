import type { KeyPairKeyObjectResult } from 'node:crypto';

import type { Mock, MockInstance } from 'vitest';

import type { Lib_Schema_ConfigSchema } from '../../lib/schema.d.ts';
import type { Worker_Index_CreateWorker_Returns } from '../../worker/index.d.ts';

/**
 * Tests - Worker - Phone Handlers.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_Now = number;

export type Tests_Worker_PhoneHandlers_KeyPair = KeyPairKeyObjectResult;

export type Tests_Worker_PhoneHandlers_PublicKey = string;

export type Tests_Worker_PhoneHandlers_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Tests_Worker_PhoneHandlers_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Phone Handlers - Create Worker - Routes Text Webhooks And Refuses Other Paths And Methods.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_GetResponse = Response;

export type Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_CallsResponse = Response;

export type Tests_Worker_PhoneHandlers_CreateWorker_RoutesTextWebhooksAndRefusesOtherPathsAndMethods_PostResponse = Response;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Answers With An Error When Forwarding Fails.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_AnswersWithAnErrorWhenForwardingFails_ConsoleWarnSpy = MockInstance<typeof console.warn>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_AnswersWithAnErrorWhenForwardingFails_Response = Response;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Drops Texts To A Disabled Number And Notifies.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_Context_WaitUntil = Mock<ExecutionContext['waitUntil']>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_Context = {
  waitUntil: Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_Context_WaitUntil;
};

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_DropsTextsToADisabledNumberAndNotifies_Response = Response;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Ends Plivo Calls Without Sending Anything.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_EndsPlivoCallsWithoutSendingAnything_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_EndsPlivoCallsWithoutSendingAnything_Response = Response;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Forwards A Verified Plivo Text To The Destination Phone.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedPlivoTextToTheDestinationPhone_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedPlivoTextToTheDestinationPhone_Response = Response;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedPlivoTextToTheDestinationPhone_RequestBody = Record<string, unknown>;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Forwards A Verified Telnyx Text To The Destination Phone.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedTelnyxTextToTheDestinationPhone_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedTelnyxTextToTheDestinationPhone_Response = Response;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_ForwardsAVerifiedTelnyxTextToTheDestinationPhone_RequestBody = Record<string, unknown>;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Ignores Delivery Receipts.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_IgnoresDeliveryReceipts_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_IgnoresDeliveryReceipts_Response = Response;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Refuses Bad Signatures And Unknown Providers.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_RefusesBadSignaturesAndUnknownProviders_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_RefusesBadSignaturesAndUnknownProviders_Response = Response;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_RefusesBadSignaturesAndUnknownProviders_UnknownResponse = Response;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Sends A Text From The Destination Phone Through The Alias.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_SendsATextFromTheDestinationPhoneThroughTheAlias_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_SendsATextFromTheDestinationPhoneThroughTheAlias_Response = Response;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_SendsATextFromTheDestinationPhoneThroughTheAlias_RequestBody = Record<string, unknown>;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Tells The Destination Phone When Sending Fails.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_ConsoleWarnSpy = MockInstance<typeof console.warn>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_Response = Response;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TellsTheDestinationPhoneWhenSendingFails_NoticeBody = Record<string, unknown>;

/**
 * Tests - Worker - Phone Handlers - Handle Phone Webhook - Texts Help When The Destination Phone Leaves Out The Number.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TextsHelpWhenTheDestinationPhoneLeavesOutTheNumber_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_PhoneHandlers_HandlePhoneWebhook_TextsHelpWhenTheDestinationPhoneLeavesOutTheNumber_RequestBody = Record<string, unknown>;

/**
 * Tests - Worker - Phone Handlers - Plivo Request.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_PlivoRequest_Body = string;

export type Tests_Worker_PhoneHandlers_PlivoRequest_Returns = Request;

export type Tests_Worker_PhoneHandlers_PlivoRequest_Url = string;

export type Tests_Worker_PhoneHandlers_PlivoRequest_Signature = string;

/**
 * Tests - Worker - Phone Handlers - Telnyx Body.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_TelnyxBody_To = string;

export type Tests_Worker_PhoneHandlers_TelnyxBody_EventType = string;

export type Tests_Worker_PhoneHandlers_TelnyxBody_From = string;

export type Tests_Worker_PhoneHandlers_TelnyxBody_Text = string;

export type Tests_Worker_PhoneHandlers_TelnyxBody_Returns = string;

/**
 * Tests - Worker - Phone Handlers - Telnyx Request.
 *
 * @since 1.2.0
 */
export type Tests_Worker_PhoneHandlers_TelnyxRequest_Body = string;

export type Tests_Worker_PhoneHandlers_TelnyxRequest_Returns = Request;

export type Tests_Worker_PhoneHandlers_TelnyxRequest_Timestamp = string;

export type Tests_Worker_PhoneHandlers_TelnyxRequest_Signature = string;
