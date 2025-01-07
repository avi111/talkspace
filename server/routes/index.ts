import express from 'express';
import { imageRouter } from './imageRoutes';

export const router = express.Router();
router.use(imageRouter);