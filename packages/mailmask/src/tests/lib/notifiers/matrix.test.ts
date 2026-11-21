import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { Runner as MatrixNotifier } from '../../../lib/notifiers/matrix.js';
import { createPayload } from './fixtures.js';

afterEach(() => {
  vi.restoreAllMocks();

  return;
});

/**
 * Tests - Lib - Notifiers - Matrix - Matrix Adapter.
 *
 * @since 1.2.0
 */
describe('Matrix adapter', () => {
  it('builds its exact request and owns validation', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_793_880_000_000);

    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    expect(new MatrixNotifier({
      type: 'matrix',
      name: 'matrix',
      homeserver_url: 'https://matrix.example.com/',
      room_id: '!room:example.com',
      access_token: 'matrix-token',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://matrix.example.com/_matrix/client/v3/rooms/!room%3Aexample.com/send/m.room.message/1793880000000-i',
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer matrix-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: [
          'Mailmask <alert>',
          'Message <&>.',
        ].join('\n'),
        msgtype: 'm.text',
      }),
    });

    expect(MatrixNotifier.validate({
      type: 'matrix',
      name: 'matrix',
      homeserver_url: 'https://matrix.example.com',
      room_id: '!room:example.com',
      access_token: 'token',
    })).toBe(true);

    expect(MatrixNotifier.validate({
      type: 'matrix',
      name: 'matrix',
      homeserver_url: 'https://matrix.example.com',
      room_id: '#alias:example.com',
      access_token: 'token',
    })).toBe(false);

    return;
  });

  return;
});
