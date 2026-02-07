import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // men, women, watches, lens, accessories, shoes, saree
    subCategory: { type: String, trim: true, default: '' },
    gender: { type: String, trim: true, default: '' },

    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    finalPrice: { type: Number, min: 0 },

    images: [{ type: String }],
    thumbnail: { type: String, default: '' },

    description: { type: String, default: '' },
    stock: { type: Number, default: 0, min: 0 },
    sizes: [{ type: String }],

    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0, min: 0 },
    reviewsCount: { type: Number, default: 0, min: 0 },

    isNewArrival: { type: Boolean, default: false },
    onSale: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },

    color: String,
    colorOptions: [{ type: String }],
    boxOptions: [{ type: String }],
    productDetails: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Watch specific fields
    model: { type: String, trim: true, default: '' },
    functions: { type: String, trim: true, default: '' },
    dialColor: { type: String, trim: true, default: '' },
    dialSize: { type: String, trim: true, default: '' },
    strapColor: { type: String, trim: true, default: '' },
    strapMaterial: { type: String, trim: true, default: '' },
    crystalMaterial: { type: String, trim: true, default: '' },
    lockType: { type: String, trim: true, default: '' },
    waterResistance: { type: String, trim: true, default: '' },
    calendarType: { type: String, trim: true, default: '' },
    movement: { type: String, trim: true, default: '' },
    itemWeight: { type: String, trim: true, default: '' },
    quality: { type: String, trim: true, default: '' },
    warranty: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.discountPercent > 0 && this.price) {
    this.finalPrice = this.price - (this.price * this.discountPercent) / 100;
  } else {
    this.finalPrice = this.price;
  }
  this.inStock = (this.stock || 0) > 0;
  next();
});

productSchema.index({ category: 1 });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ category: 1, gender: 1 });
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema, 'products');
export default Product;
