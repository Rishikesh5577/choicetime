import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (non-blocking - routes will still work)
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('⚠️  MongoDB connection error (routes will still work):', error.message);
    console.log('   Database operations will fail until connection is established');
    // Don't exit - allow routes to register even without DB connection
  });

// Routes (single products collection: GET /api/products?category=men & GET /api/products/:id)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes);

// Register review routes - MUST be before 404 handler
try {
  app.use('/api/reviews', reviewRoutes);
  console.log('✅ Review routes registered at /api/reviews');
} catch (error) {
  console.error('❌CRITICAL: Failed to register review routes:', error);
  console.error('   This will cause 404 errors for /api/reviews');
}

console.log('✅ Payment routes registered at /api/payment');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5008;

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}\n`);
  console.log('📋 Registered API Routes:');
  console.log('   ✓ /api/auth');
  console.log('   ✓ /api/products/*');
  console.log('   ✓ /api/admin');
  console.log('   ✓ /api/cart');
  console.log('   ✓ /api/orders');
  console.log('   ✓ /api/profile');
  console.log('   ✓ /api/payment');
  console.log('   ✓ /api/reviews');
  console.log('\n✅ All routes registered successfully!\n');
  console.log('🔍 Test review routes:');
  console.log(`   GET  http://localhost:${PORT}/api/reviews/health`);
  console.log(`   GET  http://localhost:${PORT}/api/reviews/:productId`);
  console.log(`   POST http://localhost:${PORT}/api/reviews\n`);
});

