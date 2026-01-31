import mongoose from 'mongoose';

const menTshirtSchema = new mongoose.Schema({
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
    enum: ['Tshirts', 'Tshirt', 'tshirt', 'TSHIRT'],
    default: 'Tshirts',
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
    tshirtSize: {
      type: String,
      trim: true,
    },
    tshirtMaterial: {
      type: String,
      trim: true,
    },
    tshirtFit: {
      type: String,
      trim: true,
    },
    tshirtSleeve: {
      type: String,
      trim: true,
    },
    tshirtNeck: {
      type: String,
      trim: true,
    },
    tshirtColor: {
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
menTshirtSchema.virtual('finalPrice').get(function() {
  if (this.discountPercent > 0) {
    return this.mrp - (this.mrp * this.discountPercent / 100);
  }
  return this.mrp;
});

// Ensure virtuals are included in JSON output
menTshirtSchema.set('toJSON', { virtuals: true });
menTshirtSchema.set('toObject', { virtuals: true });

// Update timestamp before saving
menTshirtSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
menTshirtSchema.index({ category: 1 });
menTshirtSchema.index({ categoryId: 1 });
menTshirtSchema.index({ title: 'text', description: 'text' });
menTshirtSchema.index({ 'product_info.brand': 1 });

// Use 'MenTshirt' as the collection name
const MenTshirt = mongoose.model('MenTshirt', menTshirtSchema, 'MenTshirt');

export default MenTshirt;

