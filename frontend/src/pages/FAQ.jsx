import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping typically takes 5-7 business days. Express shipping (2-3 business days) is available for an additional fee. You can track your order status in your account dashboard.'
        },
        {
          q: 'What are the shipping charges?',
          a: 'We offer free shipping on orders above ₹1,000. For orders below ₹1,000, standard shipping charges are ₹99. Express shipping is available for ₹199.'
        },
        {
          q: 'Can I change or cancel my order?',
          a: 'You can cancel your order within 24 hours of placing it. After that, please contact our customer service team. Once your order has been shipped, you can return it using our return policy.'
        },
        {
          q: 'How do I track my order?',
          a: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the "Orders" section.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day return policy on all items. Items must be unworn, unwashed, and in their original packaging with tags attached. Customized or personalized items are not eligible for returns.'
        },
        {
          q: 'How do I return an item?',
          a: 'To return an item, log into your account, go to "Orders", select the order you want to return, and click "Return Item". Follow the instructions to generate a return label. We will process your refund within 5-7 business days after receiving the item.'
        },
        {
          q: 'How long does it take to process a refund?',
          a: 'Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method. It may take an additional 3-5 business days for the refund to appear in your account.'
        },
        {
          q: 'Do you offer exchanges?',
          a: 'We currently don\'t offer direct exchanges. If you need a different size or color, please return the item and place a new order. We\'ll process your return refund quickly so you can reorder.'
        }
      ]
    },
    {
      category: 'Products & Sizing',
      questions: [
        {
          q: 'How do I find my size?',
          a: 'Each product page includes a detailed size guide. You can also visit our Size Guide page for comprehensive sizing information. If you\'re still unsure, our customer service team can help you find the perfect fit.'
        },
        {
          q: 'Are your products authentic?',
          a: 'Yes, all our products are 100% authentic and sourced directly from authorized dealers and manufacturers. We guarantee the authenticity of every item we sell.'
        },
        {
          q: 'Do you offer gift wrapping?',
          a: 'Yes! We offer beautiful gift wrapping for an additional ₹99. You can select this option during checkout. We also include a personalized gift message at no extra charge.'
        },
        {
          q: 'What if an item is out of stock?',
          a: 'If an item is out of stock, you can sign up for email notifications to be alerted when it\'s back in stock. We restock popular items regularly, so check back often!'
        }
      ]
    },
    {
      category: 'Payment & Security',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay. We also offer Cash on Delivery (COD) for orders above ₹500.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your complete card details on our servers. All transactions are processed through secure payment gateways.'
        },
        {
          q: 'Do you offer installment plans?',
          a: 'Yes, we offer EMI options through our partner banks for orders above ₹5,000. You can select the EMI option during checkout and choose from various tenure options.'
        },
        {
          q: 'I was charged twice. What should I do?',
          a: 'If you notice a duplicate charge, please contact our customer service immediately with your order number. We\'ll investigate and process a refund if it\'s confirmed to be a duplicate transaction.'
        }
      ]
    },
    {
      category: 'Account & Support',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Sign Up" in the top navigation, enter your email address and create a password to create your account.'
        },
        {
          q: 'I forgot my password. How do I reset it?',
          a: 'Click on "Login" and then "Forgot Password". Enter your email address, and we\'ll send you a link to reset your password. Make sure to check your spam folder if you don\'t see the email.'
        },
        {
          q: 'How can I contact customer service?',
          a: 'You can reach us via email at support@styletrending.com, call us at +91 1800-123-4567, or use the contact form on our Contact Us page. Our team is available Monday-Friday, 9 AM - 6 PM.'
        },
        {
          q: 'Do you have a loyalty program?',
          a: 'Yes! Our loyalty program rewards you with points for every purchase. Earn 1 point for every ₹100 spent. Points can be redeemed for discounts on future purchases. Sign up is automatic when you create an account.'
        }
      ]
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about shopping with us.</p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-900 text-white px-6 py-4">
                <h2 className="text-xl font-semibold">{section.category}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {section.questions.map((faq, faqIndex) => {
                  const index = `${sectionIndex}-${faqIndex}`;
                  const isOpen = openIndex === index;
                  return (
                    <div key={faqIndex}>
                      <button
                        onClick={() => toggleQuestion(index)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50">
                          <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">Can't find the answer you're looking for? Please get in touch with our friendly team.</p>
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

export default FAQ;

