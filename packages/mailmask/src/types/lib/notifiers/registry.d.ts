import type {
  Shared_HttpNotifier,
  Shared_Notifier,
} from '../../shared.d.ts';
import type { Lib_Schema_NotifierConfig } from '../schema.d.ts';

export type Lib_Notifiers_Registry_Runner_Create_Notifier = Lib_Schema_NotifierConfig;
export type Lib_Notifiers_Registry_Runner_Create_Returns = Shared_Notifier;

export type Lib_Notifiers_Registry_Runner_CreateHttp_Notifier = Lib_Schema_NotifierConfig;
export type Lib_Notifiers_Registry_Runner_CreateHttp_Returns = Shared_HttpNotifier;

export type Lib_Notifiers_Registry_Runner_Validate_Value = unknown;
export type Lib_Notifiers_Registry_Runner_Validate_Returns = boolean;
