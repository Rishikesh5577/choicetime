import { Link } from 'react-router-dom';

const SizeGuide = () => {
  const mensSizes = [
    { size: 'S', chest: '36-38', waist: '30-32', length: '28' },
    { size: 'M', chest: '38-40', waist: '32-34', length: '29' },
    { size: 'L', chest: '40-42', waist: '34-36', length: '30' },
    { size: 'XL', chest: '42-44', waist: '36-38', length: '31' },
    { size: 'XXL', chest: '44-46', waist: '38-40', length: '32' }
  ];

  const womensSizes = [
    { size: 'XS', bust: '30-32', waist: '24-26', hips: '34-36' },
    { size: 'S', bust: '32-34', waist: '26-28', hips: '36-38' },
    { size: 'M', bust: '34-36', waist: '28-30', hips: '38-40' },
    { size: 'L', bust: '36-38', waist: '30-32', hips: '40-42' },
    { size: 'XL', bust: '38-40', waist: '32-34', hips: '42-44' }
  ];

  const shoeSizes = [
    { us: '6', uk: '5', eu: '39', cm: '24' },
    { us: '7', uk: '6', eu: '40', cm: '25' },
    { us: '8', uk: '7', eu: '41', cm: '26' },
    { us: '9', uk: '8', eu: '42', cm: '27' },
    { us: '10', uk: '9', eu: '43', cm: '28' },
    { us: '11', uk: '10', eu: '44', cm: '29' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center text-sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Size Guide</h1>
          <p className="text-gray-600">Find your perfect fit with our comprehensive size guide.</p>
        </div>

        {/* How to Measure */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Measure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Tops & Shirts</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                <li><strong>Waist:</strong> Measure around your natural waistline, typically the narrowest part of your torso.</li>
                <li><strong>Length:</strong> Measure from the top of the shoulder down to the desired length.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">For Bottoms</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><strong>Waist:</strong> Measure around your natural waistline where you normally wear your pants.</li>
                <li><strong>Hips:</strong> Measure around the fullest part of your hips, keeping the tape horizontal.</li>
                <li><strong>Inseam:</strong> Measure from the crotch to the bottom of the leg along the inside seam.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Men's Size Chart */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Men's Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Chest (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Waist (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Length (inches)</th>
                </tr>
              </thead>
              <tbody>
                {mensSizes.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{item.size}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.chest}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.waist}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Women's Size Chart */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Women's Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Bust (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Waist (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Hips (inches)</th>
                </tr>
              </thead>
              <tbody>
                {womensSizes.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{item.size}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.bust}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.waist}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shoe Size Chart */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shoe Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">US</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">UK</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">EU</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">CM</th>
                </tr>
              </thead>
              <tbody>
                {shoeSizes.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">{item.us}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.uk}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.eu}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>How to measure your foot:</strong> Stand on a piece of paper and trace around your foot. Measure the length from heel to toe in centimeters. Use this measurement to find your size in the chart above.
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Size Guide Tips</h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-900 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Measure yourself while wearing the type of undergarments you'll wear with the item.</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-900 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Keep the measuring tape snug but not tight. It should be parallel to the floor.</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-900 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>If you're between sizes, we recommend sizing up for a more comfortable fit.</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-900 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Different brands may have slight variations in sizing. Always check the specific product's size chart.</p>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Still Unsure About Your Size?</h3>
          <p className="text-gray-600 mb-4">Our customer service team can help you find the perfect fit. Contact us for personalized sizing assistance.</p>
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

export default SizeGuide;

