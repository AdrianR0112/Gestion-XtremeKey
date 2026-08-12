const TelegramBot = require('node-telegram-bot-api');

const { env } = require('../config/env');
const { logger } = require('../config/logger');

let sendBot = null;
let pollingBot = null;

const ADMIN_HEADER = '*Recordatorio de suscripción*';

function prepareTelegramMessage(text) {
  const value = String(text || '');
  if (!value.includes(ADMIN_HEADER)) {
    return { text: value };
  }

  // Markdown legacy interpreta _, *, `, [ y las barras invertidas como entidades.
  // Se conserva únicamente la negrita intencional del encabezado administrativo.
  const headerToken = 'TELEGRAMADMINHEADER';
  const escaped = value
    .replace(ADMIN_HEADER, headerToken)
    .replace(/([\\_*`\[\]])/g, '\\$1');

  return {
    text: escaped.replace(headerToken, ADMIN_HEADER),
    parse_mode: 'Markdown'
  };
}

function isTelegramConfigured() {
  return Boolean(env.telegramEnabled && env.telegramBotToken);
}

function getBot({ polling = false } = {}) {
  if (!isTelegramConfigured()) return null;

  if (polling) {
    if (!pollingBot) pollingBot = new TelegramBot(env.telegramBotToken, { polling: true });
    return pollingBot;
  }

  if (!sendBot) sendBot = new TelegramBot(env.telegramBotToken, { polling: false });
  return sendBot;
}

async function sendMessage({ chatId, text, replyMarkup }) {
  const bot = getBot();
  if (!bot) {
    return {
      data: null,
      error: new Error('Telegram no está configurado o está deshabilitado.')
    };
  }

  try {
    const message = prepareTelegramMessage(text);
    const data = await bot.sendMessage(chatId, message.text, {
      ...(message.parse_mode ? { parse_mode: message.parse_mode } : {}),
      ...(replyMarkup ? { reply_markup: replyMarkup } : {})
    });
    return { data, error: null };
  } catch (error) {
    logger.error('Error enviando mensaje por Telegram.', error);
    return { data: null, error };
  }
}

module.exports = { isTelegramConfigured, getBot, sendMessage, prepareTelegramMessage };
