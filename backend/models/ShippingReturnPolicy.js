import mongoose from 'mongoose';

const shippingReturnPolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  iconColor: {
    type: String,
    enum: ['green', 'blue', 'purple'],
    default: 'green',
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ShippingReturnPolicy = mongoose.model('ShippingReturnPolicy', shippingReturnPolicySchema);

export default ShippingReturnPolicy;
