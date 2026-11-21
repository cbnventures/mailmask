import { LIB_REGEX_ANGLE_ADDRESS, LIB_REGEX_EMAIL_ADDRESS } from '../lib/regex.js';

import type {
  Worker_Relay_BuildForwardedMessage_AddedHeaders,
  Worker_Relay_BuildForwardedMessage_OriginalSender,
  Worker_Relay_BuildForwardedMessage_Raw,
  Worker_Relay_BuildForwardedMessage_Returns,
  Worker_Relay_BuildForwardedMessage_ReverseAddress,
  Worker_Relay_BuildForwardedMessage_Split,
  Worker_Relay_BuildReverseAddress_AliasAddress,
  Worker_Relay_BuildReverseAddress_AtIndex,
  Worker_Relay_BuildReverseAddress_BaseDomain,
  Worker_Relay_BuildReverseAddress_LocalPart,
  Worker_Relay_BuildReverseAddress_ReplyTarget,
  Worker_Relay_BuildReverseAddress_Returns,
  Worker_Relay_BuildReverseAddress_ReverseAddress,
  Worker_Relay_BuildSentMessage_AliasEmail,
  Worker_Relay_BuildSentMessage_BaseDomain,
  Worker_Relay_BuildSentMessage_Raw,
  Worker_Relay_BuildSentMessage_RecipientEmail,
  Worker_Relay_BuildSentMessage_Returns,
  Worker_Relay_BuildSentMessage_Split,
  Worker_Relay_DecodeReverseTag_EqualsIndex,
  Worker_Relay_DecodeReverseTag_Recipient,
  Worker_Relay_DecodeReverseTag_Returns,
  Worker_Relay_DecodeReverseTag_Tag,
  Worker_Relay_FilterHeaders_HeaderName,
  Worker_Relay_FilterHeaders_Headers,
  Worker_Relay_FilterHeaders_KeepListed,
  Worker_Relay_FilterHeaders_Listed,
  Worker_Relay_FilterHeaders_Names,
  Worker_Relay_FilterHeaders_Returns,
  Worker_Relay_ForwardRemovedHeaders,
  Worker_Relay_JoinRawMessage_Body,
  Worker_Relay_JoinRawMessage_HeaderBytes,
  Worker_Relay_JoinRawMessage_Headers,
  Worker_Relay_JoinRawMessage_Joined,
  Worker_Relay_JoinRawMessage_Returns,
  Worker_Relay_LineBreak,
  Worker_Relay_ParseAddress_AngleMatch,
  Worker_Relay_ParseAddress_FirstValue,
  Worker_Relay_ParseAddress_Returns,
  Worker_Relay_ParseAddress_Value,
  Worker_Relay_ReadFirstHeaderValue_Header,
  Worker_Relay_ReadFirstHeaderValue_Name,
  Worker_Relay_ReadFirstHeaderValue_Raw,
  Worker_Relay_ReadFirstHeaderValue_Returns,
  Worker_Relay_ReadHeaderName_Header,
  Worker_Relay_ReadHeaderName_Returns,
  Worker_Relay_ReadRawMessage_Buffer,
  Worker_Relay_ReadRawMessage_Raw,
  Worker_Relay_ReadRawMessage_Returns,
  Worker_Relay_SentKeptHeaders,
  Worker_Relay_SplitRawMessage_BodyStart,
  Worker_Relay_SplitRawMessage_HeaderEnd,
  Worker_Relay_SplitRawMessage_Headers,
  Worker_Relay_SplitRawMessage_HeaderText,
  Worker_Relay_SplitRawMessage_LastIndex,
  Worker_Relay_SplitRawMessage_Raw,
  Worker_Relay_SplitRawMessage_Returns,
  Worker_Relay_SplitRawMessage_TrimmedLine,
} from '../types/worker/relay.d.ts';

