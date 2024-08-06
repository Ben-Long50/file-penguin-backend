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

  getContentsInFolder: async (req, res) => {
    try {
      const folderId = Number(req.params.folderId);
      const [folders, files] = await Promise.all([
        folderServices.getFoldersInFolder(folderId),
        folderServices.getFilesInFolder(folderId),
      ]);
      if (!folders && !files) {
        return res.status(404).json({ error: 'Folders and files not found' });
      }
      res.status(200).json({ folders, files });
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
          };

          const newFolder = await folderServices.createFolder(folderData);
          res.status(200).json(newFolder);
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

  addChildToFolder: async (req, res) => {
    try {
      const parentFolder = await folderServices.addChildToFolder(
        req.body.folderId,
        req.body.childId,
      );
      res.status(200).json(parentFolder);
    } catch (error) {
      res.status(500).json([{ msg: error.message }]);
    }
  },

  deleteFolder: async (req, res) => {
    try {
      const folder = await folderServices.deleteFolder(req.body.folderId);
      res.status(200).json(folder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default folderController;
