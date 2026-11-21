import type { Shared_NotificationEmailMessage } from '../shared.d.ts';

/**
 * Worker - Cloudflare Email - Is Dmarc Pass.
 *
 * @since 1.2.0
 */
export type Worker_CloudflareEmail_IsDmarcPass_Raw = Uint8Array;

export type Worker_CloudflareEmail_IsDmarcPass_Returns = boolean;

export type Worker_CloudflareEmail_IsDmarcPass_AuthenticationResults = string | undefined;

export type Worker_CloudflareEmail_IsDmarcPass_Value = string;

/**
 * Worker - Cloudflare Email - Send Raw Email.
 *
 * @since 1.2.0
 */
export type Worker_CloudflareEmail_SendRawEmail_EmailBinding = SendEmail;

export type Worker_CloudflareEmail_SendRawEmail_EmailMessageConstructor = new (from: string, to: string, raw: ReadableStream | string) => EmailMessage;

export type Worker_CloudflareEmail_SendRawEmail_From = string;

export type Worker_CloudflareEmail_SendRawEmail_To = string;

export type Worker_CloudflareEmail_SendRawEmail_Raw = Uint8Array;

export type Worker_CloudflareEmail_SendRawEmail_Returns = Promise<void>;

export type Worker_CloudflareEmail_SendRawEmail_Stream = ReadableStream<Uint8Array>;

/**
 * Worker - Cloudflare Email - Send Text Email.
 *
 * @since 1.2.0
 */
export type Worker_CloudflareEmail_SendTextEmail_EmailBinding = SendEmail;

export type Worker_CloudflareEmail_SendTextEmail_Message = Shared_NotificationEmailMessage;

export type Worker_CloudflareEmail_SendTextEmail_Returns = Promise<void>;