/**
 * Worker - Relay - Line Break.
 *
 * The CRLF that separates mail header lines. Rebuilt headers use it so they
 * match the line endings of the untouched body that follows them.
 *
 * @since 1.2.0
 */
const lineBreak: Worker_Relay_LineBreak = String.fromCharCode(13, 10);

/**
 * Worker - Relay - Forward Removed Headers.
 *
 * Headers taken off a forwarded message before it is sent on from the reply
 * address. They name the original sender or carry signatures that no longer fit.
 *
 * @since 1.2.0
 */
const forwardRemovedHeaders: Worker_Relay_ForwardRemovedHeaders = [
  'arc-',
  'authentication-results',
  'delivered-to',
  'dkim-signature',
  'from',
  'reply-to',
  'return-path',
  'sender',
  'x-mailmask-',
];

/**
 * Worker - Relay - Sent Kept Headers.
 *
 * The only headers kept from a message the user sends through an alias. Every
 * other header can name the user's real address, client, or mail provider.
 *
 * @since 1.2.0
 */
const sentKeptHeaders: Worker_Relay_SentKeptHeaders = [
  'content-',
  'date',
  'in-reply-to',
  'mime-version',
  'references',
  'subject',
];

/**
 * Worker - Relay - Local Part Limit.
 *
 * Longest local part an address may have. A reply address longer than this
 * would be refused by mail servers, so the message is forwarded plainly instead.
 *
 * @since 1.2.0
 */
const LOCAL_PART_LIMIT = 64;

/**
 * Worker - Relay - Build Forwarded Message.
 *
 * Rewrites an inbound message so it comes from, and replies go to, the alias's
 * reply address for the original sender. The body is left exactly as it arrived.
 *
 * @param {Worker_Relay_BuildForwardedMessage_Raw}            raw            - Raw.
 * @param {Worker_Relay_BuildForwardedMessage_ReverseAddress} reverseAddress - Reverse address.
 * @param {Worker_Relay_BuildForwardedMessage_OriginalSender} originalSender - Original sender.
 * @param {Worker_Relay_BuildForwardedMessage_AddedHeaders}   addedHeaders   - Added headers.
 *
 * @returns {Worker_Relay_BuildForwardedMessage_Returns}
 *
 * @since 1.2.0
 */
function buildForwardedMessage(raw: Worker_Relay_BuildForwardedMessage_Raw, reverseAddress: Worker_Relay_BuildForwardedMessage_ReverseAddress, originalSender: Worker_Relay_BuildForwardedMessage_OriginalSender, addedHeaders: Worker_Relay_BuildForwardedMessage_AddedHeaders): Worker_Relay_BuildForwardedMessage_Returns {
  const split: Worker_Relay_BuildForwardedMessage_Split = splitRawMessage(raw);

  return joinRawMessage([
    `From: "${originalSender.replaceAll('"', '')}" <${reverseAddress}>`,
    `Reply-To: ${reverseAddress}`,
    ...addedHeaders,
    ...filterHeaders(split['headers'], forwardRemovedHeaders, false),
  ], split['body']);
}

/**
 * Worker - Relay - Build Reverse Address.
 *
 * Builds the reply address for one sender, "alias+local=domain@base", which
 * Email Routing delivers to the alias rule. Undefined when it would be too long.
 *
 * @param {Worker_Relay_BuildReverseAddress_AliasAddress} aliasAddress - Alias address.
 * @param {Worker_Relay_BuildReverseAddress_ReplyTarget}  replyTarget  - Reply target.
 * @param {Worker_Relay_BuildReverseAddress_BaseDomain}   baseDomain   - Base domain.
 *
 * @returns {Worker_Relay_BuildReverseAddress_Returns}
 *
 * @since 1.2.0
 */
