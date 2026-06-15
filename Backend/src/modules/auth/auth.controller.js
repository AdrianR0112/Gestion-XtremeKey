const authService = require('./auth.service');
const { successResponse } = require('../../utils/apiResponse');
const { asyncHandler } = require('../../utils/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json(successResponse(data, 'Usuario registrado correctamente.'));
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json(successResponse(data, 'Inicio de sesion correcto.'));
});

const me = asyncHandler(async (req, res) => {
  const data = await authService.getMe(req.user.sub);
  res.status(200).json(successResponse(data, 'Perfil obtenido correctamente.'));
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.sub, req.body);
  res.status(200).json(successResponse(null, 'Contrasena actualizada correctamente.'));
});

const logout = asyncHandler(async (_req, res) => {
  res.status(200).json(successResponse(null, 'Sesion cerrada correctamente.'));
});

module.exports = { register, login, me, changePassword, logout };
