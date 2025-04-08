// controllers/profileController.js

import Profile from '../models/Profile.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all profiles for a user
// @route   GET /api/profiles
// @access  Private
export const getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new profile
// @route   POST /api/profiles
// @access  Private
export const createProfile = async (req, res, next) => {
  try {
    const { name, isChild, avatar } = req.body;

    const profile = new Profile({
      user: req.user.id,
      name,
      isChild,
      avatar: avatar || `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 8) + 1}.jpg`
    });

    await profile.save();

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a profile
// @route   PUT /api/profiles/:id
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse('Profile not found', 404));
    }

    if (profile.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this profile', 401));
    }

    profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a profile
// @route   DELETE /api/profiles/:id
// @access  Private
export const deleteProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse('Profile not found', 404));
    }

    if (profile.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this profile', 401));
    }

    await profile.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
