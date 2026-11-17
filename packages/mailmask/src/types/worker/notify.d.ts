import type { Lib_Schema_NotifierConfig } from '../lib/schema.d.ts';
import type {
  Shared_NotificationPayload,
  Shared_NotificationRequest,
} from '../shared.d.ts';

/**
 * Worker - Notify - Run With Timeout.
 *
 * @since 1.0.0
 */
export type Worker_Notify_RunWithTimeout_Operation = Promise<unknown>;

export type Worker_Notify_RunWithTimeout_Controller = AbortController;

export type Worker_Notify_RunWithTimeout_Returns = Promise<void>;

export type Worker_Notify_RunWithTimeout_TimeoutId = ReturnType<typeof setTimeout> | undefined;

export type Worker_Notify_RunWithTimeout_Timeout = Promise<void>;

/**
 * Worker - Notify - Send Notification.
 *
 * @since 1.0.0
 */
export type Worker_Notify_SendNotification_Notifier = Lib_Schema_NotifierConfig;

export type Worker_Notify_SendNotification_Payload = Shared_NotificationPayload;

export type Worker_Notify_SendNotification_EmailBinding = SendEmail | undefined;

export type Worker_Notify_SendNotification_Returns = Promise<void>;

export type Worker_Notify_SendNotification_Controller = AbortController;

export type Worker_Notify_SendNotification_EmailOperation = Promise<unknown>;

export type Worker_Notify_SendNotification_Request = Shared_NotificationRequest | undefined;

export type Worker_Notify_SendNotification_HttpOperation = Promise<unknown>;

export type Worker_Notify_SendNotification_Response = Response | undefined;

/**
 * Worker - Notify - Send Notifications.
 *
 * @since 1.0.0
 */
export type Worker_Notify_SendNotifications_Notifiers = Lib_Schema_NotifierConfig[];

export type Worker_Notify_SendNotifications_Payload = Shared_NotificationPayload;

export type Worker_Notify_SendNotifications_EmailBinding = SendEmail | undefined;

export type Worker_Notify_SendNotifications_Returns = Promise<void>;

export type Worker_Notify_SendNotifications_Request = Promise<void>;

export type Worker_Notify_SendNotifications_Requests = Worker_Notify_SendNotifications_Request[];

export type Worker_Notify_SendNotifications_Results = PromiseSettledResult<void>[];

export type Worker_Notify_SendNotifications_Result = PromiseSettledResult<void> | undefined;

export type Worker_Notify_SendNotifications_Notifier = Lib_Schema_NotifierConfig | undefined;

export type Worker_Notify_SendNotifications_Reason = unknown;

export type Worker_Notify_SendNotifications_ErrorMessage = string;
