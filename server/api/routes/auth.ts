import express from 'express';
import { confirm, login, signup } from '../controllers/authController';

const router = express.Router();

router.get('/confirm', confirm);
router.post('/signup', signup);
router.post('/login', login);

export default router;
