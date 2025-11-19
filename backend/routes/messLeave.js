const express = require('express');
const authMiddleware = require('../middleware/auth');
const MessLeave = require('../models/MessLeave');
const User = require('../models/User');
const router = express.Router();

// Apply for mess leave (Student)
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { startDate, endDate, reason } = req.body;
    const user = await User.findById(req.user._id);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const messLeave = new MessLeave({
      studentID: user.studentID,
      startDate: start,
      endDate: end,
      reason,
      numberOfDays,
      studentName: user.name,
      roomNO: user.roomNO
    });

    await messLeave.save();
    res.status(201).json(messLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's mess leaves
router.get('/my-leaves', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.user._id);
    const leaves = await MessLeave.find({ studentID: user.studentID })
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all mess leaves (Admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const leaves = await MessLeave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve mess leave (Admin)
router.put('/:id/approve', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const leave = await MessLeave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = 'approved';
    await leave.save();
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject mess leave (Admin)
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const leave = await MessLeave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = 'rejected';
    await leave.save();
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

