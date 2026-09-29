const { env } = require('./env');

const corsOptions = {
<<<<<<< Updated upstream
  origin: env.corsOrigin,
=======
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
>>>>>>> Stashed changes
  credentials: true
};

module.exports = { corsOptions };
