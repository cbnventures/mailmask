import type {
  Shared_PhoneAvailableNumber,
  Shared_PhoneInboundMessage,
  Shared_PhoneNumberSearch,
  Shared_PhoneOutboundMessage,
  Shared_PhoneWebhook,
  Shared_PhoneWebhookReply,
} from '../shared.d.ts';
import type { Lib_Schema_PhoneProviderConfig } from './schema.d.ts';

/**
 * Lib - Phone Provider - Get Phone Provider Adapter.
 *
 * @since 1.2.0
 */
export type Lib_PhoneProvider_GetPhoneProviderAdapter_Type = 'plivo' | 'telnyx';

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_VerifyWebhook = (provider: Lib_Schema_PhoneProviderConfig, webhook: Shared_PhoneWebhook, now: number) => Promise<boolean>;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_ParseInboundMessage = (webhook: Shared_PhoneWebhook) => Shared_PhoneInboundMessage | undefined;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_AcknowledgeMessage = () => Shared_PhoneWebhookReply;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_SendMessage = (provider: Lib_Schema_PhoneProviderConfig, message: Shared_PhoneOutboundMessage) => Promise<void>;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_CheckCredentials = (provider: Lib_Schema_PhoneProviderConfig) => Promise<void>;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_SearchNumbers = (provider: Lib_Schema_PhoneProviderConfig, search: Shared_PhoneNumberSearch) => Promise<Shared_PhoneAvailableNumber[]>;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_OwnsNumber = (provider: Lib_Schema_PhoneProviderConfig, number: string) => Promise<boolean>;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_BuyNumber = (provider: Lib_Schema_PhoneProviderConfig, number: string) => Promise<string>;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_ReleaseNumber = (provider: Lib_Schema_PhoneProviderConfig, number: string) => Promise<void>;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_ConnectNumbers = (provider: Lib_Schema_PhoneProviderConfig, numbers: string[], baseUrl: string) => Promise<Lib_Schema_PhoneProviderConfig>;

export type Lib_PhoneProvider_GetPhoneProviderAdapter_Returns = {
  verifyWebhook: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_VerifyWebhook;
  parseInboundMessage: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_ParseInboundMessage;
  acknowledgeMessage: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_AcknowledgeMessage;
  sendMessage: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_SendMessage;
  checkCredentials: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_CheckCredentials;
  searchNumbers: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_SearchNumbers;
  ownsNumber: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_OwnsNumber;
  buyNumber: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_BuyNumber;
  releaseNumber: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_ReleaseNumber;
  connectNumbers: Lib_PhoneProvider_GetPhoneProviderAdapter_Returns_ConnectNumbers;
};
