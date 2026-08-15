const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, hospital } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, password, and role are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'A user with this email already exists'
      });
    }

    // Create the user (password gets hashed automatically by the model)
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      hospital: hospital || null
    });

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hospital: user.hospital
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Explicitly select password since the schema hides it by default
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        status: 'error',
        message: 'Your account is not active. Please contact an administrator.'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hospital: user.hospital
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { registerUser, loginUser };