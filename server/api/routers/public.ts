import express from 'express';
import { addInterestedEmail } from '../controllers/interestController.js';
import {
  resetTestUserItems,
  getPublicItems,
  getPublicItem,
} from '../controllers/itemsController.js';
import { createWebhook } from '../controllers/stripeController.js';

const publicRouter = express.Router();

publicRouter.post('/interest', addInterestedEmail);
publicRouter.get('/cron/reset-test-items', resetTestUserItems);
publicRouter.get('/locations/:locationId/items', getPublicItems);
publicRouter.get('/locations/:locationId/items/:itemId', getPublicItem);

publicRouter.post('/stripe/webhook', createWebhook);

export default publicRouter;
