const { fromNodeHeaders } = require('better-auth/node');

const { getBetterAuthInstance, getBetterAuthSession } = require('../../auth/bridge');
const { applyBetterAuthCookies, relayBetterAuthResponse } = require('../../auth/http');
const { createAuthIdentity, findAuthUserByEmail } = require('../../auth/identity.repository');
const clientesRepository = require('../clientes/clientes.repository');
const staffRepository = require('../staff/staff.repository');
const { successResponse } = require('../../utils/apiResponse');

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function splitName(name = '') {
  const clean = String(name).trim().replace(/\s+/g, ' ');
  const parts = clean.split(' ').filter(Boolean);
  return {
    nombre: parts.shift() || clean || 'Cliente',
    apellido: parts.join(' ') || '-',
  };
}

function mapCustomerSession(cliente, session) {
  const fullName = [cliente.Nom_Cli, cliente.Ape_Cli].filter(Boolean).join(' ').trim();
  return {
    session: {
      id: session?.session?.id || null,
      expiresAt: session?.session?.expiresAt || null,
    },
    user: {
      id: String(cliente.Id_Cli),
      authUserId: cliente.Auth_User_Id,
      name: fullName || 'Cliente',
      email: cliente.Ema_Cli,
      role: 'cliente',
      company: 'Shop',
      cliente,
    },
  };
}

async function requireCustomerSession(req) {
  const session = await getBetterAuthSession(req);
  if (!session?.user) {
    throw createHttpError(401, 'Sesion no encontrada.');
  }

  const cliente = await clientesRepository.findByAuthUserId(session.user.id);
  if (!cliente || session.user.role !== 'cliente') {
    throw createHttpError(403, 'Acceso restringido a clientes.');
  }

  return { session, cliente };
}

async function register(req, res, next) {
  try {
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!name || !email || password.length < 6) {
      throw createHttpError(400, 'Datos de registro invalidos.');
    }

    const existingCliente = await clientesRepository.findByEmail(email);
    if (existingCliente?.Auth_User_Id) {
      throw createHttpError(409, 'El correo ya esta registrado como cliente.');
    }

    const existingAuthUser = await findAuthUserByEmail(email);
    if (existingAuthUser) {
      const linkedStaff = await staffRepository.findByAuthUserId(existingAuthUser.id);
      if (linkedStaff || existingAuthUser.role === 'admin') {
        throw createHttpError(409, 'Este correo pertenece a una cuenta staff y no puede registrarse como cliente.');
      }

      throw createHttpError(409, 'El correo ya esta registrado.');
    }

    const authUser = await createAuthIdentity({ name, email, password, role: 'cliente' });
    const { nombre, apellido } = splitName(name);
    await clientesRepository.createOne({
      Nom_Cli: nombre,
      Ape_Cli: apellido,
      Tel_Cli: null,
      Ema_Cli: email,
      Auth_User_Id: authUser.id,
      Email_Verificado: 0,
    });

    const auth = await getBetterAuthInstance();
    const response = await auth.api.signInEmail({
      body: { email, password },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    const payload = await response.clone().json();
    const cliente = await clientesRepository.findByAuthUserId(payload.user.id);

    if (!response.ok || !cliente) {
      return relayBetterAuthResponse(response, res);
    }

    applyBetterAuthCookies(response, res);
    return res.status(201).json(successResponse(mapCustomerSession(cliente, { session: payload.session || {}, user: payload.user }), 'Cliente registrado correctamente.'));
  } catch (error) {
    return next(error);
  }
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
    const cliente = payload?.user?.id ? await clientesRepository.findByAuthUserId(payload.user.id) : null;

    if (!response.ok) {
      return relayBetterAuthResponse(response, res);
    }

    if (!cliente || payload?.user?.role !== 'cliente') {
      return res.status(403).json({ ok: false, message: 'Este acceso es exclusivo para clientes.' });
    }

    applyBetterAuthCookies(response, res);
    return res.status(200).json(successResponse(mapCustomerSession(cliente, { session: payload.session || {}, user: payload.user }), 'Inicio de sesion correcto.'));
  } catch (error) {
    return next(error);
  }
}

async function session(req, res, next) {
  try {
    const data = await requireCustomerSession(req);
    return res.status(200).json(successResponse(mapCustomerSession(data.cliente, data.session), 'Sesion obtenida correctamente.'));
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

module.exports = {
  register,
  login,
  session,
  logout,
};
