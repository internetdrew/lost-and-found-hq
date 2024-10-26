import express, { Request, Response } from 'express';
import cors from 'cors';
import { PORT } from './config';
import authRoutes from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req: Request, res: Response) => {
  res.send('Hello from Lost & Found HQ API!');
});

// Auth routes
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
