# PROJECT_RULES.md

## Project Identity

### Name and Description

- **Project name:** mailmask
- **Description:** Self-hosted disposable email aliases on Cloudflare Workers and Cloudflare Email Routing, managed through an interactive CLI.
- **Primary language:** TypeScript
- **Framework / runtime:** Cloudflare Workers (Wrangler), Node.js CLI (Commander), and Docusaurus documentation

### Repository URL

- **URL:** https://github.com/cbnventures/mailmask

## Repository Structure

### Repository Layout

```
mailmask/
├── .changelog/              — Pending Nova changelog fragments
├── .github/workflows/       — Nova-generated GitHub Actions workflows
├── apps/
│   └── docs/                — Docusaurus documentation site
├── packages/
│   └── mailmask/          — Published CLI and Cloudflare Worker package
│       └── src/
│           ├── cli/         — CLI commands and interactive menu
│           ├── lib/         — Shared schemas, regexes, and runtime utilities
│           ├── worker/      — Email Worker entry point, router, and notifications
│           ├── tests/       — Package unit tests
│           └── types/       — Type declarations mirroring package source
├── scripts/                 — Repository build, development, and release helpers
├── tests/                   — Root tooling and package-script contracts
├── config.sample.json       — User configuration example
├── nova.config.json         — Nova project and workspace configuration
├── package.json             — Private monorepo coordinator
└── README.md                — Project overview and generated sections
```

### Source Structure

```
packages/mailmask/src/
├── cli/
│   ├── commands/            — Alias, destination, notifier, phone alias, phone provider, settings, validate, generate, and deploy commands
│   ├── menu/                — Interactive configuration interface
│   └── index.ts             — Commander entry point (`mailmask` / `mm`)
├── lib/
│   ├── cloudflare.ts        — Cloudflare API adapter (token, zone, Email Routing, Email Sending, Workers plan, custom domains, Wrangler deploy)
│   ├── item.ts              — Application constants
│   ├── notification.ts      — Notification payload builders and compatibility entry points
│   ├── notifiers/           — One adapter per notifier service, registry, and shared HTTP delivery
│   ├── package-runtime.ts   — Packaged CLI path and version resolution
│   ├── phone.ts             — Shared phone number, signature, and provider request helpers
│   ├── phone-provider.ts    — Picks the Telnyx or Plivo adapter for a provider type
│   ├── plivo.ts             — Plivo adapter (webhooks, texts, numbers, application)
│   ├── public-dns.ts        — Public DNS over HTTPS adapter (confirms Email Sending records resolve)
│   ├── regex.ts             — Centralized regular expressions
│   ├── schema.ts            — Zod configuration, Cloudflare, and phone provider API schemas
│   └── telnyx.ts            — Telnyx adapter (webhooks, texts, numbers, messaging profile)
├── worker/
│   ├── cloudflare-email.ts  — Cloudflare Email Workers adapter (send_email binding, DMARC result)
│   ├── handlers.ts          — Forward, send from the alias, or reject one inbound message
│   ├── index.ts             — Cloudflare Worker entry point (email and fetch)
│   ├── landing/             — Service page served at the base domain
│   ├── notify.ts            — Best-effort refusal notifications
│   ├── phone-handlers.ts    — Verify, forward, send on, or drop one phone provider text webhook
│   ├── phone-router.ts      — Pure phone alias resolution, outbound text parsing, and sender matching
│   ├── relay.ts             — Reply addresses and header rewriting for sending from aliases
│   └── router.ts            — Pure alias resolution and sender matching
├── tests/                   — Tests mirroring package behavior
└── types/                   — Declarations mirroring source and tests
```

### Key Files

