const { getBetterAuthSession } = require('../auth/bridge');
const staffRepository = require('../modules/staff/staff.repository');

async function authMiddleware(req, _res, next) {
  try {
    const session = await getBetterAuthSession(req);
    if (!session?.user) {
      const error = new Error('Sesion requerida.');
      error.statusCode = 401;
      return next(error);
    }

    const staff = await staffRepository.findByAuthUserId(session.user.id);

    req.auth = session;
    req.user = {
      sub: session.user.id,
      authUserId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      Id_Staff: staff ? Number(staff.Id_Staff) : null,
      staff,
    };

    return next();
  } catch (_error) {
    const error = new Error('Sesion invalida o expirada.');
    error.statusCode = 401;
    return next(error);
  }
}

module.exports = { authMiddleware };
