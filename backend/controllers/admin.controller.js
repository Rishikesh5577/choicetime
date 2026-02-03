import User from '../models/User.js';
import Order from '../models/Order.js';
import Men from '../models/product/menModel.js';
import MenTshirt from '../models/product/menTshirt.model.js';
import Women from '../models/product/womenModel.js';
import Watch from '../models/product/watch.model.js';
import WatchNew from '../models/product/watchNew.model.js';
import Lens from '../models/product/lens.model.js';
import Accessory from '../models/product/accessory.model.js';
import Shoes from '../models/product/shoes.model.js';
import Saree from '../models/product/saree.model.js';
import Category from '../models/Category.js';

const productModelMap = {
  men: Men,
  'men-tshirt': MenTshirt,
  'MenTshirt': MenTshirt,
  'Tshirts': MenTshirt,
  'Tshirt': MenTshirt,
  women: Women,
  watch: Watch,
  watches: Watch,
  'watch-new': WatchNew,
  'WATCH': WatchNew,
  'WATCHES': WatchNew,
  lens: Lens,
  lenses: Lens,
  accessory: Accessory,
  accessories: Accessory,
  shoes: Shoes,
  'Shoes': Shoes,
  'Shoe': Shoes,
  saree: Saree,
  'Saree': Saree,
  'SARI': Saree,
  'sari': Saree,
};

const resolveProductModel = (category) => {
  if (!category) {
    throw new Error('Category is required');
  }
  // Check for exact match first (for WATCH/WATCHES)
  const exactMatch = productModelMap[category];
  if (exactMatch) {
    return exactMatch;
  }
  // Then check lowercase
  const key = category.toLowerCase();
  const model = productModelMap[key];
  if (!model) {
    throw new Error(`Unsupported category: ${category}`);
  }
  return model;
};

export const getDashboardSummary = async (req, res) => {
  try {
    // Count all documents in each collection (includes duplicates, multiple entries, etc.)
    // countDocuments() counts every document regardless of duplicates
    const [
      totalUsers,
      totalOrders,
      pendingOrders,
      totalRevenue,
      menCount,
      womenCount,
      watchCount,
      watchNewCount,
      lensCount,
      accessoryCount,
      menTshirtCount,
      shoesCount,
      sareeCount,
    ] = await Promise.all([
      User.countDocuments(), // Count all user documents
      Order.countDocuments(), // Count all order documents
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Men.countDocuments(), // Count ALL men products (including duplicates)
      Women.countDocuments(), // Count ALL women products (including duplicates)
      Watch.countDocuments(), // Count ALL watch products (including duplicates)
      WatchNew.countDocuments().catch(() => 0), // Count ALL new watch products (including duplicates)
      Lens.countDocuments(), // Count ALL lens products (including duplicates)
      Accessory.countDocuments(), // Count ALL accessory products (including duplicates)
      MenTshirt.countDocuments().catch(() => 0), // Count ALL men t-shirt products (including duplicates)
      Shoes.countDocuments().catch(() => 0), // Count ALL shoes products (including duplicates)
      Saree.countDocuments().catch(() => 0), // Count ALL saree products (including duplicates)
    ]);

    // Calculate total products from all collections
    // This includes: duplicates, products in multiple collections, all variations
    // Each document is counted separately, so if a product appears 2x or 3x, it's counted 2x or 3x
    const totalProducts = menCount + womenCount + watchCount + watchNewCount + lensCount + accessoryCount + menTshirtCount + shoesCount + sareeCount;

    // Calculate inventory totals (avoid double counting)
    const inventory = {
      men: menCount + menTshirtCount, // Men includes men t-shirts
      women: womenCount + sareeCount, // Women includes sarees
      watches: watchCount + watchNewCount, // Combined watch count (old + new schema)
      lens: lensCount,
      accessories: accessoryCount + shoesCount, // Accessories includes shoes
      saree: sareeCount, // Saree count separately for reference
    };

    // Category-wise product counts (individual collections)
    // Note: Sarees are included in women count, not shown separately
    // Note: Men T-Shirts are included in men count, not shown separately
    // Note: Shoes are included in accessories count, not shown separately
    const categoryCounts = {
      men: menCount + menTshirtCount, // Men includes men t-shirts
      women: womenCount + sareeCount, // Women includes sarees
      watches: watchCount + watchNewCount,
      lens: lensCount,
      accessories: accessoryCount + shoesCount, // Accessories includes shoes
    };

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalProducts, // Total count of all products available on website
        inventory,
        categoryCounts, // Individual category counts
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary',
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    order.deliveredDate = status === 'delivered' ? new Date() : order.deliveredDate;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message,
    });
  }
};

