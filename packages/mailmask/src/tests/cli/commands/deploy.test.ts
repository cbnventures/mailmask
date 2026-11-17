import { resolveMx } from 'node:dns/promises';

import {
  afterEach, describe, expect, it, vi,
} from 'vitest';

import {
  applyRoutingRules,
  attachCustomDomains,
  enableSubaddressing,
  ensureEmailRoutingEnabled,
  findMissingPermissions,
  planCustomDomains,
  planRoutingRules,
  releaseCatchAll,
} from '../../../cli/commands/deploy.js';

import type {
  Tests_Cli_Commands_Deploy_Aliases,
  Tests_Cli_Commands_Deploy_ApplyRoutingRules_CreatesUpdatesAndDeletesFromThePlan_FetchSpy,
  Tests_Cli_Commands_Deploy_AttachCustomDomains_AttachesEachMissingHostToTheWorker_FetchSpy,
  Tests_Cli_Commands_Deploy_AttachCustomDomains_WarnsAndContinuesWhenCloudflareRefusesAHost_CallCount,
  Tests_Cli_Commands_Deploy_AttachCustomDomains_WarnsAndContinuesWhenCloudflareRefusesAHost_FetchSpy,
  Tests_Cli_Commands_Deploy_CloudflareResponse_Result,
  Tests_Cli_Commands_Deploy_CloudflareResponse_Returns,
  Tests_Cli_Commands_Deploy_CloudflareResponse_Success,
  Tests_Cli_Commands_Deploy_DescribeRequests_Calls,
  Tests_Cli_Commands_Deploy_DescribeRequests_Init,
  Tests_Cli_Commands_Deploy_DescribeRequests_Method,
  Tests_Cli_Commands_Deploy_DescribeRequests_Returns,
  Tests_Cli_Commands_Deploy_EnableSubaddressing_TurnsSubaddressingOnOnlyWhenCloudflareHasItOff_FetchSpy,
  Tests_Cli_Commands_Deploy_EnsureEmailRoutingEnabled_AcceptsASubdomainWhoseMxRecordsPointToCloudflare_Routing,
  Tests_Cli_Commands_Deploy_EnsureEmailRoutingEnabled_StopsForAnApexWithoutEmailRouting_RoutingCheck,
  Tests_Cli_Commands_Deploy_EnsureEmailRoutingEnabled_StopsForASubdomainWithoutCloudflareMxRecords_RoutingCheck,
  Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Cases,
  Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Missing,
  Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachPermissionOnceWhenEveryProbeFails_Missing,
  Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_FetchSpy,
  Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Missing,
  Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Paths,
  Tests_Cli_Commands_Deploy_GetRequestPath_Input,
  Tests_Cli_Commands_Deploy_GetRequestPath_Returns,
  Tests_Cli_Commands_Deploy_GetRequestPath_Url,
  Tests_Cli_Commands_Deploy_NodeDnsPromises_ResolveMxMock,
  Tests_Cli_Commands_Deploy_OwnedRule_Address,
  Tests_Cli_Commands_Deploy_OwnedRule_Id,
  Tests_Cli_Commands_Deploy_OwnedRule_Returns,
  Tests_Cli_Commands_Deploy_OwnedRule_WorkerName,
  Tests_Cli_Commands_Deploy_PlanCustomDomains_RerunsWithoutChangesOnceBothHostsAreAttached_FetchSpy,
  Tests_Cli_Commands_Deploy_PlanCustomDomains_RerunsWithoutChangesOnceBothHostsAreAttached_MissingHostnames,
  Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_FetchSpy,
  Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_MissingHostnames,
  Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_RequestUrl,
  Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsOnlyTheMissingHostWhenOneIsAttached_MissingHostnames,
  Tests_Cli_Commands_Deploy_PlanCustomDomains_StopsBeforeAnyChangeWhenAnotherWorkerOwnsAHost_FetchSpy,
  Tests_Cli_Commands_Deploy_PlanRoutingRules_CreatesARuleForEachEnabledAlias_Plan,
  Tests_Cli_Commands_Deploy_PlanRoutingRules_KeepsTwoWorkersOnOneZoneApart_Plan,
  Tests_Cli_Commands_Deploy_PlanRoutingRules_NeverTouchesRulesItDidNotCreate_Plan,
  Tests_Cli_Commands_Deploy_PlanRoutingRules_RerunsWithoutChangesOnceTheRulesMatch_FetchSpy,
  Tests_Cli_Commands_Deploy_PlanRoutingRules_RerunsWithoutChangesOnceTheRulesMatch_Plan,
  Tests_Cli_Commands_Deploy_PlanRoutingRules_StopsBeforeTheRuleLimitCountingRulesOthersOwn_OtherRules,
  Tests_Cli_Commands_Deploy_PlanRoutingRules_UpdatesChangedRulesAndRemovesRulesForGoneOrDisabledAliases_Plan,
  Tests_Cli_Commands_Deploy_ReleaseCatchAll_LeavesACatchAllThatPointsElsewhereAlone_FetchSpy,
  Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_FetchSpy,
  Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_Method,
  Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_Path,
  Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_Plan,
  Tests_Cli_Commands_Deploy_RulesResponse_Input,
  Tests_Cli_Commands_Deploy_RulesResponse_Page,
  Tests_Cli_Commands_Deploy_RulesResponse_Returns,
  Tests_Cli_Commands_Deploy_RulesResponse_Rules,
} from '../../../types/tests/cli/commands/deploy.test.d.ts';

