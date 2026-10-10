import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  type: String,
  image: String,
  isTrending: Boolean,
  features: [String]
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new product (Phase 4 Admin feature)
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;