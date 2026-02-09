import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Personal Information</h3>
            <p className="text-gray-600 leading-relaxed">
              We collect personal details such as your name, email address, shipping address, phone number, and payment information when you make a purchase, create an account, or contact us.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Non-Personal Information</h3>
            <p className="text-gray-600 leading-relaxed">
              We may collect non-personal data such as browser type, operating system, and browsing behavior to improve our website and services.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'How We Use Your Information',
      content: (
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">To Process Orders</h3>
            <p className="text-gray-600 leading-relaxed">We use your personal information to process and fulfill your orders.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">To Communicate</h3>
            <p className="text-gray-600 leading-relaxed">We use your contact information to send you updates about your order, respond to inquiries, and send promotional materials if you have opted in.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">To Improve Our Services</h3>
            <p className="text-gray-600 leading-relaxed">We analyze non-personal information to understand user behavior and enhance our website's performance.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Information Sharing',
      content: (
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Third-Party Service Providers</h3>
            <p className="text-gray-600 leading-relaxed">We may share your information with third-party service providers who assist us in operating our website, processing payments, and delivering orders.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Legal Requirements</h3>
            <p className="text-gray-600 leading-relaxed">We may disclose your information if required by law or to protect our rights.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Data Security',
      content: (
        <p className="text-gray-600 leading-relaxed">
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
        </p>
      )
    },
    {
      title: 'Your Rights',
      content: (
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Access and Correction</h3>
            <p className="text-gray-600 leading-relaxed">You have the right to access and correct your personal information. You can update your account details through our website.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Opt-Out</h3>
            <p className="text-gray-600 leading-relaxed">You can opt-out of receiving promotional emails by following the unsubscribe instructions in the emails.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Changes to This Policy',
      content: (
        <p className="text-gray-600 leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the revised date will be indicated at the top of the page.
        </p>
      )
    }
  ];

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
        </div>

        {/* Privacy Policy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-[#5C4D3D] text-white px-6 py-3">
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>
              <div className="px-6 py-5">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
