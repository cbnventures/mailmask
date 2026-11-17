import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { buildTestNotification } from '../../lib/notification.js';
import { sendNotifications } from '../../worker/notify.js';

import type {
  Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_ConsoleWarnSpy,
  Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_FetchSpy,
  Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_Notifiers,
  Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_Payload,
  Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_ConsoleWarnSpy,
  Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_FetchSpy,
  Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_Notifiers,
  Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_Payload,
  Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_ConsoleWarnSpy,
  Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_FetchSpy,
  Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_Notifiers,
  Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_Payload,
  Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_ConsoleWarnSpy,
  Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_FetchSpy,
  Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Notifiers,
  Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Payload,
  Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Promise,
} from '../../types/tests/worker/notify.test.d.ts';

afterEach(() => {
  vi.useRealTimers();

  vi.restoreAllMocks();

  return;
});

/**
 * Tests - Worker - Notify - Send Notifications.
 *
 * @since 1.0.0
 */
describe('sendNotifications', () => {
  it('isolates one notifier failure from the rest of the fan-out', async () => {
    const payload: Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_Payload = buildTestNotification(Date.parse('2026-11-05T12:00:00.000Z'));
    const notifiers: Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_Notifiers = [
      {
        type: 'webhook',
        name: 'broken',
        url: 'https://broken.example.com/mailmask',
      },
      {
        type: 'webhook',
        name: 'working',
        url: 'https://working.example.com/mailmask',
      },
    ];
    const fetchSpy: Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_FetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(new Response('ok'));
    const consoleWarnSpy: Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_ConsoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await expect(sendNotifications(notifiers, payload)).resolves.toBeUndefined();

    expect(fetchSpy).toHaveBeenCalledTimes(2);

    expect(fetchSpy).toHaveBeenCalledWith('https://working.example.com/mailmask', expect.objectContaining({ body: JSON.stringify(payload) }));

    expect(consoleWarnSpy).toHaveBeenCalledOnce();

    expect(consoleWarnSpy).toHaveBeenCalledWith('Notifier "broken" (webhook) failed: request failed.');

    return;
  });

  it('does not expose Telegram bot tokens in failure logs', async () => {
    const payload: Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_Payload = buildTestNotification(Date.parse('2026-11-05T12:00:00.000Z'));
    const notifiers: Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_Notifiers = [{
      type: 'telegram',
      name: 'phone',
      bot_token: '123456:secret-bot-token',
      chat_id: '-1001234567890',
    }];
    const fetchSpy: Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('unauthorized', { status: 401 }));
    const consoleWarnSpy: Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_ConsoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await expect(sendNotifications(notifiers, payload)).resolves.toBeUndefined();

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    expect(consoleWarnSpy).toHaveBeenCalledWith('Notifier "phone" (telegram) failed: returned HTTP 401.');

    expect(JSON.stringify(consoleWarnSpy.mock.calls)).not.toContain('123456:secret-bot-token');

    return;
  });

  it('logs nothing for successful notifiers', async () => {
    const payload: Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_Payload = buildTestNotification(Date.parse('2026-11-05T12:00:00.000Z'));
    const notifiers: Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_Notifiers = [{
      type: 'webhook',
      name: 'working',
      url: 'https://working.example.com/mailmask',
    }];
    const fetchSpy: Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    const consoleWarnSpy: Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_ConsoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await expect(sendNotifications(notifiers, payload)).resolves.toBeUndefined();

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    expect(consoleWarnSpy).not.toHaveBeenCalled();

    return;
  });

  it('stops waiting for a notifier after the timeout', async () => {
    vi.useFakeTimers();

    const payload: Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Payload = buildTestNotification(Date.parse('2026-11-05T12:00:00.000Z'));
    const notifiers: Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Notifiers = [{
      type: 'webhook',
      name: 'slow',
      url: 'https://slow.example.com/mailmask',
    }];
    const fetchSpy: Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    const consoleWarnSpy: Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_ConsoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const promise: Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Promise = sendNotifications(notifiers, payload);

    await vi.advanceTimersByTimeAsync(10_000);

    await expect(promise).resolves.toBeUndefined();

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    expect(consoleWarnSpy).toHaveBeenCalledWith('Notifier "slow" (webhook) failed: Notification timed out after 10000 milliseconds.');

    return;
  });

  return;
});
