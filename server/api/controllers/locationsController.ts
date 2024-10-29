import { Request, Response } from 'express';
import { createSupabaseServerClient } from '../../lib/supabase';
import { AuthenticatedRequest } from '../middleware/auth';

export const addLocation = async (req: Request, res: Response) => {
  const supabase = createSupabaseServerClient(req, res);
  const { data, error } = await supabase.from('locations').insert({
    user_id: (req as AuthenticatedRequest).user.id,
    name: req.body.name,
    address: req.body.streetAddress,
    city: req.body.city,
    state: req.body.state,
    postal_code: req.body.zipCode,
  });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseServerClient(req, res);
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .limit(1);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseServerClient(req, res);
    const { data, error } = await supabase
      .from('locations')
      .update({
        name: req.body.name,
        address: req.body.streetAddress,
        city: req.body.city,
        state: req.body.state,
        postal_code: req.body.zipCode,
      })
      .eq('id', req.body.id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseServerClient(req, res);
    const { data, error } = await supabase
      .from('locations')
      .delete()
      .eq('id', req.params.id);
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
