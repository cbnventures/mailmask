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
 * Lib - Schema - Apprise Notifier Schema.
 *
 * Validates an Apprise API endpoint and the optional Apprise notification
 * URLs that the API should target.
 *
 * @since 1.0.0
 */
const appriseNotifierSchema = z.object({
  type: z.literal('apprise'),
  name: z.string().min(1),
  url: z.url().refine((url) => url.startsWith('https://'), { message: 'URL must start with https://' }),
  urls: z.string().min(1).optional(),
}).strict();

/**
 * Lib - Schema - Discord Notifier Schema.
 *
 * Validates a Discord incoming webhook notifier. Only Discord's documented
 * webhook URL forms are accepted.
 *
 * @since 1.0.0
 */
const discordNotifierSchema = z.object({
  type: z.literal('discord'),
  name: z.string().min(1),
  webhook_url: z.url().refine((url) => url.startsWith('https://discord.com/api/webhooks/') || url.startsWith('https://discordapp.com/api/webhooks/'), { message: 'Discord webhook URL must start with https://discord.com/api/webhooks/' }),
}).strict();

/**
 * Lib - Schema - Email Notifier Schema.
 *
 * Validates the sender and verified recipient used by a Cloudflare
 * send_email binding.
 *
 * @since 1.0.0
 */
const emailNotifierSchema = z.object({
  type: z.literal('email'),
  name: z.string().min(1),
  from: z.string().min(1).regex(LIB_REGEX_EMAIL_ADDRESS, { message: 'From must be a valid email address' }),
  to: z.string().min(1).regex(LIB_REGEX_EMAIL_ADDRESS, { message: 'To must be a valid email address' }),
}).strict();

/**
 * Lib - Schema - Gotify Notifier Schema.
 *
 * Validates a Gotify server and application token. Mailmask appends Gotify's
 * message endpoint to the configured server URL.
 *
 * @since 1.0.0
 */
const gotifyNotifierSchema = z.object({
  type: z.literal('gotify'),
  name: z.string().min(1),
  url: z.url().refine((url) => url.startsWith('https://'), { message: 'URL must start with https://' }),
  token: z.string().min(1),
}).strict();

/**
 * Lib - Schema - Matrix Notifier Schema.
 *
 * Validates a Matrix homeserver, room ID, and access token. Room IDs use the
 * canonical exclamation-mark form expected by the client API.
 *
 * @since 1.0.0
 */
