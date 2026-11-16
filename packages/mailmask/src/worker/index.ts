import { configSchema } from '../lib/schema.js';
import { handleEmail } from './handlers.js';
import { landingPage } from './landing/page.js';

import type {
  Worker_Index_CreateWorker_Email_Context,
  Worker_Index_CreateWorker_Email_Env,
  Worker_Index_CreateWorker_Email_Message,
  Worker_Index_CreateWorker_Email_Returns,
  Worker_Index_CreateWorker_Fetch_MethodNotAllowedBody,
  Worker_Index_CreateWorker_Fetch_NotFoundBody,
  Worker_Index_CreateWorker_Fetch_Request,
  Worker_Index_CreateWorker_Fetch_RequestUrl,
  Worker_Index_CreateWorker_Fetch_Returns,
  Worker_Index_CreateWorker_Fetch_RootResponse,
  Worker_Index_CreateWorker_RawConfig,
  Worker_Index_CreateWorker_Result,
  Worker_Index_CreateWorker_Returns,
} from '../types/worker/index.d.ts';

/**
 * Worker - Create Worker.
 *
 * Builds the Worker handlers around the config bundled at deploy time. The config is
 * validated once when the Worker starts instead of on every message.
 *
 * @param {Worker_Index_CreateWorker_RawConfig} rawConfig - Raw config.
 *
 * @returns {Worker_Index_CreateWorker_Returns}
 *
 * @since UNRELEASED
 */
function createWorker(rawConfig: Worker_Index_CreateWorker_RawConfig): Worker_Index_CreateWorker_Returns {
  const result: Worker_Index_CreateWorker_Result = configSchema.safeParse(rawConfig);

  return {
    async fetch(request: Worker_Index_CreateWorker_Fetch_Request): Worker_Index_CreateWorker_Fetch_Returns {
      const requestUrl: Worker_Index_CreateWorker_Fetch_RequestUrl = new URL(request['url']);

      if (
        (
          request['method'] === 'GET'
          || request['method'] === 'HEAD'
        )
      ) {
        if (requestUrl['pathname'] === '/') {
          const rootResponse: Worker_Index_CreateWorker_Fetch_RootResponse = landingPage();

          if (request['method'] === 'HEAD') {
            return new Response(null, rootResponse);
          }

          return rootResponse;
        }

        const notFoundBody: Worker_Index_CreateWorker_Fetch_NotFoundBody = JSON.stringify({
          status: 'error',
          message: 'Mailmask only handles inbound email.',
        }, null, 2);

        return new Response((request['method'] === 'HEAD') ? null : notFoundBody, {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const methodNotAllowedBody: Worker_Index_CreateWorker_Fetch_MethodNotAllowedBody = JSON.stringify({
        status: 'error',
        message: 'Method not allowed',
      }, null, 2);

      return new Response(methodNotAllowedBody, {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Allow': 'GET, HEAD',
        },
      });
    },
    async email(message: Worker_Index_CreateWorker_Email_Message, env: Worker_Index_CreateWorker_Email_Env, context: Worker_Index_CreateWorker_Email_Context): Worker_Index_CreateWorker_Email_Returns {
      // Never silently accept mail when the configuration cannot be trusted.
      if (result['success'] === false) {
        message.setReject('Temporary configuration error');

        return;
      }

      await handleEmail(message, result['data'], Date.now(), context, (env === undefined) ? undefined : env['MAILMASK_EMAIL']);

      return;
    },
  };
}

export {
  createWorker,
};
