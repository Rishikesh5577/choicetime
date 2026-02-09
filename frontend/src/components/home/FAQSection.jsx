import { useState } from 'react';

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major payment methods including Credit Cards, Debit Cards, UPI, Net Banking, and Cash on Delivery (COD) for your convenience.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery typically takes 5-7 business days depending on your location. We also offer express delivery options for faster shipping.'
  },
  {
    question: 'What is your return & exchange policy?',
    answer: 'We offer a hassle-free 7-day return and exchange policy. If you are not satisfied with your purchase, you can initiate a return or exchange within 7 days of delivery.'
  },
  {
    question: 'Are your products genuine & authentic?',
    answer: 'Yes, all our products are 100% genuine and authentic. We source directly from trusted manufacturers and brands to ensure the highest quality for our customers.'
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order is shipped, you will receive a tracking ID via email and SMS. You can use this tracking ID to check the real-time status of your delivery.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Currently, we deliver across India. We are working on expanding our services to international locations. Stay tuned for updates!'
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 md:py-16 bg-[#F7F4EE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header - matching website theme */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-widest">
            Frequently Asked Questions
          </h2>
          <div className="mt-2 mx-auto w-12 h-0.5 bg-gray-800 rounded-full"></div>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden transition-all duration-400 bg-white ${openIndex === index ? 'shadow-xl -translate-y-0.5' : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left transition-colors duration-200"
              >
                <span className="text-xs sm:text-sm font-semibold text-gray-800 pr-4 tracking-wide">{faq.question}</span>
                <span className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full transition-all duration-300 ${openIndex === index ? 'bg-gray-900 text-white rotate-180' : 'bg-[#F7F4EE] text-gray-600'}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
