import { z } from 'zod';

import { Runner as NotifierRegistry } from './notifiers/registry.js';

import {
  LIB_REGEX_ALIAS_ADDRESS,
  LIB_REGEX_BASE_DOMAIN,
  LIB_REGEX_COUNTRY_CODE,
  LIB_REGEX_DESTINATION_NAME,
  LIB_REGEX_EMAIL_ADDRESS,
  LIB_REGEX_PHONE_NUMBER,
  LIB_REGEX_PHONE_SENDER_PATTERN,
  LIB_REGEX_SENDER_PATTERN,
  LIB_REGEX_WORKER_NAME,
} from './regex.js';

/**
 * Lib - Schema - Destination Schema.
 *
 * Validates a destination: a short name that aliases reference, the real email
 * address that forwarded mail is delivered to, and an optional real phone number.
 *
 * @since 1.2.0
 */
const destinationSchema = z.object({
  name: z.string().min(1).regex(LIB_REGEX_DESTINATION_NAME, { message: 'Destination name must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen' }),
  email: z.string().min(1).regex(LIB_REGEX_EMAIL_ADDRESS, { message: 'Destination email must be a valid email address' }),
  phone: z.string().regex(LIB_REGEX_PHONE_NUMBER, { message: 'Destination phone must be an E.164 number such as +15550100100' }).optional(),
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
 * Lib - Schema - Phone Sender Pattern Schema.
 *
 * Validates a single sender rule used by a phone alias allow or block list,
 * either a full number or a prefix ending in "*".
 *
 * @since 1.2.0
 */
const phoneSenderPatternSchema = z.string().min(1).regex(LIB_REGEX_PHONE_SENDER_PATTERN, { message: 'Phone sender rules must be a number (+15550100100), a short code (12345), a sender name (ACME), or a prefix ending in * (+1555*)' });

/**
 * Lib - Schema - Phone Alias Schema.
 *
 * Validates a phone alias: the number a provider rents to you, the provider that
 * receives its texts, the destination phone it forwards to, and the email rules.
 *
 * @since 1.2.0
 */
const phoneAliasSchema = z.object({
  number: z.string().regex(LIB_REGEX_PHONE_NUMBER, { message: 'Phone alias number must be an E.164 number such as +15550100100' }),
  provider: z.string().min(1),
  destination: z.string().min(1),
  label: z.string().min(1).optional(),
  enabled: z.boolean(),
  expires_at: z.iso.datetime({ offset: true }).optional(),
  allowed_senders: z.array(phoneSenderPatternSchema).optional(),
  blocked_senders: z.array(phoneSenderPatternSchema).optional(),
}).strict();

/**
 * Lib - Schema - Telnyx Provider Schema.
 *
 * Validates a Telnyx account: the API keys, the messaging profile deploy made, and
 * the optional countries that profile may text, which default to every country.
 *
 * @since 1.2.0
 */
const telnyxProviderSchema = z.object({
  type: z.literal('telnyx'),
  name: z.string().min(1).regex(LIB_REGEX_DESTINATION_NAME, { message: 'Provider name must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen' }),
  api_key: z.string().min(1),
  public_key: z.string().min(1),
  messaging_profile_id: z.string().min(1).optional(),
  destination_countries: z.array(z.string().regex(LIB_REGEX_COUNTRY_CODE, { message: 'Destination countries must be two-letter country codes such as US' })).min(1).optional(),
}).strict();

/**
 * Lib - Schema - Plivo Provider Schema.
 *
 * Validates a Plivo account: the auth ID and auth token used for API calls and
 * webhook signatures, and the application that deploy points numbers at.
 *
 * @since 1.2.0
 */
const plivoProviderSchema = z.object({
  type: z.literal('plivo'),
  name: z.string().min(1).regex(LIB_REGEX_DESTINATION_NAME, { message: 'Provider name must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen' }),
  auth_id: z.string().min(1),
  auth_token: z.string().min(1),
  application_id: z.string().min(1).optional(),
}).strict();

/**
 * Lib - Schema - Phone Provider Schema.
 *
 * Discriminated union over the provider type field, so each phone provider is
 * validated against the credentials its API needs.
 *
 * @since 1.2.0
 */
const phoneProviderSchema = z.discriminatedUnion('type', [
  plivoProviderSchema,
  telnyxProviderSchema,
]);

/**
 * Lib - Schema - Apprise Notifier Schema.
 *
 * References the validation rules owned by the Apprise adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 1.0.0
 */
const appriseNotifierSchema = NotifierRegistry['schemas']['apprise'];

/**
 * Lib - Schema - Discord Notifier Schema.
 *
 * References the validation rules owned by the Discord adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 1.0.0
 */
const discordNotifierSchema = NotifierRegistry['schemas']['discord'];

/**
 * Lib - Schema - Email Notifier Schema.
 *
 * References the validation rules owned by the email adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 1.0.0
 */
const emailNotifierSchema = NotifierRegistry['schemas']['email'];

/**
 * Lib - Schema - Gotify Notifier Schema.
 *
 * References the validation rules owned by the Gotify adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 1.0.0
 */
const gotifyNotifierSchema = NotifierRegistry['schemas']['gotify'];

/**
 * Lib - Schema - Matrix Notifier Schema.
 *
 * References the validation rules owned by the Matrix adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 1.0.0
 */
const matrixNotifierSchema = NotifierRegistry['schemas']['matrix'];

/**
 * Lib - Schema - Ntfy Notifier Schema.
 *
 * References the validation rules owned by the ntfy adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 0.0.1
 */
const ntfyNotifierSchema = NotifierRegistry['schemas']['ntfy'];

/**
 * Lib - Schema - Ntfy Reverse Proxy Notifier Schema.
 *
 * References the validation rules owned by the Reverse Proxy for ntfy adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 0.0.1
 */
const ntfyReverseProxyNotifierSchema = NotifierRegistry['schemas']['ntfy-reverse-proxy'];

/**
 * Lib - Schema - Pushover Notifier Schema.
 *
 * References the validation rules owned by the Pushover adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 1.0.0
 */
const pushoverNotifierSchema = NotifierRegistry['schemas']['pushover'];

/**
 * Lib - Schema - Slack Notifier Schema.
 *
 * References the validation rules owned by the Slack adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 1.0.0
 */
const slackNotifierSchema = NotifierRegistry['schemas']['slack'];

/**
 * Lib - Schema - Telegram Notifier Schema.
 *
 * References the validation rules owned by the Telegram adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 1.0.0
 */
const telegramNotifierSchema = NotifierRegistry['schemas']['telegram'];

/**
 * Lib - Schema - Webhook Notifier Schema.
 *
 * References the validation rules owned by the generic webhook adapter.
 * The public schema name remains available to existing callers.
 *
 * @since 1.0.0
 */
const webhookNotifierSchema = NotifierRegistry['schemas']['webhook'];

/**
 * Lib - Schema - Notifier Schema.
 *
 * Preserves the public discriminated union assembled from adapter-owned schemas.
 * Configuration parsing keeps its existing errors and inferred output shape.
 *
 * @since 1.0.0
 */
const notifierSchema = NotifierRegistry['schema'];

/**
 * Lib - Schema - Settings Schema.
 *
 * Validates global settings such as the Worker name, the email domain,
 * subaddressing, alias headers, and whether you can send and reply from aliases.
 *
 * @since 1.2.0
 */
const settingsSchema = z.object({
  worker_name: z.string().min(1).regex(LIB_REGEX_WORKER_NAME, { message: 'Worker name must contain only lowercase alphanumeric characters and hyphens, and cannot start or end with a hyphen' }),
  base_domain: z.string().min(1).regex(LIB_REGEX_BASE_DOMAIN, { message: 'Base domain must be a valid domain name (lowercase alphanumeric characters, hyphens, and dots)' }),
  subaddressing: z.boolean(),
  add_alias_headers: z.boolean(),
  send_from_aliases: z.boolean().optional(),
}).strict();

/**
 * Lib - Schema - Config Schema.
 *
 * Top-level schema that composes destinations, aliases, phone providers, phone
 * aliases, notifiers, and settings into a single validated configuration object.
 *
 * @since 1.2.0
 */
const configSchema = z.object({
  destinations: z.array(destinationSchema),
  aliases: z.array(aliasSchema),
  phone_providers: z.array(phoneProviderSchema).optional(),
  phone_aliases: z.array(phoneAliasSchema).optional(),
  notifiers: z.array(notifierSchema),
  settings: settingsSchema,
});

/**
 * Lib - Schema - Telnyx Webhook Schema.
 *
 * Validates the parts of a Telnyx messaging webhook that Mailmask reads: the
 * event type, the sender, the recipients, the text, and any MMS media links.
 *
 * @since 1.2.0
 */
const telnyxWebhookSchema = z.object({
  data: z.object({
    event_type: z.string(),
    payload: z.object({
      id: z.string(),
      from: z.object({
        phone_number: z.string(),
      }),
      to: z.array(z.object({
        phone_number: z.string(),
      })),
      text: z.string().nullish(),
      media: z.array(z.object({
        url: z.string(),
      })).nullish(),
    }).optional(),
  }),
});

/**
 * Lib - Schema - Telnyx Available Numbers Schema.
 *
 * Validates the number search result so the CLI can list numbers that can be
 * bought, with the features each one supports.
 *
 * @since 1.2.0
 */
const telnyxAvailableNumbersSchema = z.object({
  data: z.array(z.object({
    phone_number: z.string(),
    features: z.array(z.object({
      name: z.string(),
    })).optional(),
  })),
});

/**
 * Lib - Schema - Telnyx Phone Numbers Schema.
 *
 * Validates the account's phone number list, used to confirm a number belongs
 * to the account and to find the ID that releasing a number needs.
 *
 * @since 1.2.0
 */
const telnyxPhoneNumbersSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    phone_number: z.string(),
  })),
});

