const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true,
    ref: 'User'
  },
  category: {
    type: String,
    required: true,
    enum: ['electricity', 'water', 'mess', 'fans', 'lightbulb', 'other']
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'resolved'],
    default: 'pending'
  },
  resolutionDate: {
    type: Date
  },
  resolutionTime: {
    type: String
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

module.exports = mongoose.model('Complaint', complaintSchema);

