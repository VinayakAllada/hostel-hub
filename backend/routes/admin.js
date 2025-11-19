const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get all students
router.get('/students', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student details by ID
router.get('/students/:studentID', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await User.findOne({ studentID: req.params.studentID }).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get all related data
    const Complaint = require('../models/Complaint');
    const Attendance = require('../models/Attendance');
    const MessLeave = require('../models/MessLeave');
    const Invoice = require('../models/Invoice');

    const complaints = await Complaint.find({ studentID: student.studentID });
    const attendance = await Attendance.find({ studentID: student.studentID });
    const messLeaves = await MessLeave.find({ studentID: student.studentID });
    const invoices = await Invoice.find({ 
      $or: [
        { studentID: student.studentID },
        { isBroadcast: true }
      ]
    });

    res.json({
      student,
      complaints,
      attendance,
      messLeaves,
      invoices
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

