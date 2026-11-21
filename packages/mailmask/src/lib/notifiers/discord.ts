import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Discord_Runner_BuildRequest_Payload,
  Lib_Notifiers_Discord_Runner_BuildRequest_Returns,
  Lib_Notifiers_Discord_Runner_Constructor_Notifier,
  Lib_Notifiers_Discord_Runner_Notifier,
  Lib_Notifiers_Discord_Runner_Send_Dependencies,
  Lib_Notifiers_Discord_Runner_Send_Payload,
  Lib_Notifiers_Discord_Runner_Send_Returns,
  Lib_Notifiers_Discord_Runner_Validate_Returns,
  Lib_Notifiers_Discord_Runner_Validate_Value,
} from '../../types/lib/notifiers/discord.d.ts';

/**
 * Lib - Notifiers - Discord.
 *
 * Owns Discord webhook validation and embed request delivery.
 * Existing configuration and delivery behavior remain unchanged.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Discord - Schema.
   *
   * Accepts both documented Discord webhook host forms used by saved configs.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('discord'),
    name: z.string().min(1),
    webhook_url: z.url().refine((url) => url.startsWith('https://discord.com/api/webhooks/') || url.startsWith('https://discordapp.com/api/webhooks/'), { message: 'Discord webhook URL must start with https://discord.com/api/webhooks/' }),
  }).strict();

  /**
   * Lib - Notifiers - Discord - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_Discord_Runner_Notifier;

  /**
   * Lib - Notifiers - Discord - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Discord_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_Discord_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Discord - Build Request.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Discord_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Discord_Runner_BuildRequest_Returns}
   *
   * @since 1.2.0
   */
  public buildRequest(payload: Lib_Notifiers_Discord_Runner_BuildRequest_Payload): Lib_Notifiers_Discord_Runner_BuildRequest_Returns {
    return {
      url: this.#notifier['webhook_url'],
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
    };
  }

  /**
   * Lib - Notifiers - Discord - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Discord_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Discord_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Discord_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_Discord_Runner_Send_Payload, dependencies: Lib_Notifiers_Discord_Runner_Send_Dependencies): Lib_Notifiers_Discord_Runner_Send_Returns {
    await HttpDelivery.send(this.buildRequest(payload), dependencies);

    return;
  }

  /**
   * Lib - Notifiers - Discord - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Discord_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Discord_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Discord_Runner_Validate_Value): Lib_Notifiers_Discord_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
