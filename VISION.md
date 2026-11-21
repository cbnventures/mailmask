# VISION.md

## Purpose

### Problem Statement

Every sign-up form, store checkout, and free trial asks for an email address, and once an address is handed out it can be sold, leaked in a breach, or flooded with marketing that never stops. Hosted alias services solve this, but they sit in the middle of your mail, charge per alias or per month, and can disappear or change terms. People who already own a domain on Cloudflare have everything needed to run their own aliases, but stitching together Email Routing rules by hand does not scale past a handful of addresses and offers no expiry, sender filtering, or easy kill switch. Phone numbers have the same problem: a number typed into a delivery app or loyalty program ends up on spam lists and in breaches, and a real number is much harder to change than an address.

### Origin

Mailmask was built by CBN Ventures as a sibling to Branded Short Links and Reverse Proxy for ntfy: a small, self-hosted Cloudflare Worker with an interactive CLI, for people who want disposable addresses on their own domain without trusting a third-party alias provider.

### Target Audience

- **Privacy-minded domain owners** — People with a domain on Cloudflare who want a unique, throwaway address for every site and service they sign up for.
- **Developers and testers** — People who need short-lived inboxes for sign-up flows, trials, and QA without creating real mailboxes.
- **Guided-setup users** — Users who want to install a package, run an interactive CLI, and deploy, without editing Email Routing rules or Worker config by hand.

### Value Proposition

Mailmask turns any Cloudflare-managed domain into a private alias service. Every alias forwards to a real inbox you control, can expire on its own, can accept mail only from the senders you expect, and can be switched off in seconds. The Worker runs on your own Cloudflare account, mail is never stored, and all configuration is managed through an interactive CLI.

## Product Direction

Aliases receive mail and forward it to verified destination inboxes. With sending turned on, replies and new messages go out from the alias through per-sender reply addresses and Cloudflare Email Sending, so the other side only sees the alias.

Phone aliases bring the same model to text messages through the user's own Telnyx or Plivo account: texts to a phone alias are forwarded to the user's real phone, and the user texts back through the phone alias. Email stays email and texts stay texts, and calls are not part of the product.

## Product Design

Aliases, destinations, and settings live in one `config.json` managed by the CLI. The deploy command passes that configuration to the Worker and points the zone's Email Routing catch-all at it, so creating or retiring an alias is a CLI change followed by a deploy. Mail is routed in memory and never persisted.

Phone providers and phone aliases live in the same `config.json`. Deploy points each phone alias number's messaging webhook at the Worker on the base domain, where signed webhooks are routed in memory and texts are never persisted.

## Positioning

### Differentiators

| This project                                              | Alternatives                                                             |
|-----------------------------------------------------------|--------------------------------------------------------------------------|
| Runs on your own Cloudflare account and domain            | Hosted alias services sit in the middle of all your mail                 |
| Mail is forwarded in memory and never stored              | Hosted services and self-hosted mail servers keep message copies         |
| Per-alias expiry, allow lists, and block lists            | Plain Email Routing rules only map one address to one destination        |
| Aliases on demand with one catch-all rule                 | Hand-made routing rules for every address do not scale                   |
| Interactive CLI generates and deploys everything          | Manual dashboard clicks for every alias change                           |
| Two-way phone aliases on your own Telnyx or Plivo account | Masked-number services rent the numbers and handle every text themselves |

## Risks and Future