/**
 * Lib - Schema - Telnyx Messaging Profile Schema.
 *
 * Validates the messaging profile returned when deploy creates one, so its ID
 * can be saved and reused on the next deploy.
 *
 * @since 1.2.0
 */
const telnyxMessagingProfileSchema = z.object({
  data: z.object({
    id: z.string(),
  }),
});

/**
 * Lib - Schema - Telnyx Number Order Schema.
 *
 * Validates the order returned when a number is bought. Orders start pending
 * and fail only when Telnyx cannot sell the number.
 *
 * @since 1.2.0
 */
const telnyxNumberOrderSchema = z.object({
  data: z.object({
    id: z.string(),
    status: z.string(),
  }),
});

/**
 * Lib - Schema - Plivo Available Numbers Schema.
 *
 * Validates the Plivo number search result so the CLI can list numbers that
 * can be rented, with the services each one supports.
 *
 * @since 1.2.0
 */
const plivoAvailableNumbersSchema = z.object({
  objects: z.array(z.object({
    number: z.string(),
    sms_enabled: z.boolean().optional(),
    mms_enabled: z.boolean().optional(),
    voice_enabled: z.boolean().optional(),
  })),
});

/**
 * Lib - Schema - Plivo Application Schema.
 *
 * Validates the application returned when deploy creates one, so its ID can be
 * saved and the same application is updated on the next deploy.
 *
 * @since 1.2.0
 */
