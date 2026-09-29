const { normalizeWhatsappPhone } = require('../../services/vencimientoEmail.service');

function buildPhoneCandidates(raw) {
  const entrada = String(raw ?? '').trim();
  const canonico = normalizeWhatsappPhone(entrada);
  if (!canonico) {
    return { entrada, canonico: '', variantes: [] };
  }

  const variants = new Set([entrada, canonico, `+${canonico}`]);
  if (canonico.startsWith('593') && canonico.length === 12) {
    const local = canonico.slice(3);
    variants.add(local);
    variants.add(`0${local}`);
  }

  return {
    entrada,
    canonico,
    variantes: [...variants].filter(Boolean),
  };
}

module.exports = { buildPhoneCandidates };
