import { Request, Response } from 'express';
import * as path from 'path';
import { Image } from '../models/Image';
import { isImageExpired } from '../utils/imageUtils';
import {APIError, UploadResponse} from "../types/image.ts";

export const uploadImage = async (req: Request, res: Response<UploadResponse | APIError>) => {
  try {
    const { expiresAt } = req.body;
    if (!req.file) {
      return res.status(400).json({
        message: 'No image uploaded',
        code: "400",
      });
    }

    const image = new Image({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      expiryDate: expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    await image.save();

    const imageUrl = `${req.protocol}://${req.get('host')}/api/v1/images/${image._id}`;
    
    res.status(201).json({
      message: 'Image uploaded successfully',
      url: imageUrl,
      expiryDate: image.expiryDate,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
        message: 'Failed to upload image',
        code: "500",
    });
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    if (isImageExpired(image.expiryDate)) {
      return res.status(410).json({ error: 'Image has expired' });
    }

    const imagePath = path.join(process.cwd(), 'uploads', image.filename);
    res.setHeader('Content-Type', image.mimeType);
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
};