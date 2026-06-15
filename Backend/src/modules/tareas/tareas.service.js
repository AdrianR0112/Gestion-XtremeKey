const tareasRepository = require('./tareas.repository');
const clientesRepository = require('../clientes/clientes.repository');
const ventasRepository = require('../ventas/ventas.repository');
const { validatePayload, isNumericId } = require('./tareas.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function ensureClienteExiste(idCli) {
  if (idCli === undefined || idCli === null) return;
  const cliente = await clientesRepository.findById(idCli);
  if (!cliente) {
    throw createHttpError(400, 'El cliente indicado no existe.');
  }
}

async function ensureVentaExiste(idVen) {
  if (idVen === undefined || idVen === null) return;
  const venta = await ventasRepository.findById(idVen);
  if (!venta) {
    throw createHttpError(400, 'La venta indicada no existe.');
  }
}

async function listTareas() {
  return tareasRepository.findAll();
}

async function getTareaById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Tar invalido.');
  }

  const item = await tareasRepository.findById(Number(id));
  if (!item) {
    throw createHttpError(404, 'Tarea no encontrada.');
  }

  return item;
}

async function createTarea(payload) {
  const validation = validatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureClienteExiste(validation.payload.Id_Cli);
  await ensureVentaExiste(validation.payload.Id_Ven);

  return tareasRepository.createOne(validation.payload);
}

async function updateTarea(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Tar invalido.');
  }

  const current = await tareasRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Tarea no encontrada.');
  }

  const validation = validatePayload(payload, { isUpdate: true });
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const merged = {
    ...current,
    ...validation.payload
  };

  const mergedValidation = validatePayload(merged, { isUpdate: true });
  if (!mergedValidation.isValid) {
    throw createHttpError(400, 'Payload invalido.', mergedValidation.errors);
  }

  await ensureClienteExiste(validation.payload.Id_Cli ?? current.Id_Cli);
  await ensureVentaExiste(validation.payload.Id_Ven ?? current.Id_Ven);

  return tareasRepository.updateById(Number(id), validation.payload);
}

async function deleteTarea(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Tar invalido.');
  }

  const deleted = await tareasRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Tarea no encontrada.');
  }
}

module.exports = {
  listTareas,
  getTareaById,
  createTarea,
  updateTarea,
  deleteTarea
};
