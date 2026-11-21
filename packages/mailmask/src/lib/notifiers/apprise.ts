import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Apprise_Runner_BuildRequest_Payload,
  Lib_Notifiers_Apprise_Runner_BuildRequest_Returns,
  Lib_Notifiers_Apprise_Runner_Constructor_Notifier,
  Lib_Notifiers_Apprise_Runner_Notifier,
  Lib_Notifiers_Apprise_Runner_Send_Dependencies,
  Lib_Notifiers_Apprise_Runner_Send_Payload,
  Lib_Notifiers_Apprise_Runner_Send_Returns,
  Lib_Notifiers_Apprise_Runner_Validate_Returns,
  Lib_Notifiers_Apprise_Runner_Validate_Value,
} from '../../types/lib/notifiers/apprise.d.ts';

/**
 * Lib - Notifiers - Apprise.
 *
 * Owns Apprise configuration validation and Notify API request delivery.
 * The optional destination list stays in the existing request body position.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Apprise - Schema.
   *
   * Validates the stored Apprise endpoint and optional destination URLs.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('apprise'),
    name: z.string().min(1),
    url: z.url().refine((url) => url.startsWith('https://'), { message: 'URL must start with https://' }),
    urls: z.string().min(1).optional(),
  }).strict();

  /**
   * Lib - Notifiers - Apprise - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_Apprise_Runner_Notifier;

  /**
   * Lib - Notifiers - Apprise - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Apprise_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_Apprise_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Apprise - Build Request.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Apprise_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Apprise_Runner_BuildRequest_Returns}
   *
   * @since 1.2.0
   */
  public buildRequest(payload: Lib_Notifiers_Apprise_Runner_BuildRequest_Payload): Lib_Notifiers_Apprise_Runner_BuildRequest_Returns {
    return {
      url: this.#notifier['url'],
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: payload['message'],
        title: payload['title'],
        type: 'info',
        ...((this.#notifier['urls'] === undefined) ? {} : { urls: this.#notifier['urls'] }),
      }),
    };
  }

  /**
   * Lib - Notifiers - Apprise - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Apprise_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Apprise_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Apprise_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_Apprise_Runner_Send_Payload, dependencies: Lib_Notifiers_Apprise_Runner_Send_Dependencies): Lib_Notifiers_Apprise_Runner_Send_Returns {
    await HttpDelivery.send(this.buildRequest(payload), dependencies);

    return;
  }

  /**
   * Lib - Notifiers - Apprise - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Apprise_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Apprise_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Apprise_Runner_Validate_Value): Lib_Notifiers_Apprise_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
