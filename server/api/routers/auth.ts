import express from 'express';
import {
  confirm,
  getUser,
  login,
  logout,
  signup,
  startTestDrive,
} from '../controllers/authController.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = express.Router();

router.get('/confirm', confirm);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', requireAuth, getUser);
router.post('/start-test-drive', startTestDrive);

export default router;
