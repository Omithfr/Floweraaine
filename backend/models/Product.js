import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['ready', 'customizable'], required: true },
  type: { type: String, enum: ['cars', 'hampers', 'floral'], required: true },
  isTrending: { type: Boolean, default: false },
  images: [{ type: String }],
  image: { type: String },
  features: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);