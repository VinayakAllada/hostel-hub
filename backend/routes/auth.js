const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const router = express.Router();

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Student Register
router.post('/register', async (req, res) => {
  try {
    const { studentID, roomNO, name, email, password } = req.body;

    // Check if studentID, roomNO, or email already exists
    const existingStudent = await User.findOne({
      $or: [{ studentID }, { roomNO }, { email }]
    });

    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student ID, Room Number, or Email already exists' 
      });
    }

    const user = new User({
      studentID,
      roomNO,
      name,
      email,
      password
    });

    await user.save();

    const token = generateToken(user._id, 'student');

    res.status(201).json({
      token,
      user: {
        id: user._id,
        studentID: user.studentID,
        roomNO: user.roomNO,
        name: user.name,
        email: user.email,
        role: 'student'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student Login
router.post('/login', async (req, res) => {
  try {
    const { studentID, password } = req.body;

    const user = await User.findOne({ studentID });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, 'student');

    res.json({
      token,
      user: {
        id: user._id,
        studentID: user.studentID,
        roomNO: user.roomNO,
        name: user.name,
        email: user.email,
        role: 'student'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { adminID, password } = req.body;

    const admin = await Admin.findOne({ adminID });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin._id, 'admin');

    res.json({
      token,
      user: {
        id: admin._id,
        adminID: admin.adminID,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