vi.mock('node:dns/promises', () => {
  const resolveMxMock: Tests_Cli_Commands_Deploy_NodeDnsPromises_ResolveMxMock = vi.fn();

  return { resolveMx: resolveMxMock };
});

const aliases: Tests_Cli_Commands_Deploy_Aliases = [
  {
    address: 'shop',
    destination: 'personal',
    enabled: true,
  },
  {
    address: 'old',
    destination: 'personal',
    enabled: false,
  },
];

/**
 * Tests - CLI - Commands - Deploy - Cloudflare Response.
 *
 * Builds a Cloudflare v4 envelope so each test can describe the API answer
 * it needs without repeating the JSON shape or the authentication error.
 *
 * @param {Tests_Cli_Commands_Deploy_CloudflareResponse_Success} success - Success.
 * @param {Tests_Cli_Commands_Deploy_CloudflareResponse_Result}  result  - Result.
 *
 * @returns {Tests_Cli_Commands_Deploy_CloudflareResponse_Returns}
 *
 * @since 1.1.0
 */
function cloudflareResponse(success: Tests_Cli_Commands_Deploy_CloudflareResponse_Success, result: Tests_Cli_Commands_Deploy_CloudflareResponse_Result): Tests_Cli_Commands_Deploy_CloudflareResponse_Returns {
  return new Response(JSON.stringify({
    success,
    errors: (success === true) ? [] : [{
      code: 10000,
      message: 'Authentication error',
    }],
    result,
  }), {
    status: (success === true) ? 200 : 403,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Tests - CLI - Commands - Deploy - Get Request Path.
 *
 * Reduces a fetch input to its Cloudflare API path without the query, so a
 * mock can answer each endpoint the deploy command calls on its own.
 *
 * @param {Tests_Cli_Commands_Deploy_GetRequestPath_Input} input - Input.
 *
 * @returns {Tests_Cli_Commands_Deploy_GetRequestPath_Returns}
 *
 * @since 1.1.0
 */
function getRequestPath(input: Tests_Cli_Commands_Deploy_GetRequestPath_Input): Tests_Cli_Commands_Deploy_GetRequestPath_Returns {
  const url: Tests_Cli_Commands_Deploy_GetRequestPath_Url = new URL((input instanceof Request) ? input['url'] : String(input));

  return url['pathname'].replace('/client/v4', '');
}

/**
 * Tests - CLI - Commands - Deploy - Describe Requests.
 *
 * Turns recorded fetch calls into "METHOD path" lines with their JSON bodies,
 * so a test can assert the exact order of Cloudflare changes deploy makes.
 *
 * @param {Tests_Cli_Commands_Deploy_DescribeRequests_Calls} calls - Calls.
 *
 * @returns {Tests_Cli_Commands_Deploy_DescribeRequests_Returns}
 *
 * @since 1.1.0
 */
function describeRequests(calls: Tests_Cli_Commands_Deploy_DescribeRequests_Calls): Tests_Cli_Commands_Deploy_DescribeRequests_Returns {
  return calls.map((call) => {
    const init: Tests_Cli_Commands_Deploy_DescribeRequests_Init = call[1];
    const method: Tests_Cli_Commands_Deploy_DescribeRequests_Method = (init !== undefined && init['method'] !== undefined) ? init['method'] : 'GET';

    return {
      request: `${method} ${getRequestPath(call[0])}`,
      body: (init !== undefined && typeof init['body'] === 'string') ? JSON.parse(init['body']) : undefined,
    };
  });
}

/**
 * Tests - CLI - Commands - Deploy - Owned Rule.
 *
 * Builds a routing rule exactly as deploy creates it, so tests can seed a zone
 * with rules that a Mailmask Worker already owns.
 *
 * @param {Tests_Cli_Commands_Deploy_OwnedRule_Id}         id         - Id.
 * @param {Tests_Cli_Commands_Deploy_OwnedRule_WorkerName} workerName - Worker name.
 * @param {Tests_Cli_Commands_Deploy_OwnedRule_Address}    address    - Address.
 *
 * @returns {Tests_Cli_Commands_Deploy_OwnedRule_Returns}
 *
 * @since 1.1.0
 */
function ownedRule(id: Tests_Cli_Commands_Deploy_OwnedRule_Id, workerName: Tests_Cli_Commands_Deploy_OwnedRule_WorkerName, address: Tests_Cli_Commands_Deploy_OwnedRule_Address): Tests_Cli_Commands_Deploy_OwnedRule_Returns {
  return {
    id,
    name: `mailmask:${workerName}:${address}`,
    enabled: true,
    matchers: [{
      type: 'literal',
      field: 'to',
      value: address,
    }],
    actions: [{
      type: 'worker',
      value: [workerName],
    }],
  };
}

/**
 * Tests - CLI - Commands - Deploy - Rules Response.
 *
 * Answers a paged routing rules request with the matching slice of rules,
 * so tests exercise the same 50-per-page walk that deploy performs.
 *
 * @param {Tests_Cli_Commands_Deploy_RulesResponse_Input} input - Input.
 * @param {Tests_Cli_Commands_Deploy_RulesResponse_Rules} rules - Rules.
 *
 * @returns {Tests_Cli_Commands_Deploy_RulesResponse_Returns}
 *
 * @since 1.1.0
 */
function rulesResponse(input: Tests_Cli_Commands_Deploy_RulesResponse_Input, rules: Tests_Cli_Commands_Deploy_RulesResponse_Rules): Tests_Cli_Commands_Deploy_RulesResponse_Returns {
  const page: Tests_Cli_Commands_Deploy_RulesResponse_Page = Number(new URL(String(input)).searchParams.get('page') ?? '1');

  return cloudflareResponse(true, rules.slice((page - 1) * 50, page * 50));
}

afterEach(() => {
  vi.restoreAllMocks();

  return;
});

/**
 * Tests - CLI - Commands - Deploy - Find Missing Permissions.
 *
 * @since 1.1.0
 */
describe('findMissingPermissions', () => {
  it('returns nothing when every probe succeeds', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, []));
    const missing: Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Missing = await findMissingPermissions('token', 'zone-id', 'account-id');
    const paths: Tests_Cli_Commands_Deploy_FindMissingPermissions_ReturnsNothingWhenEveryProbeSucceeds_Paths = fetchSpy.mock.calls.map((call) => getRequestPath(call[0]));

    expect(missing).toEqual([]);

    expect(paths).toEqual([
      '/accounts/account-id/workers/scripts',
      '/accounts/account-id/workers/domains',
      '/accounts/account-id/email/routing/addresses',
      '/zones/zone-id/email/routing',
      '/zones/zone-id/email/routing/rules',
      '/zones/zone-id/email/routing/rules/catch_all',
      '/zones/zone-id/workers/routes',
    ]);

    return;
  });

  it('names each missing permission', async () => {
    const cases: Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Cases = [
      {
        permission: 'Account > Workers Scripts > Edit',
        failingPaths: ['/accounts/account-id/workers/scripts'],
      },
      {
        permission: 'Account > Workers Scripts > Edit',
        failingPaths: ['/accounts/account-id/workers/domains'],
      },
      {
        permission: 'Account > Email Routing Addresses > Edit',
        failingPaths: ['/accounts/account-id/email/routing/addresses'],
      },
      {
        permission: 'Zone > Zone Settings > Edit',
        failingPaths: ['/zones/zone-id/email/routing'],
      },
      {
        permission: 'Zone > Email Routing Rules > Edit',
        failingPaths: ['/zones/zone-id/email/routing/rules'],
      },
      {
        permission: 'Zone > Email Routing Rules > Edit',
        failingPaths: ['/zones/zone-id/email/routing/rules/catch_all'],
      },
      {
        permission: 'Zone > Workers Routes > Edit',
        failingPaths: ['/zones/zone-id/workers/routes'],
      },
    ];

    for (const testCase of cases) {
      vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => cloudflareResponse(testCase['failingPaths'].includes(getRequestPath(input)) === false, []));

      const missing: Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachMissingPermission_Missing = await findMissingPermissions('token', 'zone-id', 'account-id');

      expect(missing).toEqual([testCase['permission']]);

      vi.restoreAllMocks();
    }

    return;
  });

  it('names each permission once when every probe fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(false, null));

    const missing: Tests_Cli_Commands_Deploy_FindMissingPermissions_NamesEachPermissionOnceWhenEveryProbeFails_Missing = await findMissingPermissions('token', 'zone-id', 'account-id');

    expect(missing).toEqual([
      'Account > Workers Scripts > Edit',
      'Account > Email Routing Addresses > Edit',
      'Zone > Zone Settings > Edit',
      'Zone > Email Routing Rules > Edit',
      'Zone > Workers Routes > Edit',
    ]);

    return;
  });

  return;
});

