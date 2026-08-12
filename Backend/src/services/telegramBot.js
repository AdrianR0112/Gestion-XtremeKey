const { env } = require('../config/env');
const { logger } = require('../config/logger');
const { getBot, isTelegramConfigured, sendMessage } = require('./telegram.service');
const telegramDomain = require('../modules/telegram/telegram.service');

let bot = null;

function isAdminChat(message) {
  return String(message?.chat?.id || '') === String(env.telegramAdminChatId || '');
}

async function sendVencimientos(chatId, milestones) {
  const result = await telegramDomain.listarPorVencer(milestones);
  if (result.items.length === 0) {
    await sendMessage({ chatId, text: 'No hay suscripciones próximas a vencer.' });
    return;
  }

  await sendMessage({
    chatId,
    text: `Se encontraron ${result.items.length} suscripción(es) por vencer:`
  });

  for (const item of result.items) {
    const replyMarkup = item.whatsappUrl
      ? { inline_keyboard: [[{ text: 'Enviar recordatorio', url: item.whatsappUrl }]] }
      : undefined;
    await sendMessage({ chatId, text: item.adminText, replyMarkup });
  }
}

async function sendVencidasAyer(chatId) {
  const result = await telegramDomain.listarVencidasAyer();
  if (result.items.length === 0) {
    await sendMessage({ chatId, text: 'No hay suscripciones que hayan vencido ayer.' });
    return;
  }

  await sendMessage({
    chatId,
    text: `Se encontraron ${result.items.length} suscripción(es) que vencieron ayer:`
  });

  for (const item of result.items) {
    const replyMarkup = item.whatsappUrl
      ? { inline_keyboard: [[{ text: 'Enviar recordatorio', url: item.whatsappUrl }]] }
      : undefined;
    await sendMessage({ chatId, text: item.adminText, replyMarkup });
  }
}

function startTelegramBot() {
  if (!env.telegramEnabled) {
    logger.info('Bot de Telegram deshabilitado por configuracion.');
    return null;
  }

  if (!isTelegramConfigured()) {
    logger.warn('Bot de Telegram habilitado, pero falta TELEGRAM_BOT_TOKEN.');
    return null;
  }

  if (bot) return bot;
  bot = getBot({ polling: true });
  if (!bot) return null;

  bot.onText(/^\/start(?:@\w+)?$/i, async (message) => {
    const chatId = message.chat.id;
    await sendMessage({
      chatId,
      text: [
        `Tu chat.id es: ${chatId}`,
        '',
        'Configura este valor en TELEGRAM_ADMIN_CHAT_ID para habilitar las consultas administrativas.',
        '',
        'Comandos disponibles: /vencimientos, /hoy y /ayer'
      ].join('\n')
    });
  });

  bot.onText(/^\/(vencimientos|hoy|ayer)(?:@\w+)?$/i, async (message, match) => {
    if (!isAdminChat(message)) return;
    try {
      const command = match[1].toLowerCase();
      if (command === 'ayer') {
        await sendVencidasAyer(message.chat.id);
      } else {
        await sendVencimientos(message.chat.id, command === 'hoy' ? [0] : [5, 1, 0]);
      }
    } catch (error) {
      logger.error('Error atendiendo comando de Telegram.', error);
      await sendMessage({ chatId: message.chat.id, text: 'No se pudo consultar los vencimientos.' });
    }
  });

  bot.on('polling_error', (error) => logger.error('Error de polling de Telegram.', error));
  logger.info('Bot de Telegram inicializado en modo polling.');
  return bot;
}

module.exports = { startTelegramBot };
