const { getBetterAuthSession } = require('../auth/bridge');
const staffRepository = require('../modules/staff/staff.repository');
const clientesRepository = require('../modules/clientes/clientes.repository');

async function authMiddleware(req, _res, next) {
  try {
    const session = await getBetterAuthSession(req);
    if (!session?.user) {
      const error = new Error('Sesion requerida.');
      error.statusCode = 401;
      return next(error);
    }

    const [staff, cliente] = await Promise.all([
      staffRepository.findByAuthUserId(session.user.id),
      clientesRepository.findByAuthUserId(session.user.id),
    ]);

    req.auth = session;
    req.user = {
      sub: session.user.id,
      authUserId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      Id_Staff: staff ? Number(staff.Id_Staff) : null,
      Id_Cli: cliente ? Number(cliente.Id_Cli) : null,
      staff,
      cliente,
    };

    return next();
  } catch (_error) {
    const error = new Error('Sesion invalida o expirada.');
    error.statusCode = 401;
    return next(error);
  }
}

module.exports = { authMiddleware };
