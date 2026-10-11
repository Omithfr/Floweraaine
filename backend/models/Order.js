import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true }
  },
  product: {
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  customization: {
    occasion: { type: String },
    text: { type: String },
    note: { type: String },
    photoName: { type: String }
  },
  txnId: { type: String }, 
  receiptUrl: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'verified', 'shipped', 'delivered'] }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);