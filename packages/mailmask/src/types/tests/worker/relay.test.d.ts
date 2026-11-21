import type { Mock, MockInstance } from 'vitest';

import type { Lib_Schema_ConfigSchema } from '../../lib/schema.d.ts';
import type { Worker_Index_CreateWorker_EmailMessageConstructor } from '../../worker/index.d.ts';

/**
 * Tests - Worker - Relay.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_Now = number;

export type Tests_Worker_Relay_Crlf = string;

export type Tests_Worker_Relay_InboundRaw = string;

export type Tests_Worker_Relay_ReplyRaw = string;

export type Tests_Worker_Relay_BaseConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

export type Tests_Worker_Relay_SendConfig = { [Key in keyof Lib_Schema_ConfigSchema]: Lib_Schema_ConfigSchema[Key] };

/**
 * Tests - Worker - Relay - Build Forwarded Message - Rewrites The Sender And Keeps The Body.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_BuildForwardedMessage_RewritesTheSenderAndKeepsTheBody_Forwarded = string;

/**
 * Tests - Worker - Relay - Build Sent Message - Keeps Only Content And Threading Headers.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_BuildSentMessage_KeepsOnlyContentAndThreadingHeaders_Sent = string;

/**
 * Tests - Worker - Relay - Handle Email - Falls Back To A Plain Forward When The Binding Fails.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_ConsoleWarnSpy = MockInstance<typeof console.warn>;

export type Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_EmailBinding = SendEmail;

export type Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_To = string;

export type Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_From = string;

export type Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_Headers = Headers;

export type Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_Raw = ForwardableEmailMessage['raw'];

export type Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message = {
  to: Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_To;
  from: Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_From;
  headers: Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_Headers;
  raw: Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_Raw;
  forward: Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_Forward;
  setReject: Tests_Worker_Relay_HandleEmail_FallsBackToAPlainForwardWhenTheBindingFails_Message_SetReject;
};

/**
 * Tests - Worker - Relay - Handle Email - Forwards From A Reply Address.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_SentMessages = Array<EmailMessage | EmailMessageBuilder>;

export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_EmailBinding = SendEmail;

export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_To = string;

export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_From = string;

export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_Headers = Headers;

export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_Raw = ForwardableEmailMessage['raw'];

export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message = {
  to: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_To;
  from: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_From;
  headers: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_Headers;
  raw: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_Raw;
  forward: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_Forward;
  setReject: Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_Message_SetReject;
};

export type Tests_Worker_Relay_HandleEmail_ForwardsFromAReplyAddress_ForwardedText = string;

/**
 * Tests - Worker - Relay - Handle Email - Refuses Mail That Failed Dmarc.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_EmailBinding = SendEmail;

export type Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_To = string;

export type Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_From = string;

export type Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_Headers = Headers;

export type Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_Raw = ForwardableEmailMessage['raw'];

export type Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message = {
  to: Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_To;
  from: Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_From;
  headers: Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_Headers;
  raw: Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_Raw;
  forward: Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_Forward;
  setReject: Tests_Worker_Relay_HandleEmail_RefusesMailThatFailedDMARC_Message_SetReject;
};

/**
 * Tests - Worker - Relay - Handle Email - Sends The Users Reply From The Alias.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_SentMessages = Array<EmailMessage | EmailMessageBuilder>;

export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_EmailBinding = SendEmail;

export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_To = string;

export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_From = string;

export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_Headers = Headers;

export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_Raw = ForwardableEmailMessage['raw'];

export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_Forward = Mock<ForwardableEmailMessage['forward']>;

export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_SetReject = Mock<ForwardableEmailMessage['setReject']>;

export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message = {
  to: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_To;
  from: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_From;
  headers: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_Headers;
  raw: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_Raw;
  forward: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_Forward;
  setReject: Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_Message_SetReject;
};

export type Tests_Worker_Relay_HandleEmail_SendsTheUsersReplyFromTheAlias_SentText = string;

/**
 * Tests - Worker - Relay - Parse Address - Reads The First Address With Or Without A Display Name.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_ParseAddress_ReadsTheFirstAddressWithOrWithoutADisplayName_Address = string | undefined;

/**
 * Tests - Worker - Relay - Read First Header Value - Reads Only The Top Most Copy Of A Header.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_ReadFirstHeaderValue_ReadsOnlyTheTopMostCopyOfAHeader_Value = string | undefined;

/**
 * Tests - Worker - Relay - Reverse Addresses - Encodes And Decodes A Sender In The Alias Tag.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_ReverseAddresses_EncodesAndDecodesASenderInTheAliasTag_LongSender = string;

/**
 * Tests - Worker - Relay - Split Raw Message - Keeps Folded Header Lines Together.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_SplitRawMessage_KeepsFoldedHeaderLinesTogether_Split_Header = string;

export type Tests_Worker_Relay_SplitRawMessage_KeepsFoldedHeaderLinesTogether_Split_Headers = Tests_Worker_Relay_SplitRawMessage_KeepsFoldedHeaderLinesTogether_Split_Header[];

export type Tests_Worker_Relay_SplitRawMessage_KeepsFoldedHeaderLinesTogether_Split_Body = Uint8Array;

export type Tests_Worker_Relay_SplitRawMessage_KeepsFoldedHeaderLinesTogether_Split = {
  headers: Tests_Worker_Relay_SplitRawMessage_KeepsFoldedHeaderLinesTogether_Split_Headers;
  body: Tests_Worker_Relay_SplitRawMessage_KeepsFoldedHeaderLinesTogether_Split_Body;
};

/**
 * Tests - Worker - Relay - Test Email Message.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_TestEmailMessage_From = string;

export type Tests_Worker_Relay_TestEmailMessage_To = string;

export type Tests_Worker_Relay_TestEmailMessage_Raw = ConstructorParameters<NonNullable<Worker_Index_CreateWorker_EmailMessageConstructor>>[2];

/**
 * Tests - Worker - Relay - Test Email Message - Constructor.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_TestEmailMessage_Constructor_From = string;

export type Tests_Worker_Relay_TestEmailMessage_Constructor_To = string;

export type Tests_Worker_Relay_TestEmailMessage_Constructor_Raw = ConstructorParameters<NonNullable<Worker_Index_CreateWorker_EmailMessageConstructor>>[2];

/**
 * Tests - Worker - Relay - To Bytes.
 *
 * @since 1.2.0
 */
export type Tests_Worker_Relay_ToBytes_Text = string;

export type Tests_Worker_Relay_ToBytes_Returns = Uint8Array;
