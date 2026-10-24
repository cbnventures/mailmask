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
│   ├── commands/            — Alias, destination, settings, validate, generate, and deploy commands
│   ├── menu/                — Interactive configuration interface
│   └── index.ts             — Commander entry point (`mailmask` / `mm`)
├── lib/
│   ├── item.ts              — Application constants
│   ├── package-runtime.ts   — Packaged CLI path and version resolution
│   ├── regex.ts             — Centralized regular expressions
│   └── schema.ts            — Zod configuration and Cloudflare API schemas
├── worker/
│   ├── handlers.ts          — Forward, reject, or drop one inbound message
│   ├── index.ts             — Cloudflare Worker entry point (email and fetch)
│   ├── notify.ts            — Best-effort ntfy-style refusal notifications
│   └── router.ts            — Pure alias resolution and sender matching
├── tests/                   — Tests mirroring package behavior
└── types/                   — Declarations mirroring source and tests
```

### Key Files

| File                                            | Purpose                           | When to modify                                     |
|-------------------------------------------------|-----------------------------------|----------------------------------------------------|
| `packages/mailmask/src/worker/router.ts`        | Alias routing decisions           | Changing how recipients and senders are evaluated  |
| `packages/mailmask/src/worker/handlers.ts`      | Message forwarding and rejection  | Changing what happens after a routing decision     |
| `packages/mailmask/src/cli/commands/alias.ts`   | Alias creation and lifecycle      | Changing address generation, expiry, or alias CRUD |
| `packages/mailmask/src/cli/commands/deploy.ts`  | Cloudflare deployment pipeline    | Changing permissions, Email Routing, or deploy     |
| `packages/mailmask/src/cli/index.ts`            | CLI entry point                   | Adding or changing CLI commands                    |
| `packages/mailmask/src/cli/menu/interactive.ts` | Interactive configuration UI      | Changing the guided menu flow                      |
| `packages/mailmask/src/lib/schema.ts`           | Configuration validation schemas  | Changing the user configuration contract           |
| `config.sample.json`                            | Sample configuration              | Changing the user configuration contract           |
| `nova.config.json`                              | Repository and workspace metadata | Changing Nova-managed project behavior             |

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
| Config keys       | snake_case                   | `base_domain`, `unknown_alias_action`, `expires_at` |
| Alias addresses   | lowercase local part         | `velvet-harbor-42`, `trial.signup`                  |
| Destination names | lowercase kebab-case         | `personal`, `work-inbox`                            |
| Type files        | Mirror source path           | `packages/mailmask/src/types/worker/router.d.ts`    |
| Test files        | Mirror source path + `.test` | `packages/mailmask/src/tests/worker/router.test.ts` |
| CLI commands      | noun + verb                  | `mm alias add`, `mm destination list`               |

### Do / Don't

**Do:**
- Keep Worker code (`src/worker/`) and CLI code (`src/cli/`) separated. They run on different runtimes.
- Keep routing decisions in `router.ts` pure (no I/O) so they stay fully unit-testable.
- Use Zod schemas for all external input (config and Cloudflare API responses).
- Treat disabled, expired, and sender-refused mail as refusals that never fall through to the default destination.

**Don't:**
- Don't store, log, or echo message bodies. The Worker only forwards or refuses.
- Don't enable Email Routing or change DNS automatically. Deploy stops and points the user to the dashboard instead.
- Don't commit `config.json` or `wrangler.toml`. Both are gitignored. Only `config.sample.json` is committed.
- Don't let notification failures affect mail handling.

## Architecture and Data

### Architecture

```
Inbound mail -> Email Routing catch-all -> Worker email()
  |
  v
Validate config -> resolveRoute (domain, subaddress, alias, expiry, sender rules)
  |
  +-> forward  -> message.forward(destination, X-Mailmask-* headers)
  +-> reject   -> message.setReject(reason)   (+ optional notification for known aliases)
  +-> drop     -> no action                   (+ optional notification for known aliases)

CLI (Node.js)
  |
  v
Interactive Menu / Direct Commands -> Config Read/Write -> Validate -> Generate wrangler.toml
  -> Register destinations -> wrangler deploy -> Point catch-all at Worker
```

### Data Flow and Ownership

1. **Receive** — Email Routing hands every unmatched address on the base domain to the Worker.
2. **Validate** — The Worker parses `SETTINGS`, `DESTINATIONS`, and `ALIASES` vars and rejects mail if they are invalid.
3. **Resolve** — `resolveRoute` checks the domain, strips `+tags`, finds the alias, and applies enabled, expiry, block, and allow rules.
4. **Act** — The handler forwards to the destination, rejects with a reason, or drops, and notifies on refusals of known aliases.

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
