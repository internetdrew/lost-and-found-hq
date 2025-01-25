import { Request, Response } from 'express';
import { createSupabaseAdminClient } from '../../lib/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const addLocation = async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user.id;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from('locations').insert({
    user_id: userId,
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
    const supabase = createSupabaseAdminClient();
    const userId = (req as AuthenticatedRequest).user.id;

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error fetching locations:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', req.params.locationId)
      .eq('user_id', userId)
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('locations')
      .update({
        name: req.body.name,
        address: req.body.streetAddress,
        city: req.body.city,
        state: req.body.state,
        postal_code: req.body.zipCode,
      })
      .eq('id', req.params.locationId)
      .eq('user_id', userId)
      .select('address, city, state, postal_code, name')
      .single();

    if (error) {
      console.error('Error updating location:', error);
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
    const userId = (req as AuthenticatedRequest).user.id;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('locations')
      .delete()
      .eq('id', req.params.locationId)
      .eq('user_id', userId)
      .select('id, name, address, city, state, postal_code')
      .single();

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

export const validateLocationId = async (req: Request, res: Response) => {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('locations')
    .select('id')
    .eq('id', req.params.locationId)
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(!!data);
};

export const validateSubscription = async (req: Request, res: Response) => {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('current_period_end, canceled_at')
    .eq('location_id', req.params.locationId)
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  const isValid =
    data &&
    (!data.canceled_at || new Date(data.current_period_end) > new Date());

  res.json(isValid);
};