| File                                               | Purpose                           | When to modify                                     |
|----------------------------------------------------|-----------------------------------|----------------------------------------------------|
| `packages/mailmask/src/worker/router.ts`           | Alias routing decisions           | Changing how recipients and senders are evaluated  |
| `packages/mailmask/src/worker/handlers.ts`         | Message forwarding and rejection  | Changing what happens after a routing decision     |
| `packages/mailmask/src/worker/relay.ts`            | Sending and replying from aliases | Changing reply addresses or rewritten headers      |
| `packages/mailmask/src/worker/phone-router.ts`     | Phone alias routing decisions     | Changing how texts are forwarded or sent on        |
| `packages/mailmask/src/worker/phone-handlers.ts`   | Phone provider webhook handling   | Changing what happens after a phone decision       |
| `packages/mailmask/src/lib/telnyx.ts`              | Telnyx API and webhook adapter    | Changing Telnyx calls or signature checks          |
| `packages/mailmask/src/lib/plivo.ts`               | Plivo API and webhook adapter     | Changing Plivo calls or signature checks           |
| `packages/mailmask/src/lib/cloudflare.ts`          | Cloudflare API adapter            | Changing Cloudflare calls deploy makes             |
| `packages/mailmask/src/lib/notifiers/`             | Notification service adapters     | Changing notifier validation or delivery requests  |
| `packages/mailmask/src/worker/cloudflare-email.ts` | Cloudflare email sending adapter  | Changing how the Worker sends mail or reads DMARC  |
| `packages/mailmask/src/cli/commands/alias.ts`      | Alias creation and lifecycle      | Changing address generation, expiry, or alias CRUD |
| `packages/mailmask/src/cli/commands/deploy.ts`     | Cloudflare deployment pipeline    | Changing permissions, Email Routing, or deploy     |
| `packages/mailmask/src/cli/index.ts`               | CLI entry point                   | Adding or changing CLI commands                    |
| `packages/mailmask/src/cli/menu/interactive.ts`    | Interactive configuration UI      | Changing the guided menu flow                      |
| `packages/mailmask/src/lib/schema.ts`              | Configuration validation schemas  | Changing the user configuration contract           |
| `config.sample.json`                               | Sample configuration              | Changing the user configuration contract           |
| `nova.config.json`                                 | Repository and workspace metadata | Changing Nova-managed project behavior             |

## Build and Tooling

### Prerequisites

| Tool     | Version                    | Purpose                                   |
|----------|----------------------------|-------------------------------------------|
| Node.js  | See root `engines`         | Runtime, CLI, documentation, and build    |
| npm      | See root `packageManager`  | Package manager                           |
| Wrangler | See package dependency pin | Cloudflare Workers development and deploy |

### Commands

| Command             | What it does                                           |
|---------------------|--------------------------------------------------------|
| `npm install`       | Install every workspace dependency                     |
| `npm run dev`       | Run available workspace development processes          |
| `npm run manage`    | Launch the interactive package configuration UI        |
| `npm run tail`      | Stream and persist Cloudflare Worker logs              |
| `npm run check`     | Run root and workspace linting, type checks, and tests |
| `npm run build`     | Build the package and documentation site               |
| `npm run deploy`    | Validate, generate Worker configuration, and deploy    |
| `npm run clean`     | Remove root and workspace build output                 |
| `npm run changelog` | Record or release Nova changelog entries               |
| `npm run recipes`   | Apply enabled Nova recipes across the repository       |

### Environment Variables

Nova supplies `NODE_ENV`, `LOG_LEVEL`, and `LOG_TIME` in generated dotenv files. The root also accepts `CLOUDFLARE_API_TOKEN` for non-interactive Cloudflare operations. Product configuration lives in `config.json`.

## Workspace Rules

### Naming Conventions

| Entity            | Convention                   | Example                                             |
|-------------------|------------------------------|-----------------------------------------------------|
| Source files      | kebab-case                   | `router.ts`, `config-io.ts`                         |
| Config keys       | snake_case                   | `base_domain`, `worker_name`, `expires_at`          |
| Alias addresses   | lowercase local part         | `velvet-harbor-42`, `trial.signup`                  |
| Destination names | lowercase kebab-case         | `personal`, `work-inbox`                            |
| Type files        | Mirror source path           | `packages/mailmask/src/types/worker/router.d.ts`    |
| Test files        | Mirror source path + `.test` | `packages/mailmask/src/tests/worker/router.test.ts` |
| CLI commands      | noun + verb                  | `mm alias add`, `mm destination list`               |

### Do / Don't

**Do:**
- Keep Worker code (`src/worker/`) and CLI code (`src/cli/`) separated. They run on different runtimes.
- Keep third-party API code (URLs, auth, request and response shapes, webhook payloads) inside the adapter modules (`lib/cloudflare.ts`, `lib/public-dns.ts`, `lib/telnyx.ts`, `lib/plivo.ts`, `lib/notifiers/*.ts`, `worker/cloudflare-email.ts`). Every notifier service owns its validation and request in one file; `lib/notification.ts` only builds payloads and preserves public compatibility entry points. Routing, handlers, and CLI commands only call Mailmask-owned interfaces.
- Keep routing decisions in `router.ts` pure (no I/O) so they stay fully unit-testable.
- Use Zod schemas for all external input (config and Cloudflare API responses).
- Treat disabled, expired, and sender-refused mail as refusals that never fall through to the default destination.

**Don't:**
- Don't store, log, or echo message or text bodies. The Worker only forwards, sends on, or refuses.
- Don't enable Email Routing or change its DNS automatically. Deploy stops and points the user to the dashboard instead. The one DNS change deploy makes is adding the Email Sending records Cloudflare expects when `send_from_aliases` is on, and only the ones that are missing.
- Don't commit `config.json` or `wrangler.toml`. Both are gitignored. Only `config.sample.json` is committed.
- Don't let notification failures affect mail handling.

