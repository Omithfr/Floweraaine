import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, default: 'Kerala' }
  },
  product: {
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  quantity: { type: Number, required: true, default: 1 },
  total: { type: Number, required: true },
  customization: {
    occasion: { type: String },
    text: { type: String },
    note: { type: String },
    photoName: { type: String }
  },
  txnId: { type: String, required: true },
  receiptUrl: { type: String },
  status: { type: String, enum: ['pending', 'verified', 'shipped'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);