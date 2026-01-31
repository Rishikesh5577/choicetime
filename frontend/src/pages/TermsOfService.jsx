import { Link } from 'react-router-dom';

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using StyleTrending's website and services, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited 
              from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Permission is granted to temporarily access the materials on StyleTrending's website for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you create an account with us, you must provide information that is accurate, complete, and current. 
              You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Maintaining the security of your account and password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring that you exit from your account at the end of each session</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Products and Pricing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant 
                  that product descriptions or other content on this site is accurate, complete, reliable, current, or 
                  error-free. If a product offered by us is not as described, your sole remedy is to return it in unused condition.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pricing</h3>
                <p className="text-gray-700 leading-relaxed">
                  All prices are in Indian Rupees (INR) and are subject to change without notice. We reserve the right 
                  to modify prices at any time. In the event of a pricing error, we reserve the right to cancel any orders 
                  placed at the incorrect price.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Orders and Payment</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Acceptance</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your order is an offer to purchase products from us. We reserve the right to accept or reject your order 
                  for any reason, including product availability, errors in pricing or product information, or problems 
                  identified by our credit and fraud avoidance department.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment</h3>
                <p className="text-gray-700 leading-relaxed">
                  Payment must be received by us before we ship your order. We accept various payment methods as indicated 
                  on our website. You represent and warrant that you have the legal right to use any payment method you use 
                  in connection with a purchase.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              Our return and refund policy is detailed in our <Link to="/returns" className="text-gray-900 underline hover:text-gray-700">Returns Policy</Link>. 
              By making a purchase, you agree to our return and refund policy. We reserve the right to refuse returns that 
              do not comply with our policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Uses</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You may not use our website:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any malicious code, viruses, or harmful data</li>
              <li>To impersonate or attempt to impersonate the company or any employee</li>
              <li>In any way that infringes upon the rights of others</li>
              <li>To engage in any automated use of the system</li>
              <li>To interfere with or disrupt the website or servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The website and its original content, features, and functionality are owned by StyleTrending and are protected by 
              international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not 
              reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit any of the 
              content without our prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall StyleTrending, its directors, employees, or agents be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from your use of the website or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to defend, indemnify, and hold harmless StyleTrending and its officers, directors, employees, and agents from 
              and against any claims, liabilities, damages, losses, and expenses, including without limitation, reasonable 
              attorney's fees, arising out of or in any way connected with your access to or use of the website or your violation 
              of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to 
              its conflict of law provisions. Any disputes arising under or in connection with these terms shall be subject to 
              the exclusive jurisdiction of the courts of Mumbai, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, we will 
              provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be 
              determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> legal@styletrending.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91 1800-123-4567</p>
              <p className="text-gray-700"><strong>Address:</strong> 123 Shopping Street, Mumbai, India 400001</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