## Architecture and Data

### Architecture

```
Inbound mail -> Email Routing rule per enabled alias -> Worker email()
  |
  v
Validate config -> resolveRoute (domain, reply address, subaddress, alias, expiry, sender rules)
  |
  +-> forward  -> send_email from the reply address (send_from_aliases on), else message.forward(destination, X-Mailmask-* headers)
  +-> send     -> DMARC check -> send_email from the alias to the reply address's sender
  +-> reject   -> message.setReject(reason)   (+ optional notification for known aliases)

Provider text webhook -> POST /phone/<provider>/messages -> Worker fetch()
  |
  v
Verify signature -> resolvePhoneRoute (provider, number, enabled, expiry, destination phone, sender rules)
  |
  +-> forward  -> provider text from the alias to the destination phone ("sender: text")
  +-> send     -> provider text from the alias to the number the destination phone named
  +-> help     -> provider text to the destination phone showing the "number: message" form
  +-> reject   -> dropped                     (+ optional notification for known numbers)

CLI (Node.js)
  |
  v
Interactive Menu / Direct Commands -> Config Read/Write -> Validate -> Generate wrangler.toml
  -> Register destinations -> wrangler deploy -> Custom domains -> Routing rules
  -> Point phone alias numbers at the Worker
```

### Data Flow and Ownership

1. **Receive** — Email Routing hands each enabled alias's mail, `+tag` and reply addresses included, to the Worker, and phone providers post texts to `/phone/<provider>/messages`.
2. **Validate** — The Worker checks the config bundled into it once when it starts and rejects mail if it is invalid.
3. **Resolve** — `resolveRoute` checks the domain, strips `+tags`, finds the alias, and applies enabled, expiry, block, and allow rules.
4. **Act** — The handler forwards to the destination, sends the user's own mail or text on from the alias, or refuses it, and notifies on refusals of known aliases and numbers.

### Error Strategy

| Layer             | Strategy                                                                                                  |
|-------------------|-----------------------------------------------------------------------------------------------------------|
| Worker entry      | Invalid or unparsable config rejects the message with a temporary error instead of silently accepting it. |
| Router            | Pure function; always returns a decision, never throws.                                                   |
| Notifications     | Best effort. Network failures are swallowed.                                                              |
| CLI               | Try/catch at command level. Non-zero exit code on failure.                                                |
| Config validation | Zod schemas plus referential checks (missing destinations, duplicate aliases, default destination).       |

## Project Guardrails

No additional project-specific guardrails are currently documented beyond the workspace rules and shared convention files.

## Testing and Verification

The supported verification commands are documented under Build and Tooling. Changes must pass every check applicable to the affected workspaces and platforms.

## Documentation and Ownership

### Documentation Structure

#### Framework

- **Framework:** Docusaurus with `@cbnventures/docusaurus-preset-nova`
- **Source directory:** `apps/docs/`

#### Site Structure

```
apps/docs/
├── blog/                 — Release and project articles
├── docs/
│   ├── getting-started/  — Quick start, configuration, and deployment guides
│   └── reference/        — Architecture, CLI, development, and troubleshooting
└── src/pages/            — Documentation homepage
```

#### Commands

- `npm run dev --workspace mailmask-docs` starts the documentation site.
- `npm run check --workspace mailmask-docs` validates docs, links, types, and formatting.
- `npm run build --workspace mailmask-docs` builds the production site.

## Publishing and Deployment

### Release Process

1. Record user-facing changes through `npm run changelog` while developing.
2. Preview the release with `npm run changelog -- --release --dry-run`, then run the real release after approval.
3. Run a clean install, `npm run check`, and `npm run build` against the released working copy.
4. Commit the verified release and tag it with the released package version; the publish workflow handles package and documentation deployment.

### CI/CD Workflows

| Workflow file                                       | Trigger                  | What it does                                      |
|-----------------------------------------------------|--------------------------|---------------------------------------------------|
| `nova-check-sponsor-gated-issues-sponsor-check.yml` | Issue open/close/comment | Apply GitHub Sponsors-based support policy        |
| `nova-lock-inactive-issues-lock-inactive.yml`       | Weekly cron or manual    | Lock inactive issues and pull requests            |
| `nova-publish-project.yml`                          | Version tag or manual    | Check, build, and publish package and docs output |

### Environments

| Environment        | URL / Identifier                         | Purpose                   |
|--------------------|------------------------------------------|---------------------------|
| Cloudflare Workers | Email Routing catch-all on `base_domain` | Production alias router   |
| Documentation      | https://mailmask.cbnventures.io/         | Public documentation site |

## Additional Project Rules

No additional project rules are currently documented.