/**
 * Tests - CLI - Commands - Deploy - Ensure Email Routing Enabled.
 *
 * @since 1.1.0
 */
describe('ensureEmailRoutingEnabled', () => {
  it('stops for an apex without email routing', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, { enabled: false }));

    const routingCheck: Tests_Cli_Commands_Deploy_EnsureEmailRoutingEnabled_StopsForAnApexWithoutEmailRouting_RoutingCheck = ensureEmailRoutingEnabled('token', 'zone-id', 'example.com', 'example.com');

    await expect(routingCheck).rejects.toThrow('Settings > DNS records, and select "Add missing records"');

    return;
  });

  it('stops for a subdomain without cloudflare mx records', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, { enabled: true }));

    vi.mocked(resolveMx).mockResolvedValue([{
      exchange: 'mx.other-provider.test',
      priority: 10,
    }]);

    const routingCheck: Tests_Cli_Commands_Deploy_EnsureEmailRoutingEnabled_StopsForASubdomainWithoutCloudflareMxRecords_RoutingCheck = ensureEmailRoutingEnabled('token', 'zone-id', 'example.com', 'dev.example.com');

    await expect(routingCheck).rejects.toThrow('go to Settings > Subdomains, add "dev.example.com"');

    vi.mocked(resolveMx).mockRejectedValue(new Error('queryMx ENODATA dev.example.com'));

    await expect(ensureEmailRoutingEnabled('token', 'zone-id', 'example.com', 'dev.example.com')).rejects.toThrow('Email Routing is not set up for the subdomain "dev.example.com"');

    return;
  });

  it('accepts a subdomain whose mx records point to cloudflare', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, {
      enabled: true,
      support_subaddress: false,
    }));

    vi.mocked(resolveMx).mockResolvedValue([{
      exchange: 'route1.mx.cloudflare.net',
      priority: 12,
    }]);

    const routing: Tests_Cli_Commands_Deploy_EnsureEmailRoutingEnabled_AcceptsASubdomainWhoseMxRecordsPointToCloudflare_Routing = await ensureEmailRoutingEnabled('token', 'zone-id', 'example.com', 'dev.example.com');

    expect(routing).toEqual({
      enabled: true,
      support_subaddress: false,
    });

    return;
  });

  return;
});

