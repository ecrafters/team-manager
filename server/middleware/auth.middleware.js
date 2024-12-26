const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw createError(401, 'Authentication required');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(createError(401, 'Invalid or expired token'));
  }
};