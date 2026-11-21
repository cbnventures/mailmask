/**
 * Lib - Schema.
 *
 * @since 0.0.1
 */
export type Lib_Schema_AliasConfigAddress = string;

export type Lib_Schema_AliasConfigDestination = string;

export type Lib_Schema_AliasConfigLabel = string | undefined;

export type Lib_Schema_AliasConfigEnabled = boolean;

export type Lib_Schema_AliasConfigExpiresAt = string | undefined;

export type Lib_Schema_AliasConfigSenderPattern = string;

export type Lib_Schema_AliasConfigSenderPatterns = Lib_Schema_AliasConfigSenderPattern[];

export type Lib_Schema_AliasConfigAllowedSenders = Lib_Schema_AliasConfigSenderPatterns | undefined;

export type Lib_Schema_AliasConfigBlockedSenders = Lib_Schema_AliasConfigSenderPatterns | undefined;

export type Lib_Schema_AliasConfig = {
  address: Lib_Schema_AliasConfigAddress;
  destination: Lib_Schema_AliasConfigDestination;
  label?: Lib_Schema_AliasConfigLabel;
  enabled: Lib_Schema_AliasConfigEnabled;
  expires_at?: Lib_Schema_AliasConfigExpiresAt;
  allowed_senders?: Lib_Schema_AliasConfigAllowedSenders;
  blocked_senders?: Lib_Schema_AliasConfigBlockedSenders;
};

export type Lib_Schema_DestinationConfigName = string;

export type Lib_Schema_DestinationConfigEmail = string;

export type Lib_Schema_DestinationConfigPhone = string | undefined;

export type Lib_Schema_DestinationConfig = {
  name: Lib_Schema_DestinationConfigName;
  email: Lib_Schema_DestinationConfigEmail;
  phone?: Lib_Schema_DestinationConfigPhone;
};

export type Lib_Schema_PhoneAliasConfigNumber = string;

export type Lib_Schema_PhoneAliasConfigProvider = string;

export type Lib_Schema_PhoneAliasConfigDestination = string;

export type Lib_Schema_PhoneAliasConfigLabel = string | undefined;

export type Lib_Schema_PhoneAliasConfigEnabled = boolean;

export type Lib_Schema_PhoneAliasConfigExpiresAt = string | undefined;

export type Lib_Schema_PhoneAliasConfigSenderPattern = string;

export type Lib_Schema_PhoneAliasConfigSenderPatterns = Lib_Schema_PhoneAliasConfigSenderPattern[];

export type Lib_Schema_PhoneAliasConfigAllowedSenders = Lib_Schema_PhoneAliasConfigSenderPatterns | undefined;

export type Lib_Schema_PhoneAliasConfigBlockedSenders = Lib_Schema_PhoneAliasConfigSenderPatterns | undefined;

export type Lib_Schema_PhoneAliasConfig = {
  number: Lib_Schema_PhoneAliasConfigNumber;
  provider: Lib_Schema_PhoneAliasConfigProvider;
  destination: Lib_Schema_PhoneAliasConfigDestination;
  label?: Lib_Schema_PhoneAliasConfigLabel;
  enabled: Lib_Schema_PhoneAliasConfigEnabled;
  expires_at?: Lib_Schema_PhoneAliasConfigExpiresAt;
  allowed_senders?: Lib_Schema_PhoneAliasConfigAllowedSenders;
  blocked_senders?: Lib_Schema_PhoneAliasConfigBlockedSenders;
};

export type Lib_Schema_TelnyxProviderConfigType = 'telnyx';

export type Lib_Schema_TelnyxProviderConfigName = string;

export type Lib_Schema_TelnyxProviderConfigApiKey = string;

export type Lib_Schema_TelnyxProviderConfigPublicKey = string;

export type Lib_Schema_TelnyxProviderConfigMessagingProfileId = string | undefined;

