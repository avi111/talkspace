import multer from 'multer';
import path from 'path';
import {CONFIG, MESSAGES, PATHS, RANDOM_SUFFIX_CONFIG} from "../consts";

const storage = multer.diskStorage({
  destination: PATHS.uploadsDirectory+ '/',
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * RANDOM_SUFFIX_CONFIG.randomMultiplier)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: CONFIG.uploadMaxFileSize, // Use constant for file size limit
  },
  fileFilter: (_req, file, cb) => {
    if (CONFIG.uploadAllowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(MESSAGES.errors.invalidFileType)); // Use constant for error message
    }
  },
});