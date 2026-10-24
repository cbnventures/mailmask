import type { z } from 'zod';

import type { Lib_Schema_ConfigSchema } from '../lib/schema.d.ts';

/**
 * Worker - Index - Module Exports.
 *
 * @since UNRELEASED
 */
export type Worker_Index_ModuleExports_FetchReturns = Promise<Response>;

export type Worker_Index_ModuleExports_Fetch = () => Worker_Index_ModuleExports_FetchReturns;

export type Worker_Index_ModuleExports_EmailMessage = ForwardableEmailMessage;

export type Worker_Index_ModuleExports_EmailEnv = Record<string, string | undefined>;

export type Worker_Index_ModuleExports_EmailReturns = Promise<void>;

export type Worker_Index_ModuleExports_Email = (message: Worker_Index_ModuleExports_EmailMessage, env: Worker_Index_ModuleExports_EmailEnv) => Worker_Index_ModuleExports_EmailReturns;

export type Worker_Index_ModuleExports = {
  fetch: Worker_Index_ModuleExports_Fetch;
  email: Worker_Index_ModuleExports_Email;
};

/**
 * Worker - Index - Email.
 *
 * @since UNRELEASED
 */
export type Worker_Index_Email_Message = ForwardableEmailMessage;

export type Worker_Index_Email_Env = Record<string, string | undefined>;

export type Worker_Index_Email_Returns = Promise<void>;

export type Worker_Index_Email_Settings = unknown;

export type Worker_Index_Email_Destinations = unknown;

export type Worker_Index_Email_Aliases = unknown;

export type Worker_Index_Email_Notifiers = unknown;

export type Worker_Index_Email_AliasesJson = string;

export type Worker_Index_Email_Result = z.ZodSafeParseResult<Lib_Schema_ConfigSchema>;

/**
 * Worker - Index - Fetch.
 *
 * @since UNRELEASED
 */
export type Worker_Index_Fetch_Returns = Promise<Response>;
