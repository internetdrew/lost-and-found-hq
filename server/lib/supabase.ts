import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import { Request, Response } from 'express';
import { Database } from '../database.types';

export const createSupabaseServerClient = (req: Request, res: Response) => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing required environment variables for Supabase');
  }

  return createServerClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.appendHeader(
              'Set-Cookie',
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );
};
