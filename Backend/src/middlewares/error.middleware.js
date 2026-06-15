function errorMiddleware(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    ok: false,
    message,
    errors: err.errors || null,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = { errorMiddleware };
