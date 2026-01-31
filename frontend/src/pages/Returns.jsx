import { Link } from 'react-router-dom';

const Returns = () => {
  const returnSteps = [
    { step: 1, title: 'Initiate Return', description: 'Log into your account, go to Orders, and click "Return Item"' },
    { step: 2, title: 'Select Items', description: 'Choose the items you want to return and provide a reason' },
    { step: 3, title: 'Get Return Label', description: 'We\'ll email you a prepaid return shipping label' },
    { step: 4, title: 'Package & Ship', description: 'Pack the items securely with original packaging and ship using the label' },
    { step: 5, title: 'Refund Processed', description: 'Once we receive and inspect the items, we\'ll process your refund' }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Returns & Refunds</h1>
          <p className="text-gray-600">Our hassle-free return policy ensures you shop with confidence.</p>
        </div>

        {/* Return Policy Overview */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Policy</h2>
          <div className="space-y-4 text-gray-700">
            <p>We offer a <strong>30-day return policy</strong> on all items. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange.</p>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Items Eligible for Return:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Items must be unworn, unwashed, and unused</li>
                <li>Original tags and labels must be attached</li>
                <li>Items must be in original packaging</li>
                <li>All accessories and documentation must be included</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-red-900 mb-2">Items NOT Eligible for Return:</h3>
              <ul className="list-disc list-inside space-y-1 text-red-700">
                <li>Customized or personalized items</li>
                <li>Items damaged due to misuse or wear</li>
                <li>Items without original tags or packaging</li>
                <li>Underwear, innerwear, and intimate apparel (for hygiene reasons)</li>
                <li>Items purchased during clearance sales (unless defective)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How to Return an Item</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {returnSteps.map((item, index) => (
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refund Information */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Information</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Refund Processing Time</h3>
              <p>Refunds are processed within <strong>5-7 business days</strong> after we receive and inspect your returned item. The refund will be credited to your original payment method.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Refund Method</h3>
              <p>Refunds are issued to the original payment method used for the purchase:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>Credit/Debit Cards: 3-5 business days after processing</li>
                <li>UPI/Wallets: 1-2 business days after processing</li>
                <li>Net Banking: 3-5 business days after processing</li>
                <li>Cash on Delivery: Refund via bank transfer (5-7 business days)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Return Shipping</h3>
              <p>We provide <strong>free return shipping</strong> for all eligible returns. Simply use the prepaid return label we email to you. For returns due to customer preference (not defects), return shipping may be deducted from the refund amount for orders below ₹999.</p>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Exchanges</h2>
          <div className="space-y-4 text-gray-700">
            <p>We currently don't offer direct exchanges. If you need a different size or color:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Return the item using our return process</li>
              <li>Place a new order for the desired size/color</li>
              <li>We'll process your return refund quickly so you can reorder</li>
            </ol>
            <p className="mt-4">This ensures you get the exact item you want while maintaining our fast return processing.</p>
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Need Help with Returns?</h3>
          <p className="text-gray-600 mb-4">If you have questions about returning an item or need assistance, our customer service team is here to help.</p>
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

export default Returns;

