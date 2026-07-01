function errorMiddleware(err, _req, res, _next) {
  const statusCode = err.statusCode || (err.name === 'MulterError' ? 400 : 500);
  const message = err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE'
    ? 'La imagen excede el tamano maximo permitido de 5 MB.'
    : (err.message || 'Internal server error');

  res.status(statusCode).json({
    ok: false,
    message,
    errors: err.errors || null,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = { errorMiddleware };