export type Lib_Schema_TelnyxProviderConfigDestinationCountry = string;

export type Lib_Schema_TelnyxProviderConfigDestinationCountries = Lib_Schema_TelnyxProviderConfigDestinationCountry[] | undefined;

export type Lib_Schema_TelnyxProviderConfig = {
  type: Lib_Schema_TelnyxProviderConfigType;
  name: Lib_Schema_TelnyxProviderConfigName;
  api_key: Lib_Schema_TelnyxProviderConfigApiKey;
  public_key: Lib_Schema_TelnyxProviderConfigPublicKey;
  messaging_profile_id?: Lib_Schema_TelnyxProviderConfigMessagingProfileId;
  destination_countries?: Lib_Schema_TelnyxProviderConfigDestinationCountries;
};

export type Lib_Schema_PlivoProviderConfigType = 'plivo';

export type Lib_Schema_PlivoProviderConfigName = string;

export type Lib_Schema_PlivoProviderConfigAuthId = string;

export type Lib_Schema_PlivoProviderConfigAuthToken = string;

export type Lib_Schema_PlivoProviderConfigApplicationId = string | undefined;

export type Lib_Schema_PlivoProviderConfig = {
  type: Lib_Schema_PlivoProviderConfigType;
  name: Lib_Schema_PlivoProviderConfigName;
  auth_id: Lib_Schema_PlivoProviderConfigAuthId;
  auth_token: Lib_Schema_PlivoProviderConfigAuthToken;
  application_id?: Lib_Schema_PlivoProviderConfigApplicationId;
};

export type Lib_Schema_PhoneProviderConfig = Lib_Schema_PlivoProviderConfig | Lib_Schema_TelnyxProviderConfig;

export type Lib_Schema_SettingsConfigWorkerName = string;

export type Lib_Schema_SettingsConfigBaseDomain = string;

export type Lib_Schema_SettingsConfigSubaddressing = boolean;

export type Lib_Schema_SettingsConfigAddAliasHeaders = boolean;

export type Lib_Schema_SettingsConfigSendFromAliases = boolean | undefined;

export type Lib_Schema_SettingsConfig = {
  worker_name: Lib_Schema_SettingsConfigWorkerName;
  base_domain: Lib_Schema_SettingsConfigBaseDomain;
  subaddressing: Lib_Schema_SettingsConfigSubaddressing;
  add_alias_headers: Lib_Schema_SettingsConfigAddAliasHeaders;
  send_from_aliases?: Lib_Schema_SettingsConfigSendFromAliases;
};

export type Lib_Schema_AppriseNotifierConfigType = 'apprise';

export type Lib_Schema_AppriseNotifierConfigName = string;

export type Lib_Schema_AppriseNotifierConfigUrl = string;

export type Lib_Schema_AppriseNotifierConfigUrls = string | undefined;

export type Lib_Schema_AppriseNotifierConfig = {
  type: Lib_Schema_AppriseNotifierConfigType;
  name: Lib_Schema_AppriseNotifierConfigName;
  url: Lib_Schema_AppriseNotifierConfigUrl;
  urls?: Lib_Schema_AppriseNotifierConfigUrls;
};

export type Lib_Schema_DiscordNotifierConfigType = 'discord';

export type Lib_Schema_DiscordNotifierConfigName = string;

export type Lib_Schema_DiscordNotifierConfigWebhookUrl = string;

export type Lib_Schema_DiscordNotifierConfig = {
  type: Lib_Schema_DiscordNotifierConfigType;
  name: Lib_Schema_DiscordNotifierConfigName;
  webhook_url: Lib_Schema_DiscordNotifierConfigWebhookUrl;
};

export type Lib_Schema_EmailNotifierConfigType = 'email';

export type Lib_Schema_EmailNotifierConfigName = string;

export type Lib_Schema_EmailNotifierConfigFrom = string;

export type Lib_Schema_EmailNotifierConfigTo = string;

