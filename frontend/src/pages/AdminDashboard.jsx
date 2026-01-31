import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Auto-generate value (slug) from name
const nameToValue = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

// SVG Icons
const IconDashboard = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconProducts = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconAdd = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const IconEdit = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const IconDelete = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconOrders = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const IconStatus = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const IconUsers = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconCategories = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

// Sidebar menu items
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: IconDashboard },
  { id: 'products', label: 'View Products', icon: IconProducts },
  { id: 'add-product', label: 'Add Product', icon: IconAdd },
  { id: 'edit-product', label: 'Edit Product', icon: IconEdit },
  { id: 'delete-product', label: 'Delete Product', icon: IconDelete },
  { id: 'categories', label: 'Manage Categories', icon: IconCategories },
  { id: 'orders', label: 'Manage Orders', icon: IconOrders },
  { id: 'order-status', label: 'Order Status', icon: IconStatus },
  { id: 'users', label: 'Manage Users', icon: IconUsers },
];

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [productCategory, setProductCategory] = useState('men');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    category: 'men',
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    discountPercent: 0,
    subCategory: '',
    stock: 10,
    images: '',
    description: '',
    isNewArrival: false,
    onSale: false,
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryValue, setNewCategoryValue] = useState('');
  const [newCategorySubcategories, setNewCategorySubcategories] = useState(''); // "Name, value" per line
  const [editingCategory, setEditingCategory] = useState(null); // { id, name, value }
  const [editingSubcategory, setEditingSubcategory] = useState(null); // { catId, subId, name, value }
  const [addingSubTo, setAddingSubTo] = useState(null); // { catId, name, value }

  const isAdmin = user?.isAdmin;

  const categoryOptions = useMemo(() =>
    categories.map((c) => ({ label: c.name, value: c.value })),
    [categories]
  );
  const subCategoryOptions = useMemo(() =>
    Object.fromEntries(
      categories.map((c) => [
        c.value,
        (c.subcategories || []).map((s) => s.value),
      ])
    ),
    [categories]
  );

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories();
      if (response.success) {
        setCategories(response.data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to fetch categories' });
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    if (activeSection === 'dashboard' || activeSection === 'orders' || activeSection === 'order-status') {
      fetchSummary();
      fetchOrders();
    }
    if (activeSection === 'products' || activeSection === 'add-product' || activeSection === 'edit-product' || activeSection === 'delete-product') {
      fetchProducts(productCategory);
      setSelectedSubCategory(''); // Reset subcategory filter when category changes
    }
    if (activeSection === 'users') {
      fetchUsers();
    }
    if (activeSection === 'categories' || activeSection === 'add-product' || activeSection === 'edit-product' || activeSection === 'products' || activeSection === 'delete-product') {
      fetchCategories();
    }
  }, [isAdmin, activeSection, productCategory]);

  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c.value === productCategory)) {
      setProductCategory(categories[0].value);
    }
  }, [categories]);

  const fetchSummary = async () => {
    try {
      const response = await adminAPI.getSummary();
      if (response.success) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getOrders();
      if (response.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async (category) => {
    try {
      setLoading(true);
      const response = await adminAPI.getProducts(category);
      if (response.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      if (response.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(userId);
      setMessage({ type: 'success', text: 'User deleted successfully' });
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete user' });
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      setMessage({ type: 'success', text: 'Order status updated' });
      fetchOrders();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update order' });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await adminAPI.deleteOrder(orderId);
      setMessage({ type: 'success', text: 'Order removed' });
      fetchOrders();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete order' });
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      // Reset subCategory when category changes
      if (name === 'category') {
        updated.subCategory = '';
      }
      return updated;
    });
  };

  const resetForm = () => {
    setProductForm({
      category: productCategory,
      name: '',
      brand: '',
      price: '',
      originalPrice: '',
      discountPercent: 0,
      subCategory: '',
      stock: 10,
      images: '',
      description: '',
      isNewArrival: false,
      onSale: false,
      isFeatured: false,
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      category: product.category || productCategory,
      name: product.name || '',
      brand: product.brand || '',
      price: product.price || product.finalPrice || '',
      originalPrice: product.originalPrice || product.price || '',
      discountPercent: product.discountPercent || 0,
      subCategory: product.subCategory || '',
      stock: product.stock || 10,
      images: product.images?.join(', ') || '',
      description: product.description || '',
      isNewArrival: product.isNewArrival || false,
      onSale: product.onSale || false,
      isFeatured: product.isFeatured || false,
    });
    setActiveSection('edit-product');
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        discountPercent: Number(productForm.discountPercent || 0),
        stock: Number(productForm.stock || 0),
        images: productForm.images
          ? productForm.images.split(',').map((img) => img.trim())
          : [],
      };
      await adminAPI.createProduct(payload);
      setMessage({ type: 'success', text: 'Product created' });
      resetForm();
      fetchProducts(productCategory);
    } catch (error) {
      const errMsg = error?.response?.data?.error || error?.response?.data?.message || error.message || 'Failed to create product';
      setMessage({ type: 'error', text: errMsg });
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        discountPercent: Number(productForm.discountPercent || 0),
        stock: Number(productForm.stock || 0),
        images: productForm.images
          ? productForm.images.split(',').map((img) => img.trim())
          : [],
      };
      await adminAPI.updateProduct(editingProduct._id, payload);
      setMessage({ type: 'success', text: 'Product updated' });
      resetForm();
      fetchProducts(productCategory);
      setActiveSection('products');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update product' });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id, productCategory);
      setMessage({ type: 'success', text: 'Product deleted' });
      fetchProducts(productCategory);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete product' });
    }
  };

  const filteredOrders = useMemo(() => orders.slice(0, 10), [orders]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border rounded-2xl shadow-sm max-w-lg w-full p-10 text-center space-y-4">
          <div className="text-4xl">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900">Admin access only</h1>
          <p className="text-gray-600">You need an admin account to view this page.</p>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Back to profile
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              <button
                onClick={fetchSummary}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 rounded-lg w-full sm:w-auto"
              >
                Refresh
              </button>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {summary ? (
                <>
                  <div className="bg-white rounded-2xl border p-4 sm:p-5 shadow-sm">
                    <p className="text-xs uppercase text-gray-500">Revenue</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                      ₹{summary.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl border p-4 sm:p-5 shadow-sm">
                    <p className="text-xs uppercase text-gray-500">Orders</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{summary.totalOrders}</p>
                    <p className="text-xs text-gray-500">{summary.pendingOrders} pending</p>
                  </div>
                  <div className="bg-white rounded-2xl border p-4 sm:p-5 shadow-sm">
                    <p className="text-xs uppercase text-gray-500">Customers</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{summary.totalUsers}</p>
                  </div>
                  <div className="bg-white rounded-2xl border p-4 sm:p-5 shadow-sm">
                    <p className="text-xs uppercase text-gray-500">Total Products</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                      {summary.totalProducts?.toLocaleString() || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">All collections</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">Loading summary...</p>
              )}
            </div>

            {/* Category-wise Product Count */}
            {summary && summary.categoryCounts && Object.keys(summary.categoryCounts).length > 0 && (
              <div className="bg-white rounded-2xl border p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Products by Category</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Object.entries(summary.categoryCounts).map(([category, count]) => (
                    <div key={category} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs uppercase text-gray-500 mb-1">
                        {category === 'lens' ? 'Lens' :
                         category.charAt(0).toUpperCase() + category.slice(1)}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">{count?.toLocaleString() || 0}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Total Products</p>
                    <p className="text-lg font-bold text-gray-900">
                      {summary.totalProducts?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'products':
        // Filter products by subcategory if selected
        let filteredProducts = selectedSubCategory
          ? products.filter((product) => {
              // Get subcategory from various possible field names
              const productSubCategory = (product.subCategory || product.subcategory || '').toLowerCase().trim();
              const normalizedSelectedSub = selectedSubCategory.toLowerCase().trim();
              
              // For saree filtering, also check if product title contains "saree" or is from Saree collection
              if (normalizedSelectedSub === 'saree') {
                const title = (product.title || product.name || '').toLowerCase();
                const isSareeByTitle = title.includes('saree') || title.includes('sari');
                const isSareeByCategory = product.category === 'saree' || product.category === 'Saree';
                
                return productSubCategory === 'saree' || 
                       productSubCategory === 'sari' ||
                       isSareeByTitle ||
                       isSareeByCategory;
              }
              
              // For other subcategories, do exact match
              return productSubCategory === normalizedSelectedSub;
            })
          : products;

        // Sort products by price
        if (sortBy !== 'default') {
          filteredProducts = [...filteredProducts].sort((a, b) => {
            const priceA = a.finalPrice || a.price || 0;
            const priceB = b.finalPrice || b.price || 0;
            
            if (sortBy === 'price-low') {
              return priceA - priceB;
            } else if (sortBy === 'price-high') {
              return priceB - priceA;
            }
            return 0;
          });
        }

        // Calculate pagination
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        // Reset to page 1 if current page is out of bounds
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(1);
        }

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">View Products</h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <select
                  value={productCategory}
                onChange={(e) => {
                  setProductCategory(e.target.value);
                  setSelectedSubCategory(''); // Reset subcategory when category changes
                  setSortBy('default'); // Reset sort when category changes
                  setCurrentPage(1); // Reset to first page when category changes
                }}
                  className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1); // Reset to first page when sort changes
                  }}
                  className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                >
                  <option value="default">Sort by: Default</option>
                  <option value="price-low">Sort by: Price (Low to High)</option>
                  <option value="price-high">Sort by: Price (High to Low)</option>
                </select>
              </div>
            </div>
            
            {/* Subcategory Filter Buttons */}
            {subCategoryOptions[productCategory] && subCategoryOptions[productCategory].length > 0 && (
              <div className="bg-white rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">Filter by Sub Category:</span>
                  {selectedSubCategory && (
                    <button
                      onClick={() => {
                        setSelectedSubCategory('');
                        setCurrentPage(1); // Reset to first page when filter clears
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 underline"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSelectedSubCategory('');
                      setCurrentPage(1); // Reset to first page when filter changes
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      selectedSubCategory === ''
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {subCategoryOptions[productCategory].map((subCat) => (
                    <button
                      key={subCat}
                      onClick={() => {
                        setSelectedSubCategory(subCat);
                        setCurrentPage(1); // Reset to first page when filter changes
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        selectedSubCategory === subCat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {subCat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-sm text-gray-500">
                {selectedSubCategory 
                  ? `No products found in ${selectedSubCategory} subcategory.`
                  : 'No products in this category yet.'}
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <p>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                </div>
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedProducts.map((product) => (
                  <div key={product._id} className="bg-white border rounded-lg overflow-hidden">
                    {(() => {
                      // Handle different image formats
                      let imageUrl = null;
                      if (Array.isArray(product.images) && product.images.length > 0) {
                        imageUrl = product.images[0];
                      } else if (product.images && typeof product.images === 'object') {
                        // Handle object format (e.g., { image1: 'url', image2: 'url' })
                        imageUrl = product.images.image1 || product.images.image2 || product.images.image3 || product.images.image4;
                      } else if (typeof product.images === 'string') {
                        imageUrl = product.images;
                      }
                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name || product.title || 'Product'}
                          className="w-full h-48 sm:h-60 object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-60 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      );
                    })()}
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">{product.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{product.brand}</p>
                      <p className="text-base sm:text-lg font-bold text-gray-900 mt-2">
                      ₹{product.finalPrice || product.price}
                    </p>
                      <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEditProduct(product)}
                          className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                          className="flex-1 px-3 py-2 text-xs bg-red-600 text-white hover:bg-red-700 rounded"
                      >
                        Delete
                      </button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'add-product':
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Product</h2>
            <form onSubmit={handleCreateProduct} className="bg-white rounded-xl border p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    disabled={categoryOptions.length === 0}
                  >
                    {categoryOptions.length === 0 && <option value="">Loading...</option>}
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category *</label>
                  <select
                    name="subCategory"
                    value={productForm.subCategory}
                    onChange={handleProductFormChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    required
                    disabled={!productForm.category}
                  >
                    <option value="">
                      {productForm.category 
                        ? 'Select Sub Category' 
                        : 'Select Category First'}
                    </option>
                    {productForm.category && subCategoryOptions[productForm.category]?.map((subCat) => (
                      <option key={subCat} value={subCat}>
                        {subCat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                  {productForm.category && !subCategoryOptions[productForm.category] && (
                    <p className="text-xs text-gray-500 mt-1">No subcategories available for this category</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    name="name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    name="brand"
                    value={productForm.brand}
                    onChange={handleProductFormChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                  <input
                    name="originalPrice"
                    type="number"
                    min="0"
                    value={productForm.originalPrice}
                    onChange={handleProductFormChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                  <input
                    name="discountPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={productForm.discountPercent}
                    onChange={handleProductFormChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
                <textarea
                  name="images"
                  value={productForm.images}
                  onChange={handleProductFormChange}
                  rows="3"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  rows="3"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Product description"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={productForm.isNewArrival}
                    onChange={handleProductFormChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">New Arrival</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="onSale"
                    checked={productForm.onSale}
                    onChange={handleProductFormChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">On Sale</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={productForm.isFeatured}
                    onChange={handleProductFormChange}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg w-full sm:w-auto"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 rounded-lg w-full sm:w-auto"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        );

      case 'edit-product':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Product</h2>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {editingProduct ? (
              <form onSubmit={handleUpdateProduct} className="bg-white rounded-xl border p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={productForm.category}
                      onChange={handleProductFormChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category *</label>
                    <select
                      name="subCategory"
                      value={productForm.subCategory}
                      onChange={handleProductFormChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      required
                      disabled={!productForm.category}
                    >
                      <option value="">
                        {productForm.category 
                          ? 'Select Sub Category' 
                          : 'Select Category First'}
                      </option>
                      {productForm.category && subCategoryOptions[productForm.category]?.map((subCat) => (
                        <option key={subCat} value={subCat}>
                          {subCat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                    {productForm.category && !subCategoryOptions[productForm.category] && (
                      <p className="text-xs text-gray-500 mt-1">No subcategories available for this category</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      name="name"
                      value={productForm.name}
                      onChange={handleProductFormChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      name="brand"
                      value={productForm.brand}
                      onChange={handleProductFormChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      value={productForm.price}
                      onChange={handleProductFormChange}
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                    <input
                      name="originalPrice"
                      type="number"
                      min="0"
                      value={productForm.originalPrice}
                      onChange={handleProductFormChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={productForm.stock}
                      onChange={handleProductFormChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                    <input
                      name="discountPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={productForm.discountPercent}
                      onChange={handleProductFormChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (comma separated)</label>
                  <textarea
                    name="images"
                    value={productForm.images}
                    onChange={handleProductFormChange}
                    rows="3"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    rows="3"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={productForm.isNewArrival}
                      onChange={handleProductFormChange}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="onSale"
                      checked={productForm.onSale}
                      onChange={handleProductFormChange}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">On Sale</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={productForm.isFeatured}
                      onChange={handleProductFormChange}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg w-full sm:w-auto"
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveSection('products');
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 rounded-lg w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-xl border p-6 text-center">
                <p className="text-gray-600">Select a product from "View Products" to edit</p>
                <button
                  onClick={() => setActiveSection('products')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                  View Products
                </button>
              </div>
            )}
          </div>
        );

      case 'delete-product':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Delete Products</h2>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-gray-500">No products in this category yet.</p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{product.brand}</p>
                      <p className="text-xs sm:text-sm text-gray-500">₹{product.finalPrice || product.price}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-sm font-semibold rounded-lg w-full sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'categories':
        const handleAddCategory = async (e) => {
          e.preventDefault();
          if (!newCategoryName.trim() || !newCategoryValue.trim()) {
            setMessage({ type: 'error', text: 'Name and value required' });
            return;
          }
          // Parse subcategories: each line "Name, value" or "Name"
          const subcats = newCategorySubcategories
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
              const comma = line.indexOf(',');
              if (comma >= 0) {
                const name = line.slice(0, comma).trim();
                const value = line.slice(comma + 1).trim() || name.toLowerCase().replace(/\s+/g, '-');
                return { name: name || 'Sub', value };
              }
              const val = line.toLowerCase().replace(/\s+/g, '-');
              return { name: line, value: val };
            });
          try {
            await adminAPI.createCategory({
              name: newCategoryName.trim(),
              value: newCategoryValue.trim(),
              subcategories: subcats,
            });
            setMessage({ type: 'success', text: `Category added${subcats.length ? ` with ${subcats.length} subcategories` : ''}` });
            setNewCategoryName('');
            setNewCategoryValue('');
            setNewCategorySubcategories('');
            fetchCategories();
          } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to add category' });
          }
        };
        const handleDeleteCategory = async (id) => {
          if (!window.confirm('Delete this category? Products may be affected.')) return;
          try {
            await adminAPI.deleteCategory(id);
            setMessage({ type: 'success', text: 'Category deleted' });
            fetchCategories();
          } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to delete' });
          }
        };
        const handleRemoveSubcategory = async (catId, subId) => {
          if (!window.confirm('Remove this subcategory?')) return;
          try {
            await adminAPI.removeSubcategory(catId, subId);
            setMessage({ type: 'success', text: 'Subcategory removed' });
            fetchCategories();
          } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to remove' });
          }
        };
        const handleAddSubToCategory = async (e) => {
          e.preventDefault();
          if (!addingSubTo?.catId || !addingSubTo.name?.trim() || !addingSubTo.value?.trim()) {
            setMessage({ type: 'error', text: 'Name and value required' });
            return;
          }
          try {
            await adminAPI.addSubcategory(addingSubTo.catId, {
              name: addingSubTo.name.trim(),
              value: addingSubTo.value.trim(),
            });
            setMessage({ type: 'success', text: 'Subcategory added' });
            setAddingSubTo(null);
            fetchCategories();
          } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to add subcategory' });
          }
        };
        const handleUpdateCategory = async (e) => {
          e.preventDefault();
          if (!editingCategory?.id || !editingCategory.name?.trim() || !editingCategory.value?.trim()) {
            setMessage({ type: 'error', text: 'Name and value required' });
            return;
          }
          try {
            await adminAPI.updateCategory(editingCategory.id, {
              name: editingCategory.name.trim(),
              value: editingCategory.value.trim(),
            });
            setMessage({ type: 'success', text: 'Category updated' });
            setEditingCategory(null);
            fetchCategories();
          } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update category' });
          }
        };
        const handleUpdateSubcategory = async (e) => {
          e.preventDefault();
          if (!editingSubcategory?.catId || !editingSubcategory?.subId || !editingSubcategory.name?.trim() || !editingSubcategory.value?.trim()) {
            setMessage({ type: 'error', text: 'Name and value required' });
            return;
          }
          const cat = categories.find((c) => c._id === editingSubcategory.catId);
          if (!cat?.subcategories?.length) return;
          const updatedSubs = cat.subcategories.map((s) =>
            s._id === editingSubcategory.subId
              ? { _id: s._id, name: editingSubcategory.name.trim(), value: editingSubcategory.value.trim() }
              : { _id: s._id, name: s.name, value: s.value }
          );
          try {
            await adminAPI.updateCategory(editingSubcategory.catId, { subcategories: updatedSubs });
            setMessage({ type: 'success', text: 'Subcategory updated' });
            setEditingSubcategory(null);
            fetchCategories();
          } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to update subcategory' });
          }
        };
        return (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Categories & Subcategories</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-xl border p-6 space-y-4 max-w-xl">
                <h3 className="font-semibold text-gray-900">Add Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-3">
                  <input
                    value={newCategoryName}
                    onChange={(e) => {
                      const v = e.target.value;
                      setNewCategoryName(v);
                      setNewCategoryValue(nameToValue(v));
                    }}
                    placeholder="Category name (e.g. Men Watches)"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    value={newCategoryValue}
                    onChange={(e) => setNewCategoryValue(e.target.value)}
                    placeholder="Auto-filled from name (editable)"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Subcategories (optional, one per line: Name, value)</label>
                    <textarea
                      value={newCategorySubcategories}
                      onChange={(e) => setNewCategorySubcategories(e.target.value)}
                      placeholder={"Analog, analog\nDigital, digital\nSmartwatch, smartwatch"}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                    Add Category
                  </button>
                </form>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">All Categories & Subcategories</h3>
              {categories.length === 0 ? (
                <p className="text-gray-500 text-sm">No categories yet. Add one above.</p>
              ) : (
                <div className="space-y-4">
                  {categories.map((cat) => (
                    <div key={cat._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        {editingCategory?.id === cat._id ? (
                          <form onSubmit={handleUpdateCategory} className="flex flex-wrap items-center gap-2 flex-1">
                            <input
                              value={editingCategory.name}
                              onChange={(e) => {
                                const v = e.target.value;
                                setEditingCategory((p) => ({ ...p, name: v, value: nameToValue(v) }));
                              }}
                              placeholder="Category name"
                              className="border rounded px-2 py-1 text-sm w-32"
                            />
                            <input
                              value={editingCategory.value}
                              onChange={(e) => setEditingCategory((p) => ({ ...p, value: e.target.value }))}
                              placeholder="Value (auto-filled)"
                              className="border rounded px-2 py-1 text-sm w-32"
                            />
                            <button type="submit" className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                              Save
                            </button>
                            <button type="button" onClick={() => setEditingCategory(null)} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300">
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <span className="font-medium text-gray-900">{cat.name}</span>
                        )}
                        <div className="flex items-center gap-2">
                          {editingCategory?.id !== cat._id && (
                            <button
                              onClick={() => setEditingCategory({ id: cat._id, name: cat.name, value: cat.value })}
                              className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                              title="Edit"
                            >
                              <IconEdit className="w-4 h-4" /> Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="text-red-600 text-sm hover:underline"
                          >
                            Delete Category
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(cat.subcategories || []).map((sub) => (
                          <span key={sub._id} className="inline-flex">
                            {editingSubcategory?.catId === cat._id && editingSubcategory?.subId === sub._id ? (
                            <form onSubmit={handleUpdateSubcategory} className="inline-flex items-center gap-1">
                              <input
                                value={editingSubcategory.name}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setEditingSubcategory((p) => ({ ...p, name: v, value: nameToValue(v) }));
                                }}
                                placeholder="Name"
                                className="border rounded px-2 py-1 text-sm w-24"
                              />
                              <input
                                value={editingSubcategory.value}
                                onChange={(e) => setEditingSubcategory((p) => ({ ...p, value: e.target.value }))}
                                placeholder="Value (auto)"
                                className="border rounded px-2 py-1 text-sm w-24"
                              />
                              <button type="submit" className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Save</button>
                              <button type="button" onClick={() => setEditingSubcategory(null)} className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300">Cancel</button>
                            </form>
                            ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">
                              {sub.name}
                              <button
                                onClick={() => setEditingSubcategory({ catId: cat._id, subId: sub._id, name: sub.name, value: sub.value })}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edit"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => handleRemoveSubcategory(cat._id, sub._id)}
                                className="text-red-500 hover:text-red-700"
                                title="Remove"
                              >
                                ×
                              </button>
                            </span>
                            )}
                          </span>
                        ))}
                        {(!cat.subcategories || cat.subcategories.length === 0) && addingSubTo?.catId !== cat._id && (
                          <span className="text-gray-400 text-sm">No subcategories</span>
                        )}
                        {addingSubTo?.catId === cat._id ? (
                            <form onSubmit={handleAddSubToCategory} className="inline-flex items-center gap-1 flex-wrap">
                            <input
                              value={addingSubTo.name}
                              onChange={(e) => {
                                const v = e.target.value;
                                setAddingSubTo((p) => ({ ...p, name: v, value: nameToValue(v) }));
                              }}
                              placeholder="Subcategory name"
                              className="border rounded px-2 py-1 text-sm w-28"
                            />
                            <input
                              value={addingSubTo.value}
                              onChange={(e) => setAddingSubTo((p) => ({ ...p, value: e.target.value }))}
                              placeholder="Value (auto)"
                              className="border rounded px-2 py-1 text-sm w-24"
                            />
                            <button type="submit" className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Add</button>
                            <button type="button" onClick={() => setAddingSubTo(null)} className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300">Cancel</button>
                          </form>
                        ) : (
                          <button
                            onClick={() => setAddingSubTo({ catId: cat._id, name: '', value: '' })}
                            className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                          >
                            + Add subcategory
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Orders</h2>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 w-full sm:w-auto"
              >
                Refresh
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white border p-12 text-center">
                <p className="text-gray-500 text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-gray-200">
                    {/* Order Header */}
                    <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1 w-full">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                              Order #{order._id?.slice(-8)?.toUpperCase() || 'N/A'}
                            </h3>
                            <span
                              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Customer:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {order.user?.name || 'Guest'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Email:</span>
                              <span className="ml-2 text-gray-900">{order.user?.email || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Date:</span>
                              <span className="ml-2 text-gray-900">
                                {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Items:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {order.items?.length || 0} item(s)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900 mt-1">
                              ₹{order.totalAmount?.toLocaleString() || '0'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="px-4 py-2 bg-red-600 text-white text-xs font-semibold hover:bg-red-700 whitespace-nowrap"
                          >
                            Delete Order
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Section */}
                    <div className="px-4 sm:px-6 py-4">
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Update Order Status:</label>
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          className="text-sm border border-gray-300 px-4 py-2 w-full sm:w-64 bg-white"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Order Items</h4>
                        <div className="space-y-3">
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                            >
                              {item.product?.images?.[0] ? (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover border border-gray-200 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">No Image</span>
                                </div>
                              )}
                              <div className="flex-1 min-w-0 w-full sm:w-auto">
                                <h5 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                                  {item.product?.name || 'Product Name Not Available'}
                                </h5>
                                {item.product?.brand && (
                                  <p className="text-xs text-gray-600 mb-2">Brand: {item.product.brand}</p>
                                )}
                                <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                                  <div>
                                    <span className="text-gray-600">Quantity:</span>
                                    <span className="ml-2 font-medium text-gray-900">{item.quantity}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Unit Price:</span>
                                    <span className="ml-2 font-medium text-gray-900">
                                      ₹{item.price?.toLocaleString() || '0'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Size:</span>
                                    <span className="ml-2 font-medium text-gray-900">
                                      {item.selectedSize || 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 w-full sm:w-auto sm:ml-auto">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Subtotal</p>
                                <p className="text-lg font-bold text-gray-900">
                                  ₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'order-status':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Status Management</h2>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 w-full sm:w-auto"
              >
                Refresh
              </button>
            </div>
            {orders.length === 0 ? (
              <div className="bg-white border p-12 text-center">
                <p className="text-gray-500 text-sm">No orders yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white border border-gray-200">
                    <div className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1 w-full space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                              Order #{order._id?.slice(-8)?.toUpperCase() || 'N/A'}
                            </h3>
                            <span
                              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="text-gray-600">Customer:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {order.user?.name || 'Guest'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Email:</span>
                              <span className="ml-2 text-gray-900">{order.user?.email || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Date:</span>
                              <span className="ml-2 text-gray-900">
                                {new Date(order.orderDate || order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Items:</span>
                              <span className="ml-2 font-medium text-gray-900">
                                {order.items?.length || 0} item(s)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900">
                              ₹{order.totalAmount?.toLocaleString() || '0'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="px-4 py-2 bg-red-600 text-white text-xs font-semibold hover:bg-red-700 whitespace-nowrap w-full sm:w-auto"
                          >
                            Delete Order
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Update Order Status:</label>
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          className="text-sm border border-gray-300 px-4 py-2 w-full sm:w-64 bg-white"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Users</h2>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 w-full sm:w-auto"
              >
                Refresh
              </button>
            </div>
            {loading ? (
              <div className="bg-white border p-12 text-center">
                <p className="text-gray-500 text-sm">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white border p-12 text-center">
                <p className="text-gray-500 text-sm">No users found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {users.map((user) => (
                  <div key={user._id} className="bg-white border border-gray-200">
                    <div className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1 w-full space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                              {user.name || 'No Name'}
                            </h3>
                            {user.isAdmin && (
                              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-blue-100 text-blue-800">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm">
                            <div>
                              <span className="text-gray-600">Email:</span>
                              <span className="ml-2 text-gray-900">{user.email || 'N/A'}</span>
                            </div>
                            {user.phone && (
                              <div>
                                <span className="text-gray-600">Phone:</span>
                                <span className="ml-2 text-gray-900">{user.phone}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-600">User ID:</span>
                              <span className="ml-2 text-gray-900 font-mono text-xs">
                                {user._id?.slice(-8)?.toUpperCase() || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Joined:</span>
                              <span className="ml-2 text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-4 py-2 bg-red-600 text-white text-xs font-semibold hover:bg-red-700 whitespace-nowrap w-full sm:w-auto"
                            disabled={user.isAdmin}
                          >
                            {user.isAdmin ? 'Cannot Delete Admin' : 'Delete User'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex-shrink-0 h-screen lg:h-screen transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-xs text-gray-500 mt-1">Control Center</p>
        </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-2 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setMessage({ type: '', text: '' });
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors mb-1 rounded ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeSection === item.id ? 'text-white' : 'text-gray-600'}`} />
              <span className="font-medium text-sm sm:text-base">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 mt-auto">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm sm:text-base">Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden w-full lg:w-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="p-4 sm:p-6">
          {message.text && (
            <div
              className={`rounded-lg px-4 py-3 text-sm mb-4 sm:mb-6 ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {message.text}
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
