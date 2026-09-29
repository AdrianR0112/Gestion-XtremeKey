const express = require('express');
const path = require('node:path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

const { corsOptions } = require('./config/cors');
const { betterAuthHandler } = require('./auth/bridge');
const { apiRouter } = require('./routes/index.routes');
const { notFoundMiddleware } = require('./middlewares/notFound.middleware');
const { errorMiddleware } = require('./middlewares/error.middleware');

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