export type Lib_Schema_EmailNotifierConfig = {
  type: Lib_Schema_EmailNotifierConfigType;
  name: Lib_Schema_EmailNotifierConfigName;
  from: Lib_Schema_EmailNotifierConfigFrom;
  to: Lib_Schema_EmailNotifierConfigTo;
};

export type Lib_Schema_GotifyNotifierConfigType = 'gotify';

export type Lib_Schema_GotifyNotifierConfigName = string;

export type Lib_Schema_GotifyNotifierConfigUrl = string;

export type Lib_Schema_GotifyNotifierConfigToken = string;

export type Lib_Schema_GotifyNotifierConfig = {
  type: Lib_Schema_GotifyNotifierConfigType;
  name: Lib_Schema_GotifyNotifierConfigName;
  url: Lib_Schema_GotifyNotifierConfigUrl;
  token: Lib_Schema_GotifyNotifierConfigToken;
};

export type Lib_Schema_MatrixNotifierConfigType = 'matrix';

export type Lib_Schema_MatrixNotifierConfigName = string;

export type Lib_Schema_MatrixNotifierConfigHomeserverUrl = string;

export type Lib_Schema_MatrixNotifierConfigRoomId = string;

export type Lib_Schema_MatrixNotifierConfigAccessToken = string;

export type Lib_Schema_MatrixNotifierConfig = {
  type: Lib_Schema_MatrixNotifierConfigType;
  name: Lib_Schema_MatrixNotifierConfigName;
  homeserver_url: Lib_Schema_MatrixNotifierConfigHomeserverUrl;
  room_id: Lib_Schema_MatrixNotifierConfigRoomId;
  access_token: Lib_Schema_MatrixNotifierConfigAccessToken;
};

export type Lib_Schema_NtfyNotifierConfigType = 'ntfy';

export type Lib_Schema_NtfyNotifierConfigName = string;

export type Lib_Schema_NtfyNotifierConfigServer = string;

export type Lib_Schema_NtfyNotifierConfigTopic = string;

export type Lib_Schema_NtfyNotifierConfigToken = string;

export type Lib_Schema_NtfyNotifierConfig = {
  type: Lib_Schema_NtfyNotifierConfigType;
  name: Lib_Schema_NtfyNotifierConfigName;
  server: Lib_Schema_NtfyNotifierConfigServer;
  topic: Lib_Schema_NtfyNotifierConfigTopic;
  token: Lib_Schema_NtfyNotifierConfigToken;
};

export type Lib_Schema_NtfyReverseProxyNotifierConfigType = 'ntfy-reverse-proxy';

export type Lib_Schema_NtfyReverseProxyNotifierConfigName = string;

export type Lib_Schema_NtfyReverseProxyNotifierConfigUrl = string;

export type Lib_Schema_NtfyReverseProxyNotifierConfigToken = string | undefined;

export type Lib_Schema_NtfyReverseProxyNotifierConfig = {
  type: Lib_Schema_NtfyReverseProxyNotifierConfigType;
  name: Lib_Schema_NtfyReverseProxyNotifierConfigName;
  url: Lib_Schema_NtfyReverseProxyNotifierConfigUrl;
  token?: Lib_Schema_NtfyReverseProxyNotifierConfigToken;
};

export type Lib_Schema_PushoverNotifierConfigType = 'pushover';

export type Lib_Schema_PushoverNotifierConfigName = string;

export type Lib_Schema_PushoverNotifierConfigUserKey = string;

export type Lib_Schema_PushoverNotifierConfigAppToken = string;

export type Lib_Schema_PushoverNotifierConfig = {
  type: Lib_Schema_PushoverNotifierConfigType;
  name: Lib_Schema_PushoverNotifierConfigName;
  user_key: Lib_Schema_PushoverNotifierConfigUserKey;
  app_token: Lib_Schema_PushoverNotifierConfigAppToken;
};

