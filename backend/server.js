const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected');
  // Seed admin after connection
  const seedAdmin = require('./utils/seedAdmin');
  seedAdmin();
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/mess-leave', require('./routes/messLeave'));
app.use('/api/invoices', require('./routes/invoices'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

