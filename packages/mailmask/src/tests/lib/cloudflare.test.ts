import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import { Runner as CloudflareAdapter } from '../../lib/cloudflare.js';

import type {
  Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_FetchSpy,
  Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Method,
  Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Onboarded,
  Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Setup,
  Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Url,
  Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_ZoneRecords,
  Tests_Lib_Cloudflare_Adapter_ProbesBillingReadOnlyWhenAsked_FetchSpy,
  Tests_Lib_Cloudflare_Adapter_ProbesEmailSendingAndDnsPermissionsOnlyWhenAsked_FetchSpy,
  Tests_Lib_Cloudflare_Adapter_ReadsAccountResources_FetchSpy,
  Tests_Lib_Cloudflare_Adapter_ReadsAccountResources_Zone,
  Tests_Lib_Cloudflare_Adapter_ReadsRoutingRulesAsMailmaskRules_Rules,
  Tests_Lib_Cloudflare_Adapter_ReadsTheCatchAllWorkers_CatchAll,
  Tests_Lib_Cloudflare_Adapter_ReadsTheWorkersPlanFromTheAccountSubscriptions_Plan,
  Tests_Lib_Cloudflare_Adapter_ReportsAnUnreadableWorkersPlanAsUnknown_Plan,
  Tests_Lib_Cloudflare_Adapter_TreatsATokenCheckThatCannotReachCloudflareAsInvalid_Valid,
  Tests_Lib_Cloudflare_CloudflareResponse_Result,
  Tests_Lib_Cloudflare_CloudflareResponse_Returns,
} from '../../types/tests/lib/cloudflare.test.d.ts';

afterEach(() => {
  vi.restoreAllMocks();

  return;
});

/**
 * Tests - Lib - Cloudflare - Response.
 *
 * Builds a successful Cloudflare v4 envelope around a result, so each test only
 * describes the part of the answer the adapter reads.
 *
 * @param {Tests_Lib_Cloudflare_CloudflareResponse_Result} result - Result.
 *
 * @returns {Tests_Lib_Cloudflare_CloudflareResponse_Returns}
 *
 * @since 1.2.0
 */
