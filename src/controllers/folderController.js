import { body, validationResult } from 'express-validator';
import folderServices from '../services/folderService.js';
import fileServices from '../services/fileService.js';

const folderController = {
  getFolders: async (req, res) => {
    try {
      const folders = await folderServices.getAllFolders(req.user.id);
      if (!folders) {
        return res.status(404).json({ error: 'Folders not found' });
      }
      res.status(200).json(folders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getFolderContents: async (req, res) => {
    try {
      const folderId = Number(req.params.folderId);
      const folderData = await folderServices.getFolderContents(folderId);

      if (!folderData) {
        return res.status(404).json({ error: 'Folders and files not found' });
      }
      res.status(200).json(folderData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createFolder: [
    body('title', 'Title must be a minimum of 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        try {
          const folderData = {
            title: req.body.title,
            owner: {
              connect: { id: req.user.id },
            },
            ...(req.body.parentFolderId && {
              parentFolder: {
                connect: { id: req.body.parentFolderId },
              },
            }),
          };
          const folders = await folderServices.createFolder(folderData);
          res.status(200).json(folders);
        } catch (error) {
          res.status(500).json([{ msg: error.message }]);
        }
      }
    },
  ],

  changeFolderName: [
    body('folderTitle', 'Name must be a minimum of 1 character')
      .trim()
      .isLength({ min: 1 })
      .escape(),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
      } else {
        try {
          const folder = await folderServices.changeFolderName(
            req.body.folderId,
            req.body.folderTitle,
          );
          res.status(200).json(folder.title);
        } catch (error) {
          res.status(500).json([{ msg: error.message }]);
        }
      }
    },
  ],

  addFolderToFolder: async (req, res) => {
    try {
      const parentFolder = await folderServices.addFolderToFolder(
        req.body.folderId,
        req.body.childId,
      );
      res.status(200).json(parentFolder);
    } catch (error) {
      res.status(500).json([{ msg: error.message }]);
    }
  },

  deleteFolderAndContents: async (req, res) => {
    try {
      const folderContents = await folderServices.getNestedContents(
        req.body.folderId,
      );

      const deleteFilePromises = folderContents.fileIds.map(async (id) =>
        fileServices.deleteFile(id),
      );

      await Promise.all(deleteFilePromises);

      await folderServices.deleteFolder(req.body.folderId);

      res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
      console.error(error.message);

      res.status(500).json({ error: error.message });
    }
  },

  deleteTrashContents: async (req, res) => {
    try {
      const trashContents = await folderServices.getNestedContents(
        req.body.folderId,
      );
      const deleteFilePromises = trashContents.fileIds.map(async (id) =>
        fileServices.deleteFile(id),
      );

      await Promise.all(deleteFilePromises);

      const foldersToDelete = trashContents.folderIds.slice(1);

      const trashFolder = await folderServices.deleteFolders(
        req.body.folderId,
        foldersToDelete,
      );

      res.status(200).json({ trashFolder, message: 'Trash contents deleted' });
    } catch (error) {
      console.error(error.message);

      res.status(500).json({ error: error.message });
    }
  },
};

export default folderController;
