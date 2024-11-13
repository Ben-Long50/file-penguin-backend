import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const uploadToCloudinary = async (req, res, next) => {
  if (req.files && req.files.length > 0) {
    try {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: '/file_penguin',
          quality: 'auto:eco',
        }),
      );

      req.fileUrls = await Promise.all(uploadPromises);

      req.files.forEach((file) => {
        fs.unlink(file.path, (error) => {
          if (error) console.error('Error deleting temp file:', error);
        });
      });

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    next();
  }
};

export default uploadToCloudinary;
