import express from 'express';
import { protect } from '../middlewares/auth.js';

import {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profileController.js';

const router = express.Router();

router.use(protect); // Middleware for all profile routes

router.route('/')
  .get(getProfiles)
  .post(createProfile);

router.route('/:id')
  .put(updateProfile)
  .delete(deleteProfile);

export default router;
