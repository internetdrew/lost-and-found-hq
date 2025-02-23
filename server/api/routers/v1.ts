import { z } from 'zod';
import express from 'express';
import {
  addLocation,
  updateLocation,
  deleteLocation,
  validateSubscription,
  getSubscriptionDetails,
  getUserLocations,
} from '../controllers/locationsController.js';
import {
  addItem,
  deleteItem,
  getItems,
  getItem,
  toggleItemActiveStatus,
  updateItem,
} from '../controllers/itemsController.js';
import { validateRequest } from '../middleware/validate.js';
import { locationSchema } from '../../../shared/schemas/location.js';
import { itemSchema } from '../../../shared/schemas/item.js';
import {
  createBillingPortalSession,
  createCheckoutSession,
  createPortalSession,
} from '../controllers/stripeController.js';
import { standardApiLimiter } from '../middleware/apiLimiter.js';

const v1Router = express.Router();
v1Router.use(standardApiLimiter);

/* Locations */
v1Router.get('/locations', getUserLocations);

v1Router.post(
  '/locations',
  validateRequest({ body: locationSchema }),
  addLocation
);
v1Router.patch(
  '/locations/:locationId',
  validateRequest({
    params: z.object({ locationId: z.string().uuid() }),
    body: locationSchema,
  }),
  updateLocation
);
v1Router.delete(
  '/locations/:locationId',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  deleteLocation
);

v1Router.get(
  '/locations/:locationId/subscription',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  validateSubscription
);
v1Router.get(
  '/locations/:locationId/subscription-details',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  getSubscriptionDetails
);

/* Location's Items */
v1Router.get(
  '/locations/:locationId/items',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  getItems
);

v1Router.get(
  '/locations/:locationId/items/:itemId',
  validateRequest({
    params: z.object({
      locationId: z.string().uuid(),
      itemId: z.string(),
    }),
  }),
  getItem
);
v1Router.post(
  '/locations/:locationId/items',
  validateRequest({
    params: z.object({ locationId: z.string().uuid() }),
    body: itemSchema,
  }),
  addItem
);
v1Router.put(
  '/locations/:locationId/items/:itemId',
  validateRequest({
    params: z.object({
      locationId: z.string().uuid(),
      itemId: z.string(),
    }),
    body: itemSchema,
  }),
  updateItem
);
v1Router.delete(
  '/locations/:locationId/items/:itemId',
  validateRequest({
    params: z.object({
      locationId: z.string().uuid(),
      itemId: z.string(),
    }),
  }),
  deleteItem
);

v1Router.patch(
  '/locations/:locationId/items/:itemId/status',
  validateRequest({
    params: z.object({
      locationId: z.string().uuid(),
      itemId: z.string(),
    }),
    body: z.object({ isPublic: z.boolean() }),
  }),
  toggleItemActiveStatus
);

/* Stripe */
v1Router.post(
  '/stripe/create-checkout-session',
  validateRequest({
    body: z.object({ lookup_key: z.string(), locationId: z.string().uuid() }),
  }),
  createCheckoutSession
);

v1Router.post(
  '/stripe/create-portal-session',
  validateRequest({ body: z.object({ sessionId: z.string() }) }),
  createPortalSession
);

v1Router.post(
  '/stripe/create-billing-portal-session',
  validateRequest({ body: z.object({ stripeCustomerId: z.string() }) }),
  createBillingPortalSession
);

export default v1Router;
