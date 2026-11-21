import type { Worker_Index_CreateWorker_EmailMessageConstructor } from '../../worker/index.d.ts';

/**
 * Tests - Worker - Cloudflare Email.
 *
 * @since 1.2.0
 */
export type Tests_Worker_CloudflareEmail_Crlf = string;

/**
 * Tests - Worker - Cloudflare Email - Is Dmarc Pass - Trusts Only The First Cloudflare Authentication Result.
 *
 * @since 1.2.0
 */
export type Tests_Worker_CloudflareEmail_IsDmarcPass_TrustsOnlyTheFirstCloudflareAuthenticationResult_Passed = boolean;

/**
 * Tests - Worker - Cloudflare Email - Send Raw Email - Sends The Bytes As An Email Message Stream.
 *
 * @since 1.2.0
 */
export type Tests_Worker_CloudflareEmail_SendRawEmail_SendsTheBytesAsAnEmailMessageStream_SentMessages = Array<EmailMessage | EmailMessageBuilder>;

export type Tests_Worker_CloudflareEmail_SendRawEmail_SendsTheBytesAsAnEmailMessageStream_EmailBinding = SendEmail;

export type Tests_Worker_CloudflareEmail_SendRawEmail_SendsTheBytesAsAnEmailMessageStream_SentText = string;

/**
 * Tests - Worker - Cloudflare Email - Send Text Email - Sends The Structured Message.
 *
 * @since 1.2.0
 */
export type Tests_Worker_CloudflareEmail_SendTextEmail_SendsTheStructuredMessage_SentMessages = Array<EmailMessage | EmailMessageBuilder>;

export type Tests_Worker_CloudflareEmail_SendTextEmail_SendsTheStructuredMessage_EmailBinding = SendEmail;

/**
 * Tests - Worker - Cloudflare Email - Test Email Message.
 *
 * @since 1.2.0
 */
export type Tests_Worker_CloudflareEmail_TestEmailMessage_From = string;

export type Tests_Worker_CloudflareEmail_TestEmailMessage_To = string;

export type Tests_Worker_CloudflareEmail_TestEmailMessage_Raw = ConstructorParameters<NonNullable<Worker_Index_CreateWorker_EmailMessageConstructor>>[2];

/**
 * Tests - Worker - Cloudflare Email - Test Email Message - Constructor.
 *
 * @since 1.2.0
 */
export type Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_From = string;

export type Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_To = string;

export type Tests_Worker_CloudflareEmail_TestEmailMessage_Constructor_Raw = ConstructorParameters<NonNullable<Worker_Index_CreateWorker_EmailMessageConstructor>>[2];

/**
 * Tests - Worker - Cloudflare Email - To Bytes.
 *
 * @since 1.2.0
 */
export type Tests_Worker_CloudflareEmail_ToBytes_Text = string;

export type Tests_Worker_CloudflareEmail_ToBytes_Returns = Uint8Array;
