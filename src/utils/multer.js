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
  const errors = [];
  if (req.files && req.files.length > 5) {
    req.files.forEach((file) => {
      fs.unlinkSync(path.join('./public/uploads/', file.filename));
    });

    errors.push({ msg: 'Maximum of 5 files allowed per upload' });
  }
  req.files.forEach((file) => {
    const parsedTitle = file.filename.split('-').slice(1);
    const newTitle = parsedTitle.join('-');
    if (file.size > 2000000) {
      errors.push({
        msg: `${newTitle} must be less than 2MB`,
      });
    }
  });
  if (errors.length > 0) {
    res.status(400).json(errors);
  } else {
    next();
  }
};

export const upload = multer({
  storage,
});
