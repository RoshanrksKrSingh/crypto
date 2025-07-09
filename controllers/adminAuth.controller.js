// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const generateToken = require('../services/generateToken');

// /**
//  * Admin Login
//  */
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   const admin = await User.findOne({ email });
//   if (!admin || admin.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied. Not an admin.' });
//   }

//   const isMatch = await bcrypt.compare(password, admin.password);
//   if (!isMatch) {
//     return res.status(400).json({ message: 'Invalid credentials' });
//   }

//  const token = generateToken(admin);


//   res.json({ token, role: admin.role });
// };
