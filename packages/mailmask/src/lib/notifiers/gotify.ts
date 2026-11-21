import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Gotify_Runner_BuildRequest_Payload,
  Lib_Notifiers_Gotify_Runner_BuildRequest_Returns,
  Lib_Notifiers_Gotify_Runner_Constructor_Notifier,
  Lib_Notifiers_Gotify_Runner_Notifier,
  Lib_Notifiers_Gotify_Runner_Send_Dependencies,
  Lib_Notifiers_Gotify_Runner_Send_Payload,
  Lib_Notifiers_Gotify_Runner_Send_Returns,
  Lib_Notifiers_Gotify_Runner_Validate_Returns,
  Lib_Notifiers_Gotify_Runner_Validate_Value,
} from '../../types/lib/notifiers/gotify.d.ts';

/**
 * Lib - Notifiers - Gotify.
 *
 * Owns Gotify server validation, token authentication, and message delivery.
 * Existing configuration and delivery behavior remain unchanged.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Gotify - Schema.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('gotify'),
    name: z.string().min(1),
    url: z.url().refine((url) => url.startsWith('https://'), { message: 'URL must start with https://' }),
    token: z.string().min(1),
  }).strict();

  /**
   * Lib - Notifiers - Gotify - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_Gotify_Runner_Notifier;

  /**
   * Lib - Notifiers - Gotify - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Gotify_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_Gotify_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Gotify - Build Request.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Gotify_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Gotify_Runner_BuildRequest_Returns}
   *
   * @since 1.2.0
   */
  public buildRequest(payload: Lib_Notifiers_Gotify_Runner_BuildRequest_Payload): Lib_Notifiers_Gotify_Runner_BuildRequest_Returns {
    return {
      url: `${HttpDelivery.trimTrailingSlashes(this.#notifier['url'])}/message`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gotify-Key': this.#notifier['token'],
      },
      body: JSON.stringify({
        message: payload['message'],
        priority: payload['priority'],
        title: payload['title'],
      }),
    };
  }

  /**
   * Lib - Notifiers - Gotify - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Gotify_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Gotify_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Gotify_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_Gotify_Runner_Send_Payload, dependencies: Lib_Notifiers_Gotify_Runner_Send_Dependencies): Lib_Notifiers_Gotify_Runner_Send_Returns {
    await HttpDelivery.send(this.buildRequest(payload), dependencies);

    return;
  }

  /**
   * Lib - Notifiers - Gotify - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Gotify_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Gotify_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Gotify_Runner_Validate_Value): Lib_Notifiers_Gotify_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
