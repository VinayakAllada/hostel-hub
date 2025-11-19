const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true
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

// Compound index to prevent duplicate attendance entries
attendanceSchema.index({ studentID: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

