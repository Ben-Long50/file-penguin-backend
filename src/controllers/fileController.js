import { body, validationResult } from 'express-validator';
import fileServices from '../services/fileService.js';
import { upload, checkFileCount } from '../utils/multer.js';
import uploadToCloudinary from '../utils/cloudinary.js';

const fileController = {
  getAllFiles: async (req, res) => {
    try {
      const files = await fileServices.getAllFilesByUser(req.user.id);
      res.status(200).json({ files });
    } catch (error) {
      res.send(500).json({ error: error.message });
    }
  },

  uploadFiles: [
    upload.array('file'),
    checkFileCount,
    uploadToCloudinary,
    async (req, res) => {
      const parseTitle = (title, format) => {
        const parsedTitle = title.split('-').slice(1);
        const newTitle = parsedTitle.join('-').concat(`.${format}`);
        return newTitle;
      };
      try {
        const filesData = req.fileUrls.map((url) => ({
          ownerId: req.user.id,
          folderId: Number(req.params.folderId),
          url: url.secure_url,
          uploadId: url.public_id,
          title: parseTitle(url.original_filename, url.format),
          ext: url.format,
        }));
        const uploadedFiles = await Promise.all(
          filesData.map((data) => fileServices.createFile(data)),
        );
        res.status(200).json(uploadedFiles);
      } catch (error) {
        res.status(500).json([{ msg: error.message }]);
      }
    },
  ],

  downloadFile: async (req, res) => {
    try {
      const file = await fileServices.getFile(req.params.fileId);
      res.status(200).json({ url: file.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  changeFileName: [
    body('fileTitle', 'Name must be a minimum of 1 character')
      .trim()
      .isLength({ min: 1 })
      .escape(),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
      } else {
        try {
          const file = await fileServices.changeFileName(
            req.body.fileId,
            req.body.fileTitle,
          );
          res.status(200).json(file);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    },
  ],

  addFileToFolder: async (req, res) => {
    try {
      const updatedFolders = await fileServices.addFileToFolder(
        req.body.folderId,
        req.body.fileId,
      );
      res.status(200).json(updatedFolders);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  deleteFile: async (req, res) => {
    try {
      await fileServices.deleteFile(req.params.fileId);
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default fileController;
