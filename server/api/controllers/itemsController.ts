import { Request, Response } from 'express';
import { createSupabaseServerClient } from '../../lib/supabase';
import { AuthenticatedRequest } from '../middleware/auth';

export const getItems = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseServerClient(req, res);
    const { data, error } = await supabase.from('items').select('*');

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseServerClient(req, res);
    const userId = (req as AuthenticatedRequest).user.id;

    const { data, error } = await supabase
      .from('items')
      .insert({
        title: req.body.title,
        location_id: req.body.locationId,
        added_by_user_id: userId,
        found_at: req.body.foundAt,
        category: req.body.category,
        date_found: req.body.dateFound,
        brief_description: req.body.briefDescription,
        status: 'pending',
        is_public: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
