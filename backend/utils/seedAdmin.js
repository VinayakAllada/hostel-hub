const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ adminID: '30146' });
    
    if (!existingAdmin) {
      const admin = new Admin({
        adminID: '30146',
        name: 'Sai Akshay',
        email: 'saiakshayvuttur25@gmail.com',
        password: '123456',
        role: 'admin'
      });
      
      await admin.save();
      console.log('Admin seeded successfully');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

module.exports = seedAdmin;

