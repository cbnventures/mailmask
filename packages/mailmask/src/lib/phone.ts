import { LIB_REGEX_PHONE_DIGITS, LIB_REGEX_PHONE_NUMBER_SEPARATORS } from './regex.js';

import type {
  Lib_Phone_ConstantTimeEqual_Difference,
  Lib_Phone_ConstantTimeEqual_Left,
  Lib_Phone_ConstantTimeEqual_LeftBytes,
  Lib_Phone_ConstantTimeEqual_Returns,
  Lib_Phone_ConstantTimeEqual_Right,
  Lib_Phone_ConstantTimeEqual_RightBytes,
  Lib_Phone_DecodeBase64_Binary,
  Lib_Phone_DecodeBase64_Bytes,
  Lib_Phone_DecodeBase64_Returns,
  Lib_Phone_DecodeBase64_Value,
  Lib_Phone_EncodeBase64_Binary,
  Lib_Phone_EncodeBase64_Bytes,
  Lib_Phone_EncodeBase64_Returns,
  Lib_Phone_GetSubtleCrypto_Returns,
  Lib_Phone_MatchesPhoneSender_IsPrefix,
  Lib_Phone_MatchesPhoneSender_NormalizedPattern,
  Lib_Phone_MatchesPhoneSender_NormalizedSender,
  Lib_Phone_MatchesPhoneSender_Pattern,
  Lib_Phone_MatchesPhoneSender_Returns,
  Lib_Phone_MatchesPhoneSender_Sender,
  Lib_Phone_NormalizePhoneNumber_Returns,
  Lib_Phone_NormalizePhoneNumber_Stripped,
  Lib_Phone_NormalizePhoneNumber_Value,
  Lib_Phone_ProviderRequest_Body,
  Lib_Phone_ProviderRequest_Headers,
  Lib_Phone_ProviderRequest_Method,
  Lib_Phone_ProviderRequest_Response,
  Lib_Phone_ProviderRequest_ResponseText,
  Lib_Phone_ProviderRequest_Returns,
  Lib_Phone_ProviderRequest_Url,
} from '../types/lib/phone.d.ts';

/**
 * Lib - Phone - Provider Timeout Milliseconds.
 *
 * Longest time one phone provider API call may take. The Worker answers the
 * provider's webhook after forwarding, so a slow API must not hold it open.
 *
 * @since 1.2.0
 */
const PROVIDER_TIMEOUT_MILLISECONDS = 10_000;

/**
 * Lib - Phone - Constant Time Equal.
 *
 * Compares two strings without stopping at the first difference, so checking
 * a webhook signature does not leak how much of a guess was right.
 *
 * @param {Lib_Phone_ConstantTimeEqual_Left}  left  - Left.
 * @param {Lib_Phone_ConstantTimeEqual_Right} right - Right.
 *
 * @returns {Lib_Phone_ConstantTimeEqual_Returns}
 *
 * @since 1.2.0
 */
function constantTimeEqual(left: Lib_Phone_ConstantTimeEqual_Left, right: Lib_Phone_ConstantTimeEqual_Right): Lib_Phone_ConstantTimeEqual_Returns {
  const leftBytes: Lib_Phone_ConstantTimeEqual_LeftBytes = new TextEncoder().encode(left);
  const rightBytes: Lib_Phone_ConstantTimeEqual_RightBytes = new TextEncoder().encode(right);

  if (leftBytes.length !== rightBytes.length) {
    return false;
  }

  let difference: Lib_Phone_ConstantTimeEqual_Difference = 0;

  for (let byteIndex = 0; byteIndex < leftBytes.length; byteIndex += 1) {
    difference += Math.abs((leftBytes[byteIndex] ?? 0) - (rightBytes[byteIndex] ?? 0));
  }

  return difference === 0;
}

/**
 * Lib - Phone - Decode Base64.
 *
 * Turns a base64 string into bytes for WebCrypto, returning undefined when the
 * value is not valid base64 so callers can refuse the webhook instead of throwing.
 *
 * @param {Lib_Phone_DecodeBase64_Value} value - Value.
 *
 * @returns {Lib_Phone_DecodeBase64_Returns}
 *
 * @since 1.2.0
 */
function decodeBase64(value: Lib_Phone_DecodeBase64_Value): Lib_Phone_DecodeBase64_Returns {
  let binary: Lib_Phone_DecodeBase64_Binary = '';

  try {
    binary = atob(value.trim());
  } catch {
    return undefined;
  }

  const bytes: Lib_Phone_DecodeBase64_Bytes = new Uint8Array(binary.length);

  for (let charIndex = 0; charIndex < binary.length; charIndex += 1) {
    Reflect.set(bytes, charIndex, binary.charCodeAt(charIndex));
  }

  return bytes;
}

/**
 * Lib - Phone - Encode Base64.
 *
 * Turns signature bytes from WebCrypto into base64 text, the form providers put
 * in their signature headers.
 *
 * @param {Lib_Phone_EncodeBase64_Bytes} bytes - Bytes.
 *
 * @returns {Lib_Phone_EncodeBase64_Returns}
 *
 * @since 1.2.0
 */
