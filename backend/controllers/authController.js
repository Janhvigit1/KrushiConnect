import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'krushiconnect_secret_jwt_key_2026_farmer_social',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// @desc    Register a new farmer
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      village,
      district,
      state,
      crops,
      preferredLanguage,
      latitude,
      longitude
    } = req.body;

    if (!name || !email || !password || !village || !district || !state) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A farmer with this email is already registered. Please login.'
      });
    }

    // Process crops array (handles string or array)
    let processedCrops = [];
    if (Array.isArray(crops)) {
      processedCrops = crops.map((c) => c.trim()).filter(Boolean);
    } else if (typeof crops === 'string') {
      processedCrops = crops.split(',').map((c) => c.trim()).filter(Boolean);
    }

    // Coordinates processing
    let coordinates = [78.9629, 20.5937]; // default center India
    if (latitude !== undefined && longitude !== undefined && !isNaN(latitude) && !isNaN(longitude)) {
      coordinates = [parseFloat(longitude), parseFloat(latitude)];
    }

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      village,
      district,
      state,
      crops: processedCrops,
      preferredLanguage: preferredLanguage || 'en',
      location: {
        type: 'Point',
        coordinates
      }
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login farmer
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No farmer account found with this email.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in farmer
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update preferred language
// @route   PUT /api/auth/language
// @access  Private
export const updateLanguage = async (req, res, next) => {
  try {
    const { language } = req.body;
    if (!['en', 'hi'].includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language. Allowed values are 'en' or 'hi'."
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferredLanguage: language },
      { new: true }
    );

    res.status(200).json({
      success: true,
      preferredLanguage: user.preferredLanguage
    });
  } catch (error) {
    next(error);
  }
};
