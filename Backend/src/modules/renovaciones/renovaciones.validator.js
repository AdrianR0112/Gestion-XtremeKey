const { tiposRenovacion, estadosRenovacion, allowedFields } = require('./renovaciones.schemas');
const { toEcuadorDateTime } = require('../../utils/dateHelper');

function isNumericId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

function pickAllowed(payload = {}) {
  const clean = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      clean[key] = payload[key];
    }
  }
  return clean;
}

function normalizeOptionalString(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = String(value).trim();
  return trimmed === '' ? null : trimmed;
}

function normalizeDate(value, fieldName, errors, required = false) {
  if (value === undefined) {
    if (required) errors.push(`${fieldName} is required`);
    return undefined;
  }

  if (value === null || value === '') {
    if (required) errors.push(`${fieldName} is required`);
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${fieldName} must be a valid date`);
    return value;
  }

  return toEcuadorDateTime(date).slice(0, 10);
}

function validatePayload(payload = {}, { isUpdate = false } = {}) {
  const errors = [];
  const clean = pickAllowed(payload);

  if (!isUpdate) {
    if (!isNumericId(clean.Id_Dve_Ori)) {
      errors.push('Id_Dve_Ori is required and must be a positive integer');
    }

    if (!isNumericId(clean.Id_Cli)) {
      errors.push('Id_Cli is required and must be a positive integer');
    }

    if (!isNumericId(clean.Id_Prd) && !isNumericId(clean.Id_Var)) {
      errors.push('Id_Prd or Id_Var is required and at least one must be a positive integer');
    }

    if (clean.Fec_Ven_Ant_Ren === undefined || clean.Fec_Ven_Ant_Ren === null || clean.Fec_Ven_Ant_Ren === '') {
      errors.push('Fec_Ven_Ant_Ren is required');
    }
  }

  if (clean.Id_Dve_Ori !== undefined) {
    const idOri = Number(clean.Id_Dve_Ori);
    if (!Number.isInteger(idOri) || idOri <= 0) {
      errors.push('Id_Dve_Ori must be a positive integer');
    } else {
      clean.Id_Dve_Ori = idOri;
    }
  }

  if (clean.Id_Dve_Nue !== undefined) {
    if (clean.Id_Dve_Nue === null || clean.Id_Dve_Nue === '') {
      clean.Id_Dve_Nue = null;
    } else {
      const idNue = Number(clean.Id_Dve_Nue);
      if (!Number.isInteger(idNue) || idNue <= 0) {
        errors.push('Id_Dve_Nue must be a positive integer or null');
      } else {
        clean.Id_Dve_Nue = idNue;
      }
    }
  }

  if (clean.Id_Cli !== undefined) {
    const idCli = Number(clean.Id_Cli);
    if (!Number.isInteger(idCli) || idCli <= 0) {
      errors.push('Id_Cli must be a positive integer');
    } else {
      clean.Id_Cli = idCli;
    }
  }

  if (clean.Id_Prd !== undefined) {
    if (clean.Id_Prd === null || clean.Id_Prd === '') {
      clean.Id_Prd = null;
    } else {
      const idPrd = Number(clean.Id_Prd);
      if (!Number.isInteger(idPrd) || idPrd <= 0) {
        errors.push('Id_Prd must be a positive integer or null');
      } else {
        clean.Id_Prd = idPrd;
      }
    }
  }

  if (clean.Id_Var !== undefined) {
    if (clean.Id_Var === null || clean.Id_Var === '') {
      clean.Id_Var = null;
    } else {
      const idVar = Number(clean.Id_Var);
      if (!Number.isInteger(idVar) || idVar <= 0) {
        errors.push('Id_Var must be a positive integer or null');
      } else {
        clean.Id_Var = idVar;
      }
    }
  }

  clean.Fec_Ven_Ant_Ren = normalizeDate(clean.Fec_Ven_Ant_Ren, 'Fec_Ven_Ant_Ren', errors, !isUpdate);
  clean.Fec_Ini_Nue_Ren = normalizeDate(clean.Fec_Ini_Nue_Ren, 'Fec_Ini_Nue_Ren', errors, false);
  clean.Fec_Fin_Nue_Ren = normalizeDate(clean.Fec_Fin_Nue_Ren, 'Fec_Fin_Nue_Ren', errors, false);

  const numericFields = ['Pre_Ori_Ren', 'Pre_Ren', 'Des_Ren'];
  for (const field of numericFields) {
    if (clean[field] !== undefined) {
      const value = Number(clean[field]);
      if (Number.isNaN(value) || value < 0) {
        errors.push(`${field} must be a number greater or equal to 0`);
      } else {
        clean[field] = Number(value.toFixed(2));
      }
    }
  }

  clean.Tip_Ren = normalizeOptionalString(clean.Tip_Ren);
  clean.Est_Ren = normalizeOptionalString(clean.Est_Ren);
  clean.Not_Ren = normalizeOptionalString(clean.Not_Ren);

  if (clean.Tip_Ren !== undefined && !tiposRenovacion.includes(clean.Tip_Ren)) {
    errors.push('Tip_Ren must be automatica, manual or anticipada');
  }

  if (clean.Est_Ren !== undefined && !estadosRenovacion.includes(clean.Est_Ren)) {
    errors.push('Est_Ren must be pendiente, completada, rechazada or expirada');
  }

  if (clean.Fec_Ini_Nue_Ren && clean.Fec_Fin_Nue_Ren) {
    const start = new Date(clean.Fec_Ini_Nue_Ren);
    const end = new Date(clean.Fec_Fin_Nue_Ren);
    if (end < start) {
      errors.push('Fec_Fin_Nue_Ren cannot be earlier than Fec_Ini_Nue_Ren');
    }
  }

  if (clean.Pre_Ori_Ren !== undefined && clean.Pre_Ren !== undefined && clean.Des_Ren !== undefined) {
    const expected = Number((clean.Pre_Ori_Ren - clean.Des_Ren).toFixed(2));
    const received = Number(clean.Pre_Ren.toFixed(2));
    if (expected < 0) {
      errors.push('Des_Ren cannot be greater than Pre_Ori_Ren');
    } else if (Math.abs(expected - received) > 0.01) {
      errors.push('Pre_Ren must equal Pre_Ori_Ren - Des_Ren');
    }
  }

  const isValid = errors.length === 0;
  return { isValid, errors, payload: clean };
}

module.exports = { validatePayload, isNumericId };
