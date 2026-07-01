const express = require('express');
const path = require('node:path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const { corsOptions } = require('./config/cors');
const { betterAuthHandler } = require('./auth/bridge');
const { apiRouter } = require('./routes/index.routes');
const { notFoundMiddleware } = require('./middlewares/notFound.middleware');
const { errorMiddleware } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.all('/api/v1/auth', betterAuthHandler);
app.all('/api/v1/auth/*', betterAuthHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
});

app.use('/api/v1', apiRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = { app };
