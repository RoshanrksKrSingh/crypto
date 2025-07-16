const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
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
const isProd = process.env.NODE_ENV === 'production';

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://onlinetxmanag.onrender.com',
    'https://superlative-cheesecake-a8cf3e.netlify.app',
    'https://studio.apicur.io'
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Parse cookies (recommended for custom cookies or signing)
app.use(cookieParser(process.env.SESSION_SECRET));

// Parse JSON bodies
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

// Session handling with MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24, // 24 hours
    }),
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', protect, adminOnly, adminRoutes);
app.use('/api/merchant', protect, merchantOnly, merchantRoutes);
app.use('/api/user', protect, userRoutes);
app.use('/api/transactions', protect, transactionRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Role-Based API with TronGrid is running.');
});

module.exports = app;
