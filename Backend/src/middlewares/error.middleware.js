// Violacion de un CHECK en MariaDB: es un dato invalido enviado por el cliente,
// no un fallo del servidor.
const ER_CONSTRAINT_FAILED = 4025;

function resolveStatusCode(err) {
  if (err.statusCode) return err.statusCode;
  if (err.name === 'MulterError') return 400;
  if (err.errno === ER_CONSTRAINT_FAILED) return 400;
  return 500;
}

function resolveMessage(err) {
  if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
    return 'La imagen excede el tamano maximo permitido de 5 MB.';
  }

  if (err.errno === ER_CONSTRAINT_FAILED) {
    if (String(err.message).includes('chk_suscripciones_titular')) {
      return 'Una suscripcion debe tener exactamente un titular: un cliente o un revendedor.';
    }
    return 'Los datos enviados no cumplen una restriccion de la base de datos.';
  }

  return err.message || 'Internal server error';
}

function errorMiddleware(err, _req, res, _next) {
  const statusCode = resolveStatusCode(err);
  const message = resolveMessage(err);

  res.status(statusCode).json({
    ok: false,
    message,
    errors: err.errors || null,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = { errorMiddleware };