const matrixNotifierSchema = z.object({
  type: z.literal('matrix'),
  name: z.string().min(1),
  homeserver_url: z.url().refine((url) => url.startsWith('https://'), { message: 'Homeserver URL must start with https://' }),
  room_id: z.string().startsWith('!'),
  access_token: z.string().min(1),
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
 * Lib - Schema - Pushover Notifier Schema.
 *
 * Validates a Pushover user key and application API token. Both values are
 * required by Pushover's message endpoint.
 *
 * @since 1.0.0
 */
const pushoverNotifierSchema = z.object({
  type: z.literal('pushover'),
  name: z.string().min(1),
  user_key: z.string().min(1),
  app_token: z.string().min(1),
}).strict();

/**
 * Lib - Schema - Slack Notifier Schema.
 *
 * Validates a Slack incoming webhook notifier. Only Slack's documented
 * incoming-webhook URL prefix is accepted.
 *
 * @since 1.0.0
 */
const slackNotifierSchema = z.object({
  type: z.literal('slack'),
  name: z.string().min(1),
  webhook_url: z.url().refine((url) => url.startsWith('https://hooks.slack.com/'), { message: 'Slack webhook URL must start with https://hooks.slack.com/' }),
}).strict();

/**
 * Lib - Schema - Telegram Notifier Schema.
 *
 * Validates a Telegram bot token and target chat ID. The chat ID remains a
 * string so both numeric IDs and channel usernames are supported.
 *
 * @since 1.0.0
 */
const telegramNotifierSchema = z.object({
  type: z.literal('telegram'),
  name: z.string().min(1),
  bot_token: z.string().min(1),
  chat_id: z.string().min(1),
}).strict();

/**
 * Lib - Schema - Webhook Notifier Schema.
 *
 * Validates a generic HTTPS webhook and its optional bearer token. Webhooks
 * receive Mailmask's versioned JSON payload without service translation.
 *
 * @since 1.0.0
 */
const webhookNotifierSchema = z.object({
  type: z.literal('webhook'),
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
 * @since 1.0.0
 */
const notifierSchema = z.discriminatedUnion('type', [
  appriseNotifierSchema,
  discordNotifierSchema,
  emailNotifierSchema,
  gotifyNotifierSchema,
  matrixNotifierSchema,
  ntfyNotifierSchema,
  ntfyReverseProxyNotifierSchema,
  pushoverNotifierSchema,
  slackNotifierSchema,
  telegramNotifierSchema,
  webhookNotifierSchema,
]);

/**
 * Lib - Schema - Settings Schema.
 *
 * Validates global settings such as the Worker name, the email domain,
 * subaddressing, and whether forwarded mail carries alias headers.
 *
 * @since 1.1.0
 */
const settingsSchema = z.object({
  worker_name: z.string().min(1).regex(LIB_REGEX_WORKER_NAME, { message: 'Worker name must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen' }),
  base_domain: z.string().min(1).regex(LIB_REGEX_BASE_DOMAIN, { message: 'Base domain must be a valid domain name (lowercase alphanumeric characters, hyphens, and dots)' }),
  subaddressing: z.boolean(),
  add_alias_headers: z.boolean(),
}).strict();

/**
 * Lib - Schema - Config Schema.
 *
 * Top-level schema that composes destinations, aliases, notifiers, and
 * settings into a single validated configuration object.
 *
 * @since 1.0.0
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
 * API result, including the error list, which some endpoints such
 * as Workers custom domains send as null on success.
 *
 * @since 0.0.1
 */
const cloudflareEnvelopeSchema = z.object({
  success: z.boolean(),
  errors: z.array(z.object({
    code: z.number(),
    message: z.string(),
  })).nullish(),
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
 * Validates the Email Routing settings of a zone, used to confirm that Email
 * Routing is enabled and whether "alias+tag@" already matches alias rules.
 *
 * @since 1.1.0
 */
const cloudflareEmailRoutingSettingsSchema = z.object({
  enabled: z.boolean(),
  support_subaddress: z.boolean().optional(),
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
 * Validates the catch-all rule of a zone so deploy can tell whether
 * Mailmask 1.0.0 pointed it at the Worker and hand it back.
 *
 * @since 1.1.0
 */
const cloudflareCatchAllSchema = z.object({
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  actions: z.array(z.object({
    type: z.string(),
    value: z.array(z.string()).optional(),
  })),
});

/**
 * Lib - Schema - Cloudflare Routing Rules Schema.
 *
 * Validates the Email Routing rules on a zone so deploy can keep one literal
 * rule per enabled alias and leave every rule it did not create alone.
 *
 * @since 1.1.0
 */
const cloudflareRoutingRulesSchema = z.array(z.object({
  id: z.string(),
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  matchers: z.array(z.object({
    type: z.string(),
    field: z.string().optional(),
    value: z.string().optional(),
  })),
  actions: z.array(z.object({
    type: z.string(),
    value: z.array(z.string()).optional(),
  })),
}));

/**
 * Lib - Schema - Cloudflare Worker Domains Schema.
 *
 * Validates the Workers custom domains on a zone so deploy can attach the
 * missing ones and refuse hostnames that already belong to another Worker.
 *
 * @since 1.1.0
 */
const cloudflareWorkerDomainsSchema = z.array(z.object({
  hostname: z.string(),
  service: z.string(),
}));

export {
  aliasSchema,
  appriseNotifierSchema,
  cloudflareCatchAllSchema,
  cloudflareDestinationAddressesSchema,
  cloudflareEmailRoutingSettingsSchema,
  cloudflareEnvelopeSchema,
  cloudflareRoutingRulesSchema,
  cloudflareWorkerDomainsSchema,
  cloudflareZonesSchema,
  configSchema,
  destinationSchema,
  discordNotifierSchema,
  emailNotifierSchema,
  gotifyNotifierSchema,
  matrixNotifierSchema,
  notifierSchema,
  ntfyNotifierSchema,
  ntfyReverseProxyNotifierSchema,
  pushoverNotifierSchema,
  senderPatternSchema,
  settingsSchema,
  slackNotifierSchema,
  telegramNotifierSchema,
  webhookNotifierSchema,
};
