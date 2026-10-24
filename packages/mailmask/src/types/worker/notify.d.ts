import type { Lib_Schema_NotifierConfig } from '../lib/schema.d.ts';

/**
 * Worker - Notify - Send Notifications.
 *
 * @since 0.0.1
 */
export type Worker_Notify_SendNotifications_Notifiers = Lib_Schema_NotifierConfig[];

export type Worker_Notify_SendNotifications_Title = string;

export type Worker_Notify_SendNotifications_Body = string;

export type Worker_Notify_SendNotifications_Returns = Promise<void>;

export type Worker_Notify_SendNotifications_Request = Promise<Response>;

export type Worker_Notify_SendNotifications_Requests = Worker_Notify_SendNotifications_Request[];

export type Worker_Notify_SendNotifications_Headers = Record<string, string>;
