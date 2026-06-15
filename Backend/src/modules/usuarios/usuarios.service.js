const bcrypt = require('bcryptjs');
const usuariosRepository = require('./usuarios.repository');
const {
  isNumericId,
  validateCreatePayload,
  validateUpdatePayload,
  validateEstadoPayload
} = require('./usuarios.validator');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

async function listUsuarios() {
  return usuariosRepository.findAll();
}

async function getUsuarioById(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Usu invalido.');
  }

  const user = await usuariosRepository.findById(Number(id));
  if (!user) {
    throw createHttpError(404, 'Usuario no encontrado.');
  }

  return user;
}

async function createUsuario(payload) {
  const validation = validateCreatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const existing = await usuariosRepository.findByEmail(validation.payload.Ema_Usu);
  if (existing) {
    throw createHttpError(409, 'El correo ya esta registrado.');
  }

  const passwordHash = await bcrypt.hash(validation.payload.Pas_Usu, 10);
  return usuariosRepository.createOne({ ...validation.payload, Pas_Usu: passwordHash });
}

async function updateUsuario(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Usu invalido.');
  }

  const current = await usuariosRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Usuario no encontrado.');
  }

  const validation = validateUpdatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  if (validation.payload.Ema_Usu) {
    const existing = await usuariosRepository.findByEmail(validation.payload.Ema_Usu);
    if (existing && existing.Id_Usu !== Number(id)) {
      throw createHttpError(409, 'El correo ya esta registrado.');
    }
  }

  if (validation.payload.Pas_Usu) {
    validation.payload.Pas_Usu = await bcrypt.hash(validation.payload.Pas_Usu, 10);
  }

  return usuariosRepository.updateById(Number(id), validation.payload);
}

async function updateEstado(id, payload) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Usu invalido.');
  }

  const current = await usuariosRepository.findById(Number(id));
  if (!current) {
    throw createHttpError(404, 'Usuario no encontrado.');
  }

  const validation = validateEstadoPayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return usuariosRepository.updateById(Number(id), validation.payload);
}

async function deleteUsuario(id) {
  if (!isNumericId(id)) {
    throw createHttpError(400, 'Id_Usu invalido.');
  }

  const deleted = await usuariosRepository.removeById(Number(id));
  if (!deleted) {
    throw createHttpError(404, 'Usuario no encontrado.');
  }
}

module.exports = {
  listUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  updateEstado,
  deleteUsuario
};
