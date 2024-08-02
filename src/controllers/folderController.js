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
      const [folders, files] = Promise.all([
        folderServices.getFoldersInFolder(req.params.folderId),
        folderServices.getFilesInFolder(req.params.folderId),
      ]);
      if (!folders && !files) {
        return res.status(404).json({ error: 'Folders and files not found' });
      }
      res.json({ folders, files });
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
        res.status(400).json(errors.array());
      } else {
        try {
          const folderData = {
            title: req.body.title,
            ownerId: req.user.id,
          };
          const newFolder = await folderServices.createUser(folderData);
          res.status(200).json(newFolder);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    },
  ],

  deleteFolder: async (req, res) => {
    try {
      const folder = await folderServices.deleteFolder(req.params.folderId);
      res.status(200).json(folder);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default folderController;
