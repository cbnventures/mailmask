import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Matrix_Runner_BuildRequest_Payload,
  Lib_Notifiers_Matrix_Runner_BuildRequest_Returns,
  Lib_Notifiers_Matrix_Runner_BuildRequest_TransactionId,
  Lib_Notifiers_Matrix_Runner_Constructor_Notifier,
  Lib_Notifiers_Matrix_Runner_Notifier,
  Lib_Notifiers_Matrix_Runner_Send_Dependencies,
  Lib_Notifiers_Matrix_Runner_Send_Payload,
  Lib_Notifiers_Matrix_Runner_Send_Returns,
  Lib_Notifiers_Matrix_Runner_Validate_Returns,
  Lib_Notifiers_Matrix_Runner_Validate_Value,
} from '../../types/lib/notifiers/matrix.d.ts';

/**
 * Lib - Notifiers - Matrix.
 *
 * Owns Matrix configuration, access-token authentication, and room delivery.
 * Existing configuration and delivery behavior remain unchanged.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Matrix - Schema.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('matrix'),
    name: z.string().min(1),
    homeserver_url: z.url().refine((url) => url.startsWith('https://'), { message: 'Homeserver URL must start with https://' }),
    room_id: z.string().startsWith('!'),
    access_token: z.string().min(1),
  }).strict();

  /**
   * Lib - Notifiers - Matrix - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_Matrix_Runner_Notifier;

  /**
   * Lib - Notifiers - Matrix - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Matrix_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_Matrix_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Matrix - Build Request.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Matrix_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Matrix_Runner_BuildRequest_Returns}
   *
   * @since 1.2.0
   */
  public buildRequest(payload: Lib_Notifiers_Matrix_Runner_BuildRequest_Payload): Lib_Notifiers_Matrix_Runner_BuildRequest_Returns {
    const transactionId: Lib_Notifiers_Matrix_Runner_BuildRequest_TransactionId = `${String(Date.now())}-${Math.random().toString(36).slice(2)}`;

    return {
      url: `${HttpDelivery.trimTrailingSlashes(this.#notifier['homeserver_url'])}/_matrix/client/v3/rooms/${encodeURIComponent(this.#notifier['room_id'])}/send/m.room.message/${transactionId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.#notifier['access_token']}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: [
          payload['title'],
          payload['message'],
        ].join('\n'),
        msgtype: 'm.text',
      }),
    };
  }

  /**
   * Lib - Notifiers - Matrix - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Matrix_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Matrix_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Matrix_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_Matrix_Runner_Send_Payload, dependencies: Lib_Notifiers_Matrix_Runner_Send_Dependencies): Lib_Notifiers_Matrix_Runner_Send_Returns {
    await HttpDelivery.send(this.buildRequest(payload), dependencies);

    return;
  }

  /**
   * Lib - Notifiers - Matrix - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Matrix_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Matrix_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Matrix_Runner_Validate_Value): Lib_Notifiers_Matrix_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
