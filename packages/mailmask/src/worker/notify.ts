import type {
  Worker_Notify_SendNotifications_Body,
  Worker_Notify_SendNotifications_Headers,
  Worker_Notify_SendNotifications_Notifiers,
  Worker_Notify_SendNotifications_Requests,
  Worker_Notify_SendNotifications_Returns,
  Worker_Notify_SendNotifications_Title,
} from '../types/worker/notify.d.ts';

/**
 * Worker - Notify - Send Notifications.
 *
 * Delivers a notice to every notifier: straight to an ntfy topic, or
 * to a Reverse Proxy for ntfy context. Failures are swallowed because a
 * notification must never affect mail handling.
 *
 * @param {Worker_Notify_SendNotifications_Notifiers} notifiers - Notifiers.
 * @param {Worker_Notify_SendNotifications_Title}     title     - Title.
 * @param {Worker_Notify_SendNotifications_Body}      body      - Body.
 *
 * @returns {Worker_Notify_SendNotifications_Returns}
 *
 * @since UNRELEASED
 */
async function sendNotifications(notifiers: Worker_Notify_SendNotifications_Notifiers, title: Worker_Notify_SendNotifications_Title, body: Worker_Notify_SendNotifications_Body): Worker_Notify_SendNotifications_Returns {
  const requests: Worker_Notify_SendNotifications_Requests = notifiers.map(async (notifier) => {
    if (notifier['type'] === 'ntfy') {
      return fetch(notifier['server'], {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notifier['token']}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: notifier['topic'],
          title,
          message: body,
          tags: ['email'],
          priority: 3,
        }),
      });
    }

    const headers: Worker_Notify_SendNotifications_Headers = {
      'Content-Type': 'text/plain; charset=utf-8',
      'Title': title,
      'Tags': 'email',
      'Priority': '3',
    };

    if (notifier['token'] !== undefined) {
      Reflect.set(headers, 'Authorization', `Bearer ${notifier['token']}`);
    }

    return fetch(notifier['url'], {
      method: 'POST',
      headers,
      body,
    });
  });

  // Notifications are best-effort, so rejected requests are ignored.
  await Promise.allSettled(requests);

  return;
}

export {
  sendNotifications,
};
