/**
 * Shared - Notification Email Message.
 *
 * @since UNRELEASED
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
 * @since UNRELEASED
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
 * @since UNRELEASED
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
 * Shared - Route Decision.
 *
 * @since 0.0.1
 */
export type Shared_RouteDecision_Action = 'forward' | 'reject' | 'drop';

export type Shared_RouteDecision_Reason = string;

export type Shared_RouteDecision_DestinationEmail = string | undefined;

export type Shared_RouteDecision_AliasAddress = string | undefined;

export type Shared_RouteDecision_AliasLabel = string | undefined;

export type Shared_RouteDecision = {
  action: Shared_RouteDecision_Action;
  reason: Shared_RouteDecision_Reason;
  destinationEmail: Shared_RouteDecision_DestinationEmail;
  aliasAddress: Shared_RouteDecision_AliasAddress;
  aliasLabel: Shared_RouteDecision_AliasLabel;
};
