const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const mockStore = require('../data/mockStore');
const { getDBStatus } = require('../config/db');

// Authenticate JWT Token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Authentication token is missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found in database.' });
      }
    } else {
      req.user = mockStore.users.find(u => u._id === decoded.id) || {
        _id: decoded.id,
        name: decoded.name || 'Demo User',
        email: decoded.email || 'demo@medsupply.org',
        role: decoded.role || 'patient',
        city: 'Vijayawada',
        district: 'NTR District'
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to perform this operation.`
      });
    }
    next();
  };
};

// Optional auth: sets req.user if valid token exists, proceeds regardless
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = { _id: decoded.id, role: decoded.role, name: decoded.name };
    } catch (e) {
      // Ignore token parse failure for guest requests
    }
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };
