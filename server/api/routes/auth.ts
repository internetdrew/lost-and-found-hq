import express from 'express';
import {
  confirm,
  getUser,
  login,
  logout,
  signup,
} from '../controllers/authController';

const router = express.Router();

router.get('/confirm', confirm);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', getUser);

export default router;
