const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); 

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash('admin@123', 10);

  const existingAdmin = await User.findOne({ email: 'roshankrsingh95@gmail.com' });
  if (existingAdmin) {
    console.log('Admin already exists.');
    process.exit();
    return;
  }

  const admin = new User({
    firstName: 'Roshan',
    lastName: 'Singh',
    email: 'roshankrsingh95@gmail.com',
    password: hashedPassword,
    role: 'admin',
    isVerified: true,
  });

  await admin.save();
  console.log('Admin created successfully');
  process.exit();
}).catch(err => {
  console.error('Failed to connect or create admin:', err.message);
  process.exit(1);
});
