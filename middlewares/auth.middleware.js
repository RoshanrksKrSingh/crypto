const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');

// Middleware to protect any authenticated route
exports.protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Optional: Debug logging (remove in production)
    console.log(`[AUTH] User authenticated: ${user.email} | Role: ${user.role}`);

    req.user = user;
    next();
  } catch (err) {
    console.error('[AUTH] Token error:', err.message);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Middleware: Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    console.warn(`[AUTH] Access denied for user ${req.user?.email}. Admins only.`);
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// Middleware: Merchant only
exports.merchantOnly = (req, res, next) => {
  if (req.user?.role !== 'merchant') {
    console.warn(`[AUTH] Access denied for user ${req.user?.email}. Merchants only.`);
    return res.status(403).json({ message: 'Access denied: Merchants only' });
  }
  next();
};

//  const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { JWT_SECRET } = require('../config/jwt');

// Middleware to protect any authenticated route
// exports.protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer ')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: 'Not authorized, token missing' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: 'Not authorized, user not found' });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Auth error:', err.message);
//     res.status(401).json({ message: 'Token invalid or expired' });
//   }
// };

// // Admin only access
// exports.adminOnly = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied: Admins only' });
//   }
//   next();
// };

// // Merchant only access
// exports.merchantOnly = (req, res, next) => {
//   if (req.user.role !== 'merchant') {
//     return res.status(403).json({ message: 'Access denied: Merchants only' });
//   }
//   next();
// };