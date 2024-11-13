import express from 'express';
import { addInterestedEmail } from '../controllers/interestController';
import { clearTestUserItems } from '../controllers/itemsController';

const publicRouter = express.Router();

publicRouter.post('/interest', addInterestedEmail);
publicRouter.get('/cron/purge-test-items', clearTestUserItems);

export default publicRouter;