/**
 * Tests - CLI - Commands - Deploy - Enable Subaddressing.
 *
 * @since 1.1.0
 */
describe('enableSubaddressing', () => {
  it('turns subaddressing on only when cloudflare has it off', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_EnableSubaddressing_TurnsSubaddressingOnOnlyWhenCloudflareHasItOff_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, {}));

    await enableSubaddressing('token', 'zone-id', {
      enabled: true,
      support_subaddress: true,
    });

    expect(fetchSpy).not.toHaveBeenCalled();

    await enableSubaddressing('token', 'zone-id', { enabled: true });

    expect(describeRequests(fetchSpy.mock.calls)).toEqual([{
      request: 'PATCH /zones/zone-id/email/routing',
      body: { support_subaddress: true },
    }]);

    return;
  });

  return;
});

/**
 * Tests - CLI - Commands - Deploy - Plan Routing Rules.
 *
 * @since 1.1.0
 */
describe('planRoutingRules', () => {
  it('creates a rule for each enabled alias', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => rulesResponse(input, []));

    const plan: Tests_Cli_Commands_Deploy_PlanRoutingRules_CreatesARuleForEachEnabledAlias_Plan = await planRoutingRules('token', 'zone-id', 'mailmask', 'example.com', aliases);

    expect(plan).toEqual({
      create: ['shop@example.com'],
      update: [],
      remove: [],
      skipped: [],
    });

    return;
  });

  it('updates changed rules and removes rules for gone or disabled aliases', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => rulesResponse(input, [
      {
        ...ownedRule('rule-shop', 'mailmask', 'shop@example.com'),
        enabled: false,
      },
      ownedRule('rule-old', 'mailmask', 'old@example.com'),
      ownedRule('rule-gone', 'mailmask', 'gone@example.com'),
    ]));

    const plan: Tests_Cli_Commands_Deploy_PlanRoutingRules_UpdatesChangedRulesAndRemovesRulesForGoneOrDisabledAliases_Plan = await planRoutingRules('token', 'zone-id', 'mailmask', 'example.com', aliases);

    expect(plan).toEqual({
      create: [],
      update: [{
        id: 'rule-shop',
        address: 'shop@example.com',
      }],
      remove: [
        {
          id: 'rule-old',
          address: 'old@example.com',
        },
        {
          id: 'rule-gone',
          address: 'gone@example.com',
        },
      ],
      skipped: [],
    });

    return;
  });

  it('reruns without changes once the rules match', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_PlanRoutingRules_RerunsWithoutChangesOnceTheRulesMatch_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => rulesResponse(input, [ownedRule('rule-shop', 'mailmask', 'shop@example.com')]));
    const plan: Tests_Cli_Commands_Deploy_PlanRoutingRules_RerunsWithoutChangesOnceTheRulesMatch_Plan = await planRoutingRules('token', 'zone-id', 'mailmask', 'example.com', aliases);

    await applyRoutingRules('token', 'zone-id', 'mailmask', 'example.com', plan);

    expect(plan).toEqual({
      create: [],
      update: [],
      remove: [],
      skipped: [],
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    return;
  });

  it('never touches rules it did not create', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => rulesResponse(input, [
      {
        id: 'rule-manual',
        name: 'Rule created in the dashboard',
        enabled: true,
        matchers: [{
          type: 'literal',
          field: 'to',
          value: 'manual@example.com',
        }],
        actions: [{
          type: 'forward',
          value: ['me@inbox.test'],
        }],
      },
      {
        id: 'rule-shop-manual',
        name: 'Shop by hand',
        enabled: true,
        matchers: [{
          type: 'literal',
          field: 'to',
          value: 'shop@example.com',
        }],
        actions: [{
          type: 'forward',
          value: ['me@inbox.test'],
        }],
      },
    ]));

    const plan: Tests_Cli_Commands_Deploy_PlanRoutingRules_NeverTouchesRulesItDidNotCreate_Plan = await planRoutingRules('token', 'zone-id', 'mailmask', 'example.com', aliases);

    expect(plan).toEqual({
      create: [],
      update: [],
      remove: [],
      skipped: ['shop@example.com'],
    });

    return;
  });

  it('keeps two workers on one zone apart', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => rulesResponse(input, [
      ownedRule('rule-dev-shop', 'mailmask-dev', 'shop@dev.example.com'),
      ownedRule('rule-dev-test', 'mailmask-dev', 'test@dev.example.com'),
    ]));

    const plan: Tests_Cli_Commands_Deploy_PlanRoutingRules_KeepsTwoWorkersOnOneZoneApart_Plan = await planRoutingRules('token', 'zone-id', 'mailmask', 'example.com', aliases);

    expect(plan).toEqual({
      create: ['shop@example.com'],
      update: [],
      remove: [],
      skipped: [],
    });

    return;
  });

  it('stops before the rule limit counting rules others own', async () => {
    const otherRules: Tests_Cli_Commands_Deploy_PlanRoutingRules_StopsBeforeTheRuleLimitCountingRulesOthersOwn_OtherRules = [
      ...Array.from({ length: 199 }, (_unused, index) => ownedRule(`rule-dev-${String(index)}`, 'mailmask-dev', `dev-${String(index)}@example.com`)),
      ...Array.from({ length: 30 }, (_unused, index) => ownedRule(`rule-sub-${String(index)}`, 'mailmask-sub', `sub-${String(index)}@dev.example.com`)),
    ];

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => rulesResponse(input, otherRules));

    await expect(planRoutingRules('token', 'zone-id', 'mailmask', 'example.com', aliases)).resolves.toEqual({
      create: ['shop@example.com'],
      update: [],
      remove: [],
      skipped: [],
    });

    await expect(planRoutingRules('token', 'zone-id', 'mailmask', 'example.com', [
      ...aliases,
      {
        address: 'extra',
        destination: 'personal',
        enabled: true,
      },
    ])).rejects.toThrow('Deploy would leave 201 Email Routing rules on "example.com"');

    return;
  });

  return;
});

