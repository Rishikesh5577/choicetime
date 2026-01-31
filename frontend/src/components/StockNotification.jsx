import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './ToastContainer';

const StockNotification = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated && !email) {
      showError('Please enter your email address');
      return;
    }

    try {
      // Store notification preference in localStorage (in real app, this would be an API call)
      const notifications = JSON.parse(localStorage.getItem('stock_notifications') || '[]');
      const notification = {
        productId: product._id || product.id,
        productName: product.name,
        email: isAuthenticated ? null : email,
        timestamp: new Date().toISOString(),
      };
      
      notifications.push(notification);
      localStorage.setItem('stock_notifications', JSON.stringify(notifications));
      
      setIsSubscribed(true);
      success('You will be notified when this product is back in stock');
      setEmail('');
    } catch (error) {
      showError('Failed to subscribe. Please try again.');
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <Check className="w-4 h-4" />
        <span>You'll be notified when this product is back in stock</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="flex gap-2">
      {!isAuthenticated && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          required={!isAuthenticated}
        />
      )}
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
      >
        <Bell className="w-4 h-4" />
        Notify Me
      </button>
    </form>
  );
};

export default StockNotification;

