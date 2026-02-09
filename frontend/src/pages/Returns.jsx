import { Link } from 'react-router-dom';

const ArrowItem = ({ children }) => (
  <li className="flex items-start">
    <span className="text-[#5C4D3D] mr-2 mt-0.5 font-bold">&#8594;</span>
    <span>{children}</span>
  </li>
);

const Returns = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Refund and Return Policy</h1>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Order Cancellation */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-[#5C4D3D] text-white px-6 py-3">
              <h2 className="text-lg font-semibold">Order Cancellation</h2>
            </div>
            <div className="px-6 py-5">
              <h3 className="font-semibold text-gray-900 mb-3">Physical Products</h3>
              <ul className="space-y-2 text-gray-600">
                <ArrowItem>Orders can be cancelled only before the item is shipped</ArrowItem>
                <ArrowItem>Orders already shipped cannot be cancelled</ArrowItem>
              </ul>
            </div>
          </div>

          {/* Refund Policy */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-[#5C4D3D] text-white px-6 py-3">
              <h2 className="text-lg font-semibold">Refund Policy</h2>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No-Refund Policy</h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  We maintain a strict no-refund policy for all products. However, we may make exceptions in the following cases:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <ArrowItem>Product Not Received</ArrowItem>
                  <ArrowItem>If the product is lost in transit</ArrowItem>
                  <ArrowItem>If the wrong product is delivered</ArrowItem>
                  <ArrowItem>If the product is damaged during shipping</ArrowItem>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Refund Process (When Applicable)</h3>
                <p className="text-gray-600 leading-relaxed">
                  If any refund is approved, the amount will be credited back to the original payment method within 7-14 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Return Policy */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-[#5C4D3D] text-white px-6 py-3">
              <h2 className="text-lg font-semibold">Return Policy</h2>
            </div>
            <div className="px-6 py-5 space-y-5">
              <p className="text-gray-600 leading-relaxed">
                We are committed to ensuring customer satisfaction and stand by the quality of our products. Below is our return policy to guide you through the return and replacement process:
              </p>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Eligibility for Return</h3>
                <ul className="space-y-2 text-gray-600">
                  <ArrowItem>Returns are accepted only for defective, damaged, or incorrect products received.</ArrowItem>
                  <ArrowItem>The return request must be initiated within 24 hours of receiving the product.</ArrowItem>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Return Process</h3>
                <ul className="space-y-2 text-gray-600">
                  <ArrowItem>If your return request is approved, the replacement process will be initiated within 2-3 business days.</ArrowItem>
                  <ArrowItem>Once the replacement is dispatched, it is expected to be delivered within 4-7 business days.</ArrowItem>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Important Notes</h3>
                <ul className="space-y-2 text-gray-600">
                  <ArrowItem>Delivery timelines may be affected by delays from the transport company, adverse weather conditions, or other unforeseen circumstances.</ArrowItem>
                  <ArrowItem>We are not responsible for delays caused by external factors beyond our control.</ArrowItem>
                </ul>
              </div>

              <p className="text-gray-600 leading-relaxed">
                We aim to make the return and replacement process as seamless as possible.
              </p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">If you have questions about returns or refunds, our customer service team is here to help.</p>
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

export default Returns;
