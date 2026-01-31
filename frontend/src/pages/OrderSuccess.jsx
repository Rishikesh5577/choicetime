import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { CheckCircle, Package, Calendar, Receipt, Truck, FileText } from 'lucide-react';
import Invoice from '../components/Invoice';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getCartTotal } = useCart();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(10);
  const [isVisible, setIsVisible] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const paymentMethod = searchParams.get('method') || 'COD';
  const orderId = searchParams.get('orderId') || '';
  
  // Generate order number from orderId or create a random one
  const orderNumber = orderId ? orderId.slice(-8).toUpperCase() : `ORD${Date.now().toString().slice(-8)}`;
  
  // Calculate estimated delivery date (5-7 days from now)
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 3) + 5); // 5-7 days
  
  // Get order total from localStorage (stored before cart is cleared)
  const [orderTotal, setOrderTotal] = useState(0);
  
  // Fetch order details if orderId is available
  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        setLoadingOrder(true);
        try {
          const response = await orderAPI.getOrder(orderId);
          if (response.success) {
            setOrder(response.data.order);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoadingOrder(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);
  
  useEffect(() => {
    const storedTotal = localStorage.getItem('lastOrderTotal');
    if (storedTotal) {
      setOrderTotal(parseFloat(storedTotal));
      // Clear it after reading
      localStorage.removeItem('lastOrderTotal');
    }
  }, []);

  useEffect(() => {
    // Trigger fade-in animation
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Smooth transition before navigation
          setIsVisible(false);
          setTimeout(() => {
            navigate('/profile?tab=orders');
          }, 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToOrders = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate('/profile?tab=orders');
    }, 300);
  };

  const handleContinueShopping = () => {
    setIsVisible(false);
    setTimeout(() => {
      navigate('/');
    }, 300);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-12 transition-opacity duration-300"
      style={{
        opacity: isVisible ? 1 : 0
      }}
    >
      <div 
        className={`max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center transform transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        }`}
      >
        {/* Animated Success Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center relative transform transition-all duration-700"
            style={{
              animation: 'successPulse 2s ease-in-out infinite'
            }}
          >
            <div 
              className="absolute inset-0 bg-green-200 rounded-full opacity-0"
              style={{
                animation: 'ripple 2s ease-out infinite'
              }}
            ></div>
            <CheckCircle 
              className="w-14 h-14 text-green-600 relative z-10 transform transition-all duration-700"
              style={{
                animation: 'checkmarkDraw 0.8s ease-out 0.3s both'
              }}
            />
          </div>
        </div>

        {/* Success Message with Order Number */}
        <h1 
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 transform transition-all duration-500"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.2s both'
          }}
        >
          Order Placed Successfully! 🎉
        </h1>
        
        {/* Order Number */}
        <div 
          className="mb-4 transform transition-all duration-500"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.3s both'
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
            <Receipt className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Order Number:</span>
            <span className="text-sm font-bold text-gray-900">#{orderNumber}</span>
          </div>
        </div>
        
        <p 
          className="text-gray-600 mb-6 text-lg transform transition-all duration-500"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.4s both'
          }}
        >
          Your order has been confirmed and will be processed shortly.
        </p>
        
        {/* Order Details Cards */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 transform transition-all duration-500"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.5s both'
          }}
        >
          {/* Estimated Delivery */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900 uppercase">Estimated Delivery</span>
            </div>
            <p className="text-sm font-semibold text-blue-700">
              {estimatedDelivery.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xs text-blue-600 mt-1">5-7 business days</p>
          </div>
          
          {/* Payment Method */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-900 uppercase">Payment Method</span>
            </div>
            <p className="text-sm font-semibold text-purple-700">
              {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
            </p>
            {paymentMethod === 'COD' && (
              <p className="text-xs text-purple-600 mt-1">Pay on delivery</p>
            )}
          </div>
        </div>
        
        {/* Order Receipt Summary */}
        {orderTotal > 0 && (
          <div 
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 transform transition-all duration-500"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.6s both'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-semibold text-gray-900">Order Summary</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Total</span>
                <span className="font-semibold text-gray-900">₹{orderTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900">{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Order Timeline */}
        <div 
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 transform transition-all duration-500"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.7s both'
          }}
        >
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="text-left flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-2">Order Timeline</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Order confirmed</span>
                  <span className="text-xs text-gray-400 ml-auto">Just now</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-500">Processing</span>
                  <span className="text-xs text-gray-400 ml-auto">Within 24hrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-500">Shipped</span>
                  <span className="text-xs text-gray-400 ml-auto">2-3 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs text-gray-500">Delivered</span>
                  <span className="text-xs text-gray-400 ml-auto">{estimatedDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-redirect notice with animated countdown */}
        <div 
          className="mb-6 transform transition-all duration-500"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.8s both'
          }}
        >
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p>
              Redirecting to orders page in{' '}
              <span className="font-bold text-gray-700 text-sm">{countdown}</span>{' '}
              second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${((10 - countdown) / 10) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Action Buttons with Hover Effects */}
        <div 
          className="space-y-3 transform transition-all duration-500"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.9s both'
          }}
        >
          <button
            onClick={() => setShowInvoice(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            View Invoice
          </button>
          <button
            onClick={handleGoToOrders}
            className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-3.5 rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            View My Orders
          </button>
          <button
            onClick={handleContinueShopping}
            className="w-full bg-white text-gray-700 py-3.5 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold text-base transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
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
              {order ? (
                <Invoice 
                  order={order} 
                  user={user}
                  onPrint={() => window.print()}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading invoice...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes successPulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes checkmarkDraw {
          0% { 
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% { 
            transform: scale(1.2) rotate(5deg);
          }
          100% { 
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;

