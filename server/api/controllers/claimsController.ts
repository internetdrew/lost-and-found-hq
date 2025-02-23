import { Request, Response } from 'express';
import { createSupabaseAdminClient } from '../../lib/supabase.js';

export const addNewClaim = async (req: Request, res: Response) => {
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from('item_claims')
      .insert({
        item_id: req.body.itemId,
        location_id: req.body.locationId,
        claimant_first_name: req.body.firstName,
        claimant_last_name: req.body.lastName,
        claimant_email: req.body.email,
        claim_details: req.body.itemDetails,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
