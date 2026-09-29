const { toEcuadorDateTime } = require('../../utils/dateHelper');
const { z } = require('../../utils/zod');

function isValidDateValue(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function normalizeDate(value) {
  const date = new Date(value);
  return toEcuadorDateTime(date).slice(0, 10);
}

function getCurrentMonthRange() {
  const nowEc = toEcuadorDateTime(new Date());
  const [year, month] = nowEc.split('-').map(Number);
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  return { startDate, endDate };
}

const calendarioQuerySchema = z.object({
  startDate: z.any().optional(),
  endDate: z.any().optional(),
}).passthrough();

function validateQuery(query = {}) {
  const defaults = getCurrentMonthRange();
  const parseResult = calendarioQuerySchema.safeParse(query);

  if (!parseResult.success) {
    return { isValid: false, errors: parseResult.error.issues.map((issue) => issue.message), query: defaults };
  }

  const errors = [];

  let startDate = parseResult.data.startDate ?? defaults.startDate;
  let endDate = parseResult.data.endDate ?? defaults.endDate;

  if (!isValidDateValue(startDate)) {
    errors.push('startDate must be a valid date');
  } else {
    startDate = normalizeDate(startDate);
  }

  if (!isValidDateValue(endDate)) {
    errors.push('endDate must be a valid date');
  } else {
    endDate = normalizeDate(endDate);
  }

  if (errors.length === 0 && new Date(startDate) > new Date(endDate)) {
    errors.push('startDate cannot be later than endDate');
  }

  const isValid = errors.length === 0;
  return { isValid, errors, query: { startDate, endDate } };
}

module.exports = { calendarioQuerySchema, validateQuery };
