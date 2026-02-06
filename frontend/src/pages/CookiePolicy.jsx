import { Link } from 'react-router-dom';

const CookiePolicy = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: January 2024</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to the website owners. 
              Cookies allow a website to recognize your device and store some information about your preferences or past actions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies for several purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Functionality Cookies:</strong> Remember your preferences and choices</li>
              <li><strong>Targeting Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies are necessary for the website to function and cannot be switched off. They are usually 
                  set in response to actions made by you, such as setting your privacy preferences, logging in, or filling 
                  in forms.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Session management</li>
                  <li>Authentication</li>
                  <li>Security</li>
                  <li>Shopping cart functionality</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with our website by collecting and reporting 
                  information anonymously. This helps us improve the website's performance and user experience.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Page views and navigation patterns</li>
                  <li>Time spent on pages</li>
                  <li>Error messages and page load times</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies enable the website to provide enhanced functionality and personalization. They may be set 
                  by us or by third-party providers whose services we have added to our pages.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Language preferences</li>
                  <li>Region settings</li>
                  <li>User preferences and settings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advertising Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies are used to make advertising messages more relevant to you and your interests. They also 
                  perform functions like preventing the same ad from continuously reappearing.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Ad targeting and personalization</li>
                  <li>Ad performance measurement</li>
                  <li>Frequency capping</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of 
              the website and deliver advertisements. These third parties may include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
              <li><strong>Payment Processors:</strong> To securely process payments</li>
              <li><strong>Social Media Platforms:</strong> To enable social sharing features</li>
              <li><strong>Advertising Networks:</strong> To deliver relevant advertisements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browser Settings</h3>
                <p className="text-gray-700 leading-relaxed">
                  Most web browsers allow you to control cookies through their settings preferences. You can set your browser 
                  to refuse cookies or delete certain cookies. However, if you choose to delete or refuse cookies, this may 
                  impact your experience on our website, as some features may not function properly.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Opt-Out Options</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  You can opt out of certain types of cookies:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Analytics cookies: Use browser add-ons or opt-out tools provided by analytics services</li>
                  <li>Advertising cookies: Visit the Digital Advertising Alliance or Network Advertising Initiative websites</li>
                  <li>Social media cookies: Adjust privacy settings on the respective social media platforms</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookie Duration</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies are temporary and are deleted when you close your browser. They enable the website to 
                  keep track of your movement from page to page so you don't get asked for information you've already provided.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Persistent Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies remain on your device for a set period or until you delete them. They help us recognize 
                  you when you return to our website and remember your preferences.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, 
              legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. More Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              For more information about cookies and how to manage them, you can visit:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
              <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-gray-700">All About Cookies</a></li>
              <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 underline hover:text-gray-700">Your Online Choices</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> privacy@choicetime.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91 1800-123-4567</p>
              <p className="text-gray-700"><strong>Address:</strong> 123 Shopping Street, Mumbai, India 400001</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;

