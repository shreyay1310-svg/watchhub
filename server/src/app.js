import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'WatchHub E-Commerce REST API is live and operational.',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root API info
app.get('/api', (req, res) => {
  res.status(200).json({
    platform: 'WatchHub – Premium Watches for Every Style',
    version: '1.0.0',
    roles: [
      'Customer',
      'Super Admin',
      'Store Admin',
      'Inventory Manager',
      'Delivery Manager',
      'Customer Support Executive'
    ],
  });
});

// Newsletter Subscription API
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({
      status: 'fail',
      message: 'Please enter a valid email address.',
    });
  }
  return res.status(200).json({
    status: 'success',
    message: `Welcome to the WatchHub Community! A 10% welcome voucher has been sent to ${email}.`,
    email,
  });
});

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import appUpdateRoutes from './routes/appUpdateRoutes.js';
import customWatchRoutes from './routes/customWatchRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import supportRoutes from './routes/supportRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/app', appUpdateRoutes);
app.use('/api/custom-watch', customWatchRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/support', supportRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error Caught]', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
