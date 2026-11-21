/**
 * Lib - Regex - Alias Address.
 *
 * Validates the local part of an alias address. Lowercase alphanumeric
 * characters, dots, hyphens, and underscores are allowed, but the address
 * cannot start or end with a separator.
 *
 * @since 0.0.1
 */
const LIB_REGEX_ALIAS_ADDRESS = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/;

/**
 * Lib - Regex - Angle Address.
 *
 * Captures the address inside the angle brackets of a mail header such as
 * "Shop News <news@shop.example>", the part a reply should go to.
 *
 * @since 1.2.0
 */
const LIB_REGEX_ANGLE_ADDRESS = /<([^<>\s]+@[^<>\s]+)>/;

/**
 * Lib - Regex - Base Domain.
 *
 * Validates a fully qualified domain name with at least two labels,
 * each composed of lowercase alphanumeric characters and inner hyphens.
 *
 * @since 0.0.1
 */
const LIB_REGEX_BASE_DOMAIN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

/**
 * Lib - Regex - Country Code.
 *
 * Validates a two-letter ISO 3166-1 country code in capitals, the form Telnyx
 * takes for the countries a messaging profile may text.
 *
 * @since 1.2.0
 */
const LIB_REGEX_COUNTRY_CODE = /^[A-Z]{2}$/;

/**
 * Lib - Regex - Destination Name.
 *
 * Validates the short name used to reference a destination inbox
 * from aliases and settings (lowercase alphanumeric and hyphens).
 *
 * @since 0.0.1
 */
const LIB_REGEX_DESTINATION_NAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

/**
 * Lib - Regex - Duration.
 *
 * Matches a relative duration such as "30m", "12h", "7d", or "4w"
 * used when setting an alias expiry from the command line.
 *
 * @since 0.0.1
 */
const LIB_REGEX_DURATION = /^(\d+)([mhdw])$/;

/**
 * Lib - Regex - Email Address.
 *
 * Loose structural check for a single email address. Mailbox
 * verification is left to Cloudflare Email Routing.
 *
 * @since 0.0.1
 */
const LIB_REGEX_EMAIL_ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Lib - Regex - Phone Digits.
 *
 * Matches a value made only of digits, so a number Plivo sends without
 * a "+" can be told apart from a sender name.
 *
 * @since 1.2.0
 */
const LIB_REGEX_PHONE_DIGITS = /^[0-9]+$/;

/**
 * Lib - Regex - Phone Media Key.
 *
 * Matches the numbered media fields ("Media0", "Media1") that Plivo adds to an
 * inbound MMS webhook, capturing the index so media keep their order.
 *
 * @since 1.2.0
 */
const LIB_REGEX_PHONE_MEDIA_KEY = /^Media([0-9]+)$/;

/**
 * Lib - Regex - Phone Number.
 *
 * Validates a phone number in E.164 form: a plus sign, a country code that
 * does not start with zero, and up to fifteen digits in total.
 *
 * @since 1.2.0
 */
const LIB_REGEX_PHONE_NUMBER = /^\+[1-9][0-9]{6,14}$/;

/**
 * Lib - Regex - Phone Number Separators.
 *
 * Matches the spaces, dots, dashes, and parentheses people type inside phone
 * numbers, so "+1 (555) 010-0100" can be read as "+15550100100".
 *
 * @since 1.2.0
 */
const LIB_REGEX_PHONE_NUMBER_SEPARATORS = /[\s().-]/;

/**
 * Lib - Regex - Phone Sender Pattern.
 *
 * Validates a sender rule for a phone alias: a number, a short code, or a sender
 * name such as "ACME", optionally ending in "*" to match everything it starts.
 *
 * @since 1.2.0
 */
const LIB_REGEX_PHONE_SENDER_PATTERN = /^[^\s*]([^*]*[^\s*])?\*?$/;

/**
 * Lib - Regex - Phone Outbound Text.
 *
 * Matches a text sent from a destination phone to its phone alias that starts
 * with the number to text and a colon, capturing the number and the message.
 *
 * @since 1.2.0
 */
const LIB_REGEX_PHONE_OUTBOUND_TEXT = /^\s*(\+?[0-9][0-9\s().-]{1,20}[0-9])\s*:\s*([\s\S]*)$/;

/**
 * Lib - Regex - Phone Webhook Path.
 *
 * Matches the Worker path that phone providers post texts to, capturing the
 * provider name.
 *
 * @since 1.2.0
 */
const LIB_REGEX_PHONE_WEBHOOK_PATH = /^\/phone\/([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\/messages$/;

/**
 * Lib - Regex - Sender Pattern.
 *
 * Validates a sender rule, either a full address ("news@shop.com")
 * or a whole-domain wildcard ("*@shop.com").
 *
 * @since 0.0.1
 */
const LIB_REGEX_SENDER_PATTERN = /^(\*|[^\s@*]+)@[^\s@*]+\.[^\s@*]+$/;

/**
 * Lib - Regex - Surrounding Quotes.
 *
 * Matches a single leading or trailing quote character so dotenv
 * values written as "token" or 'token' are read back unquoted.
 *
 * @since 0.0.1
 */
const LIB_REGEX_SURROUNDING_QUOTES = /^["']|["']$/;

/**
 * Lib - Regex - Worker Name.
 *
 * Validates a Cloudflare Worker script name: lowercase alphanumeric
 * characters and hyphens, not starting or ending with a hyphen.
 *
 * @since 0.0.1
 */
const LIB_REGEX_WORKER_NAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export {
  LIB_REGEX_ALIAS_ADDRESS,
  LIB_REGEX_ANGLE_ADDRESS,
  LIB_REGEX_BASE_DOMAIN,
  LIB_REGEX_COUNTRY_CODE,
  LIB_REGEX_DESTINATION_NAME,
  LIB_REGEX_DURATION,
  LIB_REGEX_EMAIL_ADDRESS,
  LIB_REGEX_PHONE_DIGITS,
  LIB_REGEX_PHONE_MEDIA_KEY,
  LIB_REGEX_PHONE_NUMBER,
  LIB_REGEX_PHONE_NUMBER_SEPARATORS,
  LIB_REGEX_PHONE_OUTBOUND_TEXT,
  LIB_REGEX_PHONE_SENDER_PATTERN,
  LIB_REGEX_PHONE_WEBHOOK_PATH,
  LIB_REGEX_SENDER_PATTERN,
  LIB_REGEX_SURROUNDING_QUOTES,
  LIB_REGEX_WORKER_NAME,
};
