import express from 'express';
import { addInterestedEmail } from '../controllers/interestController';
import { resetTestUserItems } from '../controllers/itemsController';

const publicRouter = express.Router();

publicRouter.post('/interest', addInterestedEmail);
publicRouter.get('/cron/reset-test-items', resetTestUserItems);

export default publicRouter;
