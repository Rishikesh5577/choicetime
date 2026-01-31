import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Saree from './models/product/saree.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || typeof MONGODB_URI !== 'string') {
  console.error('❌ Missing MONGODB_URI. Please set it in your .env file before running this script.');
  process.exit(1);
}

async function initSareeCollection() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if collection exists and has documents
    const collectionExists = await mongoose.connection.db.listCollections({ name: 'Saree' }).hasNext();
    const count = await Saree.countDocuments();

    if (collectionExists && count > 0) {
      console.log(`✅ Saree collection already exists with ${count} document(s)`);
    } else {
      // Create the collection by inserting a sample document (will be deleted)
      console.log('📦 Creating Saree collection...');
      
      const sampleSaree = {
        title: 'Sample Saree - Delete This',
        mrp: 1000,
        discountPercent: 0,
        description: 'This is a sample document to initialize the collection. You can delete this.',
        category: 'Saree',
        categoryId: 'sample-category-id',
        product_info: {
          brand: 'Sample Brand',
          manufacturer: 'Sample Manufacturer',
          SareeLength: '6 meters',
          SareeMaterial: 'Cotton',
          SareeColor: 'White',
          IncludedComponents: 'Saree only',
        },
        images: {
          image1: 'https://via.placeholder.com/400x500?text=Sample+Saree',
        },
        stock: 0,
        sizes: [],
        isNewArrival: false,
        onSale: false,
        isFeatured: false,
        inStock: false,
        rating: 0,
        ratingsCount: 0,
        reviewsCount: 0,
      };

      const created = await Saree.create(sampleSaree);
      console.log('✅ Saree collection created successfully!');
      console.log('📝 Sample document inserted (you can delete it later)');
      
      // Optionally delete the sample document
      await Saree.deleteOne({ _id: created._id });
      console.log('🗑️  Sample document removed');
    }

    // Verify collection exists
    const finalCount = await Saree.countDocuments();
    console.log(`✅ Saree collection is ready! Current document count: ${finalCount}`);
    console.log('💡 You can now add saree products to the database.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing Saree collection:', error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

initSareeCollection();

