import type {
  Shared_NotificationEmailMessage,
  Shared_NotificationPayload,
  Shared_NotificationPayload_DetailsReason,
  Shared_NotificationRequest,
} from '../shared.d.ts';
import type {
  Lib_Schema_EmailNotifierConfig,
  Lib_Schema_NotifierConfig,
} from './schema.d.ts';

/**
 * Lib - Notification - Build Email Message.
 *
 * @since 1.0.0
 */
export type Lib_Notification_BuildEmailMessage_Notifier = Lib_Schema_EmailNotifierConfig;

export type Lib_Notification_BuildEmailMessage_Payload = Shared_NotificationPayload;

export type Lib_Notification_BuildEmailMessage_Returns = Shared_NotificationEmailMessage;

/**
 * Lib - Notification - Build Notifier Request.
 *
 * @since 1.0.0
 */
export type Lib_Notification_BuildNotifierRequest_Notifier = Lib_Schema_NotifierConfig;

export type Lib_Notification_BuildNotifierRequest_Payload = Shared_NotificationPayload;

export type Lib_Notification_BuildNotifierRequest_Returns = Shared_NotificationRequest | undefined;

/**
 * Lib - Notification - Build Refusal Notification.
 *
 * @since 1.0.0
 */
export type Lib_Notification_BuildRefusalNotification_Alias = string;

export type Lib_Notification_BuildRefusalNotification_EnvelopeSender = string;

export type Lib_Notification_BuildRefusalNotification_Recipient = string;

export type Lib_Notification_BuildRefusalNotification_Reason = string;

export type Lib_Notification_BuildRefusalNotification_Action = 'reject' | 'drop';

export type Lib_Notification_BuildRefusalNotification_OccurredAt = number;

export type Lib_Notification_BuildRefusalNotification_Returns = Shared_NotificationPayload;

export type Lib_Notification_BuildRefusalNotification_ReasonCode = Shared_NotificationPayload_DetailsReason;

export type Lib_Notification_BuildRefusalNotification_ActionDescription = string;

export type Lib_Notification_BuildRefusalNotification_Message = string;

/**
 * Lib - Notification - Build Test Notification.
 *
 * @since 1.0.0
 */
export type Lib_Notification_BuildTestNotification_OccurredAt = number | undefined;

export type Lib_Notification_BuildTestNotification_Returns = Shared_NotificationPayload;

/**
 * Lib - Notification - Build Text Refusal Notification.
 *
 * @since 1.2.0
 */
export type Lib_Notification_BuildTextRefusalNotification_Alias = string;

export type Lib_Notification_BuildTextRefusalNotification_Sender = string;

export type Lib_Notification_BuildTextRefusalNotification_Reason = string;

export type Lib_Notification_BuildTextRefusalNotification_OccurredAt = number;

export type Lib_Notification_BuildTextRefusalNotification_Returns = Shared_NotificationPayload;

export type Lib_Notification_BuildTextRefusalNotification_ReasonCode = Shared_NotificationPayload_DetailsReason;
