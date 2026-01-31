import { Link } from 'react-router-dom';

const ShippingInfo = () => {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      duration: '5-7 business days',
      price: 'Free on orders above ₹1,000, ₹99 otherwise',
      description: 'Our standard shipping option delivers your order within 5-7 business days. Orders are processed within 1-2 business days.'
    },
    {
      name: 'Express Shipping',
      duration: '2-3 business days',
      price: '₹199',
      description: 'Need it faster? Express shipping delivers your order within 2-3 business days. Orders placed before 2 PM are processed the same day.'
    },
    {
      name: 'Same Day Delivery',
      duration: 'Same day',
      price: '₹299 (Select cities only)',
      description: 'Available in Mumbai, Delhi, Bangalore, and Hyderabad. Order before 12 PM for same-day delivery. Subject to availability and location.'
    }
  ];

  const shippingSteps = [
    { step: 1, title: 'Order Placed', description: 'You place your order and receive a confirmation email' },
    { step: 2, title: 'Order Processing', description: 'We prepare your order (1-2 business days)' },
    { step: 3, title: 'Order Shipped', description: 'Your order is dispatched and you receive tracking details' },
    { step: 4, title: 'Out for Delivery', description: 'Your order is on its way to you' },
    { step: 5, title: 'Delivered', description: 'Your order arrives at your doorstep' }
  ];

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shipping Information</h1>
          <p className="text-gray-600">Everything you need to know about shipping and delivery.</p>
        </div>

        {/* Shipping Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{option.duration}</p>
                <p className="text-sm font-medium text-gray-900 mb-3">{option.price}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Process</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {shippingSteps.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold">
                      {item.step}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                  {index < shippingSteps.length - 1 && (
                    <div className="absolute left-5 mt-10 w-0.5 h-6 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Important Information</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
              <p className="text-gray-600">All orders are processed within 1-2 business days (excluding weekends and holidays). Orders placed after 2 PM will be processed the next business day.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Areas</h3>
              <p className="text-gray-600">We ship to all major cities and towns across India. For remote locations, delivery may take additional 2-3 business days. International shipping is not currently available.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tracking Your Order</h3>
              <p className="text-gray-600">Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order status in real-time through your account dashboard or by using the tracking link provided.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Attempts</h3>
              <p className="text-gray-600">Our delivery partner will attempt delivery up to 3 times. If delivery fails, your order will be returned to us. Please ensure someone is available to receive the package or provide accurate delivery instructions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Undeliverable Packages</h3>
              <p className="text-gray-600">If a package is returned to us due to an incorrect address or failed delivery attempts, we'll contact you to arrange reshipment. Additional shipping charges may apply.</p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help with Shipping?</h3>
          <p className="text-gray-600 mb-4">If you have questions about your shipment or need assistance, our customer service team is here to help.</p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;

