import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from '../utils/imageUtils';

export const validateImageId = (req: Request, res: Response, next: NextFunction) => {
  const { imageId } = req.params;
  
  if (!isValidObjectId(imageId)) {
    return res.status(400).json({ error: 'Invalid image ID format' });
  }
  
  next();
};