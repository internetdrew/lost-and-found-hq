import { Request, Response } from 'express';
import { createClient } from '../../lib/supabase';
import { EmailOtpType } from '@supabase/supabase-js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const supabase = createClient(req, res);

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
    const supabase = createClient(req, res);
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
    const supabase = createClient(req, res);
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
      const supabase = createClient(req, res);
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
    const supabase = createClient(req, res);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
