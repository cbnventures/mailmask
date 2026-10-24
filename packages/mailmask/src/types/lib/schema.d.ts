/**
 * Lib - Schema.
 *
 * @since UNRELEASED
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

export type Lib_Schema_DestinationConfig = {
  name: Lib_Schema_DestinationConfigName;
  email: Lib_Schema_DestinationConfigEmail;
};

export type Lib_Schema_SettingsConfigWorkerName = string;

export type Lib_Schema_SettingsConfigBaseDomain = string;

export type Lib_Schema_SettingsConfigUnknownAliasAction = 'reject' | 'drop' | 'forward';

export type Lib_Schema_SettingsConfigDefaultDestination = string | undefined;

export type Lib_Schema_SettingsConfigSubaddressing = boolean;

export type Lib_Schema_SettingsConfigAddAliasHeaders = boolean;

export type Lib_Schema_SettingsConfig = {
  worker_name: Lib_Schema_SettingsConfigWorkerName;
  base_domain: Lib_Schema_SettingsConfigBaseDomain;
  unknown_alias_action: Lib_Schema_SettingsConfigUnknownAliasAction;
  default_destination?: Lib_Schema_SettingsConfigDefaultDestination;
  subaddressing: Lib_Schema_SettingsConfigSubaddressing;
  add_alias_headers: Lib_Schema_SettingsConfigAddAliasHeaders;
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

export type Lib_Schema_NotifierConfig = Lib_Schema_NtfyNotifierConfig | Lib_Schema_NtfyReverseProxyNotifierConfig;

export type Lib_Schema_ConfigSchemaDestinations = Lib_Schema_DestinationConfig[];

export type Lib_Schema_ConfigSchemaAliases = Lib_Schema_AliasConfig[];

export type Lib_Schema_ConfigSchemaNotifiers = Lib_Schema_NotifierConfig[];

export type Lib_Schema_ConfigSchemaSettings = Lib_Schema_SettingsConfig;

export type Lib_Schema_ConfigSchema = {
  destinations: Lib_Schema_ConfigSchemaDestinations;
  aliases: Lib_Schema_ConfigSchemaAliases;
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

export type Lib_Schema_CloudflareEnvelopeErrors = Lib_Schema_CloudflareEnvelopeError[] | undefined;

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

export type Lib_Schema_CloudflareEmailRoutingSettings = {
  enabled: Lib_Schema_CloudflareEmailRoutingSettingsEnabled;
};

export type Lib_Schema_CloudflareDestinationAddressEmail = string;

export type Lib_Schema_CloudflareDestinationAddressVerified = string | null | undefined;

export type Lib_Schema_CloudflareDestinationAddress = {
  email: Lib_Schema_CloudflareDestinationAddressEmail;
  verified?: Lib_Schema_CloudflareDestinationAddressVerified;
};

export type Lib_Schema_CloudflareDestinationAddresses = Lib_Schema_CloudflareDestinationAddress[];

export type Lib_Schema_CloudflareCatchAllEnabled = boolean | undefined;

export type Lib_Schema_CloudflareCatchAllActionType = string;

export type Lib_Schema_CloudflareCatchAllActionValue = string[] | undefined;

export type Lib_Schema_CloudflareCatchAllAction = {
  type: Lib_Schema_CloudflareCatchAllActionType;
  value?: Lib_Schema_CloudflareCatchAllActionValue;
};

export type Lib_Schema_CloudflareCatchAllActions = Lib_Schema_CloudflareCatchAllAction[];

export type Lib_Schema_CloudflareCatchAll = {
  enabled?: Lib_Schema_CloudflareCatchAllEnabled;
  actions: Lib_Schema_CloudflareCatchAllActions;
};
