# mailmask

## 1.2.0 - 2026-11-21

### UPDATED
- The package's internal file layout now places compiled files in `build/cli/` and `build/worker/` instead of `build/src/`, and its test setup drops a `sequence` option that only repeated Vitest's default. The `mailmask` and `mm` commands are unchanged.
- Tests now report coverage through a `check:coverage` script, which fails when line, function, branch or statement coverage drops below the project minimum, and the README badges now include that coverage.
- Notification delivery now uses one adapter per service, with no change to notifier configuration or the requests each notifier sends.
- Nova 0.49.0, which keeps error stack traces on one line in non-interactive output such as CI logs, and type-checks the package without `skipLibCheck`.
- The package description now reads "Disposable email and phone aliases for your own domain, forwarded to your real inbox or phone".

### ADDED
- Phone aliases give every site or app its own Telnyx or Plivo number that forwards texts to your real phone, and texting a phone alias with "number: message" sends it on from that number, so replies never show your real one. They share the email aliases' expiry, sender rules (sender names like "ACME" included), and on and off switch, and the menu walks through adding a provider and buying a number, with a final confirmation before any purchase ("mm phone add --buy" needs "--yes"). Deploy ends with a reminder that sending relies on the caller number the provider reports, and, for Plivo, that destination countries are set in its console.
- Sending and replying from aliases, turned on with the "send_from_aliases" setting, delivers forwarded mail from a reply address for each sender, so pressing Reply sends your answer from the alias and the other side never sees your real address. Deploy onboards the base domain to Cloudflare Email Sending, adds its missing DNS records, waits up to a minute for them to resolve on public DNS and names any still pending, and reads the account's Workers plan through the "Account > Billing > Read" token permission, so it warns about Workers Paid only when the account is on Workers Free or the plan can't be read. It ends with a reminder that Reply All still exposes your real address.

## 1.1.1 - 2026-11-17

### FIXED
- Deploy accepts Cloudflare answers whose error list is null, such as the custom domains list, so a token with Account > Workers Scripts > Edit is no longer reported as missing it, and an answer mailmask can't read is shown as itself instead of as a missing permission.

## 1.1.0 - 2026-11-17

### UPDATED
- Refusals from an expired or filtered alias always bounce with their reason, and a disabled alias has no routing rule, so Cloudflare rejects its mail without a notification.
- Deploy keeps one Email Routing rule per enabled alias instead of pointing the zone's catch-all at the Worker, turns on Email Routing subaddressing when subaddressing is true, and turns off a catch-all that 1.0.0 pointed at the Worker.

### FIXED
- Deploy's token walkthrough and permission check now include Zone Settings, which Email Routing status and subaddressing need, name each missing permission group before anything changes, and match Cloudflare's current token and Email Routing setup screens.

### ADDED
- Custom domains for the base domain and its www host, attached on deploy so the service page has an address, with www redirecting to the base domain.
- Support for a subdomain base_domain such as mail.example.com, and for several Mailmask Workers sharing one zone.

### REMOVED
- The unknown_alias_action and default_destination settings, since Cloudflare now rejects mail to addresses that are not enabled aliases; configs that still have them load with a one-line notice.

## 1.0.0 - 2026-11-16

### UPDATED
- Changed generate and deploy to write wrangler.toml next to the config.json they use instead of the project root or current folder.
- Moved the config into the Worker bundle instead of Worker variables, which raises the alias limit from about 2,000 to tens of thousands.
- Changed Reverse Proxy for ntfy notifications from plain text with headers to the versioned Mailmask payload, so the proxy context's interpreter must be set to mailmask.
- Changed refusal notifications to send in the background after the routing decision instead of before it, and to log each notifier failure without secrets.
- Changed web requests outside the service page to answer with a JSON error instead of plain text.

### ADDED
- Discord, Telegram, Slack, Pushover, Gotify, Matrix, email, webhook, and Apprise notifiers alongside ntfy and Reverse Proxy for ntfy.
- A versioned Mailmask notification payload for webhook and Reverse Proxy for ntfy notifiers.
- A branded service page at the HTTP root with receiving-mail status, documentation, and GitHub links.

## 0.0.1 - 2026-10-24

### ADDED
- Initial release of Mailmask: self-hosted disposable email aliases on Cloudflare Workers with expiring aliases, sender rules, ntfy and Reverse Proxy for ntfy notifications, and an interactive CLI that deploys the Worker and configures Email Routing.
