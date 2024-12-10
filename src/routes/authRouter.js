import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/auth/signup', userController.createUser);

router.post('/auth/signin', userController.signinUser);

export default router;