function encodeBase64(bytes: Lib_Phone_EncodeBase64_Bytes): Lib_Phone_EncodeBase64_Returns {
  let binary: Lib_Phone_EncodeBase64_Binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

/**
 * Lib - Phone - Get Subtle Crypto.
 *
 * Returns the Web Crypto API that checks webhook signatures. Workers and every
 * supported Node.js release expose it globally, so no runtime import is needed.
 *
 * @returns {Lib_Phone_GetSubtleCrypto_Returns}
 *
 * @since 1.2.0
 */
function getSubtleCrypto(): Lib_Phone_GetSubtleCrypto_Returns {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins -- Web Crypto is a stable global in Node.js 22 and in Workers.
  return crypto.subtle;
}

/**
 * Lib - Phone - Matches Phone Sender.
 *
 * Checks a sender against one phone sender rule. Numbers compare without "+" and
 * separators, sender names such as "ACME" ignore case, and "*" matches a prefix.
 *
 * @param {Lib_Phone_MatchesPhoneSender_Sender}  sender  - Sender.
 * @param {Lib_Phone_MatchesPhoneSender_Pattern} pattern - Pattern.
 *
 * @returns {Lib_Phone_MatchesPhoneSender_Returns}
 *
 * @since 1.2.0
 */
function matchesPhoneSender(sender: Lib_Phone_MatchesPhoneSender_Sender, pattern: Lib_Phone_MatchesPhoneSender_Pattern): Lib_Phone_MatchesPhoneSender_Returns {
  const isPrefix: Lib_Phone_MatchesPhoneSender_IsPrefix = pattern.trim().endsWith('*');
  const normalizedSender: Lib_Phone_MatchesPhoneSender_NormalizedSender = normalizePhoneNumber(sender).replace('+', '').toLowerCase();
  const normalizedPattern: Lib_Phone_MatchesPhoneSender_NormalizedPattern = normalizePhoneNumber(pattern.trim().replace('*', '')).replace('+', '').toLowerCase();

  if (isPrefix === true) {
    return normalizedSender.startsWith(normalizedPattern) === true;
  }

  return normalizedSender === normalizedPattern;
}

/**
 * Lib - Phone - Normalize Phone Number.
 *
 * Removes spaces, dots, dashes, and parentheses, and adds the "+" that Plivo
 * leaves off full numbers. Short codes and sender names stay as they are.
 *
 * @param {Lib_Phone_NormalizePhoneNumber_Value} value - Value.
 *
 * @returns {Lib_Phone_NormalizePhoneNumber_Returns}
 *
 * @since 1.2.0
 */
function normalizePhoneNumber(value: Lib_Phone_NormalizePhoneNumber_Value): Lib_Phone_NormalizePhoneNumber_Returns {
  const stripped: Lib_Phone_NormalizePhoneNumber_Stripped = value.trim().replace(new RegExp(LIB_REGEX_PHONE_NUMBER_SEPARATORS.source, 'g'), '');

  if (stripped.startsWith('+') === true) {
    return stripped;
  }

  // Full numbers have at least ten digits; anything shorter is a short code.
  if (stripped.length >= 10 && LIB_REGEX_PHONE_DIGITS.test(stripped) === true) {
    return `+${stripped}`;
  }

  return stripped;
}

/**
 * Lib - Phone - Provider Request.
 *
 * Calls a phone provider API with a time limit and returns the status with
 * the parsed JSON body. Callers decide what a failed status means.
 *
 * @param {Lib_Phone_ProviderRequest_Url}     url     - Url.
 * @param {Lib_Phone_ProviderRequest_Method}  method  - Method.
 * @param {Lib_Phone_ProviderRequest_Headers} headers - Headers.
 * @param {Lib_Phone_ProviderRequest_Body}    body    - Body.
 *
 * @returns {Lib_Phone_ProviderRequest_Returns}
 *
 * @since 1.2.0
 */
async function providerRequest(url: Lib_Phone_ProviderRequest_Url, method: Lib_Phone_ProviderRequest_Method, headers: Lib_Phone_ProviderRequest_Headers, body: Lib_Phone_ProviderRequest_Body): Lib_Phone_ProviderRequest_Returns {
  const response: Lib_Phone_ProviderRequest_Response = await fetch(url, {
    method,
    headers: {
      ...headers,
      'Accept': 'application/json',
      ...((body !== undefined) ? { 'Content-Type': 'application/json' } : {}),
    },
    ...((body !== undefined) ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MILLISECONDS),
  });
  const responseText: Lib_Phone_ProviderRequest_ResponseText = await response.text();

  if (responseText.trim() === '') {
    return {
      ok: response['ok'],
      status: response['status'],
      data: undefined,
    };
  }

  try {
    return {
      ok: response['ok'],
      status: response['status'],
      data: JSON.parse(responseText),
    };
  } catch {
    return {
      ok: response['ok'],
      status: response['status'],
      data: undefined,
    };
  }
}

export {
  constantTimeEqual,
  decodeBase64,
  encodeBase64,
  getSubtleCrypto,
  matchesPhoneSender,
  normalizePhoneNumber,
  providerRequest,
};
