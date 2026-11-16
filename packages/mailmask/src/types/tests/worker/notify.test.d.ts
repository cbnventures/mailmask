import type { MockInstance } from 'vitest';

import type { Lib_Schema_NotifierConfig } from '../../lib/schema.d.ts';
import type { Shared_NotificationPayload } from '../../shared.d.ts';

/**
 * Tests - Worker - Notify - Send Notifications - Does Not Expose Telegram Bot Tokens In Failure Logs.
 *
 * @since UNRELEASED
 */
export type Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_Payload = { [Key in keyof Shared_NotificationPayload]: Shared_NotificationPayload[Key] };

export type Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_Notifier = Lib_Schema_NotifierConfig & {};

export type Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_Notifiers = Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_Notifier[];

export type Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_Notify_SendNotifications_DoesNotExposeTelegramBotTokensInFailureLogs_ConsoleWarnSpy = MockInstance<typeof console.warn>;

/**
 * Tests - Worker - Notify - Send Notifications - Isolates One Notifier Failure From The Rest Of The Fan Out.
 *
 * @since UNRELEASED
 */
export type Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_Payload = { [Key in keyof Shared_NotificationPayload]: Shared_NotificationPayload[Key] };

export type Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_Notifier = Lib_Schema_NotifierConfig & {};

export type Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_Notifiers = Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_Notifier[];

export type Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_Notify_SendNotifications_IsolatesOneNotifierFailureFromTheRestOfTheFanOut_ConsoleWarnSpy = MockInstance<typeof console.warn>;

/**
 * Tests - Worker - Notify - Send Notifications - Logs Nothing For Successful Notifiers.
 *
 * @since UNRELEASED
 */
export type Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_Payload = { [Key in keyof Shared_NotificationPayload]: Shared_NotificationPayload[Key] };

export type Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_Notifier = Lib_Schema_NotifierConfig & {};

export type Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_Notifiers = Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_Notifier[];

export type Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_Notify_SendNotifications_LogsNothingForSuccessfulNotifiers_ConsoleWarnSpy = MockInstance<typeof console.warn>;

/**
 * Tests - Worker - Notify - Send Notifications - Stops Waiting For A Notifier After The Timeout.
 *
 * @since UNRELEASED
 */
export type Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Payload = { [Key in keyof Shared_NotificationPayload]: Shared_NotificationPayload[Key] };

export type Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Notifier = Lib_Schema_NotifierConfig & {};

export type Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Notifiers = Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Notifier[];

export type Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_ConsoleWarnSpy = MockInstance<typeof console.warn>;

export type Tests_Worker_Notify_SendNotifications_StopsWaitingForANotifierAfterTheTimeout_Promise = Promise<void>;