/**
 * Tests - CLI - Commands - Deploy - Apply Routing Rules.
 *
 * @since 1.1.0
 */
describe('applyRoutingRules', () => {
  it('creates updates and deletes from the plan', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_ApplyRoutingRules_CreatesUpdatesAndDeletesFromThePlan_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, {}));

    await applyRoutingRules('token', 'zone-id', 'mailmask', 'example.com', {
      create: ['new@example.com'],
      update: [{
        id: 'rule-shop',
        address: 'shop@example.com',
      }],
      remove: [{
        id: 'rule-gone',
        address: 'gone@example.com',
      }],
      skipped: ['manual@example.com'],
    });

    expect(describeRequests(fetchSpy.mock.calls)).toEqual([
      {
        request: 'POST /zones/zone-id/email/routing/rules',
        body: {
          name: 'mailmask:mailmask:new@example.com',
          enabled: true,
          matchers: [{
            type: 'literal',
            field: 'to',
            value: 'new@example.com',
          }],
          actions: [{
            type: 'worker',
            value: ['mailmask'],
          }],
        },
      },
      {
        request: 'PUT /zones/zone-id/email/routing/rules/rule-shop',
        body: {
          name: 'mailmask:mailmask:shop@example.com',
          enabled: true,
          matchers: [{
            type: 'literal',
            field: 'to',
            value: 'shop@example.com',
          }],
          actions: [{
            type: 'worker',
            value: ['mailmask'],
          }],
        },
      },
      {
        request: 'DELETE /zones/zone-id/email/routing/rules/rule-gone',
        body: undefined,
      },
    ]);

    return;
  });

  return;
});

