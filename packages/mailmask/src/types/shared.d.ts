/**
 * Shared - Cloudflare Catch All.
 *
 * @since 1.2.0
 */
export type Shared_CloudflareCatchAll_Name = string | undefined;

export type Shared_CloudflareCatchAll_WorkerName = string;

export type Shared_CloudflareCatchAll_WorkerNames = Shared_CloudflareCatchAll_WorkerName[];

export type Shared_CloudflareCatchAll = {
  name: Shared_CloudflareCatchAll_Name;
  workerNames: Shared_CloudflareCatchAll_WorkerNames;
};

/**
 * Shared - Cloudflare Destination Address.
 *
 * @since 1.2.0
 */
export type Shared_CloudflareDestinationAddress_Email = string;

export type Shared_CloudflareDestinationAddress_Verified = boolean;

export type Shared_CloudflareDestinationAddress = {
  email: Shared_CloudflareDestinationAddress_Email;
  verified: Shared_CloudflareDestinationAddress_Verified;
};

/**
 * Shared - Public DNS Record.
 *
 * @since 1.2.0
 */
export type Shared_PublicDnsRecord_Type = string;

export type Shared_PublicDnsRecord_Name = string;

export type Shared_PublicDnsRecord_Content = string | undefined;

export type Shared_PublicDnsRecord = {
  type: Shared_PublicDnsRecord_Type;
  name: Shared_PublicDnsRecord_Name;
  content: Shared_PublicDnsRecord_Content;
};

/**
 * Shared - Cloudflare Email Sending Setup.
 *
 * @since 1.2.0
 */
export type Shared_CloudflareEmailSendingSetup_Created = boolean;

export type Shared_CloudflareEmailSendingSetup_AddedRecord = string;

export type Shared_CloudflareEmailSendingSetup_AddedRecords = Shared_CloudflareEmailSendingSetup_AddedRecord[];

export type Shared_CloudflareEmailSendingSetup_Records = Shared_PublicDnsRecord[];

export type Shared_CloudflareEmailSendingSetup = {
  created: Shared_CloudflareEmailSendingSetup_Created;
  addedRecords: Shared_CloudflareEmailSendingSetup_AddedRecords;
  records: Shared_CloudflareEmailSendingSetup_Records;
};

/**
 * Shared - Cloudflare Email Routing.
 *
 * @since 1.2.0
 */
export type Shared_CloudflareEmailRouting_Enabled = boolean;

export type Shared_CloudflareEmailRouting_Subaddressing = boolean;

export type Shared_CloudflareEmailRouting = {
  enabled: Shared_CloudflareEmailRouting_Enabled;
  subaddressing: Shared_CloudflareEmailRouting_Subaddressing;
};

/**
 * Shared - Cloudflare Routing Rule.
 *
 * @since 1.2.0
 */
export type Shared_CloudflareRoutingRule_Id = string;

export type Shared_CloudflareRoutingRule_Name = string | undefined;

export type Shared_CloudflareRoutingRule_Enabled = boolean | undefined;

export type Shared_CloudflareRoutingRule_Address = string | undefined;

export type Shared_CloudflareRoutingRule_WorkerName = string | undefined;

export type Shared_CloudflareRoutingRule = {
  id: Shared_CloudflareRoutingRule_Id;
  name: Shared_CloudflareRoutingRule_Name;
  enabled: Shared_CloudflareRoutingRule_Enabled;
  address: Shared_CloudflareRoutingRule_Address;
  workerName: Shared_CloudflareRoutingRule_WorkerName;
};

/**
 * Shared - Cloudflare Worker Domain.
 *
 * @since 1.2.0
 */
export type Shared_CloudflareWorkerDomain_Hostname = string;

export type Shared_CloudflareWorkerDomain_WorkerName = string;

export type Shared_CloudflareWorkerDomain = {
  hostname: Shared_CloudflareWorkerDomain_Hostname;
  workerName: Shared_CloudflareWorkerDomain_WorkerName;
};

/**
 * Shared - Cloudflare Workers Plan.
 *
 * @since 1.2.0
 */
export type Shared_CloudflareWorkersPlan = 'paid' | 'free' | 'unknown';

/**
 * Shared - Cloudflare Zone.
 *
 * @since 1.2.0
 */
export type Shared_CloudflareZone_ZoneId = string;

