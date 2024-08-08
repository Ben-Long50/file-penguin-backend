import { v2 as cloudinary } from 'cloudinary';

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
        cloudinary.uploader.upload(file.path),
      );
      req.fileUrls = await Promise.all(uploadPromises);
      console.log(req.fileUrls);
      next();
    } catch (error) {
      res.send(500).json({ error: error.message });
    }
  } else {
    next();
  }
};

export default uploadToCloudinary;
