import express from 'express';
import { addInterestedEmail } from '../controllers/interestController';
import {
  resetTestUserItems,
  getPublicItems,
  getPublicItem,
} from '../controllers/itemsController';

const publicRouter = express.Router();

publicRouter.post('/interest', addInterestedEmail);
publicRouter.get('/cron/reset-test-items', resetTestUserItems);
publicRouter.get('/locations/:locationId/items', getPublicItems);
publicRouter.get('/locations/:locationId/items/:itemId', getPublicItem);

export default publicRouter;