function buildReverseAddress(aliasAddress: Worker_Relay_BuildReverseAddress_AliasAddress, replyTarget: Worker_Relay_BuildReverseAddress_ReplyTarget, baseDomain: Worker_Relay_BuildReverseAddress_BaseDomain): Worker_Relay_BuildReverseAddress_Returns {
  const atIndex: Worker_Relay_BuildReverseAddress_AtIndex = replyTarget.lastIndexOf('@');

  if (atIndex <= 0) {
    return undefined;
  }

  const localPart: Worker_Relay_BuildReverseAddress_LocalPart = `${aliasAddress}+${replyTarget.slice(0, atIndex)}=${replyTarget.slice(atIndex + 1)}`.toLowerCase();

  if (localPart.length > LOCAL_PART_LIMIT) {
    return undefined;
  }

  const reverseAddress: Worker_Relay_BuildReverseAddress_ReverseAddress = `${localPart}@${baseDomain}`;

  if (LIB_REGEX_EMAIL_ADDRESS.test(reverseAddress) === false) {
    return undefined;
  }

  return reverseAddress;
}

/**
 * Worker - Relay - Build Sent Message.
 *
 * Rewrites a message the user sent to a reply address so it comes from the alias
 * and goes to the real recipient. Only content and threading headers are kept.
 *
 * @param {Worker_Relay_BuildSentMessage_Raw}            raw            - Raw.
 * @param {Worker_Relay_BuildSentMessage_AliasEmail}     aliasEmail     - Alias email.
 * @param {Worker_Relay_BuildSentMessage_RecipientEmail} recipientEmail - Recipient email.
 * @param {Worker_Relay_BuildSentMessage_BaseDomain}     baseDomain     - Base domain.
 *
 * @returns {Worker_Relay_BuildSentMessage_Returns}
 *
 * @since 1.2.0
 */
function buildSentMessage(raw: Worker_Relay_BuildSentMessage_Raw, aliasEmail: Worker_Relay_BuildSentMessage_AliasEmail, recipientEmail: Worker_Relay_BuildSentMessage_RecipientEmail, baseDomain: Worker_Relay_BuildSentMessage_BaseDomain): Worker_Relay_BuildSentMessage_Returns {
  const split: Worker_Relay_BuildSentMessage_Split = splitRawMessage(raw);

  return joinRawMessage([
    `From: ${aliasEmail}`,
    `To: ${recipientEmail}`,
    `Message-ID: <${crypto.randomUUID()}@${baseDomain}>`,
    ...filterHeaders(split['headers'], sentKeptHeaders, true),
  ], split['body']);
}

/**
 * Worker - Relay - Decode Reverse Tag.
 *
 * Turns the "local=domain" tag of a reply address back into the recipient's
 * address, or undefined when the tag is not a reply address at all.
 *
 * @param {Worker_Relay_DecodeReverseTag_Tag} tag - Tag.
 *
 * @returns {Worker_Relay_DecodeReverseTag_Returns}
 *
 * @since 1.2.0
 */
function decodeReverseTag(tag: Worker_Relay_DecodeReverseTag_Tag): Worker_Relay_DecodeReverseTag_Returns {
  const equalsIndex: Worker_Relay_DecodeReverseTag_EqualsIndex = tag.lastIndexOf('=');

  if (equalsIndex <= 0) {
    return undefined;
  }

  const recipient: Worker_Relay_DecodeReverseTag_Recipient = `${tag.slice(0, equalsIndex)}@${tag.slice(equalsIndex + 1)}`;

  if (LIB_REGEX_EMAIL_ADDRESS.test(recipient) === false) {
    return undefined;
  }

  return recipient;
}

/**
 * Worker - Relay - Read First Header Value.
 *
 * Returns the trimmed value of the first header with the given name, the top-most
 * one the last mail server added, or undefined when the message has none.
 *
 * @param {Worker_Relay_ReadFirstHeaderValue_Raw}  raw  - Raw.
 * @param {Worker_Relay_ReadFirstHeaderValue_Name} name - Name.
 *
 * @returns {Worker_Relay_ReadFirstHeaderValue_Returns}
 *
 * @since 1.2.0
 */
