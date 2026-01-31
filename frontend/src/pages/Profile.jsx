import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { profileAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Invoice from '../components/Invoice';
import { FileText } from 'lucide-react';

// --- ICONS (Minimalist / Stroke Style) ---
const IconUser = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const IconShoppingBag = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const IconHeart = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);
const IconShoppingCart = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const IconMapPin = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconCreditCard = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const IconBell = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.007 2.007 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const IconShieldCheck = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.002 12.002 0 002.944 12c.047 1.994.496 3.931 1.258 5.728a11.97 11.97 0 006.183 4.288c.376.108.775.108 1.151 0a11.97 11.97 0 006.183-4.288c.762-1.797 1.211-3.734 1.258-5.728a12.002 12.002 0 00-1.742-9.056z" />
  </svg>
);
const IconLogout = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);
const IconAdmin = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.002 12.002 0 002.944 12c.047 1.994.496 3.931 1.258 5.728a11.97 11.97 0 006.183 4.288c.376.108.775.108 1.151 0a11.97 11.97 0 006.183-4.288c.762-1.797 1.211-3.734 1.258-5.728a12.002 12.002 0 00-1.742-9.056z" />
  </svg>
);
const IconChevronRight = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
    </svg>
  );


// OrderRow component for displaying order with invoice
const OrderRow = ({ order, user }) => {
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50/50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">
          #{order._id?.slice(-6).toUpperCase()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
            ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
              order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 text-right font-medium">
          ₹{order.totalAmount?.toLocaleString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          <button
            onClick={() => setShowInvoice(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            View
          </button>
        </td>
      </tr>
      {showInvoice && (
        <tr>
          <td colSpan="5" className="p-0">
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowInvoice(false)}>
              <div className="bg-white rounded-lg max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Invoice</h2>
                  <button
                    onClick={() => setShowInvoice(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <Invoice 
                    order={order} 
                    user={user}
                    onPrint={() => window.print()}
                  />
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const Profile = () => {
  const { user: authUser, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Menu items config
  const menuItems = [
    { id: 'profile', label: 'General', icon: IconUser, description: 'Personal details & address' },
    { id: 'orders', label: 'Orders', icon: IconShoppingBag, description: 'History & status' },
    { id: 'payments', label: 'Billing', icon: IconCreditCard, description: 'Cards & payments' },
    { id: 'security', label: 'Security', icon: IconShieldCheck, description: 'Password & 2FA' },
    { id: 'notifications', label: 'Notifications', icon: IconBell, description: 'Email & SMS preferences' },
  ];

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setProfileData(null);
      setIsLoading(false);
      return;
    }
    loadProfile();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
    if (searchParams.get('payment') === 'success') {
      setSuccess('Payment successful! Your order has been placed.');
      navigate('/profile?tab=orders', { replace: true });
    }
  }, [searchParams, navigate]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await profileAPI.getProfile();
      if (response.success) {
        setProfileData(response.data);
        const user = response.data.user;
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address 
            ? `${user.address.address || ''}, ${user.address.city || ''}, ${user.address.state || ''}, ${user.address.country || 'India'}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',')
            : '',
        });
      } else {
        setError(response.message || 'Failed to load profile data.');
      }
    } catch (err) {
      setError('Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let addressObj = null;
      if (formData.address && formData.address.trim()) {
        const parts = formData.address.split(',').map(p => p.trim()).filter(p => p);
        if (parts.length > 0) {
          addressObj = {
            address: parts[0] || '',
            city: parts[1] || '',
            state: parts[2] || '',
            country: parts[3] || 'India',
          };
        }
      }

      const updateData = {
        name: formData.name,
        phone: formData.phone,
      };

      if (addressObj) updateData.address = addressObj;

      const response = await profileAPI.updateProfile(updateData);
      if (response.success) {
        setSuccess('Profile updated successfully!');
        await loadProfile();
      } else {
        setError(response.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Reusable Input Style (Matches Login/Signup)
  const inputClass = "block w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition duration-150 ease-in-out placeholder-gray-400";
  const labelClass = "block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2";

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // Or redirect logic handled by router

  const { user } = profileData || {};
  const displayName = user?.name || 'User';
  const userInitial = displayName.charAt(0).toUpperCase();
  const isAdmin = authUser?.isAdmin || user?.isAdmin;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      
      {/* HEADER STRIP */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                 <Link to="/" className="text-zinc-500 hover:text-zinc-900 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                 </Link>
                 <span className="h-6 w-px bg-gray-200"></span>
                <h1 className="text-lg font-semibold tracking-tight">Account Settings</h1>
            </div>
          <button onClick={logout} className="text-sm font-medium text-zinc-500 hover:text-red-600 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="lg:col-span-3 space-y-8">
            {/* User Mini Card */}
            <div className="flex items-center gap-4 px-2">
                <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                    {userInitial}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate">{displayName}</p>
                    <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                </div>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-gray-200'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-gray-100/50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-zinc-900' : 'text-zinc-400'}`} />
                  {item.label}
                  {activeTab === item.id && <IconChevronRight className="w-4 h-4 ml-auto text-zinc-400" />}
                </button>
              ))}
               {isAdmin && (
                <Link to="/admin" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-gray-100/50">
                    <IconAdmin className="w-4 h-4 text-zinc-400" />
                    Admin Dashboard
                </Link>
               )}
            </nav>

            {/* Quick Stats (Mini) */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                 <Link to="/orders" className="bg-white p-3 rounded-lg border border-gray-100 text-center hover:border-gray-300 transition-colors">
                    <span className="block text-xl font-bold">{profileData?.orders?.length || 0}</span>
                    <span className="text-[10px] uppercase tracking-wide text-zinc-500">Orders</span>
                 </Link>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[500px]">
                
                {/* Content Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h2>
                        <p className="text-sm text-zinc-500">
                            {menuItems.find(i => i.id === activeTab)?.description}
                        </p>
                    </div>
                </div>

                {/* Notifications & Messages */}
                {(error || success) && (
                    <div className={`mx-6 mt-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        <span className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        {error || success}
                    </div>
                )}

                <div className="p-6">
                    {/* --- TAB: PROFILE --- */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs font-medium text-zinc-400 bg-gray-100 px-2 py-0.5 rounded">
                                            Verified
                                        </span>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Delivery Address</label>
                                    <textarea
                                        name="address"
                                        rows="3"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Street, City, State, Zip, Country"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex gap-3">
                                <button type="submit" className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors shadow-sm">
                                    Save Changes
                                </button>
                                <button type="button" onClick={loadProfile} className="px-5 py-2.5 bg-white text-zinc-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                                    Reset
                                </button>
                            </div>
                        </form>
                    )}

                    {/* --- TAB: ORDERS (Table View) --- */}
                    {activeTab === 'orders' && (
                        <div>
                           {profileData?.orders && profileData.orders.length > 0 ? (
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {profileData.orders.map((order) => (
                                            <OrderRow key={order._id} order={order} user={profileData.user} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                           ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IconShoppingBag className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No orders placed yet</h3>
                                <Link to="/" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800">
                                    Browse Products
                                </Link>
                            </div>
                           )}
                        </div>
                    )}

                     {/* --- TAB: PAYMENTS (Credit Card UI) --- */}
                     {activeTab === 'payments' && (
                        <div className="max-w-2xl">
                            <h3 className="text-sm font-semibold text-zinc-900 mb-4">Saved Cards</h3>
                            
                            {/* Realistic CSS Credit Card */}
                            <div className="relative w-80 h-48 bg-gradient-to-br from-zinc-800 to-black rounded-xl shadow-xl overflow-hidden text-white p-6 mb-8 transition-transform transform hover:-translate-y-1">
                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white opacity-5"></div>
                                <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-white opacity-5"></div>
                                
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-10 h-6 bg-zinc-500/50 rounded flex items-center justify-center">
                                        <div className="w-6 h-4 border border-white/30 rounded-sm"></div>
                                    </div>
                                    <span className="text-xs font-mono opacity-70">DEBIT</span>
                                </div>
                                
                                <div className="mb-6">
                                    <p className="font-mono text-xl tracking-widest text-shadow">•••• •••• •••• 4242</p>
                                </div>
                                
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1">Card Holder</p>
                                        <p className="font-medium tracking-wide uppercase text-sm">{displayName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] opacity-70 uppercase tracking-wider mb-1">Expires</p>
                                        <p className="font-medium tracking-wide text-sm">12/28</p>
                                    </div>
                                </div>
                            </div>

                            <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-gray-50 transition-all">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                Add Payment Method
                            </button>
                        </div>
                    )}

                    {/* --- TAB: SECURITY --- */}
                    {activeTab === 'security' && (
                         <div className="max-w-2xl space-y-6">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                                <div>
                                    <h4 className="text-sm font-semibold text-zinc-900">Password</h4>
                                    <p className="text-xs text-zinc-500 mt-1">Last changed 30 days ago</p>
                                </div>
                                <button className="text-sm font-medium text-zinc-900 hover:underline">Update</button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                                <div>
                                    <h4 className="text-sm font-semibold text-zinc-900">Two-Factor Authentication</h4>
                                    <p className="text-xs text-zinc-500 mt-1">Add an extra layer of security</p>
                                </div>
                                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                    <input type="checkbox" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300"/>
                                    <label className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: NOTIFICATIONS --- */}
                    {activeTab === 'notifications' && (
                        <div className="max-w-2xl space-y-2">
                             {[
                              { id: 'email', title: 'Order Updates', description: 'Get notified when your order status changes.' },
                              { id: 'promo', title: 'Promotional Emails', description: 'Receive emails about new products and sales.' },
                            ].map((item) => (
                                <label key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex h-5 items-center">
                                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-zinc-900 focus:ring-zinc-900" defaultChecked />
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-zinc-900">{item.title}</span>
                                        <span className="block text-xs text-zinc-500 mt-1">{item.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}

                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;