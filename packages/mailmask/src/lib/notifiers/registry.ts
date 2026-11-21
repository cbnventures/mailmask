import { z } from 'zod';

import { Runner as AppriseNotifier } from './apprise.js';
import { Runner as DiscordNotifier } from './discord.js';
import { Runner as EmailNotifier } from './email.js';
import { Runner as GotifyNotifier } from './gotify.js';
import { Runner as MatrixNotifier } from './matrix.js';
import { Runner as NtfyReverseProxyNotifier } from './ntfy-reverse-proxy.js';
import { Runner as NtfyNotifier } from './ntfy.js';
import { Runner as PushoverNotifier } from './pushover.js';
import { Runner as SlackNotifier } from './slack.js';
import { Runner as TelegramNotifier } from './telegram.js';
import { Runner as WebhookNotifier } from './webhook.js';

import type {
  Lib_Notifiers_Registry_Runner_Create_Notifier,
  Lib_Notifiers_Registry_Runner_Create_Returns,
  Lib_Notifiers_Registry_Runner_CreateHttp_Notifier,
  Lib_Notifiers_Registry_Runner_CreateHttp_Returns,
  Lib_Notifiers_Registry_Runner_Validate_Returns,
  Lib_Notifiers_Registry_Runner_Validate_Value,
} from '../../types/lib/notifiers/registry.d.ts';

/**
 * Lib - Notifiers - Registry.
 *
 * Selects the project-owned adapter and validation schema for each notifier type.
 * Callers never switch on a third-party service or construct its request directly.
 *
 * @since 1.2.0
 */
export class Runner {
  /**
   * Lib - Notifiers - Registry - Schemas.
   *
   * Exposes adapter-owned schemas under their existing service keys so the public
   * schema module can preserve every named export without duplicating rules.
   *
   * @since 1.2.0
   */
  public static readonly schemas = {
    'apprise': AppriseNotifier['schema'],
    'discord': DiscordNotifier['schema'],
    'email': EmailNotifier['schema'],
    'gotify': GotifyNotifier['schema'],
    'matrix': MatrixNotifier['schema'],
    'ntfy': NtfyNotifier['schema'],
    'ntfy-reverse-proxy': NtfyReverseProxyNotifier['schema'],
    'pushover': PushoverNotifier['schema'],
    'slack': SlackNotifier['schema'],
    'telegram': TelegramNotifier['schema'],
    'webhook': WebhookNotifier['schema'],
  };

  /**
   * Lib - Notifiers - Registry - Schema.
   *
   * Preserves the discriminated notifier union while each branch belongs to its
   * adapter. Error messages and stored configuration shapes remain unchanged.
   *
   * @since 1.2.0
   */
  public static readonly schema = z.discriminatedUnion('type', [
    AppriseNotifier['schema'],
    DiscordNotifier['schema'],
    EmailNotifier['schema'],
    GotifyNotifier['schema'],
    MatrixNotifier['schema'],
    NtfyNotifier['schema'],
    NtfyReverseProxyNotifier['schema'],
    PushoverNotifier['schema'],
    SlackNotifier['schema'],
    TelegramNotifier['schema'],
    WebhookNotifier['schema'],
  ]);

  /**
   * Lib - Notifiers - Registry - Create.
   *
   * Keeps service selection behind the project-owned registry boundary.
   * Existing notifier configuration and caller behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Registry_Runner_Create_Notifier} notifier - Notifier.
   *
   * @returns {Lib_Notifiers_Registry_Runner_Create_Returns}
   *
   * @since 1.2.0
   */
  public static create(notifier: Lib_Notifiers_Registry_Runner_Create_Notifier): Lib_Notifiers_Registry_Runner_Create_Returns {
    if (notifier['type'] === 'email') {
      return new EmailNotifier(notifier);
    }

    return Runner.createHttp(notifier);
  }

  /**
   * Lib - Notifiers - Registry - Create HTTP.
   *
   * Returns an HTTP adapter whose exact request remains inspectable by callers.
   * Email is excluded because Cloudflare delivers it through a binding.
   *
   * @param {Lib_Notifiers_Registry_Runner_CreateHttp_Notifier} notifier - Notifier.
   *
   * @returns {Lib_Notifiers_Registry_Runner_CreateHttp_Returns}
   *
   * @since 1.2.0
   */
  public static createHttp(notifier: Lib_Notifiers_Registry_Runner_CreateHttp_Notifier): Lib_Notifiers_Registry_Runner_CreateHttp_Returns {
    switch (notifier['type']) {
      case 'apprise': {
        return new AppriseNotifier(notifier);
      }

      case 'discord': {
        return new DiscordNotifier(notifier);
      }

      case 'gotify': {
        return new GotifyNotifier(notifier);
      }

      case 'matrix': {
        return new MatrixNotifier(notifier);
      }

      case 'ntfy': {
        return new NtfyNotifier(notifier);
      }

      case 'ntfy-reverse-proxy': {
        return new NtfyReverseProxyNotifier(notifier);
      }

      case 'pushover': {
        return new PushoverNotifier(notifier);
      }

      case 'slack': {
        return new SlackNotifier(notifier);
      }

      case 'telegram': {
        return new TelegramNotifier(notifier);
      }

      case 'webhook': {
        return new WebhookNotifier(notifier);
      }

      default: {
        throw new Error('does not have an HTTP request.');
      }
    }
  }

  /**
   * Lib - Notifiers - Registry - Validate.
   *
   * Validates an unknown stored or entered notifier through its adapter schema.
   * Existing notifier configuration and caller behavior remain unchanged.
   *
   * @param {Lib_Notifiers_Registry_Runner_Validate_Value} value - Value.
   *
   * @returns {Lib_Notifiers_Registry_Runner_Validate_Returns}
   *
   * @since 1.2.0
   */
  public static validate(value: Lib_Notifiers_Registry_Runner_Validate_Value): Lib_Notifiers_Registry_Runner_Validate_Returns {
    return Runner['schema'].safeParse(value)['success'];
  }
}
