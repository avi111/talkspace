import express from 'express';
import { imageRouter } from './imageRoutes';

export const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use(imageRouter);