const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, 'Invalid credentials');
    }
    
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw createError(401, 'Invalid credentials');
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const userResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    
    res.json({ user: userResponse, token });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      throw createError(404, 'User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};