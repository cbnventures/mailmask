import { Runner as PlivoAdapter } from './plivo.js';
import { Runner as TelnyxAdapter } from './telnyx.js';

import type {
  Lib_PhoneProvider_GetPhoneProviderAdapter_Returns,
  Lib_PhoneProvider_GetPhoneProviderAdapter_Type,
} from '../types/lib/phone-provider.d.ts';

/**
 * Lib - Phone Provider - Get Phone Provider Adapter.
 *
 * Returns the adapter for a provider type. Telnyx and Plivo share one interface,
 * so the Worker and CLI handle phone aliases the same way for both.
 *
 * @param {Lib_PhoneProvider_GetPhoneProviderAdapter_Type} type - Type.
 *
 * @returns {Lib_PhoneProvider_GetPhoneProviderAdapter_Returns}
 *
 * @since 1.2.0
 */
function getPhoneProviderAdapter(type: Lib_PhoneProvider_GetPhoneProviderAdapter_Type): Lib_PhoneProvider_GetPhoneProviderAdapter_Returns {
  if (type === 'plivo') {
    return PlivoAdapter;
  }

  return TelnyxAdapter;
}

export {
  getPhoneProviderAdapter,
};
