import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const checkFileCount = (req, res, next) => {
  if (req.files && req.files.length > 5) {
    req.files.forEach((file) => {
      fs.unlinkSync(path.join('./public/uploads/', file.filename));
    });
    return res
      .status(400)
      .json([{ msg: 'Maximum of 5 files allowed per upload' }]);
  }
  next();
};

export const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  files: 5,
});
