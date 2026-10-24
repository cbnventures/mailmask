import {
  describe, expect, it, vi,
} from 'vitest';

import { configSchema } from '../../lib/schema.js';
import { handleEmail } from '../../worker/handlers.js';

import type {
  Tests_Worker_Handlers_BaseConfig,
  Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_ForwardHeaders,
  Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message,
  Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Config,
  Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_FetchSpy,
  Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message,
  Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Config,
  Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_FetchSpy,
  Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message,
  Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Config,
  Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_FetchSpy,
  Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message,
  Tests_Worker_Handlers_Now,
} from '../../types/tests/worker/handlers.test.d.ts';

const now: Tests_Worker_Handlers_Now = Date.parse('2026-10-24T12:00:00.000Z');

const baseConfig: Tests_Worker_Handlers_BaseConfig = {
  destinations: [{
    name: 'personal',
    email: 'me@inbox.test',
  }],
  aliases: [
    {
      address: 'shop',
      destination: 'personal',
      label: 'Shopping',
      enabled: true,
    },
    {
      address: 'old',
      destination: 'personal',
      enabled: false,
    },
  ],
  notifiers: [],
  settings: {
    worker_name: 'mailmask',
    base_domain: 'mail.example.com',
    unknown_alias_action: 'reject',
    subaddressing: true,
    add_alias_headers: true,
  },
};

/**
 * Tests - Worker - Handlers - Handle Email.
 *
 * @since 0.0.1
 */
describe('handleEmail', () => {
  it('forwards with identifying headers', async () => {
    const message: Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message = {
      to: 'shop@mail.example.com',
      from: 'store@shop.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };

    await handleEmail(message, configSchema.parse(baseConfig), now);

    expect(message['forward']).toHaveBeenCalledTimes(1);

    expect(message['setReject']).not.toHaveBeenCalled();

    expect(message['forward']).toHaveBeenCalledWith('me@inbox.test', expect.any(Headers));

    const forwardHeaders: Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_ForwardHeaders = new Headers(message['forward'].mock.calls[0]![1]);

    expect(forwardHeaders.get('X-Mailmask-Alias')).toBe('shop@mail.example.com');

    expect(forwardHeaders.get('X-Mailmask-Label')).toBe('Shopping');

    return;
  });

  it('rejects unknown recipients without notifying', async () => {
    const message: Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message = {
      to: 'nobody@mail.example.com',
      from: 'a@b.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };
    const config: Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Config = configSchema.parse(baseConfig);
    const fetchSpy: Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));

    Reflect.set(config, 'notifiers', [
      {
        type: 'ntfy',
        name: 'phone',
        server: 'https://ntfy.example.com',
        topic: 'alerts',
        token: 'tk_test',
      },
      {
        type: 'ntfy-reverse-proxy',
        name: 'proxy',
        url: 'https://alerts.ntfy.example.com',
      },
    ]);

    await handleEmail(message, config, now);

    expect(message['setReject']).toHaveBeenCalledWith('Address not found');

    expect(fetchSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();

    return;
  });

  it('notifies when a known alias refuses mail', async () => {
    const message: Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message = {
      to: 'old@mail.example.com',
      from: 'a@b.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };
    const config: Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Config = configSchema.parse(baseConfig);
    const fetchSpy: Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_FetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));

    Reflect.set(config, 'notifiers', [
      {
        type: 'ntfy',
        name: 'phone',
        server: 'https://ntfy.example.com',
        topic: 'alerts',
        token: 'tk_test',
      },
      {
        type: 'ntfy-reverse-proxy',
        name: 'proxy',
        url: 'https://alerts.ntfy.example.com',
      },
    ]);

    await handleEmail(message, config, now);

    expect(message['setReject']).toHaveBeenCalledWith('Address is disabled');

    expect(fetchSpy).toHaveBeenCalledTimes(2);

    expect(fetchSpy).toHaveBeenCalledWith('https://ntfy.example.com', expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer tk_test' }) }));

    expect(fetchSpy).toHaveBeenCalledWith('https://alerts.ntfy.example.com', expect.objectContaining({ headers: expect.objectContaining({ Title: 'Mailmask refused a message' }) }));

    fetchSpy.mockRestore();

    return;
  });

  it('still rejects when the notification fails', async () => {
    const message: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message = {
      to: 'old@mail.example.com',
      from: 'a@b.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };
    const config: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Config = configSchema.parse(baseConfig);
    const fetchSpy: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_FetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));

    Reflect.set(config, 'notifiers', [
      {
        type: 'ntfy',
        name: 'phone',
        server: 'https://ntfy.example.com',
        topic: 'alerts',
        token: 'tk_test',
      },
      {
        type: 'ntfy-reverse-proxy',
        name: 'proxy',
        url: 'https://alerts.ntfy.example.com',
      },
    ]);

    await handleEmail(message, config, now);

    expect(message['setReject']).toHaveBeenCalledWith('Address is disabled');

    fetchSpy.mockRestore();

    return;
  });

  return;
});
