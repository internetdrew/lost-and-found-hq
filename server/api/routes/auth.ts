import express, { Request, Response } from 'express';
import { createClient } from '../../lib/supabase';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    res.status(200).json({ message: 'Signup successful', email, password });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', (req, res) => {
  console.log(req.body);
  res.send('Login route');
});

export default router;
