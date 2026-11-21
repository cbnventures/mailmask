import { describe, expect, it } from 'vitest';

import { Runner as SlackNotifier } from '../../../lib/notifiers/slack.js';
import { createPayload } from './fixtures.js';

/**
 * Tests - Lib - Notifiers - Slack - Slack Adapter.
 *
 * @since 1.2.0
 */
describe('Slack adapter', () => {
  it('builds its exact request and owns validation', () => {
    expect(new SlackNotifier({
      type: 'slack',
      name: 'slack',
      webhook_url: 'https://hooks.slack.com/services/one/two/three',
    }).buildRequest(createPayload())).toEqual({
      url: 'https://hooks.slack.com/services/one/two/three',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: [
          '*Mailmask &lt;alert&gt;*',
          'Message &lt;&amp;&gt;.',
        ].join('\n'),
      }),
    });

    expect(SlackNotifier.validate({
      type: 'slack',
      name: 'slack',
      webhook_url: 'https://hooks.slack.com/services/one/two/three',
    })).toBe(true);

    expect(SlackNotifier.validate({
      type: 'slack',
      name: 'slack',
      webhook_url: 'https://example.com/hook',
    })).toBe(false);

    return;
  });

  return;
});
