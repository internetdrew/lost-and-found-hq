import { Request, Response } from 'express';
import { createSupabaseServerClient } from '../../lib/supabase.js';
import { EmailOtpType } from '@supabase/supabase-js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const supabase = createSupabaseServerClient(req, res);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Signup successful', email, password });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const supabase = createSupabaseServerClient(req, res);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      res.status(400).json({ error: error.message });
      return;
    }
    res
      .status(200)
      .json({ message: 'Login successful', redirectTo: '/dashboard' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseServerClient(req, res);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const confirm = async (req: Request, res: Response) => {
  try {
    const token_hash = req.query.token_hash;
    const type = req.query.type;
    const next = req.query.next ?? '/';

    if (token_hash && type) {
      const supabase = createSupabaseServerClient(req, res);
      const { error } = await supabase.auth.verifyOtp({
        type: type as EmailOtpType,
        token_hash: token_hash as string,
      });

      if (!error) {
        res.redirect(303, `/${next.toString().slice(1)}`);
        return;
      }
    }

    res.redirect(303, '/auth/auth-code-error');
  } catch (error) {
    console.error('Confirm error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const startTestDrive = async (req: Request, res: Response) => {
  const supabase = createSupabaseServerClient(req, res);

  if (
    !process.env.TEST_DRIVE_USER_EMAIL ||
    !process.env.TEST_DRIVE_USER_PASSWORD
  ) {
    throw new Error('Missing required credentials for test drive');
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_DRIVE_USER_EMAIL,
    password: process.env.TEST_DRIVE_USER_PASSWORD,
  });

  if (error) {
    console.error('Error starting test drive:', error);
    res.status(400).json({ error: error.message });
    return;
  }
  res
    .status(200)
    .json({ message: 'Test drive started', redirectTo: '/dashboard' });
};