function cloudflareResponse(result: Tests_Lib_Cloudflare_CloudflareResponse_Result): Tests_Lib_Cloudflare_CloudflareResponse_Returns {
  return new Response(JSON.stringify({
    success: true,
    errors: [],
    result,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Tests - Lib - Cloudflare - Adapter.
 *
 * @since 1.2.0
 */
describe('adapter', () => {
  it('reads routing rules as mailmask rules', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse([
      {
        id: 'rule-shop',
        name: 'mailmask:mailmask:shop@example.com',
        enabled: true,
        matchers: [{
          type: 'literal',
          field: 'to',
          value: 'Shop@Example.com',
        }],
        actions: [{
          type: 'worker',
          value: ['mailmask'],
        }],
      },
      {
        id: 'rule-manual',
        matchers: [{
          type: 'all',
        }],
        actions: [{
          type: 'forward',
          value: ['me@inbox.test'],
        }],
      },
    ]));

    const rules: Tests_Lib_Cloudflare_Adapter_ReadsRoutingRulesAsMailmaskRules_Rules = await CloudflareAdapter.listRoutingRules('token', 'zone-id');

    expect(rules).toEqual([
      {
        id: 'rule-shop',
        name: 'mailmask:mailmask:shop@example.com',
        enabled: true,
        address: 'shop@example.com',
        workerName: 'mailmask',
      },
      {
        id: 'rule-manual',
        name: undefined,
        enabled: undefined,
        address: undefined,
        workerName: undefined,
      },
    ]);

    return;
  });

  it('reads the catch-all workers', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse({
      name: 'mailmask: catch-all',
      enabled: true,
      actions: [{
        type: 'worker',
        value: ['mailmask'],
      }],
    }));

    const catchAll: Tests_Lib_Cloudflare_Adapter_ReadsTheCatchAllWorkers_CatchAll = await CloudflareAdapter.getCatchAll('token', 'zone-id');

    expect(catchAll).toEqual({
      name: 'mailmask: catch-all',
      workerNames: ['mailmask'],
    });

    return;
  });

  it('reads account resources', async () => {
    const fetchSpy: Tests_Lib_Cloudflare_Adapter_ReadsAccountResources_FetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(cloudflareResponse([{
        id: 'zone-id',
        name: 'example.com',
        account: { id: 'account-id' },
      }]))
      .mockResolvedValueOnce(cloudflareResponse([]))
      .mockResolvedValueOnce(cloudflareResponse([
        {
          email: 'me@inbox.test',
          verified: '2026-11-01T00:00:00Z',
        },
        {
          email: 'new@inbox.test',
          verified: null,
        },
      ]))
      .mockResolvedValueOnce(cloudflareResponse([{
        hostname: 'example.com',
        service: 'mailmask',
      }]))
      .mockResolvedValueOnce(cloudflareResponse({
        enabled: true,
      }));

    const zone: Tests_Lib_Cloudflare_Adapter_ReadsAccountResources_Zone = await CloudflareAdapter.findZone('token', 'example.com');

    expect(zone).toEqual({
      zoneId: 'zone-id',
      accountId: 'account-id',
      zoneName: 'example.com',
    });

    await expect(CloudflareAdapter.findZone('token', 'other.example')).resolves.toBeUndefined();

    await expect(CloudflareAdapter.listDestinationAddresses('token', 'account-id')).resolves.toEqual([
      {
        email: 'me@inbox.test',
        verified: true,
      },
      {
        email: 'new@inbox.test',
        verified: false,
      },
    ]);

    await expect(CloudflareAdapter.listWorkerDomains('token', 'account-id', 'zone-id')).resolves.toEqual([{
      hostname: 'example.com',
      workerName: 'mailmask',
    }]);

    await expect(CloudflareAdapter.getEmailRouting('token', 'zone-id')).resolves.toEqual({
      enabled: true,
      subaddressing: false,
    });

    expect(new Headers(fetchSpy.mock.calls[0]![1]!['headers']).get('Authorization')).toBe('Bearer token');

    return;
  });

  it('onboards the domain to email sending and adds only missing records', async () => {
    const zoneRecords: Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_ZoneRecords = [{
      type: 'TXT',
      name: '_dmarc.example.com',
      content: '"v=DMARC1; p=none"',
    }];
    let onboarded: Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Onboarded = false;

    const fetchSpy: Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url: Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Url = new URL(String(input));
      const method: Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Method = (init !== undefined && init['method'] !== undefined) ? init['method'] : 'GET';

      if (url['pathname'].endsWith('/email/sending/subdomains') === true && method === 'GET') {
        return cloudflareResponse((onboarded === true) ? [{
          name: 'example.com',
          tag: 'sending-1',
          enabled: true,
        }] : []);
      }

      if (url['pathname'].endsWith('/email/sending/subdomains') === true && method === 'POST') {
        onboarded = true;

        return cloudflareResponse({
          name: 'example.com',
          tag: 'sending-1',
          enabled: true,
        });
      }

      if (url['pathname'].endsWith('/email/sending/subdomains/sending-1/dns') === true) {
        return cloudflareResponse([
          {
            type: 'MX',
            name: 'cf-bounce',
            content: 'route1.mx.cloudflare.net',
            priority: 13,
          },
          {
            type: 'TXT',
            name: 'cf-bounce.example.com',
            content: 'v=spf1 include:_spf.mx.cloudflare.net ~all',
          },
          {
            type: 'TXT',
            name: '_dmarc',
            content: 'v=DMARC1; p=reject',
          },
        ]);
      }

      if (url['pathname'].endsWith('/dns_records') === true && method === 'GET') {
        return cloudflareResponse(zoneRecords.filter((zoneRecord) => zoneRecord['type'] === url.searchParams.get('type') && zoneRecord['name'] === url.searchParams.get('name')));
      }

      if (url['pathname'].endsWith('/dns_records') === true && method === 'POST') {
        zoneRecords.push(JSON.parse(String(init!['body'])));

        return cloudflareResponse({});
      }

      return cloudflareResponse(null);
    });

    const setup: Tests_Lib_Cloudflare_Adapter_OnboardsTheDomainToEmailSendingAndAddsOnlyMissingRecords_Setup = await CloudflareAdapter.ensureEmailSendingDomain('token', 'zone-id', 'example.com', 'Example.com');

    expect(setup).toEqual({
      created: true,
      addedRecords: [
        'MX cf-bounce.example.com',
        'TXT cf-bounce.example.com',
      ],
      records: [
        {
          type: 'MX',
          name: 'cf-bounce.example.com',
          content: 'route1.mx.cloudflare.net',
        },
        {
          type: 'TXT',
          name: 'cf-bounce.example.com',
          content: 'v=spf1 include:_spf.mx.cloudflare.net ~all',
        },
        {
          type: 'TXT',
          name: '_dmarc.example.com',
          content: undefined,
        },
      ],
    });

    expect(zoneRecords[1]).toEqual({
      type: 'MX',
      name: 'cf-bounce.example.com',
      content: 'route1.mx.cloudflare.net',
      ttl: 1,
      priority: 13,
    });

    await expect(CloudflareAdapter.ensureEmailSendingDomain('token', 'zone-id', 'example.com', 'example.com')).resolves.toEqual({
      created: false,
      addedRecords: [],
      records: setup['records'],
    });

    expect(fetchSpy.mock.calls.filter((call) => call[1] !== undefined && call[1]['method'] === 'POST')).toHaveLength(3);

    return;
  });

  it('probes email sending and dns permissions only when asked', async () => {
    const fetchSpy: Tests_Lib_Cloudflare_Adapter_ProbesEmailSendingAndDnsPermissionsOnlyWhenAsked_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      if (String(input).includes('/email/sending/') === true || String(input).includes('/dns_records') === true) {
        return new Response(JSON.stringify({
          success: false,
          errors: [{
            code: 10000,
            message: 'Authentication error',
          }],
          result: null,
        }), { status: 403 });
      }

      return cloudflareResponse([]);
    });

    await expect(CloudflareAdapter.findMissingPermissions('token', 'zone-id', 'account-id')).resolves.toEqual([]);

    await expect(CloudflareAdapter.findMissingPermissions('token', 'zone-id', 'account-id', true)).resolves.toEqual([
      'Zone > Email Sending > Edit',
      'Zone > DNS > Edit',
    ]);

    expect(fetchSpy.mock.calls.map((call) => String(call[0])).some((url) => url.endsWith('/zones/zone-id/email/sending/subdomains'))).toBe(true);

    return;
  });

  it('probes billing read only when asked', async () => {
    const fetchSpy: Tests_Lib_Cloudflare_Adapter_ProbesBillingReadOnlyWhenAsked_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      if (String(input).endsWith('/subscriptions') === true) {
        return new Response(JSON.stringify({
          success: false,
          errors: [{
            code: 10000,
            message: 'Authentication error',
          }],
          result: null,
        }), { status: 403 });
      }

      return cloudflareResponse([]);
    });

    await expect(CloudflareAdapter.findMissingPermissions('token', 'zone-id', 'account-id')).resolves.toEqual([]);

    expect(fetchSpy.mock.calls.some((call) => String(call[0]).endsWith('/subscriptions'))).toBe(false);

    await expect(CloudflareAdapter.findMissingPermissions('token', 'zone-id', 'account-id', true)).resolves.toEqual(['Account > Billing > Read']);

    expect(fetchSpy.mock.calls.some((call) => String(call[0]).endsWith('/accounts/account-id/subscriptions'))).toBe(true);

    return;
  });

  it('reads the workers plan from the account subscriptions', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async () => cloudflareResponse([
      {
        state: 'Paid',
        rate_plan: {
          id: 'pro',
          public_name: 'Pro Plan',
        },
      },
      {
        state: 'Paid',
        rate_plan: {
          id: 'workers_paid',
          public_name: 'Workers Paid',
        },
      },
    ])).mockImplementationOnce(async () => cloudflareResponse([{
      state: 'Cancelled',
      rate_plan: {
        id: 'workers_paid',
        public_name: 'Workers Paid',
      },
    }])).mockImplementationOnce(async () => cloudflareResponse(null));

    const plan: Tests_Lib_Cloudflare_Adapter_ReadsTheWorkersPlanFromTheAccountSubscriptions_Plan = await CloudflareAdapter.getWorkersPlan('token', 'account-id');

    expect(plan).toBe('paid');

    await expect(CloudflareAdapter.getWorkersPlan('token', 'account-id')).resolves.toBe('free');

    await expect(CloudflareAdapter.getWorkersPlan('token', 'account-id')).resolves.toBe('free');

    return;
  });

  it('reports an unreadable workers plan as unknown', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async () => new Response(JSON.stringify({
      success: false,
      errors: [{
        code: 10000,
        message: 'Authentication error',
      }],
      result: null,
    }), { status: 403 })).mockRejectedValueOnce(new Error('network down'));

    const plan: Tests_Lib_Cloudflare_Adapter_ReportsAnUnreadableWorkersPlanAsUnknown_Plan = await CloudflareAdapter.getWorkersPlan('token', 'account-id');

    expect(plan).toBe('unknown');

    await expect(CloudflareAdapter.getWorkersPlan('token', 'account-id')).resolves.toBe('unknown');

    return;
  });

  it('treats a token check that cannot reach cloudflare as invalid', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));

    const valid: Tests_Lib_Cloudflare_Adapter_TreatsATokenCheckThatCannotReachCloudflareAsInvalid_Valid = await CloudflareAdapter.verifyToken('token');

    expect(valid).toBe(false);

    return;
  });

  return;
});