export type Lib_Schema_SlackNotifierConfigType = 'slack';

export type Lib_Schema_SlackNotifierConfigName = string;

export type Lib_Schema_SlackNotifierConfigWebhookUrl = string;

export type Lib_Schema_SlackNotifierConfig = {
  type: Lib_Schema_SlackNotifierConfigType;
  name: Lib_Schema_SlackNotifierConfigName;
  webhook_url: Lib_Schema_SlackNotifierConfigWebhookUrl;
};

export type Lib_Schema_TelegramNotifierConfigType = 'telegram';

export type Lib_Schema_TelegramNotifierConfigName = string;

export type Lib_Schema_TelegramNotifierConfigBotToken = string;

export type Lib_Schema_TelegramNotifierConfigChatId = string;

export type Lib_Schema_TelegramNotifierConfig = {
  type: Lib_Schema_TelegramNotifierConfigType;
  name: Lib_Schema_TelegramNotifierConfigName;
  bot_token: Lib_Schema_TelegramNotifierConfigBotToken;
  chat_id: Lib_Schema_TelegramNotifierConfigChatId;
};

export type Lib_Schema_WebhookNotifierConfigType = 'webhook';

export type Lib_Schema_WebhookNotifierConfigName = string;

export type Lib_Schema_WebhookNotifierConfigUrl = string;

export type Lib_Schema_WebhookNotifierConfigToken = string | undefined;

export type Lib_Schema_WebhookNotifierConfig = {
  type: Lib_Schema_WebhookNotifierConfigType;
  name: Lib_Schema_WebhookNotifierConfigName;
  url: Lib_Schema_WebhookNotifierConfigUrl;
  token?: Lib_Schema_WebhookNotifierConfigToken;
};

export type Lib_Schema_NotifierConfig = Lib_Schema_AppriseNotifierConfig | Lib_Schema_DiscordNotifierConfig | Lib_Schema_EmailNotifierConfig | Lib_Schema_GotifyNotifierConfig | Lib_Schema_MatrixNotifierConfig | Lib_Schema_NtfyNotifierConfig | Lib_Schema_NtfyReverseProxyNotifierConfig | Lib_Schema_PushoverNotifierConfig | Lib_Schema_SlackNotifierConfig | Lib_Schema_TelegramNotifierConfig | Lib_Schema_WebhookNotifierConfig;

export type Lib_Schema_ConfigSchemaDestinations = Lib_Schema_DestinationConfig[];

export type Lib_Schema_ConfigSchemaAliases = Lib_Schema_AliasConfig[];

export type Lib_Schema_ConfigSchemaPhoneProviders = Lib_Schema_PhoneProviderConfig[] | undefined;

export type Lib_Schema_ConfigSchemaPhoneAliases = Lib_Schema_PhoneAliasConfig[] | undefined;

export type Lib_Schema_ConfigSchemaNotifiers = Lib_Schema_NotifierConfig[];

export type Lib_Schema_ConfigSchemaSettings = Lib_Schema_SettingsConfig;

export type Lib_Schema_ConfigSchema = {
  destinations: Lib_Schema_ConfigSchemaDestinations;
  aliases: Lib_Schema_ConfigSchemaAliases;
  phone_providers?: Lib_Schema_ConfigSchemaPhoneProviders;
  phone_aliases?: Lib_Schema_ConfigSchemaPhoneAliases;
  notifiers: Lib_Schema_ConfigSchemaNotifiers;
  settings: Lib_Schema_ConfigSchemaSettings;
};

export type Lib_Schema_CloudflareEnvelopeSuccess = boolean;

export type Lib_Schema_CloudflareEnvelopeErrorCode = number;

export type Lib_Schema_CloudflareEnvelopeErrorMessage = string;

export type Lib_Schema_CloudflareEnvelopeError = {
  code: Lib_Schema_CloudflareEnvelopeErrorCode;
  message: Lib_Schema_CloudflareEnvelopeErrorMessage;
};

