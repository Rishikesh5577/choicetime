import { Link } from 'react-router-dom';

const ShippingInfo = () => {
  return (
    <div className="min-h-screen bg-[#F7F4EE] font-sans text-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-[#5C4D3D] hover:text-[#4A3F32] mb-4 inline-flex items-center text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Shipping Policy</h1>
        </div>

        {/* Shipping Policy Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Processing Time */}
          <div className="border-b border-gray-100">
            <div className="bg-[#5C4D3D] text-white px-6 py-3">
              <h2 className="text-lg font-semibold">Processing Time</h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-gray-600 leading-relaxed">
                All orders are processed within 1-2 business days. During peak periods such as Festival season, processing may take longer, but we will make every effort to ship your order as quickly as possible.
              </p>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="border-b border-gray-100">
            <div className="bg-[#5C4D3D] text-white px-6 py-3">
              <h2 className="text-lg font-semibold">Delivery Time</h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-gray-600 leading-relaxed">
                Delivery times may vary depending on your location. Typically, orders are delivered within 3-7 business days. Please note that delays may occur due to high demand during the festive season or unforeseen circumstances like weather conditions.
              </p>
            </div>
          </div>

          {/* Order Tracking */}
          <div>
            <div className="bg-[#5C4D3D] text-white px-6 py-3">
              <h2 className="text-lg font-semibold">Order Tracking</h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-gray-600 leading-relaxed">
                Once your order is shipped, you will receive a tracking number via email, allowing you to track your shipment in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help with Shipping?</h3>
          <p className="text-gray-600 mb-4">If you have questions about your shipment or need assistance, our customer service team is here to help.</p>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-[#5C4D3D] text-white font-semibold rounded-lg hover:bg-[#4A3F32] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
