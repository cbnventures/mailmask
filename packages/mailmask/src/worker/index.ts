import { LIB_REGEX_PHONE_WEBHOOK_PATH } from '../lib/regex.js';
import { configSchema } from '../lib/schema.js';
import { handleEmail } from './handlers.js';
import { landingPage } from './landing/page.js';
import { handlePhoneWebhook } from './phone-handlers.js';

import type {
  Worker_Index_CreateWorker_Email_Context,
  Worker_Index_CreateWorker_Email_Env,
  Worker_Index_CreateWorker_Email_Message,
  Worker_Index_CreateWorker_Email_Returns,
  Worker_Index_CreateWorker_EmailMessageConstructor,
  Worker_Index_CreateWorker_Fetch_Context,
  Worker_Index_CreateWorker_Fetch_Env,
  Worker_Index_CreateWorker_Fetch_MethodNotAllowedBody,
  Worker_Index_CreateWorker_Fetch_NotFoundBody,
  Worker_Index_CreateWorker_Fetch_PhoneMethodBody,
  Worker_Index_CreateWorker_Fetch_PhoneWebhookMatch,
  Worker_Index_CreateWorker_Fetch_RedirectUrl,
  Worker_Index_CreateWorker_Fetch_Request,
  Worker_Index_CreateWorker_Fetch_RequestUrl,
  Worker_Index_CreateWorker_Fetch_Returns,
  Worker_Index_CreateWorker_Fetch_RootResponse,
  Worker_Index_CreateWorker_Fetch_UnavailableBody,
  Worker_Index_CreateWorker_RawConfig,
  Worker_Index_CreateWorker_Result,
  Worker_Index_CreateWorker_Returns,
} from '../types/worker/index.d.ts';

/**
 * Worker - Create Worker.
 *
 * Builds the Worker handlers around the config bundled at deploy time. The config is
 * validated once at start, and the generated entry passes Cloudflare's EmailMessage.
 *
 * @param {Worker_Index_CreateWorker_RawConfig}               rawConfig                 - Raw config.
 * @param {Worker_Index_CreateWorker_EmailMessageConstructor} [emailMessageConstructor] - Email message constructor.
 *
 * @returns {Worker_Index_CreateWorker_Returns}
 *
 * @since 1.2.0
 */
function createWorker(rawConfig: Worker_Index_CreateWorker_RawConfig, emailMessageConstructor?: Worker_Index_CreateWorker_EmailMessageConstructor): Worker_Index_CreateWorker_Returns {
  const result: Worker_Index_CreateWorker_Result = configSchema.safeParse(rawConfig);

  return {
    async fetch(request: Worker_Index_CreateWorker_Fetch_Request, env?: Worker_Index_CreateWorker_Fetch_Env, context?: Worker_Index_CreateWorker_Fetch_Context): Worker_Index_CreateWorker_Fetch_Returns {
      const requestUrl: Worker_Index_CreateWorker_Fetch_RequestUrl = new URL(request['url']);

      // Deploy attaches the www host too, so send it to the bare domain with the path and query intact.
      if (result['success'] === true && requestUrl['hostname'] === `www.${result['data']['settings']['base_domain']}`) {
        const redirectUrl: Worker_Index_CreateWorker_Fetch_RedirectUrl = new URL(requestUrl['href']);

        Reflect.set(redirectUrl, 'hostname', result['data']['settings']['base_domain']);

        return Response.redirect(redirectUrl['href'], 301);
      }

      const phoneWebhookMatch: Worker_Index_CreateWorker_Fetch_PhoneWebhookMatch = requestUrl['pathname'].match(LIB_REGEX_PHONE_WEBHOOK_PATH);

      // Telnyx and Plivo post texts for phone aliases to "/phone/<provider>/messages".
      if (phoneWebhookMatch !== null && phoneWebhookMatch[1] !== undefined) {
        if (request['method'] !== 'POST') {
          const phoneMethodBody: Worker_Index_CreateWorker_Fetch_PhoneMethodBody = JSON.stringify({
            status: 'error',
            message: 'Method not allowed',
          }, null, 2);

          return new Response(phoneMethodBody, {
            status: 405,
            headers: {
              'Content-Type': 'application/json',
              'Allow': 'POST',
            },
          });
        }

        // Never answer a provider with success when the configuration cannot be trusted.
        if (result['success'] === false || context === undefined) {
          const unavailableBody: Worker_Index_CreateWorker_Fetch_UnavailableBody = JSON.stringify({
            status: 'error',
            message: 'Temporary configuration error',
          }, null, 2);

          return new Response(unavailableBody, {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return handlePhoneWebhook(request, phoneWebhookMatch[1], result['data'], Date.now(), context, (env === undefined) ? undefined : env['MAILMASK_EMAIL']);
      }

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

      await handleEmail(message, result['data'], Date.now(), context, (env === undefined) ? undefined : env['MAILMASK_EMAIL'], emailMessageConstructor);

      return;
    },
  };
}

export {
  createWorker,
};
