const staffRepository = require('./staff.repository');
const {
  validateCreatePayload,
  validateUpdatePayload,
  validateEstadoPayload,
} = require('./staff.validator');
const clientesRepository = require('../clientes/clientes.repository');
const {
  findAuthUserByEmail,
  createAuthIdentity,
  updateAuthIdentity,
  updateAuthPassword,
  deleteAuthIdentity,
} = require('../../auth/identity.repository');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

function getFullName(payload) {
  return `${payload.Nom_Staff} ${payload.Ape_Staff}`.trim();
}

async function ensureAvailableSlot(currentId = null) {
  const total = await staffRepository.countAll();
  if (currentId) {
    return;
  }

  if (total >= 2) {
    throw createHttpError(409, 'Solo se permiten hasta 2 cuentas staff.');
  }
}

async function ensureEmailNotUsedByCliente(email, currentAuthUserId = null) {
  const cliente = await clientesRepository.findByEmail(email);
  if (cliente && cliente.Auth_User_Id !== currentAuthUserId) {
    throw createHttpError(409, 'El correo ya pertenece a un cliente.');
  }
}

async function listStaff() {
  return staffRepository.findAll();
}

async function getStaffById(id) {
  if (!String(id || '').trim()) {
    throw createHttpError(400, 'Id_Staff invalido.');
  }

  const staff = await staffRepository.findById(String(id).trim());
  if (!staff) {
    throw createHttpError(404, 'Staff no encontrado.');
  }

  return staff;
}

async function createStaff(payload) {
  const validation = validateCreatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  await ensureAvailableSlot();

  const existingStaff = await staffRepository.findByEmail(validation.payload.Ema_Staff);
  if (existingStaff) {
    throw createHttpError(409, 'El correo ya esta registrado en staff.');
  }

  await ensureEmailNotUsedByCliente(validation.payload.Ema_Staff);

  const existingAuthUser = await findAuthUserByEmail(validation.payload.Ema_Staff);
  if (existingAuthUser) {
    throw createHttpError(409, 'El correo ya esta registrado.');
  }

  const authUser = await createAuthIdentity({
    name: getFullName(validation.payload),
    email: validation.payload.Ema_Staff,
    password: validation.payload.Pas_Staff,
    role: 'admin',
  });

  return staffRepository.createOne({
    ...validation.payload,
    Auth_User_Id: authUser.id,
  });
}

async function updateStaff(id, payload) {
  if (!String(id || '').trim()) {
    throw createHttpError(400, 'Id_Staff invalido.');
  }

  const cleanId = String(id).trim();
  const current = await staffRepository.findById(cleanId);
  if (!current) {
    throw createHttpError(404, 'Staff no encontrado.');
  }

  const validation = validateUpdatePayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  if (validation.payload.Ema_Staff) {
    const existingStaff = await staffRepository.findByEmail(validation.payload.Ema_Staff);
    if (existingStaff && String(existingStaff.Id_Staff) !== cleanId) {
      throw createHttpError(409, 'El correo ya esta registrado en staff.');
    }

    await ensureEmailNotUsedByCliente(validation.payload.Ema_Staff, current.Auth_User_Id);

    const authUser = await findAuthUserByEmail(validation.payload.Ema_Staff);
    if (authUser && authUser.id !== current.Auth_User_Id) {
      throw createHttpError(409, 'El correo ya esta registrado.');
    }
  }

  const nextName = `${validation.payload.Nom_Staff ?? current.Nom_Staff} ${validation.payload.Ape_Staff ?? current.Ape_Staff}`.trim();
  await updateAuthIdentity(current.Auth_User_Id, {
    name: nextName,
    email: validation.payload.Ema_Staff,
    role: 'admin',
  });

  if (validation.payload.Pas_Staff) {
    await updateAuthPassword(current.Auth_User_Id, validation.payload.Pas_Staff);
  }

  delete validation.payload.Pas_Staff;

  return staffRepository.updateById(cleanId, validation.payload);
}

async function updateEstado(id, payload) {
  if (!String(id || '').trim()) {
    throw createHttpError(400, 'Id_Staff invalido.');
  }

  const cleanId = String(id).trim();
  const current = await staffRepository.findById(cleanId);
  if (!current) {
    throw createHttpError(404, 'Staff no encontrado.');
  }

  const validation = validateEstadoPayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  return staffRepository.updateById(cleanId, validation.payload);
}

async function deleteStaff(id) {
  if (!String(id || '').trim()) {
    throw createHttpError(400, 'Id_Staff invalido.');
  }

  const cleanId = String(id).trim();
  const current = await staffRepository.findById(cleanId);
  if (!current) {
    throw createHttpError(404, 'Staff no encontrado.');
  }

  await staffRepository.removeById(cleanId);
  await deleteAuthIdentity(current.Auth_User_Id);
}

module.exports = {
  listStaff,
  getStaffById,
  createStaff,
  updateStaff,
  updateEstado,
  deleteStaff,
};
