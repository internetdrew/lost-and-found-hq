import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import authRouter from './routers/auth';
import v1Router from './routers/v1';
import { requireAuth } from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/api/v1', requireAuth, v1Router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
