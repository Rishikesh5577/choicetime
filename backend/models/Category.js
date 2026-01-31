import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true, lowercase: true },
}, { _id: true });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true, lowercase: true, unique: true },
  subcategories: [subCategorySchema],
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema, 'categories');
export default Category;
