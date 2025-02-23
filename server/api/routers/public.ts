import express from 'express';
import { addInterestedEmail } from '../controllers/interestController.js';
import {
  resetTestUserItems,
  getPublicItems,
  getPublicItem,
  getItem,
} from '../controllers/itemsController.js';
import { createWebhook } from '../controllers/stripeController.js';
import { validateRequest } from '../middleware/validate.js';
import {
  getLocation,
  validateLocationId,
  validateSubscription,
} from '../controllers/locationsController.js';
import { z } from 'zod';
import { addNewClaim } from '../controllers/claimsController.js';
import { sensitiveRouteLimiter } from '../middleware/apiLimiter.js';

const publicRouter = express.Router();

publicRouter.post('/interest', sensitiveRouteLimiter, addInterestedEmail);
publicRouter.get('/cron/reset-test-items', resetTestUserItems);
publicRouter.get('/locations/:locationId/items', getPublicItems);
publicRouter.get('/locations/:locationId/items/:itemId', getPublicItem);

publicRouter.post('/stripe/webhook', sensitiveRouteLimiter, createWebhook);

publicRouter.get(
  '/locations/:locationId',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  getLocation
);

publicRouter.get(
  '/locations/:locationId/exists',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  validateLocationId
);

publicRouter.get(
  '/locations/:locationId/subscription',
  validateRequest({ params: z.object({ locationId: z.string().uuid() }) }),
  validateSubscription
);

/* Item Claims */
publicRouter.get(
  '/locations/:locationId/items/:itemId',
  validateRequest({
    params: z.object({ locationId: z.string().uuid(), itemId: z.string() }),
  }),
  getItem
);

publicRouter.post(
  '/items/claim',
  validateRequest({
    body: z.object({
      itemId: z.number(),
      locationId: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      itemDetails: z.string(),
    }),
  }),
  sensitiveRouteLimiter,
  addNewClaim
);

export default publicRouter;
