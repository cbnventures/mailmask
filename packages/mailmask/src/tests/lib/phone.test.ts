import { describe, expect, it } from 'vitest';

import {
  constantTimeEqual,
  decodeBase64,
  encodeBase64,
  matchesPhoneSender,
  normalizePhoneNumber,
} from '../../lib/phone.js';

/**
 * Tests - Lib - Phone - Normalize Phone Number.
 *
 * @since 1.2.0
 */
describe('normalizePhoneNumber', () => {
  it('strips separators and adds the plus to full numbers only', () => {
    expect(normalizePhoneNumber(' +1 (555) 010-0100 ')).toBe('+15550100100');

    expect(normalizePhoneNumber('15550100100')).toBe('+15550100100');

    expect(normalizePhoneNumber('12345')).toBe('12345');

    expect(normalizePhoneNumber('ACME')).toBe('ACME');

    return;
  });

  return;
});

/**
 * Tests - Lib - Phone - Matches Phone Sender.
 *
 * @since 1.2.0
 */
describe('matchesPhoneSender', () => {
  it('matches whole numbers and prefixes by digits', () => {
    expect(matchesPhoneSender('+15550100200', '+15550100200')).toBe(true);

    expect(matchesPhoneSender('15550100200', '+15550100200')).toBe(true);

    expect(matchesPhoneSender('+15550100200', '+1555*')).toBe(true);

    expect(matchesPhoneSender('+14155550100', '+1555*')).toBe(false);

    expect(matchesPhoneSender('12345', '12345')).toBe(true);

    expect(matchesPhoneSender('+15550100200', '+1555')).toBe(false);

    return;
  });

  return;
});

/**
 * Tests - Lib - Phone - Base64.
 *
 * @since 1.2.0
 */
describe('base64', () => {
  it('round trips bytes and refuses invalid text', () => {
    expect(encodeBase64(new Uint8Array([
      0,
      1,
      254,
      255,
    ]))).toBe('AAH+/w==');

    expect([...decodeBase64('AAH+/w==') ?? []]).toEqual([
      0,
      1,
      254,
      255,
    ]);

    expect(decodeBase64('not base64!')).toBeUndefined();

    return;
  });

  return;
});

/**
 * Tests - Lib - Phone - Constant Time Equal.
 *
 * @since 1.2.0
 */
describe('constantTimeEqual', () => {
  it('compares strings of any length', () => {
    expect(constantTimeEqual('signature', 'signature')).toBe(true);

    expect(constantTimeEqual('signature', 'signaturf')).toBe(false);

    expect(constantTimeEqual('signature', 'sig')).toBe(false);

    return;
  });

  return;
});
