import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import fileController from '../controllers/fileController.js';

const router = express.Router();

router.get('/files', authMiddleware, fileController.getAllFiles);

router.get('/files/:fileId', authMiddleware, fileController.downloadFile);

router.post(
  '/folders/:folderId/files',
  authMiddleware,
  fileController.uploadFiles,
);

router.post('/files/:fileId', authMiddleware, fileController.changeFileName);

router.put('/files/:fileId', authMiddleware, fileController.addFileToFolder);

router.delete('/files/:fileId', authMiddleware, fileController.deleteFile);

export default router;
