import type { Shared_PhoneProviderResponse } from '../shared.d.ts';

/**
 * Lib - Phone - Constant Time Equal.
 *
 * @since 1.2.0
 */
export type Lib_Phone_ConstantTimeEqual_Left = string;

export type Lib_Phone_ConstantTimeEqual_Right = string;

export type Lib_Phone_ConstantTimeEqual_Returns = boolean;

export type Lib_Phone_ConstantTimeEqual_LeftBytes = Uint8Array;

export type Lib_Phone_ConstantTimeEqual_RightBytes = Uint8Array;

export type Lib_Phone_ConstantTimeEqual_Difference = number;

/**
 * Lib - Phone - Decode Base64.
 *
 * @since 1.2.0
 */
export type Lib_Phone_DecodeBase64_Value = string;

export type Lib_Phone_DecodeBase64_Returns = Uint8Array<ArrayBuffer> | undefined;

export type Lib_Phone_DecodeBase64_Binary = string;

export type Lib_Phone_DecodeBase64_Bytes = Uint8Array<ArrayBuffer>;

/**
 * Lib - Phone - Encode Base64.
 *
 * @since 1.2.0
 */
export type Lib_Phone_EncodeBase64_Bytes = Uint8Array;

export type Lib_Phone_EncodeBase64_Returns = string;

export type Lib_Phone_EncodeBase64_Binary = string;

/**
 * Lib - Phone - Get Subtle Crypto.
 *
 * @since 1.2.0
 */
// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Web Crypto is a stable global in Node.js 22 and in Workers.
export type Lib_Phone_GetSubtleCrypto_Returns = typeof crypto.subtle;

/**
 * Lib - Phone - Matches Phone Sender.
 *
 * @since 1.2.0
 */
export type Lib_Phone_MatchesPhoneSender_Sender = string;

export type Lib_Phone_MatchesPhoneSender_Pattern = string;

export type Lib_Phone_MatchesPhoneSender_Returns = boolean;

export type Lib_Phone_MatchesPhoneSender_IsPrefix = boolean;

export type Lib_Phone_MatchesPhoneSender_NormalizedSender = string;

export type Lib_Phone_MatchesPhoneSender_NormalizedPattern = string;

/**
 * Lib - Phone - Normalize Phone Number.
 *
 * @since 1.2.0
 */
export type Lib_Phone_NormalizePhoneNumber_Value = string;

export type Lib_Phone_NormalizePhoneNumber_Returns = string;

export type Lib_Phone_NormalizePhoneNumber_Stripped = string;

/**
 * Lib - Phone - Provider Request.
 *
 * @since 1.2.0
 */
export type Lib_Phone_ProviderRequest_Url = string;

export type Lib_Phone_ProviderRequest_Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type Lib_Phone_ProviderRequest_Headers = Record<string, string>;

export type Lib_Phone_ProviderRequest_Body = Record<string, unknown> | undefined;

export type Lib_Phone_ProviderRequest_Returns = Promise<Shared_PhoneProviderResponse>;

export type Lib_Phone_ProviderRequest_Response = Response;

export type Lib_Phone_ProviderRequest_ResponseText = string;
