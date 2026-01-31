import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Watch from './models/product/watch.model.js';
import Lens from './models/product/lens.model.js';
import Accessory from './models/product/accessory.model.js';
import Men from './models/product/menModel.js';
import Women from './models/product/womenModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || typeof MONGODB_URI !== 'string') {
  console.error('❌ Missing MONGODB_URI. Please set it in your .env file before running the seed script.');
  process.exit(1);
}

// --- WATCH PRODUCTS DATA ---
const watchProducts = [
  {
    name: 'Titan Stellar Blue Dial Stainless Steel Analog Watch for Men',
    brand: 'Titan',
    category: 'watches',
    subCategory: 'analog',
    gender: 'men',
    price: 11995,
    originalPrice: 12999,
    discountPercent: 8,
    rating: 4.8,
    ratingsCount: 186,
    reviewsCount: 142,
    stock: 22,
    dialColor: 'Blue',
    bandColor: 'Silver',
    bandMaterial: 'Stainless Steel',
    displayType: 'Analog',
    movementType: 'Quartz',
    glassMaterial: 'Sapphire Coated Crystal',
    waterResistance: '5 ATM',
    caseMaterial: 'Stainless Steel',
    caseShape: 'Round',
    caseWidth: '43 mm',
    caseLength: '48 mm',
    caseThickness: '11.5 mm',
    warranty: '24 Months International Warranty on Movement',
    productDetails: {
      modelNumber: '10028SM01',
      function: 'Sun–Moon Phase Analog',
      collection: 'Stellar',
      strapMaterial: 'Stainless Steel',
      strapColor: 'Silver',
      lockMechanism: 'Butterfly Clasp',
      movement: 'Quartz 7137B',
      sunMoonPhase: true,
      specialFeatures: [
        'Sun–Moon disc with 24-hour markings',
        'Multi-layered dial inspired by observatory domes',
        'Laser-etched caseback referencing the black hole silhouette'
      ]
    },
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: 'Premium analog watch with a Sun–Moon complication, deep blue dial and stainless steel strap. Perfect for boardrooms and evening wear alike.',
    isNewArrival: true,
    onSale: true,
    isFeatured: true,
    inStock: true,
  },
  {
    name: 'Fastrack Reflex Active Pro Charcoal Smartwatch',
    brand: 'Fastrack',
    category: 'watches',
    subCategory: 'smartwatch',
    gender: 'unisex',
    price: 549,
    originalPrice: 799,
    discountPercent: 31,
    rating: 4.1,
    ratingsCount: 320,
    reviewsCount: 210,
    stock: 120,
    dialColor: 'Charcoal',
    bandColor: 'Charcoal',
    bandMaterial: 'Silicone',
    displayType: 'Digital',
    movementType: 'Smart',
    glassMaterial: 'Acrylic',
    waterResistance: 'IP68',
    caseMaterial: 'ABS',
    caseShape: 'Square',
    warranty: '1 Year Warranty',
    productDetails: {
      modelNumber: 'Fastrack-RA-Pro',
      function: 'Smartwatch',
      collection: 'Reflex Active',
      strapMaterial: 'Silicone',
      strapColor: 'Charcoal',
      movement: 'Smart Module',
      specialFeatures: ['SpO2 tracking', 'Sleep scores', '100+ watch faces']
    },
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80',
    description: 'Lightweight smartwatch with Active Health Suite, AMOLED display and detachable straps for everyday athleisure looks.',
    isNewArrival: true,
    onSale: true,
    isFeatured: false,
    inStock: true,
  },
  {
    name: 'Sonata Splash Proof Pop Dial Watch',
    brand: 'Sonata',
    category: 'watches',
    subCategory: 'casual',
    gender: 'women',
    price: 749,
    originalPrice: 949,
    discountPercent: 21,
    rating: 4.0,
    ratingsCount: 188,
    reviewsCount: 90,
    stock: 80,
    dialColor: 'Coral Pink',
    bandColor: 'White',
    bandMaterial: 'Silicone',
    displayType: 'Analog',
    movementType: 'Quartz',
    glassMaterial: 'Mineral Glass',
    waterResistance: '3 ATM',
    caseMaterial: 'Plastic',
    caseShape: 'Round',
    warranty: '1 Year Warranty',
    productDetails: {
      modelNumber: '87017PP04',
      function: 'Time + Date',
      collection: 'Splash Proof',
      strapMaterial: 'Silicone',
      strapColor: 'White',
      movement: 'Quartz',
      specialFeatures: ['Glow in the dark markers', 'Feather-light build']
    },
    images: [
      'https://images.unsplash.com/photo-1518544801958-efcbf8a7ec10?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518544801958-efcbf8a7ec10?auto=format&fit=crop&w=600&q=80',
    description: 'Fun everyday analog watch with pastel dial, sweat-proof strap and glow markers for casual brunch looks.',
    isNewArrival: false,
    onSale: true,
    isFeatured: false,
    inStock: true,
  },
  {
    name: 'Timex Helix Nova Pastel Blue',
    brand: 'Timex',
    category: 'watches',
    subCategory: 'casual',
    gender: 'women',
    price: 899,
    originalPrice: 1199,
    discountPercent: 25,
    rating: 4.2,
    ratingsCount: 140,
    reviewsCount: 75,
    stock: 64,
    dialColor: 'Pastel Blue',
    bandColor: 'Nude',
    bandMaterial: 'PU Leather',
    displayType: 'Analog',
    movementType: 'Quartz',
    glassMaterial: 'Mineral Glass',
    warranty: '1 Year Warranty',
    productDetails: {
      modelNumber: 'TW033HL12',
      function: 'Analog',
      collection: 'Helix Nova',
      strapMaterial: 'PU Leather',
      strapColor: 'Sand Beige',
      movement: 'Quartz',
      specialFeatures: ['Raised indices', 'Slim bezel']
    },
    images: [
      'https://images.unsplash.com/photo-1522312298940-653d2b79dbcd?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1522312298940-653d2b79dbcd?auto=format&fit=crop&w=600&q=80',
    description: 'Delicate pastel timepiece that pairs easily with linen dresses and day parties.',
    isNewArrival: false,
    onSale: true,
    inStock: true,
  },
  {
    name: 'Casio Youth Digital F-200 Series',
    brand: 'Casio',
    category: 'watches',
    subCategory: 'digital',
    gender: 'unisex',
    price: 960,
    originalPrice: 1095,
    discountPercent: 12,
    rating: 4.5,
    ratingsCount: 890,
    reviewsCount: 430,
    stock: 150,
    dialColor: 'Black',
    bandColor: 'Black',
    bandMaterial: 'Resin',
    displayType: 'Digital',
    movementType: 'Quartz',
    glassMaterial: 'Acrylic',
    waterResistance: '10 Year Battery',
    caseMaterial: 'Resin',
    caseShape: 'Rectangular',
    warranty: '2 Years Warranty',
    productDetails: {
      modelNumber: 'F-200W',
      function: 'Digital',
      collection: 'Youth',
      strapMaterial: 'Resin',
      strapColor: 'Black',
      movement: 'Quartz',
      specialFeatures: ['Dual time', 'LED backlight', '10-year battery']
    },
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80',
    description: 'Classic digital square watch with dual time, stopwatch and 10-year battery for the utilitarian crowd.',
    isNewArrival: false,
    onSale: true,
    inStock: true,
  },
  {
    name: 'Noise ColorFit Micro Mesh Edition',
    brand: 'Noise',
    category: 'watches',
    subCategory: 'smartwatch',
    gender: 'women',
    price: 980,
    originalPrice: 1499,
    discountPercent: 35,
    rating: 4.1,
    ratingsCount: 560,
    reviewsCount: 220,
    stock: 140,
    dialColor: 'Rose Gold',
    bandColor: 'Rose Gold Mesh',
    bandMaterial: 'Stainless Steel Mesh',
    displayType: 'Digital',
    movementType: 'Smart',
    glassMaterial: 'Tempered Glass',
    waterResistance: 'IP68',
    caseMaterial: 'Alloy',
    caseShape: 'Rectangle',
    warranty: '1 Year Warranty',
    productDetails: {
      modelNumber: 'ColorFit-Micro',
      function: 'Smartwatch',
      collection: 'ColorFit',
      strapMaterial: 'Mesh Stainless Steel',
      strapColor: 'Rose Gold',
      movement: 'Smart Module',
      specialFeatures: ['99 sports modes', 'Stress monitor', 'Quick reply templates']
    },
    images: [
      'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=600&q=80',
    description: 'Mesh-strap smartwatch with AMOLED display built for studio workouts and calendar alerts.',
    isNewArrival: true,
    onSale: true,
    inStock: true,
  },
  {
    name: 'Fastrack Streetwear Bold Red Dial',
    brand: 'Fastrack',
    category: 'watches',
    subCategory: 'analog',
    gender: 'men',
    price: 1299,
    originalPrice: 1595,
    discountPercent: 19,
    rating: 4.0,
    ratingsCount: 255,
    reviewsCount: 110,
    stock: 95,
    dialColor: 'Red',
    bandColor: 'Black',
    bandMaterial: 'Silicone',
    displayType: 'Analog',
    movementType: 'Quartz',
    glassMaterial: 'Mineral',
    waterResistance: '5 ATM',
    caseMaterial: 'Stainless Steel',
    caseShape: 'Round',
    warranty: '2 Years Warranty',
    productDetails: {
      modelNumber: '3256SL02',
      function: 'Analog',
      collection: 'Streetwear',
      strapMaterial: 'Silicone',
      strapColor: 'Black',
      movement: 'Quartz',
      specialFeatures: ['Textured bezel', 'Bold indices']
    },
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    description: 'Bold red dial watch for denim days and after-work rides.',
    isNewArrival: false,
    onSale: true,
    inStock: true,
  },
  {
    name: 'Timex Expedition Sierra Field',
    brand: 'Timex',
    category: 'watches',
    subCategory: 'field',
    gender: 'men',
    price: 1399,
    originalPrice: 1795,
    discountPercent: 22,
    rating: 4.3,
    ratingsCount: 280,
    reviewsCount: 160,
    stock: 70,
    dialColor: 'Olive',
    bandColor: 'Brown',
    bandMaterial: 'Leather',
    displayType: 'Analog',
    movementType: 'Quartz',
    glassMaterial: 'Mineral',
    waterResistance: '5 ATM',
    caseMaterial: 'Brass',
    caseShape: 'Round',
    warranty: '1 Year Warranty',
    productDetails: {
      modelNumber: 'TW4B14700',
      function: 'Analog',
      collection: 'Expedition',
      strapMaterial: 'Leather',
      strapColor: 'Brown',
      movement: 'Quartz',
      specialFeatures: ['INDIGLO light', '24-hour inner track']
    },
    images: [
      'https://images.unsplash.com/photo-1518544889280-37f4ca38e4c6?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1518544889280-37f4ca38e4c6?auto=format&fit=crop&w=600&q=80',
    description: 'Military-inspired field watch with leather strap and INDIGLO night-light.',
    isNewArrival: false,
    onSale: true,
    inStock: true,
  },
  {
    name: 'Casio Enticer Silver Dial Bracelet Watch',
    brand: 'Casio',
    category: 'watches',
    subCategory: 'dress',
    gender: 'women',
    price: 1599,
    originalPrice: 2145,
    discountPercent: 25,
    rating: 4.4,
    ratingsCount: 310,
    reviewsCount: 175,
    stock: 85,
    dialColor: 'Silver',
    bandColor: 'Silver',
    bandMaterial: 'Stainless Steel',
    displayType: 'Analog',
    movementType: 'Quartz',
    glassMaterial: 'Mineral',
    waterResistance: '3 ATM',
    caseMaterial: 'Alloy',
    caseShape: 'Round',
    warranty: '2 Years Warranty',
    productDetails: {
      modelNumber: 'LTP-1183A',
      function: 'Analog',
      collection: 'Enticer',
      strapMaterial: 'Stainless Steel',
      strapColor: 'Silver',
      movement: 'Quartz',
      specialFeatures: ['Date window', 'Sunburst dial']
    },
    images: [
      'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=600&q=80',
    description: 'Minimal silver bracelet watch that pairs with office co-ords and festive sarees alike.',
    isNewArrival: false,
    onSale: true,
    inStock: true,
  },
];

// --- DUMMY LENS PRODUCTS DATA ---
const lensProducts = [
  {
    name: 'Ray-Ban Wayfarer Classic Green Lens',
    brand: 'Ray-Ban',
    category: 'eyewear',
    subCategory: 'sunglasses',
    gender: 'unisex',
    price: 8500,
    originalPrice: 9500,
    discountPercent: 10,
    rating: 4.9,
    ratingsCount: 500,
    reviewsCount: 300,
    stock: 50,
    frameShape: 'Wayfarer',
    frameColor: 'Black',
    lensColor: 'Green',
    lensMaterial: 'Crystal',
    uvProtection: 'UV400',
    polarization: 'Non-Polarized',
    productDetails: {
      modelNumber: 'RB2140',
      frameMaterial: 'Acetate',
      lensWidth: '50 mm',
      bridgeWidth: '22 mm',
      templeLength: '150 mm',
    },
    images: ['https://images.unsplash.com/photo-1574762112833-e99d4aa33157?auto=format&fit=crop&w=900&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1574762112833-e99d4aa33157?auto=format&fit=crop&w=600&q=80',
    description: 'The iconic Wayfarer with classic green G-15 lenses. A timeless statement piece.',
    isNewArrival: false,
    onSale: true,
    isFeatured: true,
    inStock: true,
  },
  {
    name: 'Oakley Holbrook Prizm Black Polarized',
    brand: 'Oakley',
    category: 'eyewear',
    subCategory: 'sunglasses',
    gender: 'men',
    price: 10999,
    originalPrice: 12000,
    discountPercent: 8,
    rating: 4.7,
    ratingsCount: 450,
    reviewsCount: 280,
    stock: 35,
    frameShape: 'Square',
    frameColor: 'Matte Black',
    lensColor: 'Prizm Black',
    lensMaterial: 'Plutonite',
    uvProtection: 'UV400',
    polarization: 'Polarized',
    productDetails: {
      modelNumber: 'OO9102-A0',
      frameMaterial: 'O Matter',
      lensWidth: '55 mm',
      bridgeWidth: '18 mm',
      templeLength: '137 mm',
    },
    images: ['https://images.unsplash.com/photo-1518544801958-efcbf8a7ec10?auto=format&fit=crop&w=900&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1518544801958-efcbf8a7ec10?auto=format&fit=crop&w=600&q=80',
    description: 'Performance eyewear with Prizm lens technology for enhanced color and contrast.',
    isNewArrival: true,
    onSale: false,
    isFeatured: true,
    inStock: true,
  }
];

// --- DUMMY ACCESSORY PRODUCTS DATA ---
const accessoryProducts = [
  {
    name: 'Leather Bi-Fold Wallet with RFID Protection',
    brand: 'Bellroy',
    category: 'accessories',
    subCategory: 'wallets',
    gender: 'unisex',
    price: 3500,
    originalPrice: 3800,
    discountPercent: 8,
    rating: 4.6,
    ratingsCount: 200,
    reviewsCount: 150,
    stock: 75,
    material: 'Full-Grain Leather',
    closureType: 'Bi-Fold',
    features: ['RFID Blocking', 'Slim Profile', 'Coin Pocket'],
    productDetails: {
      dimensions: '10.2cm x 9cm',
      cardSlots: 4,
      billCompartments: 1,
    },
    images: ['https://images.unsplash.com/photo-1583743814966-896359e99a81?auto=format&fit=crop&w=900&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1583743814966-896359e99a81?auto=format&fit=crop&w=600&q=80',
    description: 'A premium leather wallet designed for minimalist carry with essential RFID protection.',
    isNewArrival: true,
    onSale: false,
    isFeatured: true,
    inStock: true,
  },
  {
    name: 'Silk Blend Scarf with Abstract Print',
    brand: 'Zara',
    category: 'accessories',
    subCategory: 'scarves',
    gender: 'women',
    price: 1200,
    originalPrice: 1500,
    discountPercent: 20,
    rating: 4.3,
    ratingsCount: 120,
    reviewsCount: 80,
    stock: 100,
    material: 'Silk Blend',
    features: ['Soft Touch', 'Vibrant Print'],
    productDetails: {
      dimensions: '90cm x 90cm',
      pattern: 'Abstract Geometric',
    },
    images: ['https://images.unsplash.com/photo-1534005697698-b80c1075306d?auto=format&fit=crop&w=900&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1534005697698-b80c1075306d?auto=format&fit=crop&w=600&q=80',
    description: 'Elevate any outfit with this luxurious silk blend scarf featuring a contemporary abstract print.',
    isNewArrival: false,
    onSale: true,
    isFeatured: false,
    inStock: true,
  }
];

// --- DUMMY FASHION PRODUCTS DATA ---
const fashionProducts = [
  {
    name: 'Men\'s Slim Fit Denim Jeans',
    brand: 'Levi\'s',
    subCategory: 'jeans',
    gender: 'men',
    price: 2999,
    originalPrice: 3500,
    discountPercent: 15,
    rating: 4.7,
    ratingsCount: 600,
    reviewsCount: 400,
    stock: 200,
    color: 'Dark Blue Wash',
    material: 'Cotton Blend Denim',
    fit: 'Slim',
    waistRise: 'Mid-Rise',
    sizesAvailable: ['28', '30', '32', '34', '36'],
    productDetails: {
      modelNumber: '511-SLM',
      fabricCare: 'Machine Wash',
      countryOfOrigin: 'India',
    },
    images: ['https://images.unsplash.com/photo-1598115331666-41f237f37e40?auto=format&fit=crop&w=900&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1598115331666-41f237f37e40?auto=format&fit=crop&w=600&q=80',
    description: 'Classic Levi\'s slim fit jeans, offering comfort and style for everyday wear.',
    isNewArrival: true,
    onSale: true,
    isFeatured: true,
    inStock: true,
  },
  {
    name: 'Women\'s Floral Print Maxi Dress Shirt',
    brand: 'H&M',
    subCategory: 'shirt',
    gender: 'women',
    price: 1899,
    originalPrice: 2200,
    discountPercent: 13,
    rating: 4.5,
    ratingsCount: 300,
    reviewsCount: 200,
    stock: 150,
    color: 'Multi-color Floral',
    material: 'Viscose',
    fit: 'Relaxed',
    sleeveLength: 'Short Sleeve',
    sizesAvailable: ['XS', 'S', 'M', 'L', 'XL'],
    productDetails: {
      pattern: 'Floral',
      neckline: 'V-Neck',
      dressLength: 'Maxi',
    },
    images: ['https://images.unsplash.com/photo-1574762112833-e99d4aa33157?auto=format&fit=crop&w=900&q=80'],
    thumbnail: 'https://images.unsplash.com/photo-1574762112833-e99d4aa33157?auto=format&fit=crop&w=600&q=80',
    description: 'Flowy maxi dress with a vibrant floral print, perfect for summer days and evening events.',
    isNewArrival: false,
    onSale: true,
    isFeatured: false,
    inStock: true,
  }
];

// Aggregate all sample products into a single object for easy access
const sampleProducts = {
  watch: watchProducts,
  lens: lensProducts,
  accessory: accessoryProducts,
  fashion: fashionProducts,
};

async function runSeed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Always clear existing data before seeding fresh
    console.log('Clearing existing product data...');
    await Promise.all([
      Watch.deleteMany({}),
      Lens.deleteMany({}),
      Accessory.deleteMany({}),
      Men.deleteMany({}),
      Women.deleteMany({}),
    ]);
    console.log('Existing product data cleared.');

    console.log('Seeding products...');

    // Insert watch products
    for (const product of sampleProducts.watch) {
      const createdWatch = await Watch.create(product);
      console.log(`✅ Watch created: ${createdWatch.name}`);
    }

    // Insert lens products
    for (const product of sampleProducts.lens) {
      const createdLens = await Lens.create(product);
      console.log(`✅ Lens created: ${createdLens.name}`);
    }

    // Insert men & women fashion products based on gender field
    for (const product of sampleProducts.fashion) {
      const gender = (product.gender || '').toLowerCase();
      if (gender === 'women') {
        const createdWomen = await Women.create(product);
        console.log(`✅ Women product created: ${createdWomen.name}`);
      } else {
        const createdMen = await Men.create({ ...product, gender: 'men' });
        console.log(`✅ Men product created: ${createdMen.name}`);
      }
    }

    // Insert accessory products
    for (const product of sampleProducts.accessory) {
      const createdAccessory = await Accessory.create(product);
      console.log(`✅ Accessory created: ${createdAccessory.name}`);
    }


    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  } finally {
    // Ensure mongoose connection is closed even if there's an error
    if (mongoose.connection.readyState === 1) { // 1 means connected
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
    }
  }
}

runSeed();