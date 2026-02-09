import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const termsSections = [
    {
      title: '1. Accuracy of Information',
      content: 'To access and use the Services, you agree to provide true, accurate, and complete information to us during and after registration, and you shall be responsible for all acts done through the use of your registered account on the Platform.'
    },
    {
      title: '2. No Warranty',
      content: 'Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials offered on this website or through the Services for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.'
    },
    {
      title: '3. At Your Own Risk',
      content: 'Your use of our Services and the Platform is solely and entirely at your own risk and discretion, for which we shall not be liable to you in any manner. You are required to independently assess and ensure that the Services meet your requirements.'
    },
    {
      title: '4. Intellectual Property',
      content: 'The contents of the Platform and the Services are proprietary to us and licensed to us. You will not have any authority to claim any intellectual property rights, title, or interest in its contents. The content includes, but is not limited to, the design, layout, look, and graphics.'
    },
    {
      title: '5. Unauthorized Use',
      content: 'You acknowledge that unauthorized use of the Platform and/or the Services may lead to action against you as per these Terms of Use and/or applicable laws.'
    },
    {
      title: '6. Service Charges',
      content: 'You agree to pay us the charges associated with availing the Services.'
    },
    {
      title: '7. Lawful Use',
      content: 'You agree not to use the Platform and/or Services for any purpose that is unlawful, illegal, or forbidden by these Terms, or by Indian or local laws that might apply to you.'
    },
    {
      title: '8. Third-Party Links',
      content: 'You acknowledge that the website and Services may contain links to third-party websites. Upon accessing these links, you will be governed by the terms of use, privacy policy, and other policies of such third-party websites. These links are provided for your convenience to provide further information.'
    },
    {
      title: '9. Legally Binding Contract',
      content: 'You understand that upon initiating a transaction for availing the Services, you are entering into a legally binding and enforceable contract with the Platform Owner for the Services.'
    },
    {
      title: '10. Indemnity',
      content: 'You shall indemnify and hold harmless the Platform Owner, its affiliates, group companies (as applicable), and their respective officers, directors, agents, and employees, from any claim or demand, or actions including reasonable attorneys\' fees, made by any third party or penalty imposed due to or arising out of your breach of these Terms of Use, Privacy Policy, and other Policies, or your violation of any law, rules, or regulations or the rights (including infringement of intellectual property rights) of a third party.'
    },
    {
      title: '11. Limitation of Liability',
      content: 'In no event will the Platform Owner be liable for any indirect, consequential, incidental, special, or punitive damages, including without limitation, damages for loss of profits or revenues, business interruption, loss of business opportunities, loss of data, or loss of other economic interests, whether in contract, negligence, tort, or otherwise, arising from the use of or inability to use the Services. However, the Platform Owner\'s liability will not exceed the amount paid by you for using the Services giving rise to the cause of action or Rupees One Hundred (Rs. 100), whichever is less.'
    },
    {
      title: '12. Force Majeure',
      content: 'Notwithstanding anything contained in these Terms of Use, the parties shall not be liable for any failure to perform an obligation under these Terms if performance is prevented or delayed by a force majeure event.'
    },
    {
      title: '13. Governing Law and Jurisdiction',
      content: 'These Terms and any dispute or claim relating to them, or their enforceability, shall be governed by and construed in accordance with the laws of India. All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in India.'
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Terms & Conditions</h1>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-[#5C4D3D] text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Introduction</h2>
          </div>
          <div className="px-6 py-5 space-y-4 text-gray-600 leading-relaxed">
            <p>
              This document is an electronic record in terms of the Information Technology Act, 2000, and rules thereunder as applicable, and the amended provisions pertaining to electronic records in various statutes as amended by the Information Technology Act, 2000. This electronic record is generated by a computer system and does not require any physical or digital signatures.
            </p>
            <p>
              This document is published in accordance with the provisions of Rule 3 (1) of the Information Technology (Intermediaries guidelines) Rules, 2011, that require publishing the rules and regulations, privacy policy, and Terms of Use for access or usage of the domain name [choicetime.in] ("Website"), including the related mobile site and mobile application (hereinafter referred to as "Platform").
            </p>
            <p>
              The Platform is owned by Choice Collection, a company incorporated under the Companies Act, 1956, with its registered office at Shop No.3, Paud Rd, near Hotel Durga Cold Coffee, Tarangan Society, Ideal Colony, Kothrud, Pune, Maharashtra 411038 (hereinafter referred to as "Platform Owner," "we," "us," or "our").
            </p>
            <p>
              Your use of the Platform, services, and tools are governed by the following terms and conditions ("Terms of Use") as applicable to the Platform, including the applicable policies which are incorporated herein by way of reference. If you transact on the Platform, you shall be subject to the policies that are applicable for such transactions. By mere use of the Platform, you shall be contracting with the Platform Owner, and these terms and conditions, including the policies, constitute your binding obligations with the Platform Owner.
            </p>
            <p>
              These Terms of Use relate to your use of our website, goods (as applicable), or services (as applicable) (collectively, "Services"). Any terms and conditions proposed by you which are in addition to or which conflict with these Terms of Use are expressly rejected by the Platform Owner and shall be of no force or effect. These Terms of Use can be modified at any time without assigning any reason. It is your responsibility to periodically review these Terms of Use to stay informed of updates.
            </p>
            <p>
              For the purpose of these Terms of Use, wherever the context so requires, "you", "your," or "user" shall mean any natural or legal person who has agreed to become a user/buyer on the Platform.
            </p>
            <div className="bg-[#F7F4EE] border border-[#5C4D3D]/20 rounded-lg p-4 my-2">
              <p className="text-gray-800 font-semibold leading-relaxed text-sm uppercase">
                ACCESSING, BROWSING, OR OTHERWISE USING THE PLATFORM INDICATES YOUR AGREEMENT TO ALL THE TERMS AND CONDITIONS UNDER THESE TERMS OF USE, SO PLEASE READ THEM CAREFULLY BEFORE PROCEEDING.
              </p>
            </div>
            <p>
              The use of the Platform and/or availing of our Services is subject to the following Terms of Use:
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-4">
          {termsSections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-[#5C4D3D] text-white px-6 py-3">
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>
              <div className="px-6 py-5">
                <p className="text-gray-600 leading-relaxed">{section.content}</p>
              </div>
            </div>
          ))}

          {/* 14. Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-[#5C4D3D] text-white px-6 py-3">
              <h2 className="text-lg font-semibold">14. Contact Information</h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-gray-600 leading-relaxed mb-4">
                All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website.
              </p>
              <div className="p-4 bg-[#F7F4EE] rounded-lg space-y-1">
                <p className="text-gray-700"><strong>Choice Collection Kothrud</strong></p>
                <p className="text-gray-700"><strong>Email:</strong> choicecollectionkothrud@gmail.com</p>
                <p className="text-gray-700"><strong>Address:</strong> Shop No.3, Paud Rd, near Hotel Durga Cold Coffee, Tarangan Society, Ideal Colony, Kothrud, Pune, Maharashtra 411038</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
