/**
 * Worker - Relay.
 *
 * @since 1.2.0
 */
export type Worker_Relay_LineBreak = string;

export type Worker_Relay_ForwardRemovedHeader = string;

export type Worker_Relay_ForwardRemovedHeaders = Worker_Relay_ForwardRemovedHeader[];

export type Worker_Relay_SentKeptHeader = string;

export type Worker_Relay_SentKeptHeaders = Worker_Relay_SentKeptHeader[];

/**
 * Worker - Relay - Build Forwarded Message.
 *
 * @since 1.2.0
 */
export type Worker_Relay_BuildForwardedMessage_Raw = Uint8Array;

export type Worker_Relay_BuildForwardedMessage_ReverseAddress = string;

export type Worker_Relay_BuildForwardedMessage_OriginalSender = string;

export type Worker_Relay_BuildForwardedMessage_AddedHeader = string;

export type Worker_Relay_BuildForwardedMessage_AddedHeaders = Worker_Relay_BuildForwardedMessage_AddedHeader[];

export type Worker_Relay_BuildForwardedMessage_Returns = Uint8Array;

export type Worker_Relay_BuildForwardedMessage_Split_Header = string;

export type Worker_Relay_BuildForwardedMessage_Split_Headers = Worker_Relay_BuildForwardedMessage_Split_Header[];

export type Worker_Relay_BuildForwardedMessage_Split_Body = Uint8Array;

export type Worker_Relay_BuildForwardedMessage_Split = {
  headers: Worker_Relay_BuildForwardedMessage_Split_Headers;
  body: Worker_Relay_BuildForwardedMessage_Split_Body;
};

/**
 * Worker - Relay - Build Reverse Address.
 *
 * @since 1.2.0
 */
export type Worker_Relay_BuildReverseAddress_AliasAddress = string;

export type Worker_Relay_BuildReverseAddress_ReplyTarget = string;

export type Worker_Relay_BuildReverseAddress_BaseDomain = string;

export type Worker_Relay_BuildReverseAddress_Returns = Worker_Relay_BuildReverseAddress_ReverseAddress | undefined;

export type Worker_Relay_BuildReverseAddress_AtIndex = number;

export type Worker_Relay_BuildReverseAddress_LocalPart = string;

export type Worker_Relay_BuildReverseAddress_ReverseAddress = string;

/**
 * Worker - Relay - Build Sent Message.
 *
 * @since 1.2.0
 */
export type Worker_Relay_BuildSentMessage_Raw = Uint8Array;

export type Worker_Relay_BuildSentMessage_AliasEmail = string;

export type Worker_Relay_BuildSentMessage_RecipientEmail = string;

export type Worker_Relay_BuildSentMessage_BaseDomain = string;

export type Worker_Relay_BuildSentMessage_Returns = Uint8Array;

export type Worker_Relay_BuildSentMessage_Split_Header = string;

export type Worker_Relay_BuildSentMessage_Split_Headers = Worker_Relay_BuildSentMessage_Split_Header[];

export type Worker_Relay_BuildSentMessage_Split_Body = Uint8Array;

export type Worker_Relay_BuildSentMessage_Split = {
  headers: Worker_Relay_BuildSentMessage_Split_Headers;
  body: Worker_Relay_BuildSentMessage_Split_Body;
};

/**
 * Worker - Relay - Decode Reverse Tag.
 *
 * @since 1.2.0
 */
export type Worker_Relay_DecodeReverseTag_Tag = string;

export type Worker_Relay_DecodeReverseTag_Returns = Worker_Relay_DecodeReverseTag_Recipient | undefined;

export type Worker_Relay_DecodeReverseTag_EqualsIndex = number;

export type Worker_Relay_DecodeReverseTag_Recipient = string;

/**
 * Worker - Relay - Filter Headers.
 *
 * @since 1.2.0
 */
export type Worker_Relay_FilterHeaders_Header = string;

export type Worker_Relay_FilterHeaders_Headers = Worker_Relay_FilterHeaders_Header[];

export type Worker_Relay_FilterHeaders_Name = string;

export type Worker_Relay_FilterHeaders_Names = Worker_Relay_FilterHeaders_Name[];

export type Worker_Relay_FilterHeaders_KeepListed = boolean;

export type Worker_Relay_FilterHeaders_Returns = string[];

export type Worker_Relay_FilterHeaders_HeaderName = string;

export type Worker_Relay_FilterHeaders_Listed = boolean;

/**
 * Worker - Relay - Join Raw Message.
 *
 * @since 1.2.0
 */
export type Worker_Relay_JoinRawMessage_Header = string;

export type Worker_Relay_JoinRawMessage_Headers = Worker_Relay_JoinRawMessage_Header[];

export type Worker_Relay_JoinRawMessage_Body = Uint8Array;

export type Worker_Relay_JoinRawMessage_Returns = Worker_Relay_JoinRawMessage_Joined;

export type Worker_Relay_JoinRawMessage_HeaderBytes = Uint8Array;

export type Worker_Relay_JoinRawMessage_Joined = Uint8Array;

/**
 * Worker - Relay - Parse Address.
 *
 * @since 1.2.0
 */
export type Worker_Relay_ParseAddress_Value = string | null | undefined;

export type Worker_Relay_ParseAddress_Returns = string | undefined;

export type Worker_Relay_ParseAddress_AngleMatch = RegExpMatchArray | null;

export type Worker_Relay_ParseAddress_FirstValue = string;

/**
 * Worker - Relay - Read First Header Value.
 *
 * @since 1.2.0
 */
export type Worker_Relay_ReadFirstHeaderValue_Raw = Uint8Array;

export type Worker_Relay_ReadFirstHeaderValue_Name = string;

export type Worker_Relay_ReadFirstHeaderValue_Returns = string | undefined;

export type Worker_Relay_ReadFirstHeaderValue_Header = string | undefined;

/**
 * Worker - Relay - Read Header Name.
 *
 * @since 1.2.0
 */
export type Worker_Relay_ReadHeaderName_Header = string;

export type Worker_Relay_ReadHeaderName_Returns = string;

/**
 * Worker - Relay - Read Raw Message.
 *
 * @since 1.2.0
 */
export type Worker_Relay_ReadRawMessage_Raw = ReadableStream<Uint8Array>;

export type Worker_Relay_ReadRawMessage_Returns = Promise<Uint8Array>;

export type Worker_Relay_ReadRawMessage_Buffer = ArrayBuffer;

/**
 * Worker - Relay - Split Raw Message.
 *
 * @since 1.2.0
 */
export type Worker_Relay_SplitRawMessage_Raw = Uint8Array;

export type Worker_Relay_SplitRawMessage_Returns = Worker_Relay_SplitRawMessage_Split;

export type Worker_Relay_SplitRawMessage_HeaderEnd = number;

export type Worker_Relay_SplitRawMessage_BodyStart = number;

export type Worker_Relay_SplitRawMessage_HeaderText = string;

export type Worker_Relay_SplitRawMessage_Header = string;

export type Worker_Relay_SplitRawMessage_Headers = Worker_Relay_SplitRawMessage_Header[];

export type Worker_Relay_SplitRawMessage_TrimmedLine = string;

export type Worker_Relay_SplitRawMessage_LastIndex = number;

export type Worker_Relay_SplitRawMessage_Split_Headers = Worker_Relay_SplitRawMessage_Header[];

export type Worker_Relay_SplitRawMessage_Split_Body = Uint8Array;

export type Worker_Relay_SplitRawMessage_Split = {
  headers: Worker_Relay_SplitRawMessage_Split_Headers;
  body: Worker_Relay_SplitRawMessage_Split_Body;
};
