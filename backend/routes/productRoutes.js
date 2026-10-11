import express from 'express';
import Order from '../models/Order.js'; // Assuming your model is named Order.js

const router = express.Router();

// 1. POST: Create a new order (Streamlined Checkout)
router.post('/', async (req, res) => {
  try {
    // Save the new order to the database with a default status of 'pending'
    const newOrder = new Order({
      ...req.body,
      status: 'pending' 
    });
    
    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order Creation Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET: Fetch orders for a specific customer (My Orders Dashboard)
// NOTE: This must go BEFORE any /:id routes so Express routes it correctly.
router.get('/my-orders', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User email is required' });
    }
    
    // Find all orders matching the logged-in customer's email, newest first
    const orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. GET: Fetch ALL orders (Super Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    // The frontend admin dashboard expects an array of all orders
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders); 
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. PATCH: Approve an order (Super Admin Dashboard)
router.patch('/:id/approve', async (req, res) => {
  try {
    const orderId = req.params.id; // e.g., FLW-XXXXX
    
    // Find the order by its custom FLW ID and update the status to 'verified'
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId }, 
      { status: 'verified' },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;