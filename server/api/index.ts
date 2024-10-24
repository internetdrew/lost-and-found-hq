import express, { Request, Response } from 'express';
import cors from 'cors';
import { PORT } from './config';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.send('Hello from Lost & Found HQ API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
