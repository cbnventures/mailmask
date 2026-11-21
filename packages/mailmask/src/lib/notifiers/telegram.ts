import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Telegram_Runner_BuildRequest_Payload,
  Lib_Notifiers_Telegram_Runner_BuildRequest_Returns,
  Lib_Notifiers_Telegram_Runner_Constructor_Notifier,
  Lib_Notifiers_Telegram_Runner_Notifier,
  Lib_Notifiers_Telegram_Runner_Send_Dependencies,
  Lib_Notifiers_Telegram_Runner_Send_Payload,
  Lib_Notifiers_Telegram_Runner_Send_Returns,
  Lib_Notifiers_Telegram_Runner_Validate_Returns,
  Lib_Notifiers_Telegram_Runner_Validate_Value,
} from '../../types/lib/notifiers/telegram.d.ts';

/**
 * Lib - Notifiers - Telegram.
 *
 * Owns Telegram bot authentication, chat selection, and message delivery.
 * Existing configuration and delivery behavior remain unchanged.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Telegram - Schema.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('telegram'),
    name: z.string().min(1),
    bot_token: z.string().min(1),
    chat_id: z.string().min(1),
  }).strict();

  /**
   * Lib - Notifiers - Telegram - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_Telegram_Runner_Notifier;

  /**
   * Lib - Notifiers - Telegram - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Telegram_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_Telegram_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Telegram - Build Request.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Telegram_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Telegram_Runner_BuildRequest_Returns}
   *
   * @since 1.2.0
   */
  public buildRequest(payload: Lib_Notifiers_Telegram_Runner_BuildRequest_Payload): Lib_Notifiers_Telegram_Runner_BuildRequest_Returns {
    return {
      url: `https://api.telegram.org/bot${this.#notifier['bot_token']}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: this.#notifier['chat_id'],
        text: [
          payload['title'],
          '',
          payload['message'],
        ].join('\n'),
        link_preview_options: { is_disabled: true },
      }),
    };
  }

  /**
   * Lib - Notifiers - Telegram - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Telegram_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Telegram_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Telegram_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_Telegram_Runner_Send_Payload, dependencies: Lib_Notifiers_Telegram_Runner_Send_Dependencies): Lib_Notifiers_Telegram_Runner_Send_Returns {
    await HttpDelivery.send(this.buildRequest(payload), dependencies);

    return;
  }

  /**
   * Lib - Notifiers - Telegram - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Telegram_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Telegram_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Telegram_Runner_Validate_Value): Lib_Notifiers_Telegram_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
