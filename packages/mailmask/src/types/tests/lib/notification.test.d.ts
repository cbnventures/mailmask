import type { MockInstance } from 'vitest';

import type {
  Shared_NotificationEmailMessage,
  Shared_NotificationPayload,
  Shared_NotificationRequest,
} from '../../shared.d.ts';

/**
 * Tests - Lib - Notification - Build Notifier Request - Builds Every Service Request In Its Official API Shape.
 *
 * @since 1.0.0
 */
export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_Payload = { [Key in keyof Shared_NotificationPayload]: Shared_NotificationPayload[Key] };

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_DateNowSpy = MockInstance<typeof Date.now>;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_MathRandomSpy = MockInstance<typeof Math.random>;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_AppriseRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_DiscordRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_GotifyRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_MatrixRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_NtfyRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_ProxyRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_PushoverRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_SlackRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_TelegramRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_WebhookRequest = { [Key in keyof Shared_NotificationRequest]: Shared_NotificationRequest[Key] } | undefined;

export type Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_EmailMessage = { [Key in keyof Shared_NotificationEmailMessage]: Shared_NotificationEmailMessage[Key] };

/**
 * Tests - Lib - Notification - Build Refusal Notification - Builds The Exact Versioned Mailmask Payload.
 *
 * @since 1.0.0
 */
export type Tests_Lib_Notification_BuildRefusalNotification_BuildsTheExactVersionedMailmaskPayload_Payload = { [Key in keyof Shared_NotificationPayload]: Shared_NotificationPayload[Key] };
