import { Types } from 'mongoose';

export const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

export const isImageExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};