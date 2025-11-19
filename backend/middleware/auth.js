const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role === 'admin') {
      req.user = await Admin.findById(decoded.id).select('-password');
    } else {
      req.user = await User.findById(decoded.id).select('-password');
    }
    
    if (!req.user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    req.user.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