/**
 * Tests - CLI - Commands - Deploy - Release Catch All.
 *
 * @since 1.1.0
 */
describe('releaseCatchAll', () => {
  it('migrates a 1.0.0 zone whose catch-all points at this worker', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const method: Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_Method = (init !== undefined && init['method'] !== undefined) ? init['method'] : 'GET';
      const path: Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_Path = getRequestPath(input);

      if (method === 'GET' && path === '/zones/zone-id/email/routing/rules/catch_all') {
        return cloudflareResponse(true, {
          name: 'mailmask: catch-all',
          enabled: true,
          matchers: [{ type: 'all' }],
          actions: [{
            type: 'worker',
            value: ['mailmask'],
          }],
        });
      }

      if (method === 'GET' && path === '/zones/zone-id/email/routing/rules') {
        return rulesResponse(input, []);
      }

      return cloudflareResponse(true, {});
    });
    const plan: Tests_Cli_Commands_Deploy_ReleaseCatchAll_MigratesA100ZoneWhoseCatchAllPointsAtThisWorker_Plan = await planRoutingRules('token', 'zone-id', 'mailmask', 'example.com', aliases);

    await applyRoutingRules('token', 'zone-id', 'mailmask', 'example.com', plan);

    await releaseCatchAll('token', 'zone-id', 'mailmask');

    expect(describeRequests(fetchSpy.mock.calls)).toEqual([
      {
        request: 'GET /zones/zone-id/email/routing/rules',
        body: undefined,
      },
      {
        request: 'POST /zones/zone-id/email/routing/rules',
        body: expect.objectContaining({ name: 'mailmask:mailmask:shop@example.com' }),
      },
      {
        request: 'GET /zones/zone-id/email/routing/rules/catch_all',
        body: undefined,
      },
      {
        request: 'PUT /zones/zone-id/email/routing/rules/catch_all',
        body: {
          name: 'mailmask: catch-all',
          enabled: false,
          matchers: [{ type: 'all' }],
          actions: [{ type: 'drop' }],
        },
      },
    ]);

    return;
  });

  it('leaves a catch-all that points elsewhere alone', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_ReleaseCatchAll_LeavesACatchAllThatPointsElsewhereAlone_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, {
      enabled: true,
      matchers: [{ type: 'all' }],
      actions: [{
        type: 'worker',
        value: ['mailmask-dev'],
      }],
    }));

    await releaseCatchAll('token', 'zone-id', 'mailmask');

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    return;
  });

  return;
});

