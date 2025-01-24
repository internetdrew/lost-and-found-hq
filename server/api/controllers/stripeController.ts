import { Request, Response } from 'express';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const APP_DOMAIN = process.env.CLIENT_URL;

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { lookup_key, locationId } = req.body;
    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
      active: true,
    });

    if (!prices.data.length) {
      res.status(404).json({ error: 'Price not found' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${APP_DOMAIN}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_DOMAIN}/dashboard?canceled=true`,
      payment_method_types: ['card'],
      subscription_data: {
        metadata: {
          location_id: locationId,
        },
      },
    });

    if (!session.url) {
      res.status(500).json({ error: 'Failed to create checkout session' });
      return;
    }
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPortalSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    const returnUrl = `${APP_DOMAIN}/dashboard`;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: returnUrl,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
