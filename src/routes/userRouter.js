import express from 'express';
import cors from 'cors';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/users/signup', cors(), userController.createUser);

router.post('/users/signin', cors(), userController.signinUser);

export default router;
