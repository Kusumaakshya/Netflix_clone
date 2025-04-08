import Movie from '../models/Movie.js';
import ErrorResponse from '../utils/errorResponse.js';

export const getMovies = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = Movie.find(JSON.parse(queryStr));

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Movie.countDocuments();

    query = query.skip(startIndex).limit(limit);
    const movies = await query;

    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: movies.length,
      pagination,
      data: movies
    });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ isFeatured: true }).limit(5);
    res.status(200).json({ success: true, count: movies.length, data: movies });
  } catch (err) {
    next(err);
  }
};

export const getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404));
    }
    res.status(200).json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404));
    }
    res.status(200).json({ success: true, data: movie });
  } catch (err) {
    next(err);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return next(new ErrorResponse('Movie not found', 404));
    }
    await movie.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
