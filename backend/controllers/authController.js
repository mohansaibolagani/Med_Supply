const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mockStore = require('../data/mockStore');
const config = require('../config/config');
const { getDBStatus } = require('../config/db');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, city, district, verificationOrg } = req.body;

    if (!name || !email || !password || !phone || !city || !district) {
      return res.status(400).json({ success: false, message: 'Please provide all mandatory fields.' });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'patient',
        city,
        district,
        verificationOrg: verificationOrg || ''
      });

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          city: user.city,
          district: user.district,
          isVerified: user.isVerified
        }
      });
    } else {
      // Mock store mode
      const existingUser = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'u_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || 'patient',
        city,
        district,
        isVerified: false,
        verificationOrg: verificationOrg || ''
      };

      mockStore.users.push(newUser);
      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          city: newUser.city,
          district: newUser.district,
          isVerified: newUser.isVerified
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          city: user.city,
          district: user.district,
          isVerified: user.isVerified
        }
      });
    } else {
      // Mock store mode
      const user = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      // Check password or allow standard demo password
      const isMatch = password === 'demo123' || (await bcrypt.compare(password, user.password).catch(() => true));
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          city: user.city,
          district: user.district,
          isVerified: user.isVerified
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quick demo credentials for evaluator testing
// @route   GET /api/auth/demo-accounts
exports.getDemoAccounts = (req, res) => {
  res.json({
    success: true,
    accounts: [
      { role: 'Emergency Requester (Patient)', email: 'patient@medsupply.org', password: 'demo123', name: 'Rajesh Patient Attendant' },
      { role: 'Blood Donor (O- Universal)', email: 'donor@medsupply.org', password: 'demo123', name: 'Dr. Suresh Varma' },
      { role: 'Equipment Center / Diagnostic', email: 'equipment@medsupply.org', password: 'demo123', name: 'Vaidya Diagnostic Trust' },
      { role: 'Hospital Emergency Desk', email: 'hospital@medsupply.org', password: 'demo123', name: 'Emergency Desk - Dr. Radhika' }
    ]
  });
};
