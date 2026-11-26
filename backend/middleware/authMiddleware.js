import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'krushiconnect_secret_jwt_key_2026_farmer_social'
      );

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Farmer account not found'
        });
      }

      // Check if user is banned by admin
      if (req.user.status === 'banned') {
        return res.status(403).json({
          success: false,
          message: 'Your farmer account has been suspended by the administrator.'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please sign in.'
    });
  }
};

// Admin Authorization Guard (RBAC)
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: KrushiConnect Administrator privileges required.'
    });
  }
};
