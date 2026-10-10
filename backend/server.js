import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import orderRoutes from './routes/orderRoutes.js';

// Setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer (Stores the file in memory temporarily before sending to Cloud)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB max size
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB Floweraaine Database!'))
  .catch((error) => console.error('❌ MongoDB connection error:', error.message));

// Admin JWT Login Route
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === (process.env.ADMIN_PASSWORD || 'admin')) {
    const token = jwt.sign(
      { role: 'studio_admin' }, 
      process.env.JWT_SECRET || 'floweraaine_super_secret_key', 
      { expiresIn: '1d' }
    );
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// --- NEW: Cloudinary Image Upload Endpoint ---
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'floweraaine_receipts' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).json({ success: false, message: 'Image upload failed.' });
      }
      // Send the secure, permanent URL back to React
      res.json({ success: true, url: result.secure_url });
    }
  );

  stream.end(req.file.buffer);
});

// API Routes
app.use('/api/orders', orderRoutes);

// PRODUCTION SETUP: Serve React Frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});