export type Shared_CloudflareZone_AccountId = string;

export type Shared_CloudflareZone_ZoneName = string;

export type Shared_CloudflareZone = {
  zoneId: Shared_CloudflareZone_ZoneId;
  accountId: Shared_CloudflareZone_AccountId;
  zoneName: Shared_CloudflareZone_ZoneName;
};

/**
 * Shared - Notification Email Message.
 *
 * @since 1.0.0
 */
export type Shared_NotificationEmailMessage_From = string;

export type Shared_NotificationEmailMessage_To = string;

export type Shared_NotificationEmailMessage_Subject = string;

export type Shared_NotificationEmailMessage_Text = string;

export type Shared_NotificationEmailMessage = {
  from: Shared_NotificationEmailMessage_From;
  to: Shared_NotificationEmailMessage_To;
  subject: Shared_NotificationEmailMessage_Subject;
  text: Shared_NotificationEmailMessage_Text;
};

/**
 * Shared - Notification Payload.
 *
 * @since 1.0.0
 */
export type Shared_NotificationPayload_Version = 1;

export type Shared_NotificationPayload_App = 'mailmask';

export type Shared_NotificationPayload_Event = 'message-refused' | 'test';

export type Shared_NotificationPayload_Title = string;

export type Shared_NotificationPayload_Message = string;

export type Shared_NotificationPayload_Priority = number;

export type Shared_NotificationPayload_Tag = string;

export type Shared_NotificationPayload_Tags = Shared_NotificationPayload_Tag[];

export type Shared_NotificationPayload_OccurredAt = string;

export type Shared_NotificationPayload_DetailsAlias = string;

export type Shared_NotificationPayload_DetailsEnvelopeSender = string;

export type Shared_NotificationPayload_DetailsRecipient = string;

export type Shared_NotificationPayload_DetailsReason = 'disabled' | 'expired' | 'filtered' | 'misconfigured' | 'refused' | 'test';

export type Shared_NotificationPayload_Details_Alias = Shared_NotificationPayload_DetailsAlias;

export type Shared_NotificationPayload_Details_EnvelopeSender = Shared_NotificationPayload_DetailsEnvelopeSender;

export type Shared_NotificationPayload_Details_Recipient = Shared_NotificationPayload_DetailsRecipient;

export type Shared_NotificationPayload_Details_Reason = Shared_NotificationPayload_DetailsReason;

export type Shared_NotificationPayload_Details = {
  alias: Shared_NotificationPayload_Details_Alias;
  envelopeSender: Shared_NotificationPayload_Details_EnvelopeSender;
  recipient: Shared_NotificationPayload_Details_Recipient;
  reason: Shared_NotificationPayload_Details_Reason;
};

export type Shared_NotificationPayload = {
  version: Shared_NotificationPayload_Version;
  app: Shared_NotificationPayload_App;
  event: Shared_NotificationPayload_Event;
  title: Shared_NotificationPayload_Title;
  message: Shared_NotificationPayload_Message;
  priority: Shared_NotificationPayload_Priority;
  tags: Shared_NotificationPayload_Tags;
  occurredAt: Shared_NotificationPayload_OccurredAt;
  details: Shared_NotificationPayload_Details;
};

/**
 * Shared - Notification Request.
 *
 * @since 1.0.0
 */
export type Shared_NotificationRequest_Url = string;

export type Shared_NotificationRequest_Method = 'POST' | 'PUT';

export type Shared_NotificationRequest_Headers = Record<string, string>;

export type Shared_NotificationRequest_Body = string;

export type Shared_NotificationRequest = {
  url: Shared_NotificationRequest_Url;
  method: Shared_NotificationRequest_Method;
  headers: Shared_NotificationRequest_Headers;
  body: Shared_NotificationRequest_Body;
};

/**
 * Shared - Notifier Dependencies.
 *
 * Supplies the delivery boundaries shared by project-owned notifier adapters.
 * The Worker owns the deadline and passes its abort signal into HTTP delivery.
 *
 * @since 1.2.0
 */
export type Shared_NotifierDependencies_EmailBinding = object | undefined;

export type Shared_NotifierDependencies_Fetch = (input: string, init: RequestInit) => Promise<Response>;

export type Shared_NotifierDependencies_SendEmail = (message: Shared_NotificationEmailMessage) => Promise<void>;

