import { Request, Response } from 'express';
import * as path from 'path';
import { Image } from '../models/Image';
import { isImageExpired } from '../utils/imageUtils';
import { APIError, UploadResponse } from '../types/image';
import {DEFAULT_EXPIRY_TIME_MS, MESSAGES, STATUS_CODES, UPLOADS_DIR} from "../consts";
import * as fs from "node:fs";

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

        res.status(STATUS_CODES.created).json({
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

export const cleanupExpiredImages = async () => {
    try {
        const now = new Date();
        const expiredFiles = await Image.find({
            expiryDate: {
                $lt: now,
            }
        });

        console.log(`Found ${expiredFiles.length} expired files`);

        for (const file of expiredFiles) {
            try {
                const filePath = path.join(UPLOADS_DIR, file.filename);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted file: ${file.filename}`);
                }

                await Image.findByIdAndDelete(file._id);
                console.log(`Deleted database record for: ${file.filename}`);
            } catch (error) {
                console.error(`Error deleting file ${file.filename}:`, error);
                console.error({
                    fileId: file._id,
                    filename: file.filename,
                    error: error instanceof Error ? {
                        message: error.message,
                        stack: error.stack
                    } : 'Unknown error'
                });
            }
        }
    } catch (error) {
        console.error('Error in cleanup process:', error);
    }
};