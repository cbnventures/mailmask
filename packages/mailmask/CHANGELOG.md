# mailmask

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
