import express from 'express';
import cors from 'cors';
import { PORT } from './config.ts';
import authRouter from './routers/auth.ts';
import v1Router from './routers/v1.ts';
import { requireAuth } from './middleware/auth.ts';
import publicRouter from './routers/public.ts';
import compression from 'compression';
import helmet from 'helmet';

const app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL
      : ['http://localhost:5173', 'http://localhost:3000'],
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
