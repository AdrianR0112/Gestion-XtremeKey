let authModulePromise;

function loadAuthModule() {
  if (!authModulePromise) {
    authModulePromise = import("./auth.mjs");
  }

  return authModulePromise;
}

async function betterAuthHandler(req, res, next) {
  try {
    const { authHandler } = await loadAuthModule();
    return authHandler(req, res, next);
  } catch (error) {
    return next(error);
  }
}

async function getBetterAuthSession(req) {
  const { getSessionFromRequest } = await loadAuthModule();
  return getSessionFromRequest(req);
}

async function getBetterAuthInstance() {
  const { auth } = await loadAuthModule();
  return auth;
}

module.exports = {
  betterAuthHandler,
  getBetterAuthSession,
  getBetterAuthInstance,
};
