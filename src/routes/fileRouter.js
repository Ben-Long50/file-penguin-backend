import express from 'express';
import cors from 'cors';
import authMiddleware from '../middleware/authMiddleware.js';
import fileController from '../controllers/fileController.js';

const router = express.Router();

router.post(
  '/folders/:folderId/files',
  cors(),
  authMiddleware,
  fileController.uploadFiles,
);

router.get('/files', cors(), authMiddleware, fileController.getAllFiles);

router.get(
  '/files/:fileId',
  cors(),
  authMiddleware,
  fileController.downloadFile,
);

router.put(
  '/files/:fileId',
  cors(),
  authMiddleware,
  fileController.addFileToFolder,
);

router.delete(
  '/files/:fileId',
  cors(),
  authMiddleware,
  fileController.deleteFile,
);

export default router;
