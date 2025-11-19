const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceID: {
    type: String,
    required: true,
    unique: true
  },
  studentID: {
    type: String,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  studentName: {
    type: String
  },
  roomNO: {
    type: String
  },
  isBroadcast: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);

