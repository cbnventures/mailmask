import type { Mock, MockInstance } from 'vitest';

import type { Lib_Schema_ConfigSchema } from '../../lib/schema.d.ts';

/**
 * Tests - Worker - Handlers.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Handlers_Now = number;

export type Tests_Worker_Handlers_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Handlers - Handle Email - Forwards With Identifying Headers.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message_To = string;

export type Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message_From = string;

export type Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message = {
  to: Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message_To;
  from: Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message_From;
  forward: Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message_Forward;
  setReject: Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message_SetReject;
};

export type Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_ForwardHeaders = Headers;

/**
 * Tests - Worker - Handlers - Handle Email - Notifies When A Known Alias Refuses Mail.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message_To = string;

export type Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message_From = string;

export type Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message = {
  to: Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message_To;
  from: Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message_From;
  forward: Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message_Forward;
  setReject: Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message_SetReject;
};

export type Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - Worker - Handlers - Handle Email - Rejects Unknown Recipients Without Notifying.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message_To = string;

export type Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message_From = string;

export type Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message = {
  to: Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message_To;
  from: Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message_From;
  forward: Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message_Forward;
  setReject: Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message_SetReject;
};

export type Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_FetchSpy = MockInstance<typeof fetch>;

/**
 * Tests - Worker - Handlers - Handle Email - Still Rejects When The Notification Fails.
 *
 * @since 0.0.1
 */
export type Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message_To = string;

export type Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message_From = string;

export type Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message = {
  to: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message_To;
  from: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message_From;
  forward: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message_Forward;
  setReject: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message_SetReject;
};

export type Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Config = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_FetchSpy = MockInstance<typeof fetch>;
