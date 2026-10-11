import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/floweraaine')
  .then(() => console.log('Successfully connected to MongoDB Floweraaine Database!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // Point to the Vite build output directory
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Catch-all route to hand off routing to the React app
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
  );
} else {
  // Fallback for local development
  app.get('/', (req, res) => {
    res.send('Floweraaine API is running...');
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});