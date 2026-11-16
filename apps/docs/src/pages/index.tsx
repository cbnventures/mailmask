import {
  BlogPreview,
  Canvas,
  Features,
  InstallStrip,
  Showcase,
  Spotlight,
  TerminalFrame,
} from '@cbnventures/docusaurus-preset-nova/blocks';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

import styles from './index.module.css';

import type {
  Pages_Index_FrameMarkers,
  Pages_Index_Home_Shots,
  Pages_Index_PromptMarkers,
  Pages_Index_TerminalLineTone_FirstCharacter,
  Pages_Index_TerminalLineTone_Line,
  Pages_Index_TerminalLineTone_Returns,
} from '../types/pages/index.d.ts';

/**
 * Pages - Prompt Markers.
 *
 * First characters that the prompts library prints before a question, a
 * selected choice, or an answered question, colored like a prompt.
 *
 * @since 0.11.0
 */
const promptMarkers: Pages_Index_PromptMarkers = [
  '❯',
  '?',
  '✔',
];

/**
 * Pages - Frame Markers.
 *
 * First characters of the CLI banner box and the wrangler divider, colored
 * as muted frame lines.
 *
 * @since 0.11.0
 */
const frameMarkers: Pages_Index_FrameMarkers = [
  '╭',
  '│',
  '╰',
  '─',
];

/**
 * Pages - Terminal Line Tone.
 *
 * Picks the color class for one line of captured CLI output, so the terminal
 * window reads like the real thing without an ANSI parser.
 *
 * @param {Pages_Index_TerminalLineTone_Line} line - Line.
 *
 * @returns {Pages_Index_TerminalLineTone_Returns}
 *
 * @since 0.11.0
 */
function terminalLineTone(line: Pages_Index_TerminalLineTone_Line): Pages_Index_TerminalLineTone_Returns {
  if (line.startsWith('INFO') === true) {
    return 'terminalLineInfo';
  }

  const firstCharacter: Pages_Index_TerminalLineTone_FirstCharacter = line.slice(0, 1);

  if (promptMarkers.includes(firstCharacter) === true) {
    return 'terminalLinePrompt';
  }

  if (frameMarkers.includes(firstCharacter) === true) {
    return 'terminalLineFrame';
  }

  if (line.startsWith(' ⛅️') === true) {
    return 'terminalLineFrame';
  }

  if (line.endsWith(':') === true) {
    return 'terminalLineHeading';
  }

  return 'terminalLineBody';
}

/**
 * Pages - Home.
 *
 * Root landing page that composes the hero header, install strip, feature grid,
 * CLI showcase, and blog preview using theme components.
 *
 * @constructor
 *
 * @returns {JSX.Element}
 *
 * @since 0.11.0
 */
