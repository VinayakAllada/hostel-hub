const express = require('express');
const authMiddleware = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const router = express.Router();

// Create complaint (Student)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { category, description } = req.body;
    const user = await User.findById(req.user._id);

    const complaint = new Complaint({
      studentID: user.studentID,
      category,
      description,
      studentName: user.name,
      roomNO: user.roomNO
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's complaints
router.get('/my-complaints', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.user._id);
    const complaints = await Complaint.find({ studentID: user.studentID })
      .sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all complaints (Admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept complaint and set resolution date/time (Admin)
router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { resolutionDate, resolutionTime } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = 'accepted';
    complaint.resolutionDate = resolutionDate;
    complaint.resolutionTime = resolutionTime;

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resolve complaint (Admin)
router.put('/:id/resolve', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = 'resolved';
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

