const mongoose = require('mongoose');

const messLeaveSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    ref: 'User'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  studentName: {
    type: String
  },
  roomNO: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MessLeave', messLeaveSchema);

