import express from 'express';
import cors from 'cors';
import userController from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/users/signup', cors(), authMiddleware, userController.createUser);

router.get('/users/signin', cors());

export default router;