export type Shared_NotifierDependencies_Signal = AbortSignal;

export type Shared_NotifierDependencies = {
  emailBinding: Shared_NotifierDependencies_EmailBinding;
  fetch: Shared_NotifierDependencies_Fetch;
  sendEmail: Shared_NotifierDependencies_SendEmail;
  signal: Shared_NotifierDependencies_Signal;
};

/**
 * Shared - Notifier.
 *
 * Defines the common delivery boundary implemented by every notifier adapter.
 * Callers only supply Mailmask's payload and injected delivery dependencies.
 *
 * @since 1.2.0
 */
export type Shared_Notifier_Send = (payload: Shared_NotificationPayload, dependencies: Shared_NotifierDependencies) => Promise<void>;

export type Shared_Notifier = {
  send: Shared_Notifier_Send;
};

/**
 * Shared - HTTP Notifier.
 *
 * Extends a notifier with request construction so callers and tests can inspect
 * the exact third-party URL, method, headers, and serialized body.
 *
 * @since 1.2.0
 */
export type Shared_HttpNotifier_BuildRequest = (payload: Shared_NotificationPayload) => Shared_NotificationRequest;

export type Shared_HttpNotifier = Shared_Notifier & {
  buildRequest: Shared_HttpNotifier_BuildRequest;
};

/**
 * Shared - Phone Available Number.
 *
 * @since 1.2.0
 */
export type Shared_PhoneAvailableNumber_Number = string;

export type Shared_PhoneAvailableNumber_Feature = string;

export type Shared_PhoneAvailableNumber_Features = Shared_PhoneAvailableNumber_Feature[];

export type Shared_PhoneAvailableNumber = {
  number: Shared_PhoneAvailableNumber_Number;
  features: Shared_PhoneAvailableNumber_Features;
};

/**
 * Shared - Phone Inbound Message.
 *
 * @since 1.2.0
 */
export type Shared_PhoneInboundMessage_MessageId = string;

export type Shared_PhoneInboundMessage_From = string;

export type Shared_PhoneInboundMessage_ToNumber = string;

export type Shared_PhoneInboundMessage_To = Shared_PhoneInboundMessage_ToNumber[];

export type Shared_PhoneInboundMessage_Text = string;

export type Shared_PhoneInboundMessage_MediaUrl = string;

export type Shared_PhoneInboundMessage_MediaUrls = Shared_PhoneInboundMessage_MediaUrl[];

export type Shared_PhoneInboundMessage = {
  messageId: Shared_PhoneInboundMessage_MessageId;
  from: Shared_PhoneInboundMessage_From;
  to: Shared_PhoneInboundMessage_To;
  text: Shared_PhoneInboundMessage_Text;
  mediaUrls: Shared_PhoneInboundMessage_MediaUrls;
};

/**
 * Shared - Phone Number Search.
 *
 * @since 1.2.0
 */
export type Shared_PhoneNumberSearch_CountryCode = string;

export type Shared_PhoneNumberSearch_AreaCode = string | undefined;

export type Shared_PhoneNumberSearch_Limit = number;

export type Shared_PhoneNumberSearch = {
  countryCode: Shared_PhoneNumberSearch_CountryCode;
  areaCode: Shared_PhoneNumberSearch_AreaCode;
  limit: Shared_PhoneNumberSearch_Limit;
};

/**
 * Shared - Phone Outbound Message.
 *
 * @since 1.2.0
 */
export type Shared_PhoneOutboundMessage_From = string;

export type Shared_PhoneOutboundMessage_To = string;

export type Shared_PhoneOutboundMessage_Text = string;

export type Shared_PhoneOutboundMessage_MediaUrl = string;

export type Shared_PhoneOutboundMessage_MediaUrls = Shared_PhoneOutboundMessage_MediaUrl[];

export type Shared_PhoneOutboundMessage = {
  from: Shared_PhoneOutboundMessage_From;
  to: Shared_PhoneOutboundMessage_To;
  text: Shared_PhoneOutboundMessage_Text;
  mediaUrls: Shared_PhoneOutboundMessage_MediaUrls;
};

/**
 * Shared - Phone Provider Response.
 *
 * @since 1.2.0
 */
export type Shared_PhoneProviderResponse_Ok = boolean;

export type Shared_PhoneProviderResponse_Status = number;

