import { User } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '../../lib/supabase.js';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user: User;
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
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
