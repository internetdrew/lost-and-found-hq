import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import authRouter from './routers/auth.js';
import v1Router from './routers/v1.js';
import { requireAuth } from './middleware/auth.js';
import publicRouter from './routers/public.js';
import compression from 'compression';
import helmet from 'helmet';

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(compression());
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/api/v1', requireAuth, v1Router);
app.use('/api/public', publicRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
