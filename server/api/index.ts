import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import authRouter from './routers/auth';
import v1Router from './routers/v1';
import { requireAuth } from './middleware/auth';
import { addInterestedEmail } from './controllers/interestController';
import { initializeCronJobs } from './cron-jobs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/api/v1', requireAuth, v1Router);

app.post('/interest', addInterestedEmail);

initializeCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
