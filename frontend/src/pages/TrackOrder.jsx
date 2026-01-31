import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackingAPI } from '../utils/api';
import { useToast } from '../components/ToastContainer';

const TrackOrder = () => {
  const { isAuthenticated } = useAuth();
  const { error: showError } = useToast();
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setTrackingData(null);
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    try {
      const response = await trackingAPI.trackOrder(orderId.trim());
      if (response.success) {
        setTrackingData(response.data);
      } else {
        setError(response.message || 'Order not found');
        showError(response.message || 'Order not found');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to track order. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
      case 'in transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out for delivery':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order ID or tracking number to check the status of your order.</p>
        </div>

        {/* Track Order Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleTrack} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID or Tracking Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Alternative: View Orders if Logged In */}
        {isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">View All Orders</h3>
                <p className="text-sm text-blue-700 mb-3">You can view and track all your orders from your account dashboard.</p>
                <Link
                  to="/profile?tab=orders"
                  className="text-sm font-medium text-blue-900 hover:text-blue-700 underline"
                >
                  Go to My Orders →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order #{trackingData.orderId}</h2>
                  <p className="text-sm text-gray-600">Tracking Number: {trackingData.trackingNumber}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(trackingData.status)}`}>
                  {trackingData.status.charAt(0).toUpperCase() + trackingData.status.slice(1)}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(trackingData.estimatedDelivery).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
              {trackingData.timeline.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${index === trackingData.timeline.length - 1 ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
                    {index < trackingData.timeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-300 ml-1.5"></div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 pb-6">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-gray-900">{event.status}</h4>
                      <div className="text-sm text-gray-600">
                        <span>{event.date}</span>
                        <span className="ml-2">{event.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        {!trackingData && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Can't Find Your Order?</h3>
            <p className="text-gray-600 mb-4">If you're having trouble tracking your order, please contact our customer service team.</p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;

