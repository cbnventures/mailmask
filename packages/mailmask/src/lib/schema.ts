import { z } from 'zod';

import {
  LIB_REGEX_ALIAS_ADDRESS,
  LIB_REGEX_BASE_DOMAIN,
  LIB_REGEX_DESTINATION_NAME,
  LIB_REGEX_EMAIL_ADDRESS,
  LIB_REGEX_SENDER_PATTERN,
  LIB_REGEX_WORKER_NAME,
} from './regex.js';

/**
 * Lib - Schema - Destination Schema.
 *
 * Validates a destination inbox: a short name that aliases reference
 * and the real email address that forwarded mail is delivered to.
 *
 * @since 0.0.1
 */
const destinationSchema = z.object({
  name: z.string().min(1).regex(LIB_REGEX_DESTINATION_NAME, { message: 'Destination name must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen' }),
  email: z.string().min(1).regex(LIB_REGEX_EMAIL_ADDRESS, { message: 'Destination email must be a valid email address' }),
}).strict();

/**
 * Lib - Schema - Sender Pattern Schema.
 *
 * Validates a single sender rule used by the allow and block lists,
 * either a full address or a "*@domain" wildcard.
 *
 * @since 0.0.1
 */
const senderPatternSchema = z.string().min(1).regex(LIB_REGEX_SENDER_PATTERN, { message: 'Sender rules must be a full address (news@shop.com) or a domain wildcard (*@shop.com)' });

/**
 * Lib - Schema - Alias Schema.
 *
 * Validates an alias: the local part that receives mail, the destination
 * it forwards to, and the optional label, expiry, and sender rules.
 *
 * @since 0.0.1
 */
const aliasSchema = z.object({
  address: z.string().min(1).max(64).regex(LIB_REGEX_ALIAS_ADDRESS, { message: 'Alias address must contain only lowercase alphanumeric characters, dots, hyphens, and underscores, and cannot start or end with a separator' }),
  destination: z.string().min(1),
  label: z.string().min(1).optional(),
  enabled: z.boolean(),
  expires_at: z.iso.datetime({ offset: true }).optional(),
  allowed_senders: z.array(senderPatternSchema).optional(),
  blocked_senders: z.array(senderPatternSchema).optional(),
}).strict();

/**
 * Lib - Schema - Ntfy Notifier Schema.
 *
 * Validates a notifier that publishes straight to an ntfy server topic
 * with an access token, the same shape Branded Short Links uses.
 *
 * @since 0.0.1
 */
const ntfyNotifierSchema = z.object({
  type: z.literal('ntfy'),
  name: z.string().min(1),
  server: z.url().refine((server) => server.startsWith('https://'), { message: 'Server URL must start with https://' }),
  topic: z.string().min(1),
  token: z.string().startsWith('tk_'),
}).strict();

/**
 * Lib - Schema - Ntfy Reverse Proxy Notifier Schema.
 *
 * Validates a notifier that posts to a Reverse Proxy for ntfy context
 * URL, with the context token when the context requires one.
 *
 * @since 0.0.1
 */
const ntfyReverseProxyNotifierSchema = z.object({
  type: z.literal('ntfy-reverse-proxy'),
  name: z.string().min(1),
  url: z.url().refine((url) => url.startsWith('https://'), { message: 'URL must start with https://' }),
  token: z.string().min(1).optional(),
}).strict();

/**
 * Lib - Schema - Notifier Schema.
 *
 * Discriminated union over the notifier type field, so each notifier
 * is validated against the fields its type needs.
 *
 * @since 0.0.1
 */
const notifierSchema = z.discriminatedUnion('type', [
  ntfyNotifierSchema,
  ntfyReverseProxyNotifierSchema,
]);

/**
 * Lib - Schema - Settings Schema.
 *
 * Validates global settings such as the Worker name, the email domain,
 * and what happens to mail for addresses that are not aliases.
 *
 * @since 0.0.1
 */
const settingsSchema = z.object({
  worker_name: z.string().min(1).regex(LIB_REGEX_WORKER_NAME, { message: 'Worker name must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen' }),
  base_domain: z.string().min(1).regex(LIB_REGEX_BASE_DOMAIN, { message: 'Base domain must be a valid domain name (lowercase alphanumeric characters, hyphens, and dots)' }),
  unknown_alias_action: z.enum([
    'reject',
    'drop',
    'forward',
  ]),
  default_destination: z.string().min(1).optional(),
  subaddressing: z.boolean(),
  add_alias_headers: z.boolean(),
}).strict().refine((settings) => settings['unknown_alias_action'] !== 'forward' || settings['default_destination'] !== undefined, {
  message: 'A default_destination is required when unknown_alias_action is "forward"',
  path: ['default_destination'],
});

/**
 * Lib - Schema - Config Schema.
 *
 * Top-level schema that composes destinations, aliases, notifiers, and
 * settings into a single validated configuration object.
 *
 * @since 0.0.1
 */
const configSchema = z.object({
  destinations: z.array(destinationSchema),
  aliases: z.array(aliasSchema),
  notifiers: z.array(notifierSchema),
  settings: settingsSchema,
});

/**
 * Lib - Schema - Cloudflare Envelope Schema.
 *
 * Validates the response envelope that wraps every Cloudflare v4
 * API result, including the error list returned on failure.
 *
 * @since 0.0.1
 */
const cloudflareEnvelopeSchema = z.object({
  success: z.boolean(),
  errors: z.array(z.object({
    code: z.number(),
    message: z.string(),
  })).optional(),
  result: z.unknown(),
});

/**
 * Lib - Schema - Cloudflare Zones Schema.
 *
 * Validates the zone list returned when looking up the zone
 * (and owning account) that serves the base domain.
 *
 * @since 0.0.1
 */
const cloudflareZonesSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  account: z.object({
    id: z.string(),
  }),
}));

/**
 * Lib - Schema - Cloudflare Email Routing Settings Schema.
 *
 * Validates the Email Routing settings of a zone, used to confirm
 * that Email Routing is enabled before the catch-all is configured.
 *
 * @since 0.0.1
 */
const cloudflareEmailRoutingSettingsSchema = z.object({
  enabled: z.boolean(),
});

/**
 * Lib - Schema - Cloudflare Destination Addresses Schema.
 *
 * Validates the account-level destination addresses that Email
 * Routing is allowed to forward to, with their verification time.
 *
 * @since 0.0.1
 */
const cloudflareDestinationAddressesSchema = z.array(z.object({
  email: z.string(),
  verified: z.string().nullable().optional(),
}));

/**
 * Lib - Schema - Cloudflare Catch All Schema.
 *
 * Validates the catch-all rule of a zone so the previous action
 * can be reported before it is pointed at the Worker.
 *
 * @since 0.0.1
 */
const cloudflareCatchAllSchema = z.object({
  enabled: z.boolean().optional(),
  actions: z.array(z.object({
    type: z.string(),
    value: z.array(z.string()).optional(),
  })),
});

export {
  aliasSchema,
  cloudflareCatchAllSchema,
  cloudflareDestinationAddressesSchema,
  cloudflareEmailRoutingSettingsSchema,
  cloudflareEnvelopeSchema,
  cloudflareZonesSchema,
  configSchema,
  destinationSchema,
  notifierSchema,
  ntfyNotifierSchema,
  ntfyReverseProxyNotifierSchema,
  senderPatternSchema,
  settingsSchema,
};
