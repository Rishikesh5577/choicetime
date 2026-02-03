import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const defaultCategories = [
  {
    name: "Men's Watches",
    slug: 'mens-watches',
    path: '/watches?gender=men',
    productType: 'watches',
    order: 1,
    subItems: [
      { name: 'View All', path: '/watches?gender=men' },
      { name: 'Analog', path: '/watches?gender=men&subCategory=analog' },
      { name: 'Smart Watches', path: '/watches?gender=men&subCategory=smart' },
    ],
  },
  {
    name: "Women's Watches",
    slug: 'womens-watches',
    path: '/watches?gender=women',
    productType: 'watches',
    order: 2,
    subItems: [
      { name: 'View All', path: '/watches?gender=women' },
      { name: 'Analog', path: '/watches?gender=women&subCategory=analog' },
      { name: 'Smart Watches', path: '/watches?gender=women&subCategory=smart' },
    ],
  },
  {
    name: "Men's Wallet",
    slug: 'mens-wallet',
    path: '/accessories?gender=men&subCategory=wallet',
    productType: 'accessories',
    order: 3,
    subItems: [{ name: 'View All', path: '/accessories?gender=men&subCategory=wallet' }],
  },
  {
    name: "Women's Wallet",
    slug: 'womens-wallet',
    path: '/accessories?gender=women&subCategory=wallet',
    productType: 'accessories',
    order: 4,
    subItems: [{ name: 'View All', path: '/accessories?gender=women&subCategory=wallet' }],
  },
  {
    name: "Men's Belt",
    slug: 'mens-belt',
    path: '/accessories?gender=men&subCategory=belt',
    productType: 'accessories',
    order: 5,
    subItems: [{ name: 'View All', path: '/accessories?gender=men&subCategory=belt' }],
  },
  {
    name: "Women's Belt",
    slug: 'womens-belt',
    path: '/accessories?gender=women&subCategory=belt',
    productType: 'accessories',
    order: 6,
    subItems: [{ name: 'View All', path: '/accessories?gender=women&subCategory=belt' }],
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log('Categories already exist. Skipping seed.');
      process.exit(0);
      return;
    }
    await Category.insertMany(defaultCategories);
    console.log('✅ Seeded', defaultCategories.length, 'categories');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedCategories();
