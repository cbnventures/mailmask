import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Pushover_Runner_BuildRequest_Payload,
  Lib_Notifiers_Pushover_Runner_BuildRequest_Returns,
  Lib_Notifiers_Pushover_Runner_Constructor_Notifier,
  Lib_Notifiers_Pushover_Runner_Notifier,
  Lib_Notifiers_Pushover_Runner_Send_Dependencies,
  Lib_Notifiers_Pushover_Runner_Send_Payload,
  Lib_Notifiers_Pushover_Runner_Send_Returns,
  Lib_Notifiers_Pushover_Runner_Validate_Returns,
  Lib_Notifiers_Pushover_Runner_Validate_Value,
} from '../../types/lib/notifiers/pushover.d.ts';

/**
 * Lib - Notifiers - Pushover.
 *
 * Owns Pushover credentials and message API delivery.
 * Existing configuration and delivery behavior remain unchanged.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Pushover - Schema.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('pushover'),
    name: z.string().min(1),
    user_key: z.string().min(1),
    app_token: z.string().min(1),
  }).strict();

  /**
   * Lib - Notifiers - Pushover - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_Pushover_Runner_Notifier;

  /**
   * Lib - Notifiers - Pushover - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Pushover_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_Pushover_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Pushover - Build Request.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Pushover_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Pushover_Runner_BuildRequest_Returns}
   *
   * @since 1.2.0
   */
  public buildRequest(payload: Lib_Notifiers_Pushover_Runner_BuildRequest_Payload): Lib_Notifiers_Pushover_Runner_BuildRequest_Returns {
    return {
      url: 'https://api.pushover.net/1/messages.json',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: this.#notifier['app_token'],
        user: this.#notifier['user_key'],
        title: payload['title'],
        message: payload['message'],
        priority: 0,
      }),
    };
  }

  /**
   * Lib - Notifiers - Pushover - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Pushover_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Pushover_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Pushover_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_Pushover_Runner_Send_Payload, dependencies: Lib_Notifiers_Pushover_Runner_Send_Dependencies): Lib_Notifiers_Pushover_Runner_Send_Returns {
    await HttpDelivery.send(this.buildRequest(payload), dependencies);

    return;
  }

  /**
   * Lib - Notifiers - Pushover - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Pushover_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Pushover_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Pushover_Runner_Validate_Value): Lib_Notifiers_Pushover_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
