import { z } from 'zod';

import { LIB_REGEX_EMAIL_ADDRESS } from '../regex.js';

import type {
  Lib_Notifiers_Email_Runner_BuildMessage_Payload,
  Lib_Notifiers_Email_Runner_BuildMessage_Returns,
  Lib_Notifiers_Email_Runner_Constructor_Notifier,
  Lib_Notifiers_Email_Runner_Notifier,
  Lib_Notifiers_Email_Runner_Send_Dependencies,
  Lib_Notifiers_Email_Runner_Send_Payload,
  Lib_Notifiers_Email_Runner_Send_Returns,
  Lib_Notifiers_Email_Runner_Validate_Returns,
  Lib_Notifiers_Email_Runner_Validate_Value,
} from '../../types/lib/notifiers/email.d.ts';

/**
 * Lib - Notifiers - Email.
 *
 * Owns notifier email validation, message construction, and send_email delivery.
 * Existing configuration and delivery behavior remain unchanged.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Email - Schema.
   *
   * Validates the sender and verified recipient used by Cloudflare's binding.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.object({
    type: z.literal('email'),
    name: z.string().min(1),
    from: z.string().min(1).regex(LIB_REGEX_EMAIL_ADDRESS, { message: 'From must be a valid email address' }),
    to: z.string().min(1).regex(LIB_REGEX_EMAIL_ADDRESS, { message: 'To must be a valid email address' }),
  }).strict();

  /**
   * Lib - Notifiers - Email - Notifier.
   *
   * Keeps the validated stored configuration used to build each delivery.
   * The value never leaves its service-specific adapter.
   *
   * @private
   *
   * @since 1.2.0
   */
  readonly #notifier: Lib_Notifiers_Email_Runner_Notifier;

  /**
   * Lib - Notifiers - Email - Constructor.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Email_Runner_Constructor_Notifier} notifier - Notifier.
   *
   * @since 1.2.0
   */
  public constructor(notifier: Lib_Notifiers_Email_Runner_Constructor_Notifier) {
    this.#notifier = notifier;

    return;
  }

  /**
   * Lib - Notifiers - Email - Build Message.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Email_Runner_BuildMessage_Payload} payload - Payload.
   *
   * @returns {Lib_Notifiers_Email_Runner_BuildMessage_Returns}
   *
   * @since 1.2.0
   */
  public buildMessage(payload: Lib_Notifiers_Email_Runner_BuildMessage_Payload): Lib_Notifiers_Email_Runner_BuildMessage_Returns {
    return {
      from: this.#notifier['from'],
      to: this.#notifier['to'],
      subject: payload['title'],
      text: [
        payload['message'],
        '',
        `Alias: ${payload['details']['alias']}`,
        `Envelope sender: ${payload['details']['envelopeSender']}`,
        `Recipient: ${payload['details']['recipient']}`,
        `Reason: ${payload['details']['reason']}`,
      ].join('\n'),
    };
  }

  /**
   * Lib - Notifiers - Email - Send.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Email_Runner_Send_Payload}      payload      - Payload.
   * @param {Lib_Notifiers_Email_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Email_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public async send(payload: Lib_Notifiers_Email_Runner_Send_Payload, dependencies: Lib_Notifiers_Email_Runner_Send_Dependencies): Lib_Notifiers_Email_Runner_Send_Returns {
    if (dependencies['emailBinding'] === undefined) {
      throw new Error('The MAILMASK_EMAIL send_email binding is not configured.');
    }

    try {
      await dependencies.sendEmail(this.buildMessage(payload));
    } catch {
      throw new Error('delivery failed.');
    }

    return;
  }

  /**
   * Lib - Notifiers - Email - Validate.
   *
   * Keeps this service-specific responsibility behind the adapter boundary.
   * Existing configuration and delivery behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Email_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Email_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Email_Runner_Validate_Value): Lib_Notifiers_Email_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