export type Lib_Schema_CloudflareEnvelopeErrors = Lib_Schema_CloudflareEnvelopeError[] | null | undefined;

export type Lib_Schema_CloudflareEnvelopeResult = unknown;

export type Lib_Schema_CloudflareEnvelope = {
  success: Lib_Schema_CloudflareEnvelopeSuccess;
  errors?: Lib_Schema_CloudflareEnvelopeErrors;
  result?: Lib_Schema_CloudflareEnvelopeResult;
};

export type Lib_Schema_CloudflareZoneId = string;

export type Lib_Schema_CloudflareZoneName = string;

export type Lib_Schema_CloudflareZoneAccountId = string;

export type Lib_Schema_CloudflareZoneAccount = {
  id: Lib_Schema_CloudflareZoneAccountId;
};

export type Lib_Schema_CloudflareZone = {
  id: Lib_Schema_CloudflareZoneId;
  name: Lib_Schema_CloudflareZoneName;
  account: Lib_Schema_CloudflareZoneAccount;
};

export type Lib_Schema_CloudflareZones = Lib_Schema_CloudflareZone[];

export type Lib_Schema_CloudflareEmailRoutingSettingsEnabled = boolean;

export type Lib_Schema_CloudflareEmailRoutingSettingsSupportSubaddress = boolean | undefined;

export type Lib_Schema_CloudflareEmailRoutingSettings = {
  enabled: Lib_Schema_CloudflareEmailRoutingSettingsEnabled;
  support_subaddress?: Lib_Schema_CloudflareEmailRoutingSettingsSupportSubaddress;
};

export type Lib_Schema_CloudflareDestinationAddressEmail = string;

export type Lib_Schema_CloudflareDestinationAddressVerified = string | null | undefined;

export type Lib_Schema_CloudflareDestinationAddress = {
  email: Lib_Schema_CloudflareDestinationAddressEmail;
  verified?: Lib_Schema_CloudflareDestinationAddressVerified;
};

export type Lib_Schema_CloudflareDestinationAddresses = Lib_Schema_CloudflareDestinationAddress[];

export type Lib_Schema_CloudflareCatchAllName = string | undefined;

export type Lib_Schema_CloudflareCatchAllEnabled = boolean | undefined;

export type Lib_Schema_CloudflareCatchAllActionType = string;

export type Lib_Schema_CloudflareCatchAllActionValue = string[] | undefined;

export type Lib_Schema_CloudflareCatchAllAction = {
  type: Lib_Schema_CloudflareCatchAllActionType;
  value?: Lib_Schema_CloudflareCatchAllActionValue;
};

export type Lib_Schema_CloudflareCatchAllActions = Lib_Schema_CloudflareCatchAllAction[];

export type Lib_Schema_CloudflareCatchAll = {
  name?: Lib_Schema_CloudflareCatchAllName;
  enabled?: Lib_Schema_CloudflareCatchAllEnabled;
  actions: Lib_Schema_CloudflareCatchAllActions;
};

export type Lib_Schema_CloudflareRoutingRuleId = string;

export type Lib_Schema_CloudflareRoutingRuleName = string | undefined;

export type Lib_Schema_CloudflareRoutingRuleEnabled = boolean | undefined;

export type Lib_Schema_CloudflareRoutingRuleMatcherType = string;

export type Lib_Schema_CloudflareRoutingRuleMatcherField = string | undefined;

export type Lib_Schema_CloudflareRoutingRuleMatcherValue = string | undefined;

export type Lib_Schema_CloudflareRoutingRuleMatcher = {
  type: Lib_Schema_CloudflareRoutingRuleMatcherType;
  field?: Lib_Schema_CloudflareRoutingRuleMatcherField;
  value?: Lib_Schema_CloudflareRoutingRuleMatcherValue;
};

