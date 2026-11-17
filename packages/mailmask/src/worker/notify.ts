import {
  buildEmailMessage,
  buildNotifierRequest,
  NOTIFICATION_TIMEOUT_MILLISECONDS,
} from '../lib/notification.js';

import type {
  Worker_Notify_RunWithTimeout_Controller,
  Worker_Notify_RunWithTimeout_Operation,
  Worker_Notify_RunWithTimeout_Returns,
  Worker_Notify_RunWithTimeout_Timeout,
  Worker_Notify_RunWithTimeout_TimeoutId,
  Worker_Notify_SendNotification_Controller,
  Worker_Notify_SendNotification_EmailBinding,
  Worker_Notify_SendNotification_EmailOperation,
  Worker_Notify_SendNotification_HttpOperation,
  Worker_Notify_SendNotification_Notifier,
  Worker_Notify_SendNotification_Payload,
  Worker_Notify_SendNotification_Request,
  Worker_Notify_SendNotification_Response,
  Worker_Notify_SendNotification_Returns,
  Worker_Notify_SendNotifications_EmailBinding,
  Worker_Notify_SendNotifications_ErrorMessage,
  Worker_Notify_SendNotifications_Notifier,
  Worker_Notify_SendNotifications_Notifiers,
  Worker_Notify_SendNotifications_Payload,
  Worker_Notify_SendNotifications_Reason,
  Worker_Notify_SendNotifications_Requests,
  Worker_Notify_SendNotifications_Result,
  Worker_Notify_SendNotifications_Results,
  Worker_Notify_SendNotifications_Returns,
} from '../types/worker/notify.d.ts';

/**
 * Worker - Notify - Run With Timeout.
 *
 * Bounds one notifier operation so fan-out always finishes. It also aborts
 * HTTP work when the deadline passes.
 *
 * @param {Worker_Notify_RunWithTimeout_Operation}  operation  - Operation.
 * @param {Worker_Notify_RunWithTimeout_Controller} controller - Controller.
 *
 * @returns {Worker_Notify_RunWithTimeout_Returns}
 *
 * @since 1.0.0
 */
async function runWithTimeout(operation: Worker_Notify_RunWithTimeout_Operation, controller: Worker_Notify_RunWithTimeout_Controller): Worker_Notify_RunWithTimeout_Returns {
  let timeoutId: Worker_Notify_RunWithTimeout_TimeoutId = undefined;
  const timeout: Worker_Notify_RunWithTimeout_Timeout = new Promise((resolvePromise) => {
    timeoutId = setTimeout(() => {
      controller.abort();

      resolvePromise();

      return;
    }, NOTIFICATION_TIMEOUT_MILLISECONDS);

    return;
  });

  try {
    await Promise.race([
      operation,
      timeout,
    ]);

    if (controller.signal.aborted === true) {
      throw new Error(`Notification timed out after ${String(NOTIFICATION_TIMEOUT_MILLISECONDS)} milliseconds.`);
    }
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }

  return;
}

/**
 * Worker - Notify - Send Notification.
 *
 * Sends one notification through its HTTP API or the Cloudflare send_email
 * binding. Non-success HTTP responses are treated as notifier failures.
 *
 * @param {Worker_Notify_SendNotification_Notifier}     notifier     - Notifier.
 * @param {Worker_Notify_SendNotification_Payload}      payload      - Payload.
 * @param {Worker_Notify_SendNotification_EmailBinding} emailBinding - Email binding.
 *
 * @returns {Worker_Notify_SendNotification_Returns}
 *
 * @since 1.0.0
 */
async function sendNotification(notifier: Worker_Notify_SendNotification_Notifier, payload: Worker_Notify_SendNotification_Payload, emailBinding: Worker_Notify_SendNotification_EmailBinding): Worker_Notify_SendNotification_Returns {
  const controller: Worker_Notify_SendNotification_Controller = new AbortController();

  if (notifier['type'] === 'email') {
    if (emailBinding === undefined) {
      throw new Error('The MAILMASK_EMAIL send_email binding is not configured.');
    }

    const emailOperation: Worker_Notify_SendNotification_EmailOperation = (async () => {
      try {
        await emailBinding.send(buildEmailMessage(notifier, payload));
      } catch {
        throw new Error('delivery failed.');
      }

      return;
    })();

    await runWithTimeout(emailOperation, controller);

    return;
  }

  const request: Worker_Notify_SendNotification_Request = buildNotifierRequest(notifier, payload);

  if (request === undefined) {
    throw new Error('does not have an HTTP request.');
  }

  const httpOperation: Worker_Notify_SendNotification_HttpOperation = (async () => {
    let response: Worker_Notify_SendNotification_Response = undefined;

    try {
      response = await fetch(request['url'], {
        method: request['method'],
        headers: request['headers'],
        body: request['body'],
        signal: controller.signal,
      });
    } catch {
      if (controller.signal.aborted === true) {
        return;
      }

      throw new Error('request failed.');
    }

    if (response['ok'] === false) {
      throw new Error(`returned HTTP ${String(response['status'])}.`);
    }

    return;
  })();

  await runWithTimeout(httpOperation, controller);

  return;
}

/**
 * Worker - Notify - Send Notifications.
 *
 * Fans a payload out to every notifier concurrently. Each notifier has its
 * own timeout, and every failure is isolated because notifications must never
 * affect mail routing.
 *
 * @param {Worker_Notify_SendNotifications_Notifiers}    notifiers    - Notifiers.
 * @param {Worker_Notify_SendNotifications_Payload}      payload      - Payload.
 * @param {Worker_Notify_SendNotifications_EmailBinding} emailBinding - Email binding.
 *
 * @returns {Worker_Notify_SendNotifications_Returns}
 *
 * @since 1.0.0
 */
async function sendNotifications(notifiers: Worker_Notify_SendNotifications_Notifiers, payload: Worker_Notify_SendNotifications_Payload, emailBinding?: Worker_Notify_SendNotifications_EmailBinding): Worker_Notify_SendNotifications_Returns {
  const requests: Worker_Notify_SendNotifications_Requests = notifiers.map(async (notifier) => {
    await sendNotification(notifier, payload, emailBinding);

    return;
  });

  const results: Worker_Notify_SendNotifications_Results = await Promise.allSettled(requests);

  for (let resultIndex = 0; resultIndex < results.length; resultIndex += 1) {
    const result: Worker_Notify_SendNotifications_Result = results[resultIndex];
    const notifier: Worker_Notify_SendNotifications_Notifier = notifiers[resultIndex];

    if (
      result === undefined
      || notifier === undefined
      || result['status'] !== 'rejected'
    ) {
      continue;
    }

    const reason: Worker_Notify_SendNotifications_Reason = result['reason'];
    const errorMessage: Worker_Notify_SendNotifications_ErrorMessage = (reason instanceof Error) ? reason.message : 'unknown notifier failure.';

    // eslint-disable-next-line no-console -- Cloudflare failures use warning-level Worker logs.
    console.warn(`Notifier "${notifier['name']}" (${notifier['type']}) failed: ${errorMessage}`);
  }

  return;
}

export {
  sendNotification,
  sendNotifications,
};
