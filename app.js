
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const merchantRoutes = require('./routes/merchant.routes');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const setupSwagger = require('./config/swagger');
const { protect, adminOnly, merchantOnly } = require('./middlewares/auth.middleware');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger Docs
setupSwagger(app);

// Public authentication routes
app.use('/api/auth', authRoutes); 

// Protected Role-Based Routes
app.use('/api/admin', protect, adminOnly, adminRoutes);
app.use('/api/merchant', protect, merchantOnly, merchantRoutes);
app.use('/api/user', protect, userRoutes);
app.use('/api/transactions', protect, transactionRoutes); // Any role can use this

// Health check route
app.get('/', (req, res) => {
  res.send('Role-Based API with TronGrid is running.');
});

module.exports = app;
