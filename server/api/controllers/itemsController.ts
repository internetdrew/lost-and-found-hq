import { Request, Response } from 'express';
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
} from '../../lib/supabase';
import { AuthenticatedRequest } from '../middleware/auth';

export const getItems = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseServerClient(req, res);
    const locationId = req.params.locationId;

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: true });

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

export const getItem = async (req: Request, res: Response) => {
  const itemId = req.params.id;

  if (!itemId) {
    res.status(400).json({ error: 'Item ID is required' });
    return;
  }

  try {
    const supabase = createSupabaseServerClient(req, res);
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching item:', error);
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

export const updateItem = async (req: Request, res: Response) => {
  const itemId = req.params.id;

  if (!itemId) {
    res.status(400).json({ error: 'Item ID is required' });
    return;
  }

  try {
    const supabase = createSupabaseServerClient(req, res);
    const { data, error } = await supabase
      .from('items')
      .update({
        title: req.body.title,
        location_id: req.body.locationId,
        brief_description: req.body.briefDescription,
        found_at: req.body.foundAt,
        category: req.body.category,
        date_found: req.body.dateFound,
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleItemActiveStatus = async (req: Request, res: Response) => {
  const itemId = req.params.id;

  if (!itemId) {
    res.status(400).json({ error: 'Item ID is required' });
    return;
  }

  try {
    const supabase = createSupabaseServerClient(req, res);
    const { data, error } = await supabase
      .from('items')
      .update({ is_public: req.body.isPublic })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('Error toggling item active status:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error toggling item active status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  const itemId = req.params.id;

  if (!itemId) {
    res.status(400).json({ error: 'Item ID is required' });
    return;
  }

  try {
    const supabase = createSupabaseServerClient(req, res);
    const { data, error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const clearTestUserItems = async (req: Request, res: Response) => {
  if (!process.env.TEST_DRIVE_USER_EMAIL) {
    throw new Error('TEST_DRIVE_USER_EMAIL not configured');
  }
  try {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log('Unauthorized for auth header:', req.headers.authorization);
      res.status(401).end('Unauthorized');
      return;
    }

    const supabase = createSupabaseAdminClient();

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', process.env.TEST_DRIVE_USER_EMAIL)
      .single();

    if (userError || !userData) {
      console.error('Error finding test user:', userError);
      return;
    }

    const { data: testUserItemIds } = await supabase
      .from('items')
      .select('id')
      .eq('added_by_user_id', userData.id);

    const { error: deleteError } = await supabase
      .from('items')
      .delete()
      .in('id', testUserItemIds?.map(item => item.id) || []);

    if (deleteError) {
      console.error('Error clearing test items:', deleteError);
      return;
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Error in clearTestUserItems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
