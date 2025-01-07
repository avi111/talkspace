import { Request, Response } from 'express';
import * as path from 'path';
import { Image } from '../models/Image';
import { isImageExpired } from '../utils/imageUtils';
import { APIError, UploadResponse } from '../types/image';
import {DEFAULT_EXPIRY_TIME_MS, MESSAGES, STATUS_CODES} from "../consts";

export const uploadImage = async (req: Request, res: Response<UploadResponse | APIError>) => {
    try {
        const { expiresAt } = req.body;
        if (!req.file) {
            return res.status(STATUS_CODES.badRequest).json({
                error: MESSAGES.errors.noImageUploaded,
            });
        }

        const image = new Image({
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            expiryDate: expiresAt || new Date(Date.now() + DEFAULT_EXPIRY_TIME_MS),
        });

        await image.save();

        const imageUrl = `${req.protocol}://${req.get('host')}/api/v1/images/${image._id}`;

        res.status(201).json({
            message: MESSAGES.success.imageUploaded,
            url: imageUrl,
            expiryDate: image.expiryDate,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(STATUS_CODES.internalServerError).json({
            error: MESSAGES.errors.uploadFailed,
        });
    }
};

export const getImage = async (req: Request, res: Response<APIError>) => {
    try {
        const { imageId } = req.params;
        const image = await Image.findById(imageId);

        if (!image) {
            return res.status(STATUS_CODES.notFound).json({
                error: MESSAGES.errors.imageNotFound,
            });
        }

        if (isImageExpired(image.expiryDate)) {
            return res.status(STATUS_CODES.gone).json({
                error: MESSAGES.errors.imageExpired,
            });
        }

        const imagePath = path.join(process.cwd(), 'uploads', image.filename);
        res.setHeader('Content-Type', image.mimeType);
        res.sendFile(imagePath);
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(STATUS_CODES.internalServerError).json({
            error: MESSAGES.errors.serveFailed,
        });
    }
};