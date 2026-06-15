function roleMiddleware(roles = []) {
  return (req, _res, next) => {
    const role = req.user?.role;

    if (!role) {
      const error = new Error('Usuario no autenticado.');
      error.statusCode = 401;
      return next(error);
    }

    if (roles.length > 0 && !roles.includes(role)) {
      const error = new Error('No autorizado para este recurso.');
      error.statusCode = 403;
      return next(error);
    }

    return next();
  };
}

module.exports = { roleMiddleware };
