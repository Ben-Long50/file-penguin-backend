import express from 'express';
import cors from 'cors';
import authMiddleware from '../middleware/authMiddleware.js';
import folderController from '../controllers/folderController.js';

const router = express.Router();

router.post('/folders', cors(), authMiddleware, folderController.createFolder);

router.get('/folders', cors(), authMiddleware, folderController.getFolders);

router.get(
  '/folders/:folderId',
  cors(),
  authMiddleware,
  folderController.getFolderContents,
);

router.post(
  '/folders/:folderId',
  cors(),
  authMiddleware,
  folderController.changeFolderName,
);

router.put(
  '/folders/:folderId',
  cors(),
  authMiddleware,
  folderController.addFolderToFolder,
);

router.delete(
  '/folders/:folderId',
  cors(),
  authMiddleware,
  folderController.deleteTrashContents,
);

export default router;
