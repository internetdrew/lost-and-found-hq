import { Request, Response } from 'express';
import { createClient } from '../../lib/supabase';
import { EmailOtpType } from '@supabase/supabase-js';

export const signup = async (req: Request, res: Response) => {
  console.log('signup route hit');
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
  console.log(req.body);
  res.send('Login route');
};

export const confirm = async (req: Request, res: Response) => {
  console.log('confirm route hit');
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

    // return the user to an error page with some instructions
    res.redirect(303, '/auth/auth-code-error');
  } catch (error) {
    console.error('Confirm error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