const plivoApplicationSchema = z.object({
  app_id: z.string(),
});

/**
 * Lib - Schema - Plivo Buy Number Schema.
 *
 * Validates the rental result. Plivo reports each number as fulfilled, or as
 * pending while it waits for compliance documents.
 *
 * @since 1.2.0
 */
const plivoBuyNumberSchema = z.object({
  numbers: z.array(z.object({
    number: z.string(),
    status: z.string(),
  })).optional(),
  status: z.string().optional(),
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
 * Lib - Schema - Cloudflare Sending Subdomain Schema.
 *
 * Validates one Email Sending domain: its name, the tag the API uses as its ID,
 * and whether sending is enabled for it.
 *
 * @since 1.2.0
 */
const cloudflareSendingSubdomainSchema = z.object({
  name: z.string(),
  tag: z.string(),
  enabled: z.boolean().optional(),
});

/**
 * Lib - Schema - Cloudflare Sending Subdomains Schema.
 *
 * Validates the zone's Email Sending domains so deploy can tell whether the base
 * domain is already onboarded before it creates one.
 *
 * @since 1.2.0
 */
const cloudflareSendingSubdomainsSchema = z.array(cloudflareSendingSubdomainSchema);

/**
 * Lib - Schema - Cloudflare DNS Records Schema.
 *
 * Validates DNS records, both the ones Email Sending expects for a sending domain
 * and the ones already in the zone, so deploy adds only what is missing.
 *
 * @since 1.2.0
 */
const cloudflareDnsRecordsSchema = z.array(z.object({
  type: z.string(),
  name: z.string(),
  content: z.string(),
  priority: z.number().optional(),
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

/**
 * Lib - Schema - Cloudflare Subscriptions Schema.
 *
 * Validates the account's billing subscriptions, of which only each plan's names,
 * its product, and its state matter, so deploy can tell Workers Paid from Free.
 *
 * @since 1.2.0
 */
const cloudflareSubscriptionsSchema = z.array(z.object({
  state: z.string().catch(''),
  rate_plan: z.object({
    id: z.string().catch(''),
    public_name: z.string().catch(''),
  }).catch({
    id: '',
    public_name: '',
  }),
  product: z.object({
    name: z.string().catch(''),
  }).catch({
    name: '',
  }),
}));

/**
 * Lib - Schema - DNS Over HTTPS Answer Schema.
 *
 * Validates a public resolver's JSON answer, of which the response code and each
 * answer's type and data matter, so deploy can see the records the world sees.
 *
 * @since 1.2.0
 */
const dnsOverHttpsAnswerSchema = z.object({
  Status: z.number(),
  Answer: z.array(z.object({
    type: z.number(),
    data: z.string(),
  })).optional(),
});

export {
  aliasSchema,
  appriseNotifierSchema,
  cloudflareCatchAllSchema,
  cloudflareDestinationAddressesSchema,
  cloudflareDnsRecordsSchema,
  cloudflareEmailRoutingSettingsSchema,
  cloudflareEnvelopeSchema,
  cloudflareRoutingRulesSchema,
  cloudflareSendingSubdomainSchema,
  cloudflareSendingSubdomainsSchema,
  cloudflareSubscriptionsSchema,
  cloudflareWorkerDomainsSchema,
  cloudflareZonesSchema,
  configSchema,
  destinationSchema,
  discordNotifierSchema,
  dnsOverHttpsAnswerSchema,
  emailNotifierSchema,
  gotifyNotifierSchema,
  matrixNotifierSchema,
  notifierSchema,
  ntfyNotifierSchema,
  ntfyReverseProxyNotifierSchema,
  phoneAliasSchema,
  phoneProviderSchema,
  phoneSenderPatternSchema,
  plivoApplicationSchema,
  plivoAvailableNumbersSchema,
  plivoBuyNumberSchema,
  plivoProviderSchema,
  pushoverNotifierSchema,
  senderPatternSchema,
  settingsSchema,
  slackNotifierSchema,
  telegramNotifierSchema,
  telnyxAvailableNumbersSchema,
  telnyxMessagingProfileSchema,
  telnyxNumberOrderSchema,
  telnyxPhoneNumbersSchema,
  telnyxProviderSchema,
  telnyxWebhookSchema,
  webhookNotifierSchema,
};
