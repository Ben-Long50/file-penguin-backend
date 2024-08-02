import express from 'express';
import cors from 'cors';
import authMiddleware from '../middleware/authMiddleware.js';
import fileController from '../controllers/fileController.js';

const router = express.Router();

router.post('/files', cors(), authMiddleware, fileController.uploadFile);

router.get('/files', cors(), authMiddleware, fileController.getAllFilesByUser);

router.get(
  '/files/:fileId',
  cors(),
  authMiddleware,
  fileController.downloadFile,
);

router.delete(
  '/files/:fileId',
  cors(),
  authMiddleware,
  fileController.deleteFile,
);

export default router;
