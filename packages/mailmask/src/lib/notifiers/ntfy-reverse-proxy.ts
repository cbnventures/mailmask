import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_NtfyReverseProxy_Runner_BuildRequest_BearerHeaders,
  Lib_Notifiers_NtfyReverseProxy_Runner_BuildRequest_Payload,
  Lib_Notifiers_NtfyReverseProxy_Runner_BuildRequest_Returns,
  Lib_Notifiers_NtfyReverseProxy_Runner_Constructor_Notifier,
  Lib_Notifiers_NtfyReverseProxy_Runner_Notifier,
  Lib_Notifiers_NtfyReverseProxy_Runner_Send_Dependencies,
  Lib_Notifiers_NtfyReverseProxy_Runner_Send_Payload,
  Lib_Notifiers_NtfyReverseProxy_Runner_Send_Returns,
  Lib_Notifiers_NtfyReverseProxy_Runner_Validate_Returns,
  Lib_Notifiers_NtfyReverseProxy_Runner_Validate_Value,
} from '../../types/lib/notifiers/ntfy-reverse-proxy.d.ts';

/**
 * Lib - Notifiers - Ntfy Reverse Proxy.
 *
 * Owns Reverse Proxy for ntfy validation, optional bearer auth, and delivery.
 * Existing configuration and delivery behavior remain unchanged.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Ntfy Reverse Proxy - Schema.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('ntfy-reverse-proxy'),
    name: z.string().min(1),
    url: z.url().refine((url) => url.startsWith('https://'), { message: 'URL must start with https://' }),
    token: z.string().min(1).optional(),
  }).strict();

  /**
   * Lib - Notifiers - Ntfy Reverse Proxy - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_NtfyReverseProxy_Runner_Notifier;

  /**
   * Lib - Notifiers - Ntfy Reverse Proxy - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_NtfyReverseProxy_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_NtfyReverseProxy_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Ntfy Reverse Proxy - Build Request.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_NtfyReverseProxy_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_NtfyReverseProxy_Runner_BuildRequest_Returns}
   *
   * @since 1.2.0
   */
  public buildRequest(payload: Lib_Notifiers_NtfyReverseProxy_Runner_BuildRequest_Payload): Lib_Notifiers_NtfyReverseProxy_Runner_BuildRequest_Returns {
    const bearerHeaders: Lib_Notifiers_NtfyReverseProxy_Runner_BuildRequest_BearerHeaders = (this.#notifier['token'] === undefined) ? {} : { Authorization: `Bearer ${this.#notifier['token']}` };

    return {
      url: this.#notifier['url'],
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...bearerHeaders,
      },
      body: JSON.stringify(payload),
    };
  }

  /**
   * Lib - Notifiers - Ntfy Reverse Proxy - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_NtfyReverseProxy_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_NtfyReverseProxy_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_NtfyReverseProxy_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_NtfyReverseProxy_Runner_Send_Payload, dependencies: Lib_Notifiers_NtfyReverseProxy_Runner_Send_Dependencies): Lib_Notifiers_NtfyReverseProxy_Runner_Send_Returns {
    await HttpDelivery.send(this.buildRequest(payload), dependencies);

    return;
  }

  /**
   * Lib - Notifiers - Ntfy Reverse Proxy - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_NtfyReverseProxy_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_NtfyReverseProxy_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_NtfyReverseProxy_Runner_Validate_Value): Lib_Notifiers_NtfyReverseProxy_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
