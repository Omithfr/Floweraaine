import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// POST: Submit a new order from the Checkout page
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
});

// GET: Fetch all orders for the Admin Dashboard
router.get('/', async (req, res) => {
  try {
    // Fetches all orders, sorted by newest first
    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

// PATCH: Approve an order from the Admin Dashboard
router.patch('/:id/approve', async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.id }, 
      { status: 'verified' },
      { new: true }
    );
    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve order', error: error.message });
  }
});

export default router;