import express from 'express';
import {
  confirm,
  getUser,
  login,
  logout,
  signup,
} from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/confirm', confirm);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', requireAuth, getUser);

export default router;
