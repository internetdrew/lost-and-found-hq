import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello from auth routes');
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  res.send('Signup route');
});

router.post('/login', (req, res) => {
  console.log(req.body);
  res.send('Login route');
});

export default router;
