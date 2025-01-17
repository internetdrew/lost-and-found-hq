import { Request, Response } from 'express';
import { createSupabaseAdminClient } from '../../lib/supabase';
import { AuthenticatedRequest } from '../middleware/auth';

export const getItems = async (req: Request, res: Response) => {
  const locationId = req.params.locationId;

  if (!locationId) {
    res.status(400).json({ error: 'Location ID is required' });
    return;
  }

  try {
    const supabase = createSupabaseAdminClient();

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
  const itemId = req.params.itemId;
  const locationId = req.params.locationId;

  if (!itemId || !locationId) {
    res.status(400).json({ error: 'Item ID and location ID are required' });
    return;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('location_id', locationId)
      .eq('id', itemId)
      .single();

    if (error) {
      console.error('Supabase error fetching item:', error);
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
  const locationId = req.params.locationId;

  if (!locationId) {
    res.status(400).json({ error: 'Location ID is required' });
    return;
  }

  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('items')
      .insert({
        title: req.body.title,
        location_id: locationId,
        added_by_user_id: userId,
        found_at: req.body.foundAt,
        category: req.body.category,
        date_found: req.body.dateFound,
        brief_description: req.body.briefDescription,
        staff_details: req.body.staffDetails,
        status: 'pending',
        is_public: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error adding item:', error);
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
  const locationId = req.params.locationId;
  const itemId = req.params.itemId;

  if (!locationId || !itemId) {
    res.status(400).json({ error: 'Location ID and item ID are required' });
    return;
  }

  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('items')
      .update({
        title: req.body.title,
        location_id: locationId,
        brief_description: req.body.briefDescription,
        staff_details: req.body.staffDetails,
        found_at: req.body.foundAt,
        category: req.body.category,
        date_found: req.body.dateFound,
        added_by_user_id: userId,
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating item:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  const itemId = req.params.itemId;

  if (!itemId) {
    res.status(400).json({ error: 'Item ID is required' });
    return;
  }

  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)
      .eq('added_by_user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error deleting item:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleItemActiveStatus = async (req: Request, res: Response) => {
  const locationId = req.params.locationId;
  const itemId = req.params.itemId;

  if (!locationId || !itemId) {
    res.status(400).json({ error: 'Location ID and item ID are required' });
    return;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('items')
      .update({ is_public: req.body.isPublic })
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error toggling item active status:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error toggling item active status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetTestUserItems = async (req: Request, res: Response) => {
  if (!process.env.TEST_DRIVE_USER_EMAIL) {
    throw new Error('TEST_DRIVE_USER_EMAIL not configured');
  }

  try {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized for auth header:', req.headers.authorization);
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

    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .select('id')
      .eq('user_id', userData.id)
      .single();

    if (locationError || !locationData) {
      console.error('Error finding location:', locationError);
      return;
    }

    const { error: newItemsError } = await supabase.from('items').insert([
      {
        title: 'Utility Belt',
        added_by_user_id: userData.id,
        brief_description:
          'A utility belt with a few tools. It has a winged creature on the buckle.',
        staff_details: 'I think this might be for the caped crusader.',
        category: 'clothing',
        date_found: new Date().toISOString(),
        found_at: 'Under the Batmobile',
        is_public: true,
        location_id: locationData.id,
        status: 'pending',
      },
      {
        title: 'Playing Card',
        added_by_user_id: userData.id,
        brief_description:
          'A Joker playing card. It has a red and black pattern. And a note on the back.',
        staff_details:
          'I think I saw the guy with the green hair who is always laughing drop this. Beware!',
        category: 'other',
        date_found: new Date().toISOString(),
        found_at: 'In the Bat...levator',
        is_public: true,
        location_id: locationData.id,
        status: 'pending',
      },
    ]);

    if (newItemsError) {
      console.error('Error adding cron items:', newItemsError);
      return;
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error('Error in clearTestUserItems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPublicItems = async (req: Request, res: Response) => {
  const locationId = req.params.locationId;

  if (!locationId) {
    res.status(400).json({ error: 'Location ID is required' });
    return;
  }

  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('items')
      .select(
        `
        id,
        title,
        brief_description,
        category,
        date_found,
        found_at,
        is_public,
        location_id,
        status,
        created_at
      `
      )
      .eq('location_id', locationId)
      .eq('is_public', true)
      .order('created_at', { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching public items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPublicItem = async (req: Request, res: Response) => {
  const itemId = req.params.itemId;
  const locationId = req.params.locationId;

  if (!itemId || !locationId) {
    res.status(400).json({ error: 'Item ID and location ID are required' });
    return;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('items')
      .select(
        `
        id,
        title,
        brief_description,
        category,
        date_found,
        found_at,
        is_public,
        location_id,
        status,
        created_at
      `
      )
      .eq('location_id', locationId)
      .eq('id', itemId)
      .eq('is_public', true)
      .single();

    if (error) {
      console.error('Supabase error fetching public item:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching public item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
