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

export type Lib_Notification_BuildNotifierRequest_BearerHeaders = Record<string, string>;

export type Lib_Notification_BuildNotifierRequest_TransactionId = string;

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
 * Lib - Notification - Escape Slack.
 *
 * @since 1.0.0
 */
export type Lib_Notification_EscapeSlack_Value = string;

export type Lib_Notification_EscapeSlack_Returns = string;

/**
 * Lib - Notification - Trim Trailing Slashes.
 *
 * @since 1.0.0
 */
export type Lib_Notification_TrimTrailingSlashes_Value = string;

export type Lib_Notification_TrimTrailingSlashes_Returns = string;

export type Lib_Notification_TrimTrailingSlashes_Trimmed = string;
