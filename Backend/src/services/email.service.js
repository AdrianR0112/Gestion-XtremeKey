const { Resend } = require('resend');

const { env } = require('../config/env');
const { logger } = require('../config/logger');

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

function getFromAddress() {
  if (!env.resendFromEmail) {
    return '';
  }

  return env.resendFromName
    ? `${env.resendFromName} <${env.resendFromEmail}>`
    : env.resendFromEmail;
}

function isEmailConfigured() {
  return Boolean(env.resendApiKey && env.resendFromEmail);
}

async function sendEmail({
  from,
  to,
  subject,
  html,
  text,
  react,
  cc,
  bcc,
  replyTo,
  scheduledAt,
  headers,
  tags,
  attachments,
  template,
  idempotencyKey
}) {
  if (!isEmailConfigured() || !resend) {
    return {
      data: null,
      error: {
        name: 'ResendConfigurationError',
        message: 'Resend no esta configurado. Defina RESEND_API_KEY y RESEND_FROM_EMAIL.'
      }
    };
  }

  if (!template && !html && !text && !react) {
    return {
      data: null,
      error: {
        name: 'ResendPayloadError',
        message: 'Debe enviar al menos uno de estos campos: html, text, react o template.'
      }
    };
  }

  if (template && (html || text || react)) {
    return {
      data: null,
      error: {
        name: 'ResendPayloadError',
        message: 'template no se puede combinar con html, text o react.'
      }
    };
  }

  const payload = {
    from: from || getFromAddress(),
    to,
    subject,
    html,
    text,
    react,
    cc,
    bcc,
    replyTo: replyTo || env.resendReplyTo || undefined,
    scheduledAt,
    headers,
    tags,
    attachments,
    template,
    idempotencyKey
  };

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    logger.error('Error al enviar correo con Resend.', error);
  }

  return { data, error };
}

module.exports = {
  isEmailConfigured,
  getFromAddress,
  sendEmail
};
