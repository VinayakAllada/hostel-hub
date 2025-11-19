const express = require('express');
const authMiddleware = require('../middleware/auth');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const router = express.Router();

// Get student's announcements (only broadcast)
router.get('/my-invoices', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const announcements = await Invoice.find({
      isBroadcast: true
    }).sort({ createdAt: -1 });
    
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all announcements (Admin) - only broadcast
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const announcements = await Invoice.find({ isBroadcast: true }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate announcement and send to all students (Admin)
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description } = req.body;

    // Generate unique announcement ID
    const invoiceID = `ANN-${Date.now()}`;

    // Create only broadcast announcement (no individual records, no amount/duedate)
    const announcement = new Invoice({
      invoiceID,
      title,
      description,
      amount: 0, // Keep for backward compatibility but not used
      dueDate: new Date(), // Keep for backward compatibility but not used
      isBroadcast: true,
      status: 'pending' // Keep for backward compatibility but not used
    });

    await announcement.save();

    res.status(201).json({ 
      message: 'Announcement sent to all students',
      announcement 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

