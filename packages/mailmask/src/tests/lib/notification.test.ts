import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import {
  buildEmailMessage,
  buildNotifierRequest,
  buildRefusalNotification,
} from '../../lib/notification.js';

import type {
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_AppriseRequest,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_DateNowSpy,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_DiscordRequest,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_EmailMessage,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_GotifyRequest,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_MathRandomSpy,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_MatrixRequest,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_NtfyRequest,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_Payload,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_ProxyRequest,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_PushoverRequest,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_SlackRequest,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_TelegramRequest,
  Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_WebhookRequest,
  Tests_Lib_Notification_BuildRefusalNotification_BuildsTheExactVersionedMailmaskPayload_Payload,
} from '../../types/tests/lib/notification.test.d.ts';

afterEach(() => {
  vi.restoreAllMocks();

  return;
});

/**
 * Tests - Lib - Notification - Build Refusal Notification.
 *
 * @since UNRELEASED
 */
describe('buildRefusalNotification', () => {
  it('builds the exact versioned Mailmask payload', () => {
    const payload: Tests_Lib_Notification_BuildRefusalNotification_BuildsTheExactVersionedMailmaskPayload_Payload = buildRefusalNotification(
      'old@example.com',
      'sender@shop.test',
      'old@example.com',
      'Address is disabled',
      'reject',
      Date.parse('2026-11-05T12:00:00.000Z'),
    );

    expect(payload).toEqual({
      version: 1,
      app: 'mailmask',
      event: 'message-refused',
      title: 'Mailmask refused a message',
      message: 'Mail to old@example.com from sender@shop.test was rejected: Address is disabled.',
      priority: 3,
      tags: ['email'],
      occurredAt: '2026-11-05T12:00:00.000Z',
      details: {
        alias: 'old@example.com',
        envelopeSender: 'sender@shop.test',
        recipient: 'old@example.com',
        reason: 'disabled',
      },
    });

    return;
  });

  return;
});

/**
 * Tests - Lib - Notification - Build Notifier Request.
 *
 * @since UNRELEASED
 */
