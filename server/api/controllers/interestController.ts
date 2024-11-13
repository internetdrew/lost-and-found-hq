import { Request, Response } from 'express';
import { createSupabaseServerClient } from '../../lib/supabase';

export const addInterestedEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  const supabase = createSupabaseServerClient(req, res);

  const { error } = await supabase.from('interested_parties').insert({
    email_address: email,
  });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ message: 'Interested party added' });
};