export type Shared_PhoneProviderResponse_Data = unknown;

export type Shared_PhoneProviderResponse = {
  ok: Shared_PhoneProviderResponse_Ok;
  status: Shared_PhoneProviderResponse_Status;
  data: Shared_PhoneProviderResponse_Data;
};

/**
 * Shared - Phone Route Decision.
 *
 * @since 1.2.0
 */
export type Shared_PhoneRouteDecision_Action = 'forward' | 'help' | 'reject' | 'send';

export type Shared_PhoneRouteDecision_Reason = string;

export type Shared_PhoneRouteDecision_AliasNumber = string | undefined;

export type Shared_PhoneRouteDecision_AliasLabel = string | undefined;

export type Shared_PhoneRouteDecision_Recipient = string | undefined;

export type Shared_PhoneRouteDecision_Text = string | undefined;

export type Shared_PhoneRouteDecision = {
  action: Shared_PhoneRouteDecision_Action;
  reason: Shared_PhoneRouteDecision_Reason;
  aliasNumber: Shared_PhoneRouteDecision_AliasNumber;
  aliasLabel: Shared_PhoneRouteDecision_AliasLabel;
  recipient: Shared_PhoneRouteDecision_Recipient;
  text: Shared_PhoneRouteDecision_Text;
};

/**
 * Shared - Phone Webhook.
 *
 * @since 1.2.0
 */
export type Shared_PhoneWebhook_Url = string;

export type Shared_PhoneWebhook_Headers = Headers;

export type Shared_PhoneWebhook_Body = string;

export type Shared_PhoneWebhook = {
  url: Shared_PhoneWebhook_Url;
  headers: Shared_PhoneWebhook_Headers;
  body: Shared_PhoneWebhook_Body;
};

/**
 * Shared - Phone Webhook Reply.
 *
 * @since 1.2.0
 */
export type Shared_PhoneWebhookReply_Body = string;

export type Shared_PhoneWebhookReply_ContentType = string;

export type Shared_PhoneWebhookReply = {
  body: Shared_PhoneWebhookReply_Body;
  contentType: Shared_PhoneWebhookReply_ContentType;
};

/**
 * Shared - Route Decision.
 *
 * @since 1.2.0
 */
export type Shared_RouteDecision_Action = 'forward' | 'reject' | 'send';

export type Shared_RouteDecision_Reason = string;

export type Shared_RouteDecision_DestinationEmail = string | undefined;

export type Shared_RouteDecision_AliasAddress = string | undefined;

export type Shared_RouteDecision_AliasLabel = string | undefined;

export type Shared_RouteDecision_RecipientEmail = string | undefined;

export type Shared_RouteDecision = {
  action: Shared_RouteDecision_Action;
  reason: Shared_RouteDecision_Reason;
  destinationEmail: Shared_RouteDecision_DestinationEmail;
  aliasAddress: Shared_RouteDecision_AliasAddress;
  aliasLabel: Shared_RouteDecision_AliasLabel;
  recipientEmail: Shared_RouteDecision_RecipientEmail;
};

/**
 * Shared - Routing Rule Plan.
 *
 * @since 1.1.0
 */
export type Shared_RoutingRulePlan_CreateAddress = string;

export type Shared_RoutingRulePlan_Create = Shared_RoutingRulePlan_CreateAddress[];

export type Shared_RoutingRulePlan_Rule_Id = string;

export type Shared_RoutingRulePlan_Rule_Address = string;

export type Shared_RoutingRulePlan_Rule = {
  id: Shared_RoutingRulePlan_Rule_Id;
  address: Shared_RoutingRulePlan_Rule_Address;
};

export type Shared_RoutingRulePlan_Update = Shared_RoutingRulePlan_Rule[];

export type Shared_RoutingRulePlan_Remove = Shared_RoutingRulePlan_Rule[];

export type Shared_RoutingRulePlan_SkippedAddress = string;

export type Shared_RoutingRulePlan_Skipped = Shared_RoutingRulePlan_SkippedAddress[];

export type Shared_RoutingRulePlan = {
  create: Shared_RoutingRulePlan_Create;
  update: Shared_RoutingRulePlan_Update;
  remove: Shared_RoutingRulePlan_Remove;
  skipped: Shared_RoutingRulePlan_Skipped;
};
