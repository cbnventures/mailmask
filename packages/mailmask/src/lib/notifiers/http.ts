import type {
  Lib_Notifiers_Http_Runner_Send_Dependencies,
  Lib_Notifiers_Http_Runner_Send_Request,
  Lib_Notifiers_Http_Runner_Send_Response,
  Lib_Notifiers_Http_Runner_Send_Returns,
  Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Returns,
  Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Trimmed,
  Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Value,
} from '../../types/lib/notifiers/http.d.ts';

/**
 * Lib - Notifiers - HTTP.
 *
 * Owns shared HTTP delivery and its established failure wording.
 * Service adapters supply the exact request and the Worker supplies the deadline.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - HTTP - Send.
   *
   * Sends one adapter-built request and translates transport and status failures.
   * An aborted fetch returns so the Worker's timeout boundary supplies its message.
   *
   * @param {Lib_Notifiers_Http_Runner_Send_Request}      request      - Request.
   * @param {Lib_Notifiers_Http_Runner_Send_Dependencies} dependencies - Dependencies.
   *
   * @returns {Lib_Notifiers_Http_Runner_Send_Returns}
   *
   * @since 1.2.0
   */
  public static async send(request: Lib_Notifiers_Http_Runner_Send_Request, dependencies: Lib_Notifiers_Http_Runner_Send_Dependencies): Lib_Notifiers_Http_Runner_Send_Returns {
    let response: Lib_Notifiers_Http_Runner_Send_Response = undefined;

    try {
      response = await dependencies.fetch(request['url'], {
        body: request['body'],
        headers: request['headers'],
        method: request['method'],
        signal: dependencies['signal'],
      });
    } catch {
      if (dependencies['signal'].aborted === true) {
        return;
      }

      throw new Error('request failed.');
    }

    if (response['ok'] === false) {
      throw new Error(`returned HTTP ${String(response['status'])}.`);
    }

    return;
  }

  /**
   * Lib - Notifiers - HTTP - Trim Trailing Slashes.
   *
   * Removes trailing slashes before a service adapter appends its fixed API path.
   * The rest of the configured base URL remains byte-for-byte unchanged.
   *
   * @param {Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Returns}
   *
   * @since 1.2.0
   */
  public static trimTrailingSlashes(value: Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Value): Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Returns {
    let trimmed: Lib_Notifiers_Http_Runner_TrimTrailingSlashes_Trimmed = value;

    while (trimmed.endsWith('/') === true) {
      trimmed = trimmed.slice(0, -1);
    }

    return trimmed;
  }
}
