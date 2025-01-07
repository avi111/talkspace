import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from '../utils/imageUtils';
import {APIError} from "../types/image";
import {MESSAGES, STATUS_CODES} from "../consts";

export const validateImageId = (req: Request, res: Response<APIError>, next: NextFunction) => {
  const { imageId } = req.params;
  
  if (!isValidObjectId(imageId)) {
    return res.status(STATUS_CODES.badRequest).json({
        error: MESSAGES.errors.invalidImageId,
    });
  }
  
  next();
};