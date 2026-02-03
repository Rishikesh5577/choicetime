import mongoose from 'mongoose';

const womenSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },

  // FIXED CATEGORY
  category: {
    type: String,
    default: 'women',
    immutable: true,
  },

  // SUBCATEGORIES FOR WOMEN (same options)
  subCategory: {
    type: String,
    enum: ['shirt', 'tshirt', 'jeans', 'trousers'],
    required: true,
  },

  gender: {
    type: String,
    default: 'women',
    immutable: true,
  },

  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  finalPrice: { type: Number, min: 0 },

  images: [{ type: String }],
  thumbnail: String,

  rating: { type: Number, default: 0, min: 0, max: 5 },
  ratingsCount: { type: Number, default: 0, min: 0 },
  reviewsCount: { type: Number, default: 0, min: 0 },

  stock: { type: Number, default: 0, min: 0 },
  sizes: [{ type: String }],

  color: String,
  brandColor: String,
  idealFor: String,

  productDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  description: String,
  netQuantity: { type: Number, default: 1 },

  isNewArrival: { type: Boolean, default: false },
  onSale: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto calculate finalPrice
womenSchema.pre('save', function (next) {
  if (this.discountPercent > 0) {
    this.finalPrice = this.price - (this.price * this.discountPercent / 100);
  } else {
    this.finalPrice = this.price;
  }
  this.updatedAt = Date.now();
  next();
});

womenSchema.index({ subCategory: 1 });
womenSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Women = mongoose.model('Women', womenSchema, 'womens');

export default Women;
