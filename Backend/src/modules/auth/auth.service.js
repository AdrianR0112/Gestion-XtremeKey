const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRepository = require('./auth.repository');
const {
  validateRegisterPayload,
  validateLoginPayload,
  validateChangePasswordPayload
} = require('./auth.validator');
const { env } = require('../../config/env');

function createHttpError(statusCode, message, errors = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
}

function buildTokenPayload(user) {
  return {
    sub: user.Id_Usu,
    email: user.Ema_Usu,
    role: user.Rol_Usu,
    status: user.Est_Usu
  };
}

function signToken(user) {
  return jwt.sign(buildTokenPayload(user), env.jwtSecret, { expiresIn: env.jwtExpiresIn || '8h' });
}

async function register(payload) {
  const validation = validateRegisterPayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const existing = await authRepository.findByEmail(validation.payload.Ema_Usu);
  if (existing) {
    throw createHttpError(409, 'El correo ya esta registrado.');
  }

  const passwordHash = await bcrypt.hash(validation.payload.Pas_Usu, 10);
  const created = await authRepository.createUser({
    ...validation.payload,
    Pas_Usu: passwordHash
  });

  const token = signToken(created);
  return { user: created, token };
}

async function login(payload) {
  const validation = validateLoginPayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const user = await authRepository.findByEmail(validation.payload.Ema_Usu);
  if (!user) {
    throw createHttpError(401, 'Credenciales invalidas.');
  }

  const passwordMatch = await bcrypt.compare(validation.payload.Pas_Usu, user.Pas_Usu);
  if (!passwordMatch) {
    throw createHttpError(401, 'Credenciales invalidas.');
  }

  if (user.Est_Usu !== 'activo') {
    throw createHttpError(403, `El usuario esta ${user.Est_Usu}.`);
  }

  await authRepository.updateLastAccess(user.Id_Usu);
  const publicUser = await authRepository.findPublicById(user.Id_Usu);
  const token = signToken(publicUser);

  return { user: publicUser, token };
}

async function getMe(userId) {
  const user = await authRepository.findPublicById(Number(userId));
  if (!user) {
    throw createHttpError(404, 'Usuario no encontrado.');
  }

  return user;
}

async function changePassword(userId, payload) {
  const validation = validateChangePasswordPayload(payload);
  if (!validation.isValid) {
    throw createHttpError(400, 'Payload invalido.', validation.errors);
  }

  const currentUser = await authRepository.findPublicById(Number(userId));
  if (!currentUser) {
    throw createHttpError(404, 'Usuario no encontrado.');
  }

  const userWithPassword = await authRepository.findByEmail(currentUser.Ema_Usu);
  if (!userWithPassword) {
    throw createHttpError(404, 'Usuario no encontrado.');
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    validation.payload.currentPassword,
    userWithPassword.Pas_Usu
  );

  if (!isCurrentPasswordValid) {
    throw createHttpError(401, 'La contrasena actual es incorrecta.');
  }

  const nextHash = await bcrypt.hash(validation.payload.newPassword, 10);
  await authRepository.updatePassword(Number(userId), nextHash);
}

module.exports = {
  register,
  login,
  getMe,
  changePassword
};
