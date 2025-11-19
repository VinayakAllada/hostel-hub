const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get student profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name, email, roomNO } = req.body;
    const user = await User.findById(req.user._id);

    // Check for duplicate email or roomNO
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }

    if (roomNO && roomNO !== user.roomNO) {
      const existingRoom = await User.findOne({ roomNO });
      if (existingRoom) {
        return res.status(400).json({ message: 'Room number already exists' });
      }
      user.roomNO = roomNO;
    }

    if (name) user.name = name;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