export type Lib_Schema_CloudflareRoutingRuleActionType = string;

export type Lib_Schema_CloudflareRoutingRuleActionValue = string[] | undefined;

export type Lib_Schema_CloudflareRoutingRuleAction = {
  type: Lib_Schema_CloudflareRoutingRuleActionType;
  value?: Lib_Schema_CloudflareRoutingRuleActionValue;
};

export type Lib_Schema_CloudflareRoutingRuleMatchers = Lib_Schema_CloudflareRoutingRuleMatcher[];

export type Lib_Schema_CloudflareRoutingRuleActions = Lib_Schema_CloudflareRoutingRuleAction[];

export type Lib_Schema_CloudflareRoutingRule = {
  id: Lib_Schema_CloudflareRoutingRuleId;
  name?: Lib_Schema_CloudflareRoutingRuleName;
  enabled?: Lib_Schema_CloudflareRoutingRuleEnabled;
  matchers: Lib_Schema_CloudflareRoutingRuleMatchers;
  actions: Lib_Schema_CloudflareRoutingRuleActions;
};

export type Lib_Schema_CloudflareRoutingRules = Lib_Schema_CloudflareRoutingRule[];

export type Lib_Schema_CloudflareSendingSubdomainName = string;

export type Lib_Schema_CloudflareSendingSubdomainTag = string;

export type Lib_Schema_CloudflareSendingSubdomainEnabled = boolean | undefined;

export type Lib_Schema_CloudflareSendingSubdomain = {
  name: Lib_Schema_CloudflareSendingSubdomainName;
  tag: Lib_Schema_CloudflareSendingSubdomainTag;
  enabled?: Lib_Schema_CloudflareSendingSubdomainEnabled;
};

export type Lib_Schema_CloudflareSendingSubdomains = Lib_Schema_CloudflareSendingSubdomain[];

export type Lib_Schema_CloudflareDnsRecordType = string;

export type Lib_Schema_CloudflareDnsRecordName = string;

export type Lib_Schema_CloudflareDnsRecordContent = string;

export type Lib_Schema_CloudflareDnsRecordPriority = number | undefined;

export type Lib_Schema_CloudflareDnsRecord = {
  type: Lib_Schema_CloudflareDnsRecordType;
  name: Lib_Schema_CloudflareDnsRecordName;
  content: Lib_Schema_CloudflareDnsRecordContent;
  priority?: Lib_Schema_CloudflareDnsRecordPriority;
};

export type Lib_Schema_CloudflareDnsRecords = Lib_Schema_CloudflareDnsRecord[];

export type Lib_Schema_CloudflareWorkerDomainHostname = string;

export type Lib_Schema_CloudflareWorkerDomainService = string;

export type Lib_Schema_CloudflareWorkerDomain = {
  hostname: Lib_Schema_CloudflareWorkerDomainHostname;
  service: Lib_Schema_CloudflareWorkerDomainService;
};

export type Lib_Schema_CloudflareWorkerDomains = Lib_Schema_CloudflareWorkerDomain[];

export type Lib_Schema_CloudflareSubscriptionState = string;

export type Lib_Schema_CloudflareSubscriptionRatePlanId = string;

export type Lib_Schema_CloudflareSubscriptionRatePlanPublicName = string;

export type Lib_Schema_CloudflareSubscriptionRatePlan = {
  id: Lib_Schema_CloudflareSubscriptionRatePlanId;
  public_name: Lib_Schema_CloudflareSubscriptionRatePlanPublicName;
};

export type Lib_Schema_CloudflareSubscriptionProductName = string;

export type Lib_Schema_CloudflareSubscriptionProduct = {
  name: Lib_Schema_CloudflareSubscriptionProductName;
};

export type Lib_Schema_CloudflareSubscription = {
  state: Lib_Schema_CloudflareSubscriptionState;
  rate_plan: Lib_Schema_CloudflareSubscriptionRatePlan;
  product: Lib_Schema_CloudflareSubscriptionProduct;
};

