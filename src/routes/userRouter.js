import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/users/signup', userController.createUser);

router.post('/users/signin', userController.signinUser);

export default router;
