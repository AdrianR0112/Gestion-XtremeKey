const { z } = require("../utils/zod");

function getParseTarget(target, req) {
  if (target === "body") return req.body;
  if (target === "query") return req.query;
  if (target === "params") return req.params;
  return req.body;
}

function setParseTarget(target, req, value) {
  if (target === "body") req.body = value;
  if (target === "query") req.query = value;
  if (target === "params") req.params = value;
}

function validateMiddleware(schema, target = "body") {
  return (req, res, next) => {
    if (!schema || typeof schema.safeParse !== "function") {
      return next();
    }

    const result = schema.safeParse(getParseTarget(target, req));

    if (!result.success) {
      return res.status(400).json({
        ok: false,
        message: "Validation error",
        errors: result.error.issues.map((issue) => issue.message),
      });
    }

    setParseTarget(target, req, result.data);
    return next();
  };
}

module.exports = { validateMiddleware };
