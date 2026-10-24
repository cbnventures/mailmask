/**
 * Lib - Regex - Alias Address.
 *
 * Validates the local part of an alias address. Lowercase alphanumeric
 * characters, dots, hyphens, and underscores are allowed, but the address
 * cannot start or end with a separator.
 *
 * @since UNRELEASED
 */
const LIB_REGEX_ALIAS_ADDRESS = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/;

/**
 * Lib - Regex - Base Domain.
 *
 * Validates a fully qualified domain name with at least two labels,
 * each composed of lowercase alphanumeric characters and inner hyphens.
 *
 * @since UNRELEASED
 */
const LIB_REGEX_BASE_DOMAIN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

/**
 * Lib - Regex - Destination Name.
 *
 * Validates the short name used to reference a destination inbox
 * from aliases and settings (lowercase alphanumeric and hyphens).
 *
 * @since UNRELEASED
 */
const LIB_REGEX_DESTINATION_NAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

/**
 * Lib - Regex - Duration.
 *
 * Matches a relative duration such as "30m", "12h", "7d", or "4w"
 * used when setting an alias expiry from the command line.
 *
 * @since UNRELEASED
 */
const LIB_REGEX_DURATION = /^(\d+)([mhdw])$/;

/**
 * Lib - Regex - Email Address.
 *
 * Loose structural check for a single email address. Mailbox
 * verification is left to Cloudflare Email Routing.
 *
 * @since UNRELEASED
 */
const LIB_REGEX_EMAIL_ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Lib - Regex - Sender Pattern.
 *
 * Validates a sender rule, either a full address ("news@shop.com")
 * or a whole-domain wildcard ("*@shop.com").
 *
 * @since UNRELEASED
 */
const LIB_REGEX_SENDER_PATTERN = /^(\*|[^\s@*]+)@[^\s@*]+\.[^\s@*]+$/;

/**
 * Lib - Regex - Surrounding Quotes.
 *
 * Matches a single leading or trailing quote character so dotenv
 * values written as "token" or 'token' are read back unquoted.
 *
 * @since UNRELEASED
 */
const LIB_REGEX_SURROUNDING_QUOTES = /^["']|["']$/;

/**
 * Lib - Regex - Worker Name.
 *
 * Validates a Cloudflare Worker script name: lowercase alphanumeric
 * characters and hyphens, not starting or ending with a hyphen.
 *
 * @since UNRELEASED
 */
const LIB_REGEX_WORKER_NAME = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export {
  LIB_REGEX_ALIAS_ADDRESS,
  LIB_REGEX_BASE_DOMAIN,
  LIB_REGEX_DESTINATION_NAME,
  LIB_REGEX_DURATION,
  LIB_REGEX_EMAIL_ADDRESS,
  LIB_REGEX_SENDER_PATTERN,
  LIB_REGEX_SURROUNDING_QUOTES,
  LIB_REGEX_WORKER_NAME,
};
