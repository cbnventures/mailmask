import { buildTextRefusalNotification } from '../lib/notification.js';
import { getPhoneProviderAdapter } from '../lib/phone-provider.js';
import { sendNotifications } from './notify.js';
import { resolvePhoneRoute } from './phone-router.js';

import type {
  Worker_PhoneHandlers_ErrorResponse_Body,
  Worker_PhoneHandlers_ErrorResponse_Message,
  Worker_PhoneHandlers_ErrorResponse_Returns,
  Worker_PhoneHandlers_ErrorResponse_Status,
  Worker_PhoneHandlers_HandlePhoneWebhook_Adapter,
  Worker_PhoneHandlers_HandlePhoneWebhook_Config,
  Worker_PhoneHandlers_HandlePhoneWebhook_Context,
  Worker_PhoneHandlers_HandlePhoneWebhook_Decision,
  Worker_PhoneHandlers_HandlePhoneWebhook_EmailBinding,
  Worker_PhoneHandlers_HandlePhoneWebhook_ErrorMessage,
  Worker_PhoneHandlers_HandlePhoneWebhook_InboundMessage,
  Worker_PhoneHandlers_HandlePhoneWebhook_Now,
  Worker_PhoneHandlers_HandlePhoneWebhook_Payload,
  Worker_PhoneHandlers_HandlePhoneWebhook_Provider,
  Worker_PhoneHandlers_HandlePhoneWebhook_ProviderName,
  Worker_PhoneHandlers_HandlePhoneWebhook_Request,
  Worker_PhoneHandlers_HandlePhoneWebhook_Returns,
  Worker_PhoneHandlers_HandlePhoneWebhook_Verified,
  Worker_PhoneHandlers_HandlePhoneWebhook_Webhook,
  Worker_PhoneHandlers_ReplyResponse_Reply,
  Worker_PhoneHandlers_ReplyResponse_Returns,
} from '../types/worker/phone-handlers.d.ts';

/**
 * Worker - Phone Handlers - Handle Phone Webhook.
 *
 * Handles one provider webhook: checks its signature, then forwards an inbound
 * text to the destination phone, sends the user's own text on through the alias,
 * or drops it. Refusals on known numbers notify.
 *
 * @param {Worker_PhoneHandlers_HandlePhoneWebhook_Request}      request        - Request.
 * @param {Worker_PhoneHandlers_HandlePhoneWebhook_ProviderName} providerName   - Provider name.
 * @param {Worker_PhoneHandlers_HandlePhoneWebhook_Config}       config         - Config.
 * @param {Worker_PhoneHandlers_HandlePhoneWebhook_Now}          now            - Now.
 * @param {Worker_PhoneHandlers_HandlePhoneWebhook_Context}      context        - Context.
 * @param {Worker_PhoneHandlers_HandlePhoneWebhook_EmailBinding} [emailBinding] - Email binding.
 *
 * @returns {Worker_PhoneHandlers_HandlePhoneWebhook_Returns}
 *
 * @since 1.2.0
 */
