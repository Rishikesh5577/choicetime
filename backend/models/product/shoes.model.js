import mongoose from 'mongoose';

const shoesSchema = new mongoose.Schema({
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
    enum: ['Shoes', 'Shoe', 'shoes', 'shoe', 'SHOES'],
    default: 'Shoes',
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
    availableSizes: [{
      type: String,
    }],
    shoeSize: {
      type: String,
      trim: true,
    },
    shoeMaterial: {
      type: String,
      trim: true,
    },
    shoeColor: {
      type: String,
      trim: true,
    },
    shoeType: {
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
shoesSchema.virtual('finalPrice').get(function() {
  if (this.discountPercent > 0) {
    return this.mrp - (this.mrp * this.discountPercent / 100);
  }
  return this.mrp;
});

// Ensure virtuals are included in JSON output
shoesSchema.set('toJSON', { virtuals: true });
shoesSchema.set('toObject', { virtuals: true });

// Update timestamp before saving
shoesSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
shoesSchema.index({ category: 1 });
shoesSchema.index({ categoryId: 1 });
shoesSchema.index({ title: 'text', description: 'text' });
shoesSchema.index({ 'product_info.brand': 1 });

// Use 'Shoes' as the collection name
const Shoes = mongoose.model('Shoes', shoesSchema, 'Shoes');

export default Shoes;