export type Lib_Schema_CloudflareSubscriptions = Lib_Schema_CloudflareSubscription[];

export type Lib_Schema_DnsOverHttpsAnswerStatus = number;

export type Lib_Schema_DnsOverHttpsAnswerRecordType = number;

export type Lib_Schema_DnsOverHttpsAnswerRecordData = string;

export type Lib_Schema_DnsOverHttpsAnswerRecord = {
  type: Lib_Schema_DnsOverHttpsAnswerRecordType;
  data: Lib_Schema_DnsOverHttpsAnswerRecordData;
};

export type Lib_Schema_DnsOverHttpsAnswerRecords = Lib_Schema_DnsOverHttpsAnswerRecord[] | undefined;

export type Lib_Schema_DnsOverHttpsAnswer = {
  Status: Lib_Schema_DnsOverHttpsAnswerStatus;
  Answer?: Lib_Schema_DnsOverHttpsAnswerRecords;
};

export type Lib_Schema_TelnyxWebhookDataEventType = string;

export type Lib_Schema_TelnyxWebhookDataPayloadId = string;

export type Lib_Schema_TelnyxWebhookDataPayloadFromPhoneNumber = string;

export type Lib_Schema_TelnyxWebhookDataPayloadFrom = {
  phone_number: Lib_Schema_TelnyxWebhookDataPayloadFromPhoneNumber;
};

export type Lib_Schema_TelnyxWebhookDataPayloadToItemPhoneNumber = string;

export type Lib_Schema_TelnyxWebhookDataPayloadToItem = {
  phone_number: Lib_Schema_TelnyxWebhookDataPayloadToItemPhoneNumber;
};

export type Lib_Schema_TelnyxWebhookDataPayloadTo = Lib_Schema_TelnyxWebhookDataPayloadToItem[];

export type Lib_Schema_TelnyxWebhookDataPayloadText = string | null | undefined;

export type Lib_Schema_TelnyxWebhookDataPayloadMediaItemUrl = string;

export type Lib_Schema_TelnyxWebhookDataPayloadMediaItem = {
  url: Lib_Schema_TelnyxWebhookDataPayloadMediaItemUrl;
};

export type Lib_Schema_TelnyxWebhookDataPayloadMedia = Lib_Schema_TelnyxWebhookDataPayloadMediaItem[] | null | undefined;

export type Lib_Schema_TelnyxWebhookDataPayload = {
  id: Lib_Schema_TelnyxWebhookDataPayloadId;
  from: Lib_Schema_TelnyxWebhookDataPayloadFrom;
  to: Lib_Schema_TelnyxWebhookDataPayloadTo;
  text?: Lib_Schema_TelnyxWebhookDataPayloadText;
  media?: Lib_Schema_TelnyxWebhookDataPayloadMedia;
};

export type Lib_Schema_TelnyxWebhookDataPayloadOptional = Lib_Schema_TelnyxWebhookDataPayload | undefined;

export type Lib_Schema_TelnyxWebhookData = {
  event_type: Lib_Schema_TelnyxWebhookDataEventType;
  payload?: Lib_Schema_TelnyxWebhookDataPayloadOptional;
};

export type Lib_Schema_TelnyxWebhook = {
  data: Lib_Schema_TelnyxWebhookData;
};

export type Lib_Schema_TelnyxAvailableNumberPhoneNumber = string;

export type Lib_Schema_TelnyxAvailableNumberFeatureName = string;

export type Lib_Schema_TelnyxAvailableNumberFeature = {
  name: Lib_Schema_TelnyxAvailableNumberFeatureName;
};

export type Lib_Schema_TelnyxAvailableNumberFeatures = Lib_Schema_TelnyxAvailableNumberFeature[] | undefined;

