import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Ntfy_Runner_BuildRequest_Payload,
  Lib_Notifiers_Ntfy_Runner_BuildRequest_Returns,
  Lib_Notifiers_Ntfy_Runner_Constructor_Notifier,
  Lib_Notifiers_Ntfy_Runner_Notifier,
  Lib_Notifiers_Ntfy_Runner_Send_Dependencies,
  Lib_Notifiers_Ntfy_Runner_Send_Payload,
  Lib_Notifiers_Ntfy_Runner_Send_Returns,
  Lib_Notifiers_Ntfy_Runner_Validate_Returns,
  Lib_Notifiers_Ntfy_Runner_Validate_Value,
} from '../../types/lib/notifiers/ntfy.d.ts';

/**
 * Lib - Notifiers - Ntfy.
 *
 * Owns direct ntfy topic validation, bearer authentication, and delivery.
 * Existing configuration and delivery behavior remain unchanged.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Ntfy - Schema.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('ntfy'),
    name: z.string().min(1),
    server: z.url().refine((server) => server.startsWith('https://'), { message: 'Server URL must start with https://' }),
    topic: z.string().min(1),
    token: z.string().startsWith('tk_'),
  }).strict();

  /**
   * Lib - Notifiers - Ntfy - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_Ntfy_Runner_Notifier;

  /**
   * Lib - Notifiers - Ntfy - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Ntfy_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_Ntfy_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Ntfy - Build Request.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Ntfy_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Ntfy_Runner_BuildRequest_Returns}
   *
   * @since 1.2.0
   */
  public buildRequest(payload: Lib_Notifiers_Ntfy_Runner_BuildRequest_Payload): Lib_Notifiers_Ntfy_Runner_BuildRequest_Returns {
    return {
      url: this.#notifier['server'],
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.#notifier['token']}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: this.#notifier['topic'],
        title: payload['title'],
        message: payload['message'],
        priority: payload['priority'],
        tags: payload['tags'],
      }),
    };
  }

  /**
   * Lib - Notifiers - Ntfy - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Ntfy_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Ntfy_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Ntfy_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_Ntfy_Runner_Send_Payload, dependencies: Lib_Notifiers_Ntfy_Runner_Send_Dependencies): Lib_Notifiers_Ntfy_Runner_Send_Returns {
    await HttpDelivery.send(this.buildRequest(payload), dependencies);

    return;
  }

  /**
   * Lib - Notifiers - Ntfy - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Ntfy_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Ntfy_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Ntfy_Runner_Validate_Value): Lib_Notifiers_Ntfy_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
