import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import folderController from '../controllers/folderController.js';

const router = express.Router();

router.post('/folders', authMiddleware, folderController.createFolder);

router.get('/folders', authMiddleware, folderController.getFolders);

router.get(
  '/folders/:folderId',
  authMiddleware,
  folderController.getFolderContents,
);

router.post(
  '/folders/:folderId',
  authMiddleware,
  folderController.changeFolderName,
);

router.put(
  '/folders/:folderId',
  authMiddleware,
  folderController.addFolderToFolder,
);

router.delete(
  '/folders/:folderId',
  authMiddleware,
  folderController.deleteTrashContents,
);

export default router;
