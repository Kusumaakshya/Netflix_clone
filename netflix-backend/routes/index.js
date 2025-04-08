import express from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import movieRoutes from './movieRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/movies', movieRoutes);

export default router;