/**
 * Tests - CLI - Commands - Deploy - Plan Custom Domains.
 *
 * @since 1.1.0
 */
describe('planCustomDomains', () => {
  it('returns both hosts when none are attached', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, [{
      hostname: 'blog.example.com',
      service: 'website',
    }]));
    const missingHostnames: Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_MissingHostnames = await planCustomDomains('token', 'account-id', 'zone-id', 'mailmask', 'example.com');
    const requestUrl: Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsBothHostsWhenNoneAreAttached_RequestUrl = fetchSpy.mock.calls.map((call) => String(call[0]));

    expect(missingHostnames).toEqual([
      'example.com',
      'www.example.com',
    ]);

    expect(requestUrl).toEqual(['https://api.cloudflare.com/client/v4/accounts/account-id/workers/domains?zone_id=zone-id']);

    return;
  });

  it('returns only the missing host when one is attached', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, [{
      hostname: 'example.com',
      service: 'mailmask',
    }]));

    const missingHostnames: Tests_Cli_Commands_Deploy_PlanCustomDomains_ReturnsOnlyTheMissingHostWhenOneIsAttached_MissingHostnames = await planCustomDomains('token', 'account-id', 'zone-id', 'mailmask', 'example.com');

    expect(missingHostnames).toEqual(['www.example.com']);

    return;
  });

  it('reruns without changes once both hosts are attached', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_PlanCustomDomains_RerunsWithoutChangesOnceBothHostsAreAttached_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, [
      {
        hostname: 'example.com',
        service: 'mailmask',
      },
      {
        hostname: 'www.example.com',
        service: 'mailmask',
      },
    ]));
    const missingHostnames: Tests_Cli_Commands_Deploy_PlanCustomDomains_RerunsWithoutChangesOnceBothHostsAreAttached_MissingHostnames = await planCustomDomains('token', 'account-id', 'zone-id', 'mailmask', 'example.com');

    await attachCustomDomains('token', 'account-id', 'zone-id', 'mailmask', missingHostnames);

    expect(missingHostnames).toEqual([]);

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    return;
  });

  it('stops before any change when another worker owns a host', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_PlanCustomDomains_StopsBeforeAnyChangeWhenAnotherWorkerOwnsAHost_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, [
      {
        hostname: 'example.com',
        service: 'mailmask',
      },
      {
        hostname: 'www.example.com',
        service: 'website',
      },
    ]));

    await expect(planCustomDomains('token', 'account-id', 'zone-id', 'mailmask', 'example.com')).rejects.toThrow('"www.example.com" is attached to the Worker "website"');

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    return;
  });

  return;
});

