import { User } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '../../lib/supabase';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user: User | null;
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supabase = createSupabaseServerClient(req, res);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