describe('buildNotifierRequest', () => {
  it('builds every service request in its official API shape', () => {
    const payload: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_Payload = buildRefusalNotification(
      'old@example.com',
      'sender@shop.test',
      'old@example.com',
      'Sender is blocked',
      'drop',
      Date.parse('2026-11-05T12:00:00.000Z'),
    );
    const dateNowSpy: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_DateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_793_880_000_000);
    const mathRandomSpy: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_MathRandomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const appriseRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_AppriseRequest = buildNotifierRequest({
      type: 'apprise',
      name: 'apprise',
      url: 'https://apprise.example.com/notify/mailmask',
      urls: 'discord://target',
    }, payload);
    const discordRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_DiscordRequest = buildNotifierRequest({
      type: 'discord',
      name: 'discord',
      webhook_url: 'https://discord.com/api/webhooks/one/two',
    }, payload);
    const gotifyRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_GotifyRequest = buildNotifierRequest({
      type: 'gotify',
      name: 'gotify',
      url: 'https://gotify.example.com/',
      token: 'gotify-token',
    }, payload);
    const matrixRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_MatrixRequest = buildNotifierRequest({
      type: 'matrix',
      name: 'matrix',
      homeserver_url: 'https://matrix.example.com/',
      room_id: '!room:example.com',
      access_token: 'matrix-token',
    }, payload);
    const ntfyRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_NtfyRequest = buildNotifierRequest({
      type: 'ntfy',
      name: 'ntfy',
      server: 'https://ntfy.example.com',
      topic: 'mailmask',
      token: 'tk_test',
    }, payload);
    const proxyRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_ProxyRequest = buildNotifierRequest({
      type: 'ntfy-reverse-proxy',
      name: 'proxy',
      url: 'https://proxy.example.com/mailmask',
      token: 'proxy-token',
    }, payload);
    const pushoverRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_PushoverRequest = buildNotifierRequest({
      type: 'pushover',
      name: 'pushover',
      user_key: 'user-key',
      app_token: 'app-token',
    }, payload);
    const slackRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_SlackRequest = buildNotifierRequest({
      type: 'slack',
      name: 'slack',
      webhook_url: 'https://hooks.slack.com/services/one/two/three',
    }, payload);
    const telegramRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_TelegramRequest = buildNotifierRequest({
      type: 'telegram',
      name: 'telegram',
      bot_token: 'bot-token',
      chat_id: '-100123',
    }, payload);
    const webhookRequest: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_WebhookRequest = buildNotifierRequest({
      type: 'webhook',
      name: 'webhook',
      url: 'https://webhook.example.com/mailmask',
      token: 'webhook-token',
    }, payload);
    const emailMessage: Tests_Lib_Notification_BuildNotifierRequest_BuildsEveryServiceRequestInItsOfficialAPIShape_EmailMessage = buildEmailMessage({
      type: 'email',
      name: 'email',
      from: 'mailmask@example.com',
      to: 'owner@example.com',
    }, payload);

    expect(appriseRequest).toEqual({
      url: 'https://apprise.example.com/notify/mailmask',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: payload['message'],
        title: payload['title'],
        type: 'info',
        urls: 'discord://target',
      }),
    });

    expect(discordRequest).toEqual({
      url: 'https://discord.com/api/webhooks/one/two',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          color: 3_113_463,
          description: payload['message'],
          timestamp: payload['occurredAt'],
          title: payload['title'],
        }],
      }),
    });

    expect(gotifyRequest).toEqual({
      url: 'https://gotify.example.com/message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gotify-Key': 'gotify-token',
      },
      body: JSON.stringify({
        message: payload['message'],
        priority: 3,
        title: payload['title'],
      }),
    });

    expect(matrixRequest).toEqual({
      url: 'https://matrix.example.com/_matrix/client/v3/rooms/!room%3Aexample.com/send/m.room.message/1793880000000-i',
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer matrix-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: [
          payload['title'],
          payload['message'],
        ].join('\n'),
        msgtype: 'm.text',
      }),
    });

    expect(ntfyRequest).toEqual({
      url: 'https://ntfy.example.com',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer tk_test',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'mailmask',
        title: payload['title'],
        message: payload['message'],
        priority: 3,
        tags: ['email'],
      }),
    });

    expect(proxyRequest).toEqual({
      url: 'https://proxy.example.com/mailmask',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer proxy-token',
      },
      body: JSON.stringify(payload),
    });

    expect(pushoverRequest).toEqual({
      url: 'https://api.pushover.net/1/messages.json',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'app-token',
        user: 'user-key',
        title: payload['title'],
        message: payload['message'],
        priority: 0,
      }),
    });

    expect(slackRequest).toEqual({
      url: 'https://hooks.slack.com/services/one/two/three',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: [
          `*${payload['title']}*`,
          payload['message'],
        ].join('\n'),
      }),
    });

    expect(telegramRequest).toEqual({
      url: 'https://api.telegram.org/botbot-token/sendMessage',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: '-100123',
        text: [
          payload['title'],
          '',
          payload['message'],
        ].join('\n'),
        link_preview_options: { is_disabled: true },
      }),
    });

    expect(webhookRequest).toEqual({
      url: 'https://webhook.example.com/mailmask',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer webhook-token',
      },
      body: JSON.stringify(payload),
    });

    expect(emailMessage).toEqual({
      from: 'mailmask@example.com',
      to: 'owner@example.com',
      subject: payload['title'],
      text: [
        payload['message'],
        '',
        'Alias: old@example.com',
        'Envelope sender: sender@shop.test',
        'Recipient: old@example.com',
        'Reason: filtered',
      ].join('\n'),
    });

    expect(dateNowSpy).toHaveBeenCalledTimes(1);

    expect(mathRandomSpy).toHaveBeenCalledTimes(1);

    return;
  });

  return;
});
