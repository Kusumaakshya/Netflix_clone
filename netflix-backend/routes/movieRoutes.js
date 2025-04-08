
import express from 'express';
import { protect, admin } from '../middlewares/auth.js';
import {
  getMovies,
  getFeaturedMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movieController.js';

const router = express.Router();

router.route('/')
  .get(getMovies)
  .post(protect, admin, createMovie);

router.get('/featured', getFeaturedMovies);

router.route('/:id')
  .get(getMovie)
  .put(protect, admin, updateMovie)
  .delete(protect, admin, deleteMovie);

export default router;
