const { fromNodeHeaders } = require('better-auth/node');

const { getBetterAuthInstance, getBetterAuthSession } = require('../../auth/bridge');
const { applyBetterAuthCookies, relayBetterAuthResponse } = require('../../auth/http');
const staffRepository = require('../staff/staff.repository');
const { successResponse } = require('../../utils/apiResponse');

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function mapStaffSession(staff, session) {
  return {
    session: {
      id: session?.session?.id || null,
      expiresAt: session?.session?.expiresAt || null,
    },
    user: {
      id: staff.Id_Staff,
      authUserId: staff.Auth_User_Id,
      name: `${staff.Nom_Staff} ${staff.Ape_Staff}`.trim(),
      email: staff.Ema_Staff,
      role: 'admin',
      status: staff.Est_Staff,
      staff,
    },
  };
}

async function requireStaffSession(req) {
  const session = await getBetterAuthSession(req);
  if (!session?.user) {
    throw createHttpError(401, 'Sesion no encontrada.');
  }

  const staff = await staffRepository.findByAuthUserId(session.user.id);
  if (!staff || staff.Est_Staff !== 'activo' || session.user.role !== 'admin') {
    throw createHttpError(403, 'Acceso restringido a staff admin.');
  }

  return { session, staff };
}

async function login(req, res, next) {
  try {
    const auth = await getBetterAuthInstance();
    const response = await auth.api.signInEmail({
      body: {
        email: String(req.body?.email || '').trim().toLowerCase(),
        password: String(req.body?.password || ''),
      },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    const payload = await response.clone().json();
    const staff = await staffRepository.findByAuthUserId(payload?.user?.id);

    if (!response.ok) {
      return relayBetterAuthResponse(response, res);
    }

    if (!staff || payload?.user?.role !== 'admin' || staff.Est_Staff !== 'activo') {
      return res.status(403).json({ ok: false, message: 'Este acceso es exclusivo para staff admin.' });
    }

    await staffRepository.updateLastAccessByAuthUserId(payload.user.id);
    applyBetterAuthCookies(response, res);
    return res.status(200).json(successResponse(mapStaffSession(staff, { session: payload.session || {}, user: payload.user }), 'Inicio de sesion correcto.'));
  } catch (error) {
    return next(error);
  }
}

async function session(req, res, next) {
  try {
    const data = await requireStaffSession(req);
    return res.status(200).json(successResponse(mapStaffSession(data.staff, data.session), 'Sesion obtenida correctamente.'));
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const auth = await getBetterAuthInstance();
    const response = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    return relayBetterAuthResponse(response, res);
  } catch (error) {
    return next(error);
  }
}

async function changePassword(req, res, next) {
  try {
    await requireStaffSession(req);
    const auth = await getBetterAuthInstance();
    await auth.api.changePassword({
      body: {
        currentPassword: String(req.body?.currentPassword || ''),
        newPassword: String(req.body?.newPassword || ''),
      },
      headers: fromNodeHeaders(req.headers),
    });

    return res.status(200).json(successResponse(null, 'Contrasena actualizada correctamente.'));
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  session,
  logout,
  changePassword,
};
