import { z } from 'zod';

import { Runner as HttpDelivery } from './http.js';

import type {
  Lib_Notifiers_Slack_Runner_BuildRequest_Payload,
  Lib_Notifiers_Slack_Runner_BuildRequest_Returns,
  Lib_Notifiers_Slack_Runner_Constructor_Notifier,
  Lib_Notifiers_Slack_Runner_Escape_Returns,
  Lib_Notifiers_Slack_Runner_Escape_Value,
  Lib_Notifiers_Slack_Runner_Notifier,
  Lib_Notifiers_Slack_Runner_Send_Dependencies,
  Lib_Notifiers_Slack_Runner_Send_Payload,
  Lib_Notifiers_Slack_Runner_Send_Returns,
  Lib_Notifiers_Slack_Runner_Validate_Returns,
  Lib_Notifiers_Slack_Runner_Validate_Value,
} from '../../types/lib/notifiers/slack.d.ts';

/**
 * Lib - Notifiers - Slack.
 *
 * Owns Slack webhook validation, message escaping, and delivery.
 * Existing configuration and delivery behavior remain unchanged.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Slack - Schema.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('slack'),
    name: z.string().min(1),
    webhook_url: z.url().refine((url) => url.startsWith('https://hooks.slack.com/'), { message: 'Slack webhook URL must start with https://hooks.slack.com/' }),
  }).strict();

  /**
   * Lib - Notifiers - Slack - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_Slack_Runner_Notifier;

  /**
   * Lib - Notifiers - Slack - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Slack_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_Slack_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Slack - Build Request.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Slack_Runner_BuildRequest_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Slack_Runner_BuildRequest_Returns}
   *
   * @since 1.2.0
   */
  public buildRequest(payload: Lib_Notifiers_Slack_Runner_BuildRequest_Payload): Lib_Notifiers_Slack_Runner_BuildRequest_Returns {
    return {
      url: this.#notifier['webhook_url'],
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: [
          `*${Runner.escape(payload['title'])}*`,
          Runner.escape(payload['message']),
        ].join('\n'),
      }),
    };
  }

  /**
   * Lib - Notifiers - Slack - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Slack_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Slack_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Slack_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_Slack_Runner_Send_Payload, dependencies: Lib_Notifiers_Slack_Runner_Send_Dependencies): Lib_Notifiers_Slack_Runner_Send_Returns {
    await HttpDelivery.send(this.buildRequest(payload), dependencies);

    return;
  }

  /**
   * Lib - Notifiers - Slack - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Slack_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Slack_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Slack_Runner_Validate_Value): Lib_Notifiers_Slack_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }

  /**
   * Lib - Notifiers - Slack - Escape.
   *
   * Escapes the three characters Slack reserves before it formats message text.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Slack_Runner_Escape_Value} value - Value.
   *
   * @private
   *
   * @returns {Lib_Notifiers_Slack_Runner_Escape_Returns}
   *
   * @since 1.2.0
   */
  private static escape(value: Lib_Notifiers_Slack_Runner_Escape_Value): Lib_Notifiers_Slack_Runner_Escape_Returns {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }
}
