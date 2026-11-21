import type {
  Shared_NotificationEmailMessage,
  Shared_NotificationPayload,
  Shared_NotifierDependencies,
} from '../../shared.d.ts';
import type { Lib_Schema_EmailNotifierConfig } from '../schema.d.ts';

export type Lib_Notifiers_Email_Runner_Notifier = Lib_Schema_EmailNotifierConfig;

export type Lib_Notifiers_Email_Runner_BuildMessage_Payload = Shared_NotificationPayload;
export type Lib_Notifiers_Email_Runner_BuildMessage_Returns = Shared_NotificationEmailMessage;

export type Lib_Notifiers_Email_Runner_Constructor_Notifier = Lib_Schema_EmailNotifierConfig;

export type Lib_Notifiers_Email_Runner_Send_Payload = Shared_NotificationPayload;
export type Lib_Notifiers_Email_Runner_Send_Dependencies = Shared_NotifierDependencies;
export type Lib_Notifiers_Email_Runner_Send_Returns = Promise<void>;

export type Lib_Notifiers_Email_Runner_Validate_Value = unknown;
export type Lib_Notifiers_Email_Runner_Validate_Returns = boolean;
