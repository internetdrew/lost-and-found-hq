import cron from 'node-cron';
import { clearTestUserItems } from '../controllers/itemsController';

export const initializeCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled job to clear test user items');
    await clearTestUserItems();
  });
};
