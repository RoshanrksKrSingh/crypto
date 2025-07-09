const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); 

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash('admin@123', 10);
  const admin = new User({
    name: 'Roshan Singh',
    email: 'roshankrsingh95@gmail.com',
    password: hashedPassword,
    role: 'admin',
    isVerified: true,
  });

  await admin.save();
  console.log('Admin created');
  process.exit();
});
