import mongoose from 'mongoose';

const subItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    path: { type: String, required: true },
    productType: { type: String, required: true }, // watches | accessories | men | women
    gender: { type: String, default: '' }, // men | women (optional, for building path)
    subCategory: { type: String, default: '' }, // e.g. analog, wallet, belt (optional)
    order: { type: Number, default: 0 },
    subItems: [subItemSchema],
  },
  { timestamps: true }
);

categorySchema.index({ order: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category;
