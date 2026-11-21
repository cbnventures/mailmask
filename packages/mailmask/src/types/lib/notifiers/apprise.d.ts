import type {
  Shared_NotificationPayload,
  Shared_NotificationRequest,
  Shared_NotifierDependencies,
} from '../../shared.d.ts';
import type { Lib_Schema_AppriseNotifierConfig } from '../schema.d.ts';

export type Lib_Notifiers_Apprise_Runner_Notifier = Lib_Schema_AppriseNotifierConfig;

export type Lib_Notifiers_Apprise_Runner_BuildRequest_Payload = Shared_NotificationPayload;
export type Lib_Notifiers_Apprise_Runner_BuildRequest_Returns = Shared_NotificationRequest;

export type Lib_Notifiers_Apprise_Runner_Constructor_Notifier = Lib_Schema_AppriseNotifierConfig;

export type Lib_Notifiers_Apprise_Runner_Send_Payload = Shared_NotificationPayload;
export type Lib_Notifiers_Apprise_Runner_Send_Dependencies = Shared_NotifierDependencies;
export type Lib_Notifiers_Apprise_Runner_Send_Returns = Promise<void>;

export type Lib_Notifiers_Apprise_Runner_Validate_Value = unknown;
export type Lib_Notifiers_Apprise_Runner_Validate_Returns = boolean;
