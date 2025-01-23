import { z } from 'zod';
import express from 'express';
import {
  getLocations,
  getLocation,
  addLocation,
  updateLocation,
  deleteLocation,
  validateLocationId,
  validateSubscription,
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
import { createCheckoutSession } from '../controllers/stripeController.js';
// import { createCheckoutSession } from '../controllers/stripeController.js';

const v1Router = express.Router();

/* Locations */
v1Router.get('/locations', getLocations);
v1Router.get(
  '/locations/:locationId',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  getLocation
);
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

/* Location Validation */
v1Router.get(
  '/locations/:locationId/exists',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  validateLocationId
);
v1Router.get(
  '/locations/:locationId/subscription',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  validateSubscription
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

export default v1Router;
