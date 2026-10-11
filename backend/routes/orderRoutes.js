import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// 1. POST: Create a new order (Streamlined Checkout)
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order({ ...req.body, status: 'pending' });
    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET: Fetch orders for a specific customer
router.get('/my-orders', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'User email is required' });
    
    const orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. GET: Fetch ALL orders (Super Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders); 
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. PATCH: Approve an order (Super Admin Dashboard)
router.patch('/:id/approve', async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.id }, 
      { status: 'verified' },
      { new: true }
    );
    
    if (!updatedOrder) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;