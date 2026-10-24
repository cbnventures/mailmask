# VISION.md

## Purpose

### Problem Statement

Every sign-up form, store checkout, and free trial asks for an email address, and once an address is handed out it can be sold, leaked in a breach, or flooded with marketing that never stops. Hosted alias services solve this, but they sit in the middle of your mail, charge per alias or per month, and can disappear or change terms. People who already own a domain on Cloudflare have everything needed to run their own aliases, but stitching together Email Routing rules by hand does not scale past a handful of addresses and offers no expiry, sender filtering, or easy kill switch.

### Origin

Mailmask was built by CBN Ventures as a sibling to Branded Short Links and Reverse Proxy for ntfy: a small, self-hosted Cloudflare Worker with an interactive CLI, for people who want disposable addresses on their own domain without trusting a third-party alias provider.

### Target Audience

- **Privacy-minded domain owners** — People with a domain on Cloudflare who want a unique, throwaway address for every site and service they sign up for.
- **Developers and testers** — People who need short-lived inboxes for sign-up flows, trials, and QA without creating real mailboxes.
- **Guided-setup users** — Users who want to install a package, run an interactive CLI, and deploy, without editing Email Routing rules or Worker config by hand.

### Value Proposition

Mailmask turns any Cloudflare-managed domain into a private alias service. Every alias forwards to a real inbox you control, can expire on its own, can accept mail only from the senders you expect, and can be switched off in seconds. The Worker runs on your own Cloudflare account, mail is never stored, and all configuration is managed through an interactive CLI.

## Product Direction

Version 1 is forward-only: aliases receive mail and forward it to verified destination inboxes. Replying from an alias (reverse aliases through Cloudflare outbound email) is a candidate for a later version, not a current commitment.

## Product Design

Aliases, destinations, and settings live in one `config.json` managed by the CLI. The deploy command passes that configuration to the Worker and points the zone's Email Routing catch-all at it, so creating or retiring an alias is a CLI change followed by a deploy. Mail is routed in memory and never persisted.

## Positioning

### Differentiators

| This project                                     | Alternatives                                                      |
|--------------------------------------------------|-------------------------------------------------------------------|
| Runs on your own Cloudflare account and domain   | Hosted alias services sit in the middle of all your mail          |
| Mail is forwarded in memory and never stored     | Hosted services and self-hosted mail servers keep message copies  |
| Per-alias expiry, allow lists, and block lists   | Plain Email Routing rules only map one address to one destination |
| Unlimited aliases with one catch-all rule        | Hand-made routing rules for every address do not scale            |
| Interactive CLI generates and deploys everything | Manual dashboard clicks for every alias change                    |

## Risks and Future

- Cloudflare Email Routing only forwards to verified destination addresses, so every destination needs a one-time verification click.
- Alias changes take effect on the next deploy because configuration ships with the Worker.
- Reply-from-alias support depends on Cloudflare's outbound email capabilities and is deferred.

## Marketing Copy

### Tagline

Disposable email aliases on your own domain, forwarded from the edge.

### Elevator Pitch

Mailmask gives every site you sign up for its own address on your domain. Mail to an alias is forwarded to your real inbox by a Cloudflare Worker that you own, and nothing is ever stored. Set an alias to expire after a free trial, only accept mail from the store you bought from, or switch it off the moment it starts getting spam. Everything is managed through an interactive CLI that also deploys the Worker and wires up Email Routing for you.

### Key Features

- **Unlimited aliases** — Generate memorable (`velvet-harbor-42`) or random (`k7mq2xv9pa`) addresses, or pick your own.
- **Expiring aliases** — Give an alias a lifetime like `30m`, `7d`, or a date, and it stops accepting mail on its own.
- **Sender rules** — Allow only specific senders or domains per alias, and block the ones that abuse it.
- **One-switch shutdown** — Disable an alias without deleting it, so the address stays reserved.
- **Subaddressing** — `alias+anything@` reaches the same alias.
- **Refusal notifications** — Get an ntfy notification when a disabled, expired, or filtered alias refuses mail.
- **Automatic Email Routing setup** — Deploy registers destination addresses and points the catch-all at the Worker.

## Glossary

| Term                 | Definition                                                                                                                     |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------|
| Alias                | An address on the base domain (e.g. `velvet-harbor-42@mail.example.com`) that forwards to one destination.                     |
| Destination          | A real inbox that aliases forward to. Each destination must be verified in Cloudflare Email Routing before mail can reach it.  |
| Base domain          | The domain (or subdomain) whose Email Routing catch-all points at the Worker.                                                  |
| Catch-all            | The Email Routing rule that sends every address without an explicit rule to the Worker.                                        |
| Unknown alias action | What happens to mail for an address that is not an alias: reject (bounce), drop silently, or forward to a default destination. |
| Refusal              | Mail that a known alias turns away because it is disabled, expired, or the sender does not match its rules.                    |
| Subaddressing        | Treating `alias+tag@domain` as `alias@domain`.                                                                                 |
| Sender rule          | An entry in an alias's allow or block list: a full address (`news@shop.com`) or a domain wildcard (`*@shop.com`).              |

## Additional Vision Notes

No additional vision notes are currently documented.
