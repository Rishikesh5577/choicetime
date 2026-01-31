import mongoose from 'mongoose';

const sareeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  mrp: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    // Allow any category that contains saree/sari (e.g., "Banarasi Sarees", "Silk Saree", etc.)
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.Mixed, // Can be ObjectId or String
    required: true,
  },
  product_info: {
    brand: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    SareeLength: {
      type: String,
      trim: true,
    },
    SareeMaterial: {
      type: String,
      trim: true,
    },
    SareeColor: {
      type: String,
      trim: true,
    },
    IncludedComponents: {
      type: String,
      trim: true,
    },
  },
  images: {
    image1: {
      type: String,
    },
    image2: {
      type: String,
    },
    image3: {
      type: String,
    },
    image4: {
      type: String,
    },
  },
  // Optional fields for backward compatibility and additional features
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  reviewsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  sizes: [{
    type: String,
  }],
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false, // We're handling timestamps manually
});

// Calculate final price (mrp - discount)
sareeSchema.virtual('finalPrice').get(function() {
  if (this.discountPercent > 0) {
    return this.mrp - (this.mrp * this.discountPercent / 100);
  }
  return this.mrp;
});

// Ensure virtuals are included in JSON output
sareeSchema.set('toJSON', { virtuals: true });
sareeSchema.set('toObject', { virtuals: true });

// Update timestamp before saving
sareeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
sareeSchema.index({ category: 1 });
sareeSchema.index({ categoryId: 1 });
sareeSchema.index({ title: 'text', description: 'text' });
sareeSchema.index({ 'product_info.brand': 1 });

// Use 'Saree' as the collection name
const Saree = mongoose.model('Saree', sareeSchema, 'Saree');

export default Saree;

