import { Request, Response } from 'express';
import { createSupabaseAdminClient } from '../../lib/supabase.js';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error(
    'STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET must be defined'
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

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

export const createWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event;

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    res.status(400).send('Webhook Error: Missing signature or endpoint secret');
    return;
  }
  console.log('request body: ', req.body);
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Error constructing event: ', err);
    if (err instanceof Error) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    res.status(400).send(`Webhook Error: Unknown error occurred`);
    return;
  }

  let subscription;

  switch (event.type) {
    case 'customer.subscription.updated':
      {
        subscription = event.data.object;

        const supabase = createSupabaseAdminClient();
        const periodStart = new Date(
          subscription.current_period_start * 1000
        ).toISOString();
        const periodEnd = new Date(
          subscription.current_period_end * 1000
        ).toISOString();
        const canceledAt = subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : null;

        const { error } = await supabase
          .from('subscriptions')
          .upsert(
            {
              location_id: subscription.metadata.location_id,
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              stripe_price_id: subscription.items.data[0].price.id,
              current_period_start: periodStart,
              current_period_end: periodEnd,
              canceled_at: canceledAt,
            },
            {
              onConflict: 'location_id',
            }
          )
          .select();

        if (error) {
          console.error('Error updating location subscription: ', error);
        }
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200);
  return;
};

export const createBillingPortalSession = async (
  req: Request,
  res: Response
) => {
  const { stripeCustomerId } = req.body;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${APP_DOMAIN}/dashboard`,
  });

  res.json({ url: portalSession.url });
};
