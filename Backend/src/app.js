const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const { corsOptions } = require('./config/cors');
const { apiRouter } = require('./routes/index.routes');
const { notFoundMiddleware } = require('./middlewares/notFound.middleware');
const { errorMiddleware } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
});

app.use('/api/v1', apiRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = { app };
