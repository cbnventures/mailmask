import type { Mock } from 'vitest';

import type { Lib_Schema_ConfigSchema } from '../../lib/schema.d.ts';
import type { Worker_Index_CreateWorker_Returns } from '../../worker/index.d.ts';

/**
 * Tests - Worker - Index.
 *
 * @since 1.0.0
 */
export type Tests_Worker_Index_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Index - Create Worker - Does Not Redirect Other Hosts.
 *
 * @since 1.1.0
 */
export type Tests_Worker_Index_CreateWorker_DoesNotRedirectOtherHosts_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_DoesNotRedirectOtherHosts_Response = Response;

/**
 * Tests - Worker - Index - Create Worker - Forwards Mail For A Known Alias.
 *
 * @since 1.0.0
 */
export type Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message_To = string;

export type Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message_From = string;

export type Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message = {
  to: Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message_To;
  from: Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message_From;
  forward: Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message_Forward;
  setReject: Tests_Worker_Index_CreateWorker_ForwardsMailForAKnownAlias_Message_SetReject;
};

/**
 * Tests - Worker - Index - Create Worker - Redirects Www Root And Other Methods To The Base Domain.
 *
 * @since 1.1.0
 */
export type Tests_Worker_Index_CreateWorker_RedirectsWwwRootAndOtherMethodsToTheBaseDomain_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_RedirectsWwwRootAndOtherMethodsToTheBaseDomain_RootResponse = Response;

export type Tests_Worker_Index_CreateWorker_RedirectsWwwRootAndOtherMethodsToTheBaseDomain_PostResponse = Response;

/**
 * Tests - Worker - Index - Create Worker - Redirects Www To The Base Domain With Path And Query.
 *
 * @since 1.1.0
 */
export type Tests_Worker_Index_CreateWorker_RedirectsWwwToTheBaseDomainWithPathAndQuery_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_RedirectsWwwToTheBaseDomainWithPathAndQuery_Request = Request;

export type Tests_Worker_Index_CreateWorker_RedirectsWwwToTheBaseDomainWithPathAndQuery_Response = Response;

/**
 * Tests - Worker - Index - Create Worker - Rejects Mail When The Config Is Invalid.
 *
 * @since 1.0.0
 */
export type Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message_To = string;

export type Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message_From = string;

export type Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message = {
  to: Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message_To;
  from: Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message_From;
  forward: Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message_Forward;
  setReject: Tests_Worker_Index_CreateWorker_RejectsMailWhenTheConfigIsInvalid_Message_SetReject;
};

/**
 * Tests - Worker - Index - Create Worker - Returns JSON 404 For GET Outside Root.
 *
 * @since 1.0.0
 */
export type Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Request = Request;

export type Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Response = Response;

export type Tests_Worker_Index_CreateWorker_ReturnsJSON404ForGETOutsideRoot_Body = string;

/**
 * Tests - Worker - Index - Create Worker - Returns JSON 404 For HEAD Outside Root.
 *
 * @since 1.0.0
 */
export type Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Request = Request;

export type Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Response = Response;

export type Tests_Worker_Index_CreateWorker_ReturnsJSON404ForHEADOutsideRoot_Body = string;

/**
 * Tests - Worker - Index - Create Worker - Returns JSON 405 For POST At Root.
 *
 * @since 1.0.0
 */
export type Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Request = Request;

export type Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Response = Response;

export type Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPOSTAtRoot_Body = string;

/**
 * Tests - Worker - Index - Create Worker - Returns JSON 405 For PUT Outside Root.
 *
 * @since 1.0.0
 */
export type Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Request = Request;

export type Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Response = Response;

export type Tests_Worker_Index_CreateWorker_ReturnsJSON405ForPUTOutsideRoot_Body = string;

/**
 * Tests - Worker - Index - Create Worker - Returns Service Page For HEAD Root.
 *
 * @since 1.0.0
 */
export type Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Request = Request;

export type Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Response = Response;

export type Tests_Worker_Index_CreateWorker_ReturnsServicePageForHEADRoot_Body = string;

/**
 * Tests - Worker - Index - Create Worker - Returns Service Page For Root.
 *
 * @since 1.0.0
 */
export type Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Worker = { [Key in keyof Worker_Index_CreateWorker_Returns]: Worker_Index_CreateWorker_Returns[Key] };

export type Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Request = Request;

export type Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Response = Response;

export type Tests_Worker_Index_CreateWorker_ReturnsServicePageForRoot_Body = string;