function readFirstHeaderValue(raw: Worker_Relay_ReadFirstHeaderValue_Raw, name: Worker_Relay_ReadFirstHeaderValue_Name): Worker_Relay_ReadFirstHeaderValue_Returns {
  const header: Worker_Relay_ReadFirstHeaderValue_Header = splitRawMessage(raw)['headers'].find((rawHeader) => readHeaderName(rawHeader) === name.toLowerCase());

  if (header === undefined) {
    return undefined;
  }

  return header.slice(header.indexOf(':') + 1).trim();
}

/**
 * Worker - Relay - Parse Address.
 *
 * Reads the first address out of a From or Reply-To header value, with or
 * without a display name, and lowercases it. Undefined when there is none.
 *
 * @param {Worker_Relay_ParseAddress_Value} value - Value.
 *
 * @returns {Worker_Relay_ParseAddress_Returns}
 *
 * @since 1.2.0
 */
function parseAddress(value: Worker_Relay_ParseAddress_Value): Worker_Relay_ParseAddress_Returns {
  if (value === null || value === undefined) {
    return undefined;
  }

  const angleMatch: Worker_Relay_ParseAddress_AngleMatch = value.match(LIB_REGEX_ANGLE_ADDRESS);

  if (angleMatch !== null && angleMatch[1] !== undefined) {
    return angleMatch[1].toLowerCase();
  }

  const firstValue: Worker_Relay_ParseAddress_FirstValue = (value.split(',')[0] ?? '').trim();

  if (LIB_REGEX_EMAIL_ADDRESS.test(firstValue) === false) {
    return undefined;
  }

  return firstValue.toLowerCase();
}

/**
 * Worker - Relay - Read Raw Message.
 *
 * Reads an inbound message's raw stream into bytes. Bytes, not text, keep 8-bit
 * bodies and attachments exactly as they arrived.
 *
 * @param {Worker_Relay_ReadRawMessage_Raw} raw - Raw.
 *
 * @returns {Worker_Relay_ReadRawMessage_Returns}
 *
 * @since 1.2.0
 */
async function readRawMessage(raw: Worker_Relay_ReadRawMessage_Raw): Worker_Relay_ReadRawMessage_Returns {
  const buffer: Worker_Relay_ReadRawMessage_Buffer = await new Response(raw).arrayBuffer();

  return new Uint8Array(buffer);
}

/**
 * Worker - Relay - Filter Headers.
 *
 * Keeps or removes headers by lowercase name. Names that end in "-" match every
 * header starting with them, such as "arc-" or "content-".
 *
 * @param {Worker_Relay_FilterHeaders_Headers}    headers    - Headers.
 * @param {Worker_Relay_FilterHeaders_Names}      names      - Names.
 * @param {Worker_Relay_FilterHeaders_KeepListed} keepListed - Keep listed.
 *
 * @returns {Worker_Relay_FilterHeaders_Returns}
 *
 * @since 1.2.0
 */
function filterHeaders(headers: Worker_Relay_FilterHeaders_Headers, names: Worker_Relay_FilterHeaders_Names, keepListed: Worker_Relay_FilterHeaders_KeepListed): Worker_Relay_FilterHeaders_Returns {
  return headers.filter((header) => {
    const headerName: Worker_Relay_FilterHeaders_HeaderName = readHeaderName(header);
    const listed: Worker_Relay_FilterHeaders_Listed = names.some((name) => ((name.endsWith('-') === true) ? headerName.startsWith(name) : headerName === name));

    return listed === keepListed;
  });
}

/**
 * Worker - Relay - Join Raw Message.
 *
 * Puts rebuilt headers back in front of the untouched body bytes, with the
 * CRLF line endings mail needs.
 *
 * @param {Worker_Relay_JoinRawMessage_Headers} headers - Headers.
 * @param {Worker_Relay_JoinRawMessage_Body}    body    - Body.
 *
 * @returns {Worker_Relay_JoinRawMessage_Returns}
 *
 * @since 1.2.0
 */
