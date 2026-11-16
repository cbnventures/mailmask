import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { configSchema } from '../../lib/schema.js';
import { handleEmail } from '../../worker/handlers.js';

import type {
  Tests_Worker_Handlers_BaseConfig,
  Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_Config,
  Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_ConsoleWarnSpy,
  Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_DropContext,
  Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_DropMessage,
  Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_FetchSpy,
  Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_RejectContext,
  Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_RejectMessage,
  Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_ForwardHeaders,
  Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message,
  Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_Config,
  Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_EmailBinding,
  Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_Message,
  Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_Send_OutboundMessage,
  Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_SentMessages,
  Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Config,
  Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_FetchSpy,
  Tests_Worker_Handlers_HandleEmail_NotifiesWhenAKnownAliasRefusesMail_Message,
  Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Config,
  Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_FetchSpy,
  Tests_Worker_Handlers_HandleEmail_RejectsUnknownRecipientsWithoutNotifying_Message,
  Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Config,
  Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_ConsoleWarnSpy,
  Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Context,
  Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_FetchSpy,
  Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Message,
  Tests_Worker_Handlers_Now,
} from '../../types/tests/worker/handlers.test.d.ts';

afterEach(() => {
  vi.useRealTimers();

  vi.restoreAllMocks();

  return;
});

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
  it('applies reject and drop decisions without waiting for notifications', async () => {
    vi.useFakeTimers();

    const rejectMessage: Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_RejectMessage = {
      to: 'old@mail.example.com',
      from: 'a@b.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };
    const dropMessage: Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_DropMessage = {
      to: 'old@mail.example.com',
      from: 'a@b.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };
    const config: Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_Config = configSchema.parse(baseConfig);
    const rejectContext: Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_RejectContext = { waitUntil: vi.fn() };
    const dropContext: Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_DropContext = { waitUntil: vi.fn() };
    const fetchSpy: Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    const consoleWarnSpy: Tests_Worker_Handlers_HandleEmail_AppliesRejectAndDropDecisionsWithoutWaitingForNotifications_ConsoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    Reflect.set(config, 'notifiers', [{
      type: 'webhook',
      name: 'slow',
      url: 'https://slow.example.com/mailmask',
    }]);

    await expect(handleEmail(rejectMessage, config, now, rejectContext)).resolves.toBeUndefined();

    expect(rejectMessage['setReject']).toHaveBeenCalledWith('Address is disabled');

    expect(rejectContext['waitUntil']).toHaveBeenCalledWith(expect.any(Promise));

    Reflect.set(config['settings'], 'unknown_alias_action', 'drop');

    await expect(handleEmail(dropMessage, config, now, dropContext)).resolves.toBeUndefined();

    expect(dropMessage['setReject']).not.toHaveBeenCalled();

    expect(dropContext['waitUntil']).toHaveBeenCalledWith(expect.any(Promise));

    expect(fetchSpy).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(10_000);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(2);

    return;
  });

  it('forwards with identifying headers', async () => {
    const message: Tests_Worker_Handlers_HandleEmail_ForwardsWithIdentifyingHeaders_Message = {
      to: 'shop@mail.example.com',
      from: 'store@shop.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };

    await handleEmail(message, configSchema.parse(baseConfig), now, { waitUntil: vi.fn() });

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

    await handleEmail(message, config, now, { waitUntil: vi.fn() });

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

    await handleEmail(message, config, now, { waitUntil: vi.fn() });

    expect(message['setReject']).toHaveBeenCalledWith('Address is disabled');

    expect(fetchSpy).toHaveBeenCalledTimes(2);

    expect(fetchSpy).toHaveBeenCalledWith('https://ntfy.example.com', expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer tk_test' }) }));

    expect(fetchSpy).toHaveBeenCalledWith('https://alerts.ntfy.example.com', expect.objectContaining({
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: 1,
        app: 'mailmask',
        event: 'message-refused',
        title: 'Mailmask refused a message',
        message: 'Mail to old@mail.example.com from a@b.test was rejected: Address is disabled.',
        priority: 3,
        tags: ['email'],
        occurredAt: '2026-10-24T12:00:00.000Z',
        details: {
          alias: 'old@mail.example.com',
          envelopeSender: 'a@b.test',
          recipient: 'old@mail.example.com',
          reason: 'disabled',
        },
      }),
    }));

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
    const context: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_Context = { waitUntil: vi.fn() };
    const fetchSpy: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_FetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const consoleWarnSpy: Tests_Worker_Handlers_HandleEmail_StillRejectsWhenTheNotificationFails_ConsoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

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

    await handleEmail(message, config, now, context);

    expect(message['setReject']).toHaveBeenCalledWith('Address is disabled');

    await expect(context['waitUntil'].mock.calls[0]![0]).resolves.toBeUndefined();

    expect(consoleWarnSpy).toHaveBeenNthCalledWith(1, 'Notifier "phone" (ntfy) failed: request failed.');

    expect(consoleWarnSpy).toHaveBeenNthCalledWith(2, 'Notifier "proxy" (ntfy-reverse-proxy) failed: request failed.');

    fetchSpy.mockRestore();

    return;
  });

  it('notifies by email through the Cloudflare binding', async () => {
    const message: Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_Message = {
      to: 'old@mail.example.com',
      from: 'a@b.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };
    const config: Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_Config = configSchema.parse(baseConfig);
    const sentMessages: Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_SentMessages = [];
    const emailBinding: Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_EmailBinding = {
      async send(outboundMessage: Tests_Worker_Handlers_HandleEmail_NotifiesByEmailThroughTheCloudflareBinding_Send_OutboundMessage) {
        sentMessages.push(outboundMessage);

        return { messageId: 'notification' };
      },
    };

    Reflect.set(config, 'notifiers', [{
      type: 'email',
      name: 'email',
      from: 'mailmask@mail.example.com',
      to: 'owner@example.com',
    }]);

    await handleEmail(message, config, now, { waitUntil: vi.fn() }, emailBinding);

    expect(sentMessages).toEqual([{
      from: 'mailmask@mail.example.com',
      to: 'owner@example.com',
      subject: 'Mailmask refused a message',
      text: [
        'Mail to old@mail.example.com from a@b.test was rejected: Address is disabled.',
        '',
        'Alias: old@mail.example.com',
        'Envelope sender: a@b.test',
        'Recipient: old@mail.example.com',
        'Reason: disabled',
      ].join('\n'),
    }]);

    expect(message['setReject']).toHaveBeenCalledWith('Address is disabled');

    return;
  });

  return;
});
