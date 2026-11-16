import type { z } from 'zod';

import type { Lib_Schema_NotifierConfig } from '../../lib/schema.d.ts';

/**
 * Tests - Lib - Schema - Alias Schema - Validates Addresses Expiry And Sender Rules.
 *
 * @since 0.0.1
 */
export type Tests_Lib_Schema_AliasSchema_ValidatesAddressesExpiryAndSenderRules_Result = z.ZodSafeParseResult<unknown>;

/**
 * Tests - Lib - Schema - Notifier Schema - Requires Https And Ntfy Tokens.
 *
 * @since 0.0.1
 */
export type Tests_Lib_Schema_NotifierSchema_RequiresHttpsAndNtfyTokens_Result = z.ZodSafeParseResult<unknown>;

/**
 * Tests - Lib - Schema - Notifier Schema - Validates Every Supported Type.
 *
 * @since UNRELEASED
 */
export type Tests_Lib_Schema_NotifierSchema_ValidatesEverySupportedType_Notifier = Lib_Schema_NotifierConfig & {};

export type Tests_Lib_Schema_NotifierSchema_ValidatesEverySupportedType_Notifiers = Tests_Lib_Schema_NotifierSchema_ValidatesEverySupportedType_Notifier[];