function joinRawMessage(headers: Worker_Relay_JoinRawMessage_Headers, body: Worker_Relay_JoinRawMessage_Body): Worker_Relay_JoinRawMessage_Returns {
  const headerBytes: Worker_Relay_JoinRawMessage_HeaderBytes = new TextEncoder().encode([
    ...headers,
    '',
    '',
  ].join(lineBreak));
  const joined: Worker_Relay_JoinRawMessage_Joined = new Uint8Array(headerBytes.length + body.length);

  joined.set(headerBytes, 0);

  joined.set(body, headerBytes.length);

  return joined;
}

/**
 * Worker - Relay - Read Header Name.
 *
 * Returns the lowercase field name of one header, the part before its colon,
 * so headers can be matched without caring how the sender capitalized them.
 *
 * @param {Worker_Relay_ReadHeaderName_Header} header - Header.
 *
 * @returns {Worker_Relay_ReadHeaderName_Returns}
 *
 * @since 1.2.0
 */
function readHeaderName(header: Worker_Relay_ReadHeaderName_Header): Worker_Relay_ReadHeaderName_Returns {
  return header.slice(0, Math.max(header.indexOf(':'), 0)).trim().toLowerCase();
}

/**
 * Worker - Relay - Split Raw Message.
 *
 * Splits raw message bytes at the first blank line into headers, with folded
 * lines kept with their header, and the body bytes after it.
 *
 * @param {Worker_Relay_SplitRawMessage_Raw} raw - Raw.
 *
 * @returns {Worker_Relay_SplitRawMessage_Returns}
 *
 * @since 1.2.0
 */
function splitRawMessage(raw: Worker_Relay_SplitRawMessage_Raw): Worker_Relay_SplitRawMessage_Returns {
  let headerEnd: Worker_Relay_SplitRawMessage_HeaderEnd = raw.length;
  let bodyStart: Worker_Relay_SplitRawMessage_BodyStart = raw.length;

  for (let byteIndex = 0; byteIndex < raw.length - 1; byteIndex += 1) {
    // A line feed followed by another (with or without a carriage return between) ends the headers.
    if (raw[byteIndex] === 10 && raw[byteIndex + 1] === 10) {
      headerEnd = byteIndex;
      bodyStart = byteIndex + 2;

      break;
    }

    if (
      raw[byteIndex] === 10
      && raw[byteIndex + 1] === 13
      && raw[byteIndex + 2] === 10
    ) {
      headerEnd = byteIndex;
      bodyStart = byteIndex + 3;

      break;
    }
  }

  const headerText: Worker_Relay_SplitRawMessage_HeaderText = new TextDecoder().decode(raw.subarray(0, headerEnd));
  const headers: Worker_Relay_SplitRawMessage_Headers = [];

  for (const line of headerText.split('\n')) {
    const trimmedLine: Worker_Relay_SplitRawMessage_TrimmedLine = line.replace('\r', '');

    if (trimmedLine === '') {
      continue;
    }

    const lastIndex: Worker_Relay_SplitRawMessage_LastIndex = headers.length - 1;

    if (
      (
        trimmedLine.startsWith(' ') === true
        || trimmedLine.startsWith('\t') === true
      )
      && lastIndex >= 0
    ) {
      Reflect.set(headers, lastIndex, [
        headers[lastIndex] ?? '',
        trimmedLine,
      ].join(lineBreak));

      continue;
    }

    headers.push(trimmedLine);
  }

  return {
    headers,
    body: raw.subarray(Math.min(bodyStart, raw.length)),
  };
}

export {
  buildForwardedMessage,
  buildReverseAddress,
  buildSentMessage,
  decodeReverseTag,
  parseAddress,
  readFirstHeaderValue,
  readRawMessage,
  splitRawMessage,
};