function Home() {
  const shots: Pages_Index_Home_Shots = [
    {
      key: 'aliases',
      label: 'Aliases',
      heading: 'A new address in seconds',
      description: (
        <>
          Pick two random words, random characters, or your own name for
          each alias, send it to any inbox you own, and give it an expiry
          date if it should stop working on its own.
        </>
      ),
      linkTo: '/docs/features/aliases/',
      linkLabel: 'Read About Aliases',
      alt: 'Creating an alias from the Mailmask CLI',
      terminalTitle: 'mail — mailmask — 80×24',
      output: [
        '✔ What would you like to do? › Manage Aliases',
        '✔ Manage Aliases › Create',
        '? Address: › - Use arrow-keys. Return to submit.',
        '❯   Two random words (e.g. velvet-harbor-42)',
        '    Random characters (e.g. k7mq2xv9pa)',
        '    Custom',
      ].join('\n'),
    },
    {
      key: 'cli',
      label: 'CLI',
      heading: 'One menu for everything',
      description: (
        <>
          Manage aliases, destination inboxes, notifiers, and settings from
          one guided menu, or run each step as a direct command with
          {' '}
          <code>npx mailmask</code>
          .
        </>
      ),
      linkTo: '/docs/reference/cli/',
      linkLabel: 'Read the CLI Reference',
      alt: 'The Mailmask interactive CLI menu',
      terminalTitle: 'mail — mailmask — 80×24',
      output: [
        '╭────────────────────────────────────────────────╮',
        '│                    Mailmask                    │',
        '│            A CBN Ventures Creation             │',
        '╰────────────────────────────────────────────────╯',
        '',
        '? What would you like to do? › - Use arrow-keys. Return to submit.',
        '❯   Manage Aliases',
        '    Manage Destinations',
        '    Manage Notifiers',
        '    Settings',
        '    Deploy',
        '    Exit',
      ].join('\n'),
    },
    {
      key: 'deploy',
      label: 'Deploy',
      heading: 'One command to deploy',
      description: (
        <>
          Deploy checks your API token, registers your inboxes with
          Cloudflare, publishes the Worker, and points Email Routing at it,
          then lists every alias so you know what is live.
        </>
      ),
      linkTo: '/docs/getting-started/deployment/',
      linkLabel: 'Deploy to Cloudflare',
      alt: 'A Mailmask deployment to Cloudflare Workers from the CLI',
      terminalTitle: 'mail — mailmask deploy — 80×30',
      output: [
        'INFO Checking authentication...',
        'INFO Authenticated.',
        'INFO Validating config...',
        'INFO Config is valid.',
        'INFO Verifying API token permissions...',
        'INFO Permissions verified.',
        'INFO Checking destination addresses...',
        'INFO All destination addresses are verified.',
        'INFO Generating wrangler.toml...',
        'INFO Generated "wrangler.toml".',
        'INFO Deploying worker...',
        ' ⛅️ wrangler',
        '────────────',
        'Uploaded mailmask',
        'INFO Worker deployed.',
        'INFO Email Routing catch-all already points at the Worker.',
        '',
        'Alias reference:',
        '',
        '  velvet-harbor-42@example.com -> you@example.net (active)',
        '  k7mq2xv9pa@example.com -> you@example.net (expires 2026-12-31T00:00:00.000Z)',
        '  newsletters@example.com -> you@example.net (disabled)',
        '',
        'INFO Deploy complete.',
      ].join('\n'),
    },
  ];

  return (
    <Layout description="Disposable email aliases on your own domain, forwarded to your real inbox by a Cloudflare Worker you own, with nothing stored">
      <Head>
        <title>Mailmask - Disposable Aliases on Your Own Domain</title>
      </Head>
      <Canvas container="full" className={styles['hero']}>
        <div className={styles['heroInner']}>
          <div className={styles['heroContent']}>
            <p className="nova-hero-eyebrow">Disposable Email Aliases</p>
            <Heading as="h1" className={`nova-hero-heading ${styles['heroHeading']}`}>
              A different address for every sign-up.
            </Heading>
            <p className="nova-hero-tagline">
              Every store, trial, and newsletter gets its own address on your domain. Mail is forwarded to your real inbox by a Cloudflare Worker you own, nothing is stored, and any alias can expire, filter senders, or switch off in seconds.
            </p>
            <div className={`nova-hero-actions ${styles['heroActions']}`}>
              <Link className="nova-cta-primary" to="/docs/getting-started/quick-start/">Get Started</Link>
              <Link className="nova-cta-secondary" to="/docs/overview/">Learn More</Link>
            </div>
          </div>
          <div className={styles['termWrap']} aria-hidden="true">
            <div className={styles['term']}>
              <div className={styles['termBar']}>
                <span className={`${styles['termDot']} ${styles['termDotRed']}`} />
                <span className={`${styles['termDot']} ${styles['termDotYellow']}`} />
                <span className={`${styles['termDot']} ${styles['termDotGreen']}`} />
                <span className={styles['termTitle']}>terminal</span>
              </div>
              <div className={styles['termBody']}>
                <span className={styles['termLine']}><span className={styles['termDim']}># Before &mdash; your real inbox everywhere</span></span>
                <span className={styles['termLine']}>
                  Email:
                  {' '}
                  <span className={styles['termExposed']}>you@example.com</span>
                </span>
                <span className={styles['termLine']}>&nbsp;</span>
                <span className={styles['termLine']}><span className={styles['termDim']}># After &mdash; one alias per sign-up</span></span>
                <span className={styles['termLine']}>
                  $ mm alias add -d personal -e 30d -l &quot;Free trial&quot;
                </span>
                <span className={styles['termLine']}>
                  <span className={styles['termDim']}>INFO</span>
                  {' '}
                  Created
                  {' '}
                  <span className={styles['termSafe']}>velvet-harbor-42@example.com</span>
                  . Run &quot;mm deploy&quot; to apply.
                </span>
                <span className={styles['termLine']}>&nbsp;</span>
                <span className={styles['termLine']}>
                  $ mm deploy
                </span>
                <span className={styles['termLine']}><span className={styles['termDim']}>&hellip;</span></span>
                <span className={styles['termLine']}>
                  <span className={styles['termDim']}>INFO</span>
                  {' '}
                  Deploy complete.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Canvas>
      <main>
        <InstallStrip command="npx mailmask" copyTarget="block" />
        <Features
          items={[
            {
              icon: 'lucide:at-sign',
              title: 'Aliases on Demand',
              description: 'Generate memorable (velvet-harbor-42) or random (k7mq2xv9pa) addresses, or pick your own. One catch-all rule covers them all, so there\'s nothing to set up or pay per alias.',
            },
            {
              icon: 'lucide:timer',
              title: 'Expiring Aliases',
              description: 'Give an alias a lifetime like 30m, 7d, or a date. When it runs out, the address stops accepting mail on its own.',
            },
            {
              icon: 'lucide:shield-check',
              title: 'Sender Rules',
              description: 'Allow only the senders or domains you expect on each alias, and block the ones that abuse it.',
            },
            {
              icon: 'lucide:power',
              title: 'One-Switch Shutdown',
              description: 'Disable an alias without deleting it. The address stays reserved, and you can turn it back on any time.',
            },
            {
              icon: 'lucide:bell',
              title: 'Refusal Notifications',
              description: 'Alert Discord, Slack, Telegram, ntfy, email, webhooks, and more when a known alias turns mail away. Random spam stays quiet.',
            },
            {
              icon: 'lucide:terminal',
              title: 'Interactive CLI',
              description: 'Create aliases, add inboxes, and deploy from a guided menu. Deploy registers your inbox and wires up Email Routing for you.',
            },
          ]}
        />
        <Spotlight heading="A closer look" surface="alt">
          <Showcase
            tabsLabel="Mailmask features"
            items={shots.map((shot) => ({
              label: shot['label'],
              heading: shot['heading'],
              description: shot['description'],
              link: {
                label: shot['linkLabel'],
                to: shot['linkTo'],
              },
              content: (
                <TerminalFrame title={shot['terminalTitle']} label={shot['alt']}>
                  {shot['output'].split('\n').map((line, index) => (
                    <span key={`${shot['key']}-${String(index)}`} className={styles[terminalLineTone(line)]}>
                      {(line === '') ? ' ' : line}
                    </span>
                  ))}
                </TerminalFrame>
              ),
            }))}
          />
        </Spotlight>
        <BlogPreview
          heading="From the Blog"
          description="Launches, milestones, and what's new in Mailmask."
          auto={true}
          limit={3}
          sort="newest"
        />
      </main>
    </Layout>
  );
}

export default Home;
