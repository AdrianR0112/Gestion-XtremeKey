const { toEcuadorDateTime } = require('../utils/dateHelper');

function toDateOnly(value) {
  const localValue = toEcuadorDateTime(value);
  return localValue ? localValue.slice(0, 10) : '';
}

function normalizeWhatsappPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('593')) return digits;
  if (digits.startsWith('0') && digits.length === 10) {
    return `593${digits.slice(1)}`;
  }

  return digits;
}

function buildWhatsappUrl({ phone, clientName, productName, variantName, expirationDate, reminderType }) {
  const normalizedPhone = normalizeWhatsappPhone(phone);
  if (!normalizedPhone) return '';

  const reminderLabel = reminderType === 'dia_vencimiento'
    ? 'vence hoy'
    : 'vence en 3 dias';

  const message = [
    `Hola, quiero renovar una suscripcion.`,
    `Cliente: ${clientName || 'Sin nombre'}`,
    `Producto: ${productName || 'Suscripcion'}`,
    variantName ? `Variante: ${variantName}` : null,
    `Fecha de vencimiento: ${expirationDate}`,
    `Estado: ${reminderLabel}`
  ].filter(Boolean).join('\n');

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

function buildReminderEmail({
  companyName,
  recipientName,
  clientName,
  productName,
  variantName,
  expirationDate,
  whatsappUrl,
  reminderType,
  isReseller
}) {
  const productLabel = [productName, variantName].filter(Boolean).join(' - ');
  const subject = reminderType === 'dia_vencimiento'
    ? `Tu suscripcion a ${productName || 'tu producto'} vence hoy`
    : `Tu suscripcion a ${productName || 'tu producto'} vence en 3 dias`;

  const intro = reminderType === 'dia_vencimiento'
    ? 'Te recordamos que tu suscripcion vence hoy. Si deseas continuar con el servicio, puedes renovarla ahora mismo.'
    : 'Te recordamos que tu suscripcion esta por vencer en 3 dias. Puedes renovarla con anticipacion para evitar interrupciones.';

  const resellerNote = isReseller
    ? `<p style="margin:0 0 16px;color:#334155;">Este recordatorio corresponde al cliente <strong>${clientName || 'Sin nombre'}</strong>.</p>`
    : '';

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
        <div style="padding:24px 24px 12px;background:#0f172a;color:#ffffff;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.8;">${companyName || 'Notificacion'}</p>
          <h1 style="margin:0;font-size:24px;line-height:1.3;">Recordatorio de vencimiento</h1>
        </div>
        <div style="padding:24px;">
          <p style="margin:0 0 16px;">Hola <strong>${recipientName || clientName || 'cliente'}</strong>,</p>
          <p style="margin:0 0 16px;color:#334155;">${intro}</p>
          ${resellerNote}
          <div style="border:1px solid #e2e8f0;border-radius:12px;padding:16px;background:#f8fafc;margin-bottom:20px;">
            <p style="margin:0 0 8px;"><strong>Producto:</strong> ${productLabel || 'Suscripcion'}</p>
            <p style="margin:0;"><strong>Fecha de vencimiento:</strong> ${expirationDate}</p>
          </div>
          <a href="${whatsappUrl}" style="display:inline-block;padding:14px 20px;background:#16a34a;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:700;">Renovar por WhatsApp</a>
          <p style="margin:20px 0 0;color:#64748b;font-size:13px;">Si el boton no funciona, copia y pega este enlace en tu navegador:</p>
          <p style="margin:8px 0 0;word-break:break-all;font-size:13px;"><a href="${whatsappUrl}">${whatsappUrl}</a></p>
        </div>
      </div>
    </div>
  `;

  const text = [
    `Hola ${recipientName || clientName || 'cliente'},`,
    '',
    intro,
    isReseller && clientName ? `Cliente asociado: ${clientName}` : null,
    `Producto: ${productLabel || 'Suscripcion'}`,
    `Fecha de vencimiento: ${expirationDate}`,
    `Renovar por WhatsApp: ${whatsappUrl}`
  ].filter(Boolean).join('\n');

  return { subject, html, text };
}

module.exports = {
  toDateOnly,
  buildWhatsappUrl,
  buildReminderEmail,
  normalizeWhatsappPhone
};
