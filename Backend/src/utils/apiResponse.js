function successResponse(data = null, message = 'OK') {
  return { ok: true, message, data };
}

function errorResponse(message = 'Error', errors = null) {
  return { ok: false, message, errors };
}

module.exports = { successResponse, errorResponse };
