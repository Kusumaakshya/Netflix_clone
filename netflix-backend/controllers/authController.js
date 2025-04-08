import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import ErrorResponse from '../utils/errorResponse.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorResponse('User already exists', 400));
    }

    user = new User({ email, password });
    await user.save();

    const profile = new Profile({
      user: user._id,
      name: 'Profile 1'
    });
    await profile.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      userId: user._id
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      userId: user._id
    });
  } catch (err) {
    next(err);
  }
};
