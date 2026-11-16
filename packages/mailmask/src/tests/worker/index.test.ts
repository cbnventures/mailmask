import {
  describe, expect, it, vi,
} from 'vitest';

import { createWorker } from '../../worker/index.js';

import type {
  Tests_Worker_Index_BaseConfig,
  Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message,
  Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Worker,
  Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message,
  Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Worker,
  Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Body,
  Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Request,
  Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Response,
  Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Worker,
  Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Body,
  Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Request,
  Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Response,
  Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Worker,
  Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Body,
  Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Request,
  Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Response,
  Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Worker,
  Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Body,
  Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Request,
  Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Response,
  Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Worker,
  Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Body,
  Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Request,
  Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Response,
  Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Worker,
  Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Body,
  Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Request,
  Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Response,
  Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Worker,
} from '../../types/tests/worker/index.test.d.ts';

const baseConfig: Tests_Worker_Index_BaseConfig = {
  destinations: [{
    name: 'personal',
    email: 'me@inbox.test',
  }],
  aliases: [{
    address: 'shop',
    destination: 'personal',
    enabled: true,
  }],
  notifiers: [],
  settings: {
    worker_name: 'mailmask',
    base_domain: 'mail.example.com',
    unknown_alias_action: 'reject',
    subaddressing: true,
    add_alias_headers: true,
  },
};

/**
 * Tests - Worker - Create Worker.
 *
 * @since 1.0.0
 */
describe('createWorker', () => {
  it('forwards mail for a known alias', async () => {
    const worker: Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Worker = createWorker(baseConfig);
    const message: Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message = {
      to: 'shop@mail.example.com',
      from: 'store@shop.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };

    await worker.email(message, undefined, { waitUntil: vi.fn() });

    expect(message['forward']).toHaveBeenCalledWith('me@inbox.test', expect.any(Headers));

    expect(message['setReject']).not.toHaveBeenCalled();

    return;
  });

  it('rejects mail when the config is invalid', async () => {
    const worker: Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Worker = createWorker({
      ...baseConfig,
      aliases: 'not-a-list',
    });
    const message: Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message = {
      to: 'shop@mail.example.com',
      from: 'store@shop.test',
      forward: vi.fn(async () => ({ messageId: 'test' })),
      setReject: vi.fn(),
    };

    await worker.email(message, undefined, { waitUntil: vi.fn() });

    expect(message['setReject']).toHaveBeenCalledWith('Temporary configuration error');

    expect(message['forward']).not.toHaveBeenCalled();

    return;
  });

  it('returns JSON 404 for GET outside root', async () => {
    const worker: Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Worker = createWorker(baseConfig);
    const request: Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Request = new Request('https://mail.example.com/anything-else', { method: 'GET' });
    const response: Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Response = await worker.fetch(request);
    const body: Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Body = await response.text();

    expect(response.status).toBe(404);

    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(body).toBe([
      '{',
      '  "status": "error",',
      '  "message": "Mailmask only handles inbound email."',
      '}',
    ].join('\n'));

    return;
  });

  it('returns JSON 404 for HEAD outside root', async () => {
    const worker: Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Worker = createWorker(baseConfig);
    const request: Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Request = new Request('https://mail.example.com/anything-else', { method: 'HEAD' });
    const response: Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Response = await worker.fetch(request);
    const body: Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Body = await response.text();

    expect(response.status).toBe(404);

    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(body).toBe('');

    return;
  });

  it('returns JSON 405 for POST at root', async () => {
    const worker: Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Worker = createWorker(baseConfig);
    const request: Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Request = new Request('https://mail.example.com/', { method: 'POST' });
    const response: Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Response = await worker.fetch(request);
    const body: Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Body = await response.text();

    expect(response.status).toBe(405);

    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(response.headers.get('Allow')).toBe('GET, HEAD');

    expect(body).toBe([
      '{',
      '  "status": "error",',
      '  "message": "Method not allowed"',
      '}',
    ].join('\n'));

    return;
  });

  it('returns JSON 405 for PUT outside root', async () => {
    const worker: Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Worker = createWorker(baseConfig);
    const request: Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Request = new Request('https://mail.example.com/anything-else', { method: 'PUT' });
    const response: Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Response = await worker.fetch(request);
    const body: Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Body = await response.text();

    expect(response.status).toBe(405);

    expect(response.headers.get('Content-Type')).toBe('application/json');

    expect(response.headers.get('Allow')).toBe('GET, HEAD');

    expect(body).toBe([
      '{',
      '  "status": "error",',
      '  "message": "Method not allowed"',
      '}',
    ].join('\n'));

    return;
  });

  it('returns service page for root', async () => {
    const worker: Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Worker = createWorker(baseConfig);
    const request: Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Request = new Request('https://mail.example.com/', { method: 'GET' });
    const response: Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Response = await worker.fetch(request);
    const body: Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Body = await response.text();

    expect(response.status).toBe(200);

    expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');

    expect(body).toContain('Receiving mail');

    expect(body).toContain('https://mailmask.cbnventures.io/');

    expect(body).toContain('https://github.com/cbnventures/mailmask');

    expect(body).toContain('A CBN Ventures project');

    expect(body).not.toContain('<script>');

    return;
  });

  it('returns service page for HEAD root', async () => {
    const worker: Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Worker = createWorker(baseConfig);
    const request: Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Request = new Request('https://mail.example.com/', { method: 'HEAD' });
    const response: Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Response = await worker.fetch(request);
    const body: Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Body = await response.text();

    expect(response.status).toBe(200);

    expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');

    expect(body).toBe('');

    return;
  });

  return;
});