/**
 * Tests - CLI - Commands - Deploy - Attach Custom Domains.
 *
 * @since 1.1.0
 */
describe('attachCustomDomains', () => {
  it('attaches each missing host to the worker', async () => {
    const fetchSpy: Tests_Cli_Commands_Deploy_AttachCustomDomains_AttachesEachMissingHostToTheWorker_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => cloudflareResponse(true, {}));

    await attachCustomDomains('token', 'account-id', 'zone-id', 'mailmask', [
      'example.com',
      'www.example.com',
    ]);

    expect(describeRequests(fetchSpy.mock.calls)).toEqual([
      {
        request: 'PUT /accounts/account-id/workers/domains',
        body: {
          hostname: 'example.com',
          service: 'mailmask',
          zone_id: 'zone-id',
        },
      },
      {
        request: 'PUT /accounts/account-id/workers/domains',
        body: {
          hostname: 'www.example.com',
          service: 'mailmask',
          zone_id: 'zone-id',
        },
      },
    ]);

    return;
  });

  it('warns and continues when cloudflare refuses a host', async () => {
    let callCount: Tests_Cli_Commands_Deploy_AttachCustomDomains_WarnsAndContinuesWhenCloudflareRefusesAHost_CallCount = 0;

    const fetchSpy: Tests_Cli_Commands_Deploy_AttachCustomDomains_WarnsAndContinuesWhenCloudflareRefusesAHost_FetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
      callCount += 1;

      return cloudflareResponse(callCount !== 1, null);
    });

    await expect(attachCustomDomains('token', 'account-id', 'zone-id', 'mailmask', [
      'example.com',
      'www.example.com',
    ])).resolves.toBeUndefined();

    expect(fetchSpy).toHaveBeenCalledTimes(2);

    return;
  });

  return;
});
