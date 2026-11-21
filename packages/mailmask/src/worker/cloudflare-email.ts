import { readFirstHeaderValue } from './relay.js';

import type {
  Worker_CloudflareEmail_IsDmarcPass_AuthenticationResults,
  Worker_CloudflareEmail_IsDmarcPass_Raw,
  Worker_CloudflareEmail_IsDmarcPass_Returns,
  Worker_CloudflareEmail_IsDmarcPass_Value,
  Worker_CloudflareEmail_SendRawEmail_EmailBinding,
  Worker_CloudflareEmail_SendRawEmail_EmailMessageConstructor,
  Worker_CloudflareEmail_SendRawEmail_From,
  Worker_CloudflareEmail_SendRawEmail_Raw,
  Worker_CloudflareEmail_SendRawEmail_Returns,
  Worker_CloudflareEmail_SendRawEmail_Stream,
  Worker_CloudflareEmail_SendRawEmail_To,
  Worker_CloudflareEmail_SendTextEmail_EmailBinding,
  Worker_CloudflareEmail_SendTextEmail_Message,
  Worker_CloudflareEmail_SendTextEmail_Returns,
} from '../types/worker/cloudflare-email.d.ts';

/**
 * Worker - Cloudflare Email - Is Dmarc Pass.
 *
 * Reads the first Authentication-Results header, which Cloudflare's mail servers
 * add, and confirms DMARC passed. Later copies could come from the sender.
 *
 * @param {Worker_CloudflareEmail_IsDmarcPass_Raw} raw - Raw.
 *
 * @returns {Worker_CloudflareEmail_IsDmarcPass_Returns}
 *
 * @since 1.2.0
 */
function isDmarcPass(raw: Worker_CloudflareEmail_IsDmarcPass_Raw): Worker_CloudflareEmail_IsDmarcPass_Returns {
  const authenticationResults: Worker_CloudflareEmail_IsDmarcPass_AuthenticationResults = readFirstHeaderValue(raw, 'authentication-results');

  if (authenticationResults === undefined) {
    return false;
  }

  const value: Worker_CloudflareEmail_IsDmarcPass_Value = authenticationResults.toLowerCase();

  return value.startsWith('mx.cloudflare.net') === true && value.includes('dmarc=pass') === true;
}

/**
 * Worker - Cloudflare Email - Send Raw Email.
 *
 * Sends rebuilt message bytes through the send_email binding as Cloudflare's
 * EmailMessage, passing the bytes as a stream so 8-bit content is untouched.
 *
 * @param {Worker_CloudflareEmail_SendRawEmail_EmailBinding}            emailBinding            - Email binding.
 * @param {Worker_CloudflareEmail_SendRawEmail_EmailMessageConstructor} emailMessageConstructor - Email message constructor.
 * @param {Worker_CloudflareEmail_SendRawEmail_From}                    from                    - From.
 * @param {Worker_CloudflareEmail_SendRawEmail_To}                      to                      - To.
 * @param {Worker_CloudflareEmail_SendRawEmail_Raw}                     raw                     - Raw.
 *
 * @returns {Worker_CloudflareEmail_SendRawEmail_Returns}
 *
 * @since 1.2.0
 */
async function sendRawEmail(emailBinding: Worker_CloudflareEmail_SendRawEmail_EmailBinding, emailMessageConstructor: Worker_CloudflareEmail_SendRawEmail_EmailMessageConstructor, from: Worker_CloudflareEmail_SendRawEmail_From, to: Worker_CloudflareEmail_SendRawEmail_To, raw: Worker_CloudflareEmail_SendRawEmail_Raw): Worker_CloudflareEmail_SendRawEmail_Returns {
  const stream: Worker_CloudflareEmail_SendRawEmail_Stream = new Blob([raw]).stream();

  await emailBinding.send(Reflect.construct(emailMessageConstructor, [
    from,
    to,
    stream,
  ]));

  return;
}

/**
 * Worker - Cloudflare Email - Send Text Email.
 *
 * Sends a plain-text message, such as a refusal notification, through the
 * send_email binding with Cloudflare's structured message form.
 *
 * @param {Worker_CloudflareEmail_SendTextEmail_EmailBinding} emailBinding - Email binding.
 * @param {Worker_CloudflareEmail_SendTextEmail_Message}      message      - Message.
 *
 * @returns {Worker_CloudflareEmail_SendTextEmail_Returns}
 *
 * @since 1.2.0
 */
async function sendTextEmail(emailBinding: Worker_CloudflareEmail_SendTextEmail_EmailBinding, message: Worker_CloudflareEmail_SendTextEmail_Message): Worker_CloudflareEmail_SendTextEmail_Returns {
  await emailBinding.send({
    from: message['from'],
    to: message['to'],
    subject: message['subject'],
    text: message['text'],
  });

  return;
}

export {
  isDmarcPass,
  sendRawEmail,
  sendTextEmail,
};