// Helper function to normalize saree products for admin panel
const normalizeSareeForAdmin = (product) => {
  const normalized = product.toObject ? product.toObject() : product;
  
  // Convert images object to array format
  let imagesArray = [];
  if (normalized.images && typeof normalized.images === 'object' && !Array.isArray(normalized.images)) {
    imagesArray = [
      normalized.images.image1,
      normalized.images.image2,
      normalized.images.image3,
      normalized.images.image4,
    ].filter(Boolean);
  } else if (Array.isArray(normalized.images)) {
    imagesArray = normalized.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
  }

  // Calculate prices
  const mrp = normalized.mrp || 0;
  const discountPercent = normalized.discountPercent || 0;
  const finalPrice = normalized.finalPrice || (discountPercent > 0 ? mrp - (mrp * discountPercent / 100) : mrp);

  // Extract brand from product_info
  const brand = normalized.product_info?.brand || normalized.brand || '';

  return {
    ...normalized,
    name: normalized.title || normalized.name,
    price: finalPrice,
    finalPrice: finalPrice,
    images: imagesArray,
    brand: brand,
    category: 'women',
    subCategory: 'saree', // Set subCategory for filtering
  };
};

export const getAdminProducts = async (req, res) => {
  try {
    const { category } = req.query;

    if (category) {
      // Special handling for 'saree' category - only fetch from Saree collection
      if (category === 'saree') {
        const sareeProducts = await Saree.find().sort({ updatedAt: -1 }).limit(200);
        const normalizedSarees = sareeProducts.map(normalizeSareeForAdmin);
        
        return res.status(200).json({
          success: true,
          data: { products: normalizedSarees },
        });
      }
      
      // Special handling for 'women' category to include sarees
      if (category === 'women') {
        const [womenProducts, sareeProducts] = await Promise.all([
          Women.find().sort({ updatedAt: -1 }).limit(200),
          Saree.find().sort({ updatedAt: -1 }).limit(200),
        ]);
        
        const normalizedWomen = womenProducts.map(item => item.toObject());
        const normalizedSarees = sareeProducts.map(normalizeSareeForAdmin);
        
        const allProducts = [...normalizedWomen, ...normalizedSarees].sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt || 0);
          const dateB = new Date(b.updatedAt || b.createdAt || 0);
          return dateB - dateA;
        });
        
        return res.status(200).json({
          success: true,
          data: { products: allProducts },
        });
      }
      
      const Model = resolveProductModel(category);
      const products = await Model.find().sort({ updatedAt: -1 }).limit(200);
      
      // Normalize products to ensure images are arrays
      const normalizedProducts = products.map((product) => {
        const productObj = product.toObject ? product.toObject() : product;
        
        // Normalize images to array format
        if (productObj.images && typeof productObj.images === 'object' && !Array.isArray(productObj.images)) {
          // Convert object format { image1, image2, ... } to array
          productObj.images = [
            productObj.images.image1,
            productObj.images.image2,
            productObj.images.image3,
            productObj.images.image4,
          ].filter(Boolean);
        } else if (!Array.isArray(productObj.images)) {
          productObj.images = productObj.images ? [productObj.images] : [];
        }
        
        return productObj;
      });
      
      return res.status(200).json({
        success: true,
        data: { products: normalizedProducts },
      });
    }

    const [men, menTshirts, women, watches, lens, accessories, shoes, sarees] = await Promise.all([
      Men.find().limit(50),
      MenTshirt.find().limit(50).catch(() => []),
      Women.find().limit(50),
      Watch.find().limit(50),
      Lens.find().limit(50),
      Accessory.find().limit(50),
      Shoes.find().limit(50).catch(() => []),
      Saree.find().limit(50),
    ]);

    res.status(200).json({
      success: true,
      data: {
        products: [
          ...men.map((item) => ({ ...item.toObject(), category: 'men' })),
          ...menTshirts.map((item) => ({ ...item.toObject(), category: 'men' })),
          ...women.map((item) => ({ ...item.toObject(), category: 'women' })),
          ...watches.map((item) => ({ ...item.toObject(), category: 'watches' })),
          ...lens.map((item) => ({ ...item.toObject(), category: 'lens' })),
          ...accessories.map((item) => ({ ...item.toObject(), category: 'accessories' })),
          ...shoes.map((item) => ({ ...item.toObject(), category: 'shoes' })),
          ...sarees.map((item) => ({ ...item.toObject(), category: 'saree' })),
        ],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    let { category, subCategory, ...productData } = req.body;
    
    // If category is 'women' and subCategory is 'saree', use Saree model
    if (category === 'women' && subCategory && subCategory.toLowerCase() === 'saree') {
      const Model = Saree;
      // Convert product data to saree schema format
      const sareeData = {
        title: productData.name || productData.title,
        mrp: productData.originalPrice || productData.price || productData.mrp || 0,
        discountPercent: productData.discountPercent || 0,
        description: productData.description || '',
        category: 'Saree',
        categoryId: productData.categoryId || 'women-saree',
        product_info: {
          brand: productData.brand || '',
          manufacturer: productData.manufacturer || '',
          SareeLength: productData.SareeLength || '',
          SareeMaterial: productData.SareeMaterial || '',
          SareeColor: productData.SareeColor || '',
          IncludedComponents: productData.IncludedComponents || '',
        },
        images: Array.isArray(productData.images) && productData.images.length > 0
          ? {
              image1: productData.images[0] || '',
              image2: productData.images[1] || '',
              image3: productData.images[2] || '',
              image4: productData.images[3] || '',
            }
          : { image1: '' },
        stock: productData.stock || 0,
        sizes: productData.sizes || [],
        isNewArrival: productData.isNewArrival || false,
        onSale: productData.onSale || false,
        isFeatured: productData.isFeatured || false,
        inStock: (productData.stock || 0) > 0,
        rating: productData.rating || 0,
        ratingsCount: productData.ratingsCount || 0,
        reviewsCount: productData.reviewsCount || 0,
      };
      const product = await Model.create(sareeData);
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product: normalizeSareeForAdmin(product) },
      });
    }
    
    const Model = resolveProductModel(category);
    const product = await Model.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let { category, subCategory, ...productData } = req.body;
    
    // Check if product exists in Saree collection first
    let product = await Saree.findById(req.params.id);
    if (product) {
      // It's a saree product, update in Saree collection
      const updateData = {
        title: productData.name || productData.title || product.title,
        mrp: productData.originalPrice || productData.price || productData.mrp || product.mrp,
        discountPercent: productData.discountPercent !== undefined ? productData.discountPercent : product.discountPercent,
        description: productData.description !== undefined ? productData.description : product.description,
        product_info: {
          brand: productData.brand || product.product_info?.brand || '',
          manufacturer: productData.manufacturer || product.product_info?.manufacturer || '',
          SareeLength: productData.SareeLength || product.product_info?.SareeLength || '',
          SareeMaterial: productData.SareeMaterial || product.product_info?.SareeMaterial || '',
          SareeColor: productData.SareeColor || product.product_info?.SareeColor || '',
          IncludedComponents: productData.IncludedComponents || product.product_info?.IncludedComponents || '',
        },
        stock: productData.stock !== undefined ? productData.stock : product.stock,
        sizes: productData.sizes || product.sizes || [],
        isNewArrival: productData.isNewArrival !== undefined ? productData.isNewArrival : product.isNewArrival,
        onSale: productData.onSale !== undefined ? productData.onSale : product.onSale,
        isFeatured: productData.isFeatured !== undefined ? productData.isFeatured : product.isFeatured,
        inStock: (productData.stock !== undefined ? productData.stock : product.stock) > 0,
      };
      
      if (Array.isArray(productData.images) && productData.images.length > 0) {
        updateData.images = {
          image1: productData.images[0] || '',
          image2: productData.images[1] || '',
          image3: productData.images[2] || '',
          image4: productData.images[3] || '',
        };
      }
      
      product = await Saree.findByIdAndUpdate(req.params.id, updateData, { new: true });
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: { product: normalizeSareeForAdmin(product) },
      });
    }
    
    // If category is 'women' and subCategory is 'saree', use Saree model
    if (category === 'women' && subCategory && subCategory.toLowerCase() === 'saree') {
      const Model = Saree;
      const updateData = {
        title: productData.name || productData.title,
        mrp: productData.originalPrice || productData.price || productData.mrp || 0,
        discountPercent: productData.discountPercent || 0,
        description: productData.description || '',
        product_info: {
          brand: productData.brand || '',
          manufacturer: productData.manufacturer || '',
          SareeLength: productData.SareeLength || '',
          SareeMaterial: productData.SareeMaterial || '',
          SareeColor: productData.SareeColor || '',
          IncludedComponents: productData.IncludedComponents || '',
        },
        stock: productData.stock || 0,
        sizes: productData.sizes || [],
        isNewArrival: productData.isNewArrival || false,
        onSale: productData.onSale || false,
        isFeatured: productData.isFeatured || false,
        inStock: (productData.stock || 0) > 0,
      };
      
      if (Array.isArray(productData.images) && productData.images.length > 0) {
        updateData.images = {
          image1: productData.images[0] || '',
          image2: productData.images[1] || '',
          image3: productData.images[2] || '',
          image4: productData.images[3] || '',
        };
      }
      
      product = await Model.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: { product: normalizeSareeForAdmin(product) },
      });
    }
    
    const Model = resolveProductModel(category);
    product = await Model.findByIdAndUpdate(req.params.id, productData, { new: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { category } = req.query;
    
    // Check if product exists in Saree collection first
    let product = await Saree.findById(req.params.id);
    if (product) {
      await Saree.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    }
    
    const Model = resolveProductModel(category);
    product = await Model.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

// --- Nav Categories (admin CRUD) ---
// Build path from productType + gender + subCategory (no manual path needed)
function buildCategoryPath(productType, gender, subCategory) {
  const base = { watches: '/watches', accessories: '/accessories', men: '/men', women: '/women' }[productType] || '/';
  if (productType === 'watches' || productType === 'accessories') {
    const params = new URLSearchParams();
    if (gender) params.set('gender', gender);
    if (subCategory) params.set('subCategory', subCategory);
    const q = params.toString();
    return q ? `${base}?${q}` : base;
  }
  if (productType === 'men' || productType === 'women') {
    const params = new URLSearchParams();
    if (subCategory) params.set('subCategory', subCategory);
    const q = params.toString();
    return q ? `${base}?${q}` : base;
  }
  return base;
}

function normalizeSubItems(subItems, productType, gender) {
  if (!Array.isArray(subItems)) return [];
  return subItems.map((item) => {
    const name = (item.name || '').trim();
    if (!name) return null;
    const path = item.path && item.path.trim()
      ? item.path.trim()
      : buildCategoryPath(productType, gender, (item.subCategory || '').trim() || null);
    return { name, path };
  }).filter(Boolean);
}

export const getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, path: pathInput, productType, gender, subCategory, order, subItems } = req.body;
    if (!name || !slug || !productType) {
      return res.status(400).json({
        success: false,
        message: 'name, slug and productType are required',
      });
    }
    const slugNorm = slug.trim().toLowerCase().replace(/\s+/g, '-');
    const genderVal = (gender || '').trim() || null;
    const subCatVal = (subCategory || '').trim() || null;
    const path = (pathInput && pathInput.trim()) || buildCategoryPath(productType, genderVal, subCatVal);
    const normalizedSubItems = normalizeSubItems(subItems, productType, genderVal);
    const category = await Category.create({
      name,
      slug: slugNorm,
      path,
      productType,
      gender: genderVal || '',
      subCategory: subCatVal || '',
      order: typeof order === 'number' ? order : await Category.countDocuments(),
      subItems: normalizedSubItems,
    });
    res.status(201).json({
      success: true,
      message: 'Category created',
      data: { category },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A category with this slug already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, slug, path: pathInput, productType, gender, subCategory, order, subItems } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug.trim().toLowerCase().replace(/\s+/g, '-');
    if (productType !== undefined) category.productType = productType;
    const genderVal = (gender !== undefined ? gender : category.gender) || null;
    const subCatVal = (subCategory !== undefined ? subCategory : category.subCategory) || null;
    if (pathInput !== undefined && pathInput.trim()) {
      category.path = pathInput.trim();
    } else {
      category.path = buildCategoryPath(category.productType, genderVal, subCatVal);
    }
    category.gender = genderVal || '';
    category.subCategory = subCatVal || '';
    if (typeof order === 'number') category.order = order;
    if (Array.isArray(subItems)) {
      category.subItems = normalizeSubItems(subItems, category.productType, genderVal);
    }
    await category.save();
    res.status(200).json({
      success: true,
      message: 'Category updated',
      data: { category },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A category with this slug already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    });
  }
};


