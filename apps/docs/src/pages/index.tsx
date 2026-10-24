import {
  BlogPreview,
  Canvas,
  Features,
  InstallStrip,
  Stats,
} from '@cbnventures/docusaurus-preset-nova/blocks';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

import styles from './index.module.css';

/**
 * Pages - Home.
 *
 * Root landing page that composes the hero header, install strip, feature grid,
 * stats, and blog preview using theme components.
 *
 * @constructor
 *
 * @returns {JSX.Element}
 *
 * @since 0.11.0
 */
function Home() {
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
              <Link className="nova-cta-primary" to="/docs/overview/">Read the Docs</Link>
              <Link className="nova-cta-secondary" to="https://github.com/cbnventures/mailmask">View on GitHub</Link>
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
                  Created
                  {' '}
                  <span className={styles['termSafe']}>velvet-harbor-42@mail.example.com</span>
                </span>
                <span className={styles['termLine']}>
                  Expires in
                  {' '}
                  <span className={styles['termNew']}>30 days</span>
                </span>
                <span className={styles['termLine']}>&nbsp;</span>
                <span className={styles['termLine']}>
                  <span className={styles['termSafe']}>&#10003;</span>
                  {' '}
                  Inbox hidden &nbsp;
                  <span className={styles['termSafe']}>&#10003;</span>
                  {' '}
                  Self-expiring &nbsp;
                  <span className={styles['termSafe']}>&#10003;</span>
                  {' '}
                  Nothing stored
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
              title: 'Unlimited Aliases',
              description: 'Generate memorable (velvet-harbor-42) or random (k7mq2xv9pa) addresses, or pick your own. One catch-all rule covers them all.',
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
              description: 'Get an ntfy notification when a disabled, expired, or filtered alias turns mail away. Random spam stays quiet.',
            },
            {
              icon: 'lucide:terminal',
              title: 'Interactive CLI',
              description: 'Create aliases, add inboxes, and deploy from a guided menu. Deploy registers your inbox and wires up Email Routing for you.',
            },
          ]}
        />
        <Stats
          heading="By the Numbers"
          items={[
            {
              value: '∞',
              label: 'Aliases per domain',
              color: 'primary',
            },
            {
              value: '0',
              label: 'Messages stored',
              color: 'accent',
            },
            {
              value: '1',
              label: 'Catch-all rule to manage',
              color: 'primary',
            },
            {
              value: '1',
              label: 'Command to deploy',
              color: 'accent',
            },
          ]}
        />
        <BlogPreview
          heading="From the Blog"
          description="Release notes, setup guides, and privacy notes."
          auto={true}
          limit={3}
        />
      </main>
    </Layout>
  );
}

export default Home;
