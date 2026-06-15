const { env } = require('./env');

const corsOptions = {
  origin: env.corsOrigin,
  credentials: true
};

module.exports = { corsOptions };
