const express = require('express');
const path = require('node:path');
const crypto = require('node:crypto');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

const { corsOptions } = require('./config/cors');
const { betterAuthHandler } = require('./auth/bridge');
const { apiRouter } = require('./routes/index.routes');
const { notFoundMiddleware } = require('./middlewares/notFound.middleware');
const { errorMiddleware } = require('./middlewares/error.middleware');
const { env } = require('./config/env');
const { importInitialDatabase } = require('./config/database');

const app = express();

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, message: 'Demasiados intentos de inicio de sesión. Intenta nuevamente en 15 minutos.' },
});

const authRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, message: 'Demasiadas solicitudes de autenticación. Intenta nuevamente en un minuto.' },
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.post(
  '/_internal/database/bootstrap',
  express.raw({ type: 'application/sql', limit: '2mb' }),
  async (req, res, next) => {
    try {
      if (!env.databaseBootstrapToken) {
        return res.status(404).json({ ok: false, message: 'Not found' });
      }

      const receivedToken = String(req.get('x-database-bootstrap-token') || '');
      const expectedToken = env.databaseBootstrapToken;
      const tokenIsValid = receivedToken.length === expectedToken.length
        && crypto.timingSafeEqual(Buffer.from(receivedToken), Buffer.from(expectedToken));

      if (!tokenIsValid) {
        return res.status(401).json({ ok: false, message: 'Unauthorized' });
      }

      const sql = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '';
      if (!sql.trim()) {
        return res.status(400).json({ ok: false, message: 'SQL dump is required' });
      }

      await importInitialDatabase(sql);
      return res.status(201).json({ ok: true, message: 'Database initialized' });
    } catch (error) {
      return next(error);
    }
  }
);
app.use('/api/v1/staff-auth/login', loginRateLimit);
app.use('/api/v1/auth', authRateLimit);
app.all('/api/v1/auth', betterAuthHandler);
app.all('/api/v1/auth/*', betterAuthHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
});

app.use('/api/v1', apiRouter);

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../../Frontend/dist');
  app.use(express.static(frontendDist, {
    index: false,
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('sw.js') || filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/') || req.path === '/health') {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache');
    return res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = { app };
