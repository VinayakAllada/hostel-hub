const express = require('express');
const authMiddleware = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const router = express.Router();

// Get student's attendance
router.get('/my-attendance', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.user._id);
    const attendance = await Attendance.find({ studentID: user.studentID })
      .sort({ date: -1 })
      .limit(30);
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record attendance (Admin)
router.post('/record', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { studentID, date, status } = req.body;
    const user = await User.findOne({ studentID });

    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      studentID,
      date: new Date(date)
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      return res.json(existingAttendance);
    }

    const attendance = new Attendance({
      studentID,
      date: new Date(date),
      status,
      studentName: user.name,
      roomNO: user.roomNO
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Attendance already recorded for this date' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get all attendance (Admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const attendance = await Attendance.find().sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance statistics (Admin)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const students = await User.find({ role: 'student' });
    const stats = await Promise.all(
      students.map(async (student) => {
        const total = await Attendance.countDocuments({ studentID: student.studentID });
        const present = await Attendance.countDocuments({ 
          studentID: student.studentID, 
          status: 'present' 
        });
        const absent = total - present;
        
        return {
          studentID: student.studentID,
          name: student.name,
          roomNO: student.roomNO,
          total,
          present,
          absent,
          attendancePercentage: total > 0 ? ((present / total) * 100).toFixed(2) : 0
        };
      })
    );

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

