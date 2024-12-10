import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/status', (req, res) =>
  res.status(200).json({ message: 'Service is running' }),
);

router.post('/auth/signup', userController.createUser);

router.post('/auth/signin', userController.signinUser);

export default router;