export type Lib_Schema_TelnyxAvailableNumber = {
  phone_number: Lib_Schema_TelnyxAvailableNumberPhoneNumber;
  features?: Lib_Schema_TelnyxAvailableNumberFeatures;
};

export type Lib_Schema_TelnyxAvailableNumbersData = Lib_Schema_TelnyxAvailableNumber[];

export type Lib_Schema_TelnyxAvailableNumbers = {
  data: Lib_Schema_TelnyxAvailableNumbersData;
};

export type Lib_Schema_TelnyxPhoneNumberId = string;

export type Lib_Schema_TelnyxPhoneNumberPhoneNumber = string;

export type Lib_Schema_TelnyxPhoneNumber = {
  id: Lib_Schema_TelnyxPhoneNumberId;
  phone_number: Lib_Schema_TelnyxPhoneNumberPhoneNumber;
};

export type Lib_Schema_TelnyxPhoneNumbersData = Lib_Schema_TelnyxPhoneNumber[];

export type Lib_Schema_TelnyxPhoneNumbers = {
  data: Lib_Schema_TelnyxPhoneNumbersData;
};

export type Lib_Schema_TelnyxMessagingProfileDataId = string;

export type Lib_Schema_TelnyxMessagingProfileData = {
  id: Lib_Schema_TelnyxMessagingProfileDataId;
};

export type Lib_Schema_TelnyxMessagingProfile = {
  data: Lib_Schema_TelnyxMessagingProfileData;
};

export type Lib_Schema_TelnyxNumberOrderDataId = string;

export type Lib_Schema_TelnyxNumberOrderDataStatus = string;

export type Lib_Schema_TelnyxNumberOrderData = {
  id: Lib_Schema_TelnyxNumberOrderDataId;
  status: Lib_Schema_TelnyxNumberOrderDataStatus;
};

export type Lib_Schema_TelnyxNumberOrder = {
  data: Lib_Schema_TelnyxNumberOrderData;
};

export type Lib_Schema_PlivoAvailableNumberNumber = string;

export type Lib_Schema_PlivoAvailableNumberSmsEnabled = boolean | undefined;

export type Lib_Schema_PlivoAvailableNumberMmsEnabled = boolean | undefined;

export type Lib_Schema_PlivoAvailableNumberVoiceEnabled = boolean | undefined;

export type Lib_Schema_PlivoAvailableNumber = {
  number: Lib_Schema_PlivoAvailableNumberNumber;
  sms_enabled?: Lib_Schema_PlivoAvailableNumberSmsEnabled;
  mms_enabled?: Lib_Schema_PlivoAvailableNumberMmsEnabled;
  voice_enabled?: Lib_Schema_PlivoAvailableNumberVoiceEnabled;
};

export type Lib_Schema_PlivoAvailableNumbersObjects = Lib_Schema_PlivoAvailableNumber[];

export type Lib_Schema_PlivoAvailableNumbers = {
  objects: Lib_Schema_PlivoAvailableNumbersObjects;
};

export type Lib_Schema_PlivoApplicationAppId = string;

export type Lib_Schema_PlivoApplication = {
  app_id: Lib_Schema_PlivoApplicationAppId;
};

export type Lib_Schema_PlivoBuyNumberNumberNumber = string;

export type Lib_Schema_PlivoBuyNumberNumberStatus = string;

export type Lib_Schema_PlivoBuyNumberNumber = {
  number: Lib_Schema_PlivoBuyNumberNumberNumber;
  status: Lib_Schema_PlivoBuyNumberNumberStatus;
};

export type Lib_Schema_PlivoBuyNumberNumbers = Lib_Schema_PlivoBuyNumberNumber[] | undefined;

export type Lib_Schema_PlivoBuyNumberStatus = string | undefined;

export type Lib_Schema_PlivoBuyNumber = {
  numbers?: Lib_Schema_PlivoBuyNumberNumbers;
  status?: Lib_Schema_PlivoBuyNumberStatus;
};
