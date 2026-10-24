import { configSchema } from '../lib/schema.js';
import { handleEmail } from './handlers.js';

import type {
  Worker_Index_Email_Aliases,
  Worker_Index_Email_AliasesJson,
  Worker_Index_Email_Destinations,
  Worker_Index_Email_Env,
  Worker_Index_Email_Message,
  Worker_Index_Email_Notifiers,
  Worker_Index_Email_Result,
  Worker_Index_Email_Returns,
  Worker_Index_Email_Settings,
  Worker_Index_Fetch_Returns,
  Worker_Index_ModuleExports,
} from '../types/worker/index.d.ts';

/**
 * Worker - Module Exports.
 *
 * Cloudflare Workers entry point. The email handler validates the
 * configuration from the environment and routes each message; the fetch
 * handler only answers health checks because the Worker has no routes.
 *
 * @since UNRELEASED
 */
const moduleExports: Worker_Index_ModuleExports = {
  async fetch(): Worker_Index_Fetch_Returns {
    return new Response('Mailmask only handles inbound email.\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  },
  async email(message: Worker_Index_Email_Message, env: Worker_Index_Email_Env): Worker_Index_Email_Returns {
    let settings: Worker_Index_Email_Settings = undefined;
    let destinations: Worker_Index_Email_Destinations = undefined;
    let aliases: Worker_Index_Email_Aliases = undefined;
    let notifiers: Worker_Index_Email_Notifiers = undefined;
    let aliasesJson: Worker_Index_Email_AliasesJson = '';

    // Aliases are split across ALIASES_1..ALIASES_n to stay under the per-var size limit.
    for (let i = 1; i <= Number(env['ALIASES_PARTS'] ?? '0'); i += 1) {
      aliasesJson += env[`ALIASES_${String(i)}`] ?? '';
    }

    try {
      settings = JSON.parse(env['SETTINGS'] ?? '');
      destinations = JSON.parse(env['DESTINATIONS'] ?? '');
      aliases = JSON.parse(aliasesJson);
      notifiers = JSON.parse(env['NOTIFIERS'] ?? '[]');
    } catch {
      message.setReject('Temporary configuration error');

      return;
    }

    const result: Worker_Index_Email_Result = configSchema.safeParse({
      destinations,
      aliases,
      notifiers,
      settings,
    });

    // Never silently accept mail when the configuration cannot be trusted.
    if (result['success'] === false) {
      message.setReject('Temporary configuration error');

      return;
    }

    await handleEmail(message, result['data'], Date.now());

    return;
  },
};

export default moduleExports;
