import express from 'express';
import {
  confirm,
  getUser,
  login,
  logout,
  signup,
  startTestDrive,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/confirm', confirm);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', requireAuth, getUser);
router.post('/start-test-drive', startTestDrive);

export default router;