- Cloudflare Email Routing only forwards to verified destination addresses, so every destination needs a one-time verification click.
- Alias changes take effect on the next deploy because configuration ships with the Worker.
- Sending and replying from aliases to outside recipients needs Cloudflare Email Sending, which requires the Workers Paid plan and an onboarded base domain and comes with monthly and daily sending quotas.
- Phone aliases cost money at the provider: each number has a monthly fee, and every forwarded or sent text is billed.
- In the United States, texting from local numbers usually needs a 10DLC campaign, and toll-free numbers need verification, both handled in the provider's dashboard.
- A released number goes back to the provider, which can give it to someone else along with any texts still sent to it.
- Provider webhooks reach the Worker through its custom domain on the base domain, so texts stop if that custom domain is missing.
- Plivo's webhook signature covers a nonce but no timestamp, so the Worker cannot reject a replayed Plivo webhook by age.
- Texts are sent on from a phone alias when the provider reports the destination phone as the caller, and carrier caller ID can be spoofed, so someone faking that number could text from the phone alias.

## Marketing Copy

### Tagline

Disposable email aliases on your own domain, forwarded from the edge.

### Elevator Pitch

Mailmask gives every site you sign up for its own address on your domain. Mail to an alias is forwarded to your real inbox by a Cloudflare Worker that you own, and nothing is ever stored. Set an alias to expire after a free trial, only accept mail from the store you bought from, or switch it off the moment it starts getting spam. Everything is managed through an interactive CLI that also deploys the Worker and wires up Email Routing for you.

### Key Features

- **Aliases on demand** — Generate memorable (`velvet-harbor-42`) or random (`k7mq2xv9pa`) addresses, or pick your own.
- **Expiring aliases** — Give an alias a lifetime like `30m`, `7d`, or a date, and it stops accepting mail on its own.
- **Sender rules** — Allow only specific senders or domains per alias, and block the ones that abuse it.
- **One-switch shutdown** — Disable an alias without deleting it, so the address stays reserved.
- **Subaddressing** — `alias+anything@` reaches the same alias.
- **Refusal notifications** — Get an ntfy notification when a disabled, expired, or filtered alias refuses mail.
- **Automatic Email Routing setup** — Deploy registers destination addresses and keeps one routing rule per enabled alias that sends its mail to the Worker.
- **Send and reply from aliases** — Press Reply on forwarded mail, or write to a reply address, and the message goes out from the alias.
- **Phone aliases** — Give a site its own Telnyx or Plivo number, get its texts on your real phone, and text back through the same number.

## Glossary

| Term                 | Definition                                                                                                                                            |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Alias                | An address on the base domain (e.g. `velvet-harbor-42@example.com`) that forwards to one destination.                                                 |
| Destination          | A real inbox that aliases forward to. Each destination must be verified in Cloudflare Email Routing before mail can reach it.                         |
| Base domain          | The zone's apex domain (not a subdomain), whose Email Routing catch-all points at the Worker.                                                         |
| Catch-all            | The Email Routing rule that sends every address without an explicit rule to the Worker.                                                               |
| Unknown alias action | What happens to mail for an address that is not an alias: reject (bounce), drop silently, or forward to a default destination.                        |
| Refusal              | Mail that a known alias turns away because it is disabled, expired, or the sender does not match its rules.                                           |
| Subaddressing        | Treating `alias+tag@domain` as `alias@domain`.                                                                                                        |
| Sender rule          | An entry in an alias's allow or block list: a full address (`news@shop.com`) or a domain wildcard (`*@shop.com`).                                     |
| Reply address        | An address such as `shop+news=shop.com@example.com` that stands for one sender of one alias; mail sent to it goes out from the alias to that sender.  |
| Phone alias          | A number on the user's Telnyx or Plivo account that forwards its texts to a destination's phone and sends that phone's texts on under its own number. |
| Phone provider       | The Telnyx or Plivo account that rents phone alias numbers and sends their texts.                                                                     |
| Destination phone    | The real phone number stored on a destination; phone aliases forward texts to it, and texts from it go out through the phone alias.                   |
| Sender name          | A name such as `ACME` that some senders text from instead of a number; phone sender rules can allow or block it.                                      |
| Webhook signature    | The proof Telnyx or Plivo attaches to each webhook; the Worker refuses any request whose signature does not check out.                                |

## Additional Vision Notes

No additional vision notes are currently documented.