async function handlePhoneWebhook(request: Worker_PhoneHandlers_HandlePhoneWebhook_Request, providerName: Worker_PhoneHandlers_HandlePhoneWebhook_ProviderName, config: Worker_PhoneHandlers_HandlePhoneWebhook_Config, now: Worker_PhoneHandlers_HandlePhoneWebhook_Now, context: Worker_PhoneHandlers_HandlePhoneWebhook_Context, emailBinding?: Worker_PhoneHandlers_HandlePhoneWebhook_EmailBinding): Worker_PhoneHandlers_HandlePhoneWebhook_Returns {
  const provider: Worker_PhoneHandlers_HandlePhoneWebhook_Provider = (config['phone_providers'] ?? []).find((configProvider) => configProvider['name'] === providerName);

  if (provider === undefined) {
    return errorResponse(404, 'Phone provider not found.');
  }

  const adapter: Worker_PhoneHandlers_HandlePhoneWebhook_Adapter = getPhoneProviderAdapter(provider['type']);
  const webhook: Worker_PhoneHandlers_HandlePhoneWebhook_Webhook = {
    url: request['url'],
    headers: request['headers'],
    body: await request.text(),
  };
  const verified: Worker_PhoneHandlers_HandlePhoneWebhook_Verified = await adapter.verifyWebhook(provider, webhook, now);

  if (verified === false) {
    return errorResponse(401, 'Invalid webhook signature.');
  }

  const inboundMessage: Worker_PhoneHandlers_HandlePhoneWebhook_InboundMessage = adapter.parseInboundMessage(webhook);

  // Delivery receipts for sent texts reach the same URL and need no work.
  if (inboundMessage === undefined) {
    return replyResponse(adapter.acknowledgeMessage());
  }

  const decision: Worker_PhoneHandlers_HandlePhoneWebhook_Decision = resolvePhoneRoute(inboundMessage['to'], inboundMessage['from'], inboundMessage['text'], providerName, config, now);

  if (
    decision['action'] !== 'reject'
    && decision['aliasNumber'] !== undefined
    && decision['recipient'] !== undefined
  ) {
    try {
      await adapter.sendMessage(provider, {
        from: decision['aliasNumber'],
        to: decision['recipient'],
        text: decision['text'] ?? '',
        mediaUrls: (decision['action'] === 'help') ? [] : inboundMessage['mediaUrls'],
      });
    } catch (error) {
      const errorMessage: Worker_PhoneHandlers_HandlePhoneWebhook_ErrorMessage = (error instanceof Error) ? error['message'] : 'unknown failure.';

      // eslint-disable-next-line no-console -- Cloudflare failures use warning-level Worker logs.
      console.warn(`Phone alias "${decision['aliasNumber']}" could not ${decision['action']} a text: ${errorMessage}`);

      // A failed forward asks the provider to retry; a failed send tells the user's phone instead.
      if (decision['action'] === 'forward') {
        return errorResponse(502, 'Forwarding failed.');
      }

      if (decision['action'] === 'send') {
        try {
          await adapter.sendMessage(provider, {
            from: decision['aliasNumber'],
            to: inboundMessage['from'],
            text: `Mailmask could not send your text to ${decision['recipient']}: ${errorMessage}`,
            mediaUrls: [],
          });
        } catch {
          // The provider already refused one text, so the user's phone may be unreachable too.
        }
      }
    }

    return replyResponse(adapter.acknowledgeMessage());
  }

  // Only refusals on known numbers notify; texts to unknown numbers are mostly spam.
  if (decision['aliasNumber'] !== undefined) {
    const payload: Worker_PhoneHandlers_HandlePhoneWebhook_Payload = buildTextRefusalNotification(decision['aliasNumber'], inboundMessage['from'], decision['reason'], now);

    context.waitUntil(sendNotifications(config['notifiers'], payload, emailBinding));
  }

  return replyResponse(adapter.acknowledgeMessage());
}

/**
 * Worker - Phone Handlers - Error Response.
 *
 * Builds the JSON error body the Worker uses for every HTTP answer, so
 * provider webhook failures read the same as the other routes.
 *
 * @param {Worker_PhoneHandlers_ErrorResponse_Status}  status  - Status.
 * @param {Worker_PhoneHandlers_ErrorResponse_Message} message - Message.
 *
 * @returns {Worker_PhoneHandlers_ErrorResponse_Returns}
 *
 * @since 1.2.0
 */
function errorResponse(status: Worker_PhoneHandlers_ErrorResponse_Status, message: Worker_PhoneHandlers_ErrorResponse_Message): Worker_PhoneHandlers_ErrorResponse_Returns {
  const body: Worker_PhoneHandlers_ErrorResponse_Body = JSON.stringify({
    status: 'error',
    message,
  }, null, 2);

  return new Response(body, {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Worker - Phone Handlers - Reply Response.
 *
 * Turns a provider adapter's reply into the HTTP response, so the adapters stay
 * free of runtime-specific Response objects and can run in the CLI too.
 *
 * @param {Worker_PhoneHandlers_ReplyResponse_Reply} reply - Reply.
 *
 * @returns {Worker_PhoneHandlers_ReplyResponse_Returns}
 *
 * @since 1.2.0
 */
function replyResponse(reply: Worker_PhoneHandlers_ReplyResponse_Reply): Worker_PhoneHandlers_ReplyResponse_Returns {
  return new Response(reply['body'], {
    status: 200,
    headers: { 'Content-Type': reply['contentType'] },
  });
}

export {
  handlePhoneWebhook,
};
