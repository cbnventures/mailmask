import type { MockInstance } from 'vitest';

import type {
  Lib_Schema_ConfigSchema,
  Lib_Schema_NotifierConfig,
} from '../../../lib/schema.d.ts';

/**
 * Tests - CLI - Commands - Notifier.
 *
 * @since 1.0.0
 */
export type Tests_Cli_Commands_Notifier_TestConfigPath = string;

export type Tests_Cli_Commands_Notifier_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Tests_Cli_Commands_Notifier_Notifier = Lib_Schema_NotifierConfig & {};

export type Tests_Cli_Commands_Notifier_Notifiers = Tests_Cli_Commands_Notifier_Notifier[];

/**
 * Tests - CLI - Commands - Notifier - Notifier Commands.
 *
 * @since 1.0.0
 */
export type Tests_Cli_Commands_Notifier_NotifierCommands_ConfigJson = string;

/**
 * Tests - CLI - Commands - Notifier - Notifier Commands - Adds Lists Tests And Removes Every Notifier Type.
 *
 * @since 1.0.0
 */
export type Tests_Cli_Commands_Notifier_NotifierCommands_AddsListsTestsAndRemovesEveryNotifierType_FetchSpy = MockInstance<typeof fetch>;

export type Tests_Cli_Commands_Notifier_NotifierCommands_AddsListsTestsAndRemovesEveryNotifierType_HttpNotifier = Lib_Schema_NotifierConfig & {};

export type Tests_Cli_Commands_Notifier_NotifierCommands_AddsListsTestsAndRemovesEveryNotifierType_HttpNotifiers = Tests_Cli_Commands_Notifier_NotifierCommands_AddsListsTestsAndRemovesEveryNotifierType_HttpNotifier[];

/**
 * Tests - CLI - Commands - Notifier - Notifier Commands - Rejects Duplicate Names Missing Names And Failed Test Requests.
 *
 * @since 1.0.0
 */
export type Tests_Cli_Commands_Notifier_NotifierCommands_RejectsDuplicateNamesMissingNamesAndFailedTestRequests_Returns = void;
