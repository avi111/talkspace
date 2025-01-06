import express from 'express';
import { upload } from '../config/multer';
import { uploadImage, getImage } from '../controllers/imageController';
import { validateImageId } from '../middleware/validateImageId';

export const imageRouter = express.Router();

imageRouter.post('/v1/images', upload.single('image'), uploadImage);
imageRouter.get('/v1/images/:imageId', validateImageId, getImage);