const calendarioRepository = require('./calendario.repository');
const { validateQuery } = require('./calendario.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

function mapEvent(row) {
  return {
    id: row.Event_Key,
    type: row.Event_Type,
    refId: row.Event_Id,
    title: row.Title,
    description: row.Description,
    start: row.Event_Date,
    end: row.Event_Date,
    allDay: true,
    status: row.Status,
    priority: row.Priority,
    progress: row.Progress,
    client: row.Client_Id
      ? {
          id: row.Client_Id,
          name: row.Client_Name || null
        }
      : null,
    saleId: row.Sale_Id,
    product: row.Product_Id
      ? {
          id: row.Product_Id,
          name: row.Product_Name || null
        }
      : null,
    variant: row.Variant_Id
      ? {
          id: row.Variant_Id,
          name: row.Variant_Name || null
        }
      : null,
    source: row.Source
  };
}

async function listCalendarEvents(query = {}) {
  const validation = validateQuery(query);
  if (!validation.isValid) {
    throw createHttpError(400, 'Query invalido.', validation.errors);
  }

  const rows = await calendarioRepository.findEventsBetween(
    validation.query.startDate,
    validation.query.endDate
  );

  const events = rows.map(mapEvent);
  const summary = events.reduce(
    (accumulator, event) => {
      accumulator.total += 1;
      accumulator.byType[event.type] = (accumulator.byType[event.type] || 0) + 1;
      return accumulator;
    },
    { total: 0, byType: {} }
  );

  return {
    range: validation.query,
    summary,
    events
  };
}

module.exports = { listCalendarEvents };