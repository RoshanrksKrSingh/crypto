const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
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

//  CORS CONFIG for local frontend (Vite: http://localhost:5173) & deployed frontend
const corsOptions = {
  origin: isProd
    ? ['https://frontend.onrender.com'] 
    : ['http://localhost:5173'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Swagger setup
setupSwagger(app);

// SESSION CONFIG
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 60 * 60, 
    }),
    cookie: {
      httpOnly: true,
      secure: isProd, // Secure cookies only in production (Render = true)
      sameSite: isProd ? 'none' : 'lax', // allow cross-origin cookies 
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

//  Health check
app.get('/', (req, res) => {
  res.send('Role-Based API with TronGrid is running.');
});

module.exports = app;
