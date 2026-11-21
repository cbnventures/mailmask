import type { z } from 'zod';

import type { Lib_Schema_ConfigSchema } from '../lib/schema.d.ts';

/**
 * Worker - Index - Create Worker.
 *
 * @since 1.2.0
 */
export type Worker_Index_CreateWorker_RawConfig = unknown;

export type Worker_Index_CreateWorker_EmailMessageConstructor = (new (from: string, to: string, raw: ReadableStream | string) => EmailMessage) | undefined;

export type Worker_Index_CreateWorker_Returns_FetchRequest = Request;

export type Worker_Index_CreateWorker_Returns_FetchEnvMailmaskEmail = SendEmail | undefined;

export type Worker_Index_CreateWorker_Returns_FetchEnv = {
  MAILMASK_EMAIL?: Worker_Index_CreateWorker_Returns_FetchEnvMailmaskEmail;
} | undefined;

export type Worker_Index_CreateWorker_Returns_FetchContext = Pick<ExecutionContext, 'waitUntil'> | undefined;

export type Worker_Index_CreateWorker_Returns_FetchReturns = Promise<Response>;

export type Worker_Index_CreateWorker_Returns_Fetch = (request: Worker_Index_CreateWorker_Returns_FetchRequest, env?: Worker_Index_CreateWorker_Returns_FetchEnv, context?: Worker_Index_CreateWorker_Returns_FetchContext) => Worker_Index_CreateWorker_Returns_FetchReturns;

export type Worker_Index_CreateWorker_Returns_EmailMessage = Pick<ForwardableEmailMessage, 'to' | 'from' | 'forward' | 'setReject'> & Partial<Pick<ForwardableEmailMessage, 'headers' | 'raw'>>;

export type Worker_Index_CreateWorker_Returns_EmailEnvMailmaskEmail = SendEmail | undefined;

export type Worker_Index_CreateWorker_Returns_EmailEnv = {
  MAILMASK_EMAIL?: Worker_Index_CreateWorker_Returns_EmailEnvMailmaskEmail;
} | undefined;

export type Worker_Index_CreateWorker_Returns_EmailContext = Pick<ExecutionContext, 'waitUntil'>;

export type Worker_Index_CreateWorker_Returns_EmailReturns = Promise<void>;

export type Worker_Index_CreateWorker_Returns_Email = (message: Worker_Index_CreateWorker_Returns_EmailMessage, env: Worker_Index_CreateWorker_Returns_EmailEnv, context: Worker_Index_CreateWorker_Returns_EmailContext) => Worker_Index_CreateWorker_Returns_EmailReturns;

export type Worker_Index_CreateWorker_Returns = {
  fetch: Worker_Index_CreateWorker_Returns_Fetch;
  email: Worker_Index_CreateWorker_Returns_Email;
};

export type Worker_Index_CreateWorker_Result = z.ZodSafeParseResult<Lib_Schema_ConfigSchema>;

/**
 * Worker - Index - Create Worker - Email.
 *
 * @since 1.0.0
 */
export type Worker_Index_CreateWorker_Email_Message = Pick<ForwardableEmailMessage, 'to' | 'from' | 'forward' | 'setReject'> & Partial<Pick<ForwardableEmailMessage, 'headers' | 'raw'>>;

export type Worker_Index_CreateWorker_Email_EnvMailmaskEmail = SendEmail | undefined;

export type Worker_Index_CreateWorker_Email_Env = {
  MAILMASK_EMAIL?: Worker_Index_CreateWorker_Email_EnvMailmaskEmail;
} | undefined;

export type Worker_Index_CreateWorker_Email_Context = Pick<ExecutionContext, 'waitUntil'>;

export type Worker_Index_CreateWorker_Email_Returns = Promise<void>;

/**
 * Worker - Index - Create Worker - Fetch.
 *
 * @since 1.1.0
 */
export type Worker_Index_CreateWorker_Fetch_Request = Request;

export type Worker_Index_CreateWorker_Fetch_EnvMailmaskEmail = SendEmail | undefined;

export type Worker_Index_CreateWorker_Fetch_Env = {
  MAILMASK_EMAIL?: Worker_Index_CreateWorker_Fetch_EnvMailmaskEmail;
} | undefined;

export type Worker_Index_CreateWorker_Fetch_Context = Pick<ExecutionContext, 'waitUntil'> | undefined;

export type Worker_Index_CreateWorker_Fetch_Returns = Promise<Response>;

export type Worker_Index_CreateWorker_Fetch_RequestUrl = URL;

export type Worker_Index_CreateWorker_Fetch_RedirectUrl = URL;

export type Worker_Index_CreateWorker_Fetch_PhoneWebhookMatch = RegExpMatchArray | null;

export type Worker_Index_CreateWorker_Fetch_PhoneMethodBody = string;

export type Worker_Index_CreateWorker_Fetch_UnavailableBody = string;

export type Worker_Index_CreateWorker_Fetch_RootResponse = Response;

export type Worker_Index_CreateWorker_Fetch_NotFoundBody = string;

export type Worker_Index_CreateWorker_Fetch_MethodNotAllowedBody = string;
