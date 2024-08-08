import { body, validationResult } from 'express-validator';
import folderServices from '../services/folderService.js';

const folderController = {
  getFolders: async (req, res) => {
    try {
      const folders = await folderServices.getAllFolders(req.user.id);
      if (!folders) {
        return res.status(404).json({ error: 'Folders not found' });
      }
      res.json(folders);
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
    body('title', 'Title must be a minimum of 1 character')
      .trim()
      .isLength({ min: 3 })
      .escape(),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
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
          res.status(500).json({ error: error.message });
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
          res.status(500).json({ error: error.message });
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

  deleteTrashContents: async (req, res) => {
    try {
      const trashFolder = await folderServices.deleteTrashContents(
        req.body.folderId,
      );
      res.status(200).json(trashFolder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default folderController;
