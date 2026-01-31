import { Facebook, Twitter, WhatsApp, Mail, Link2, Copy } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ToastContainer';

const SocialShare = ({ product }) => {
  const { success } = useToast();
  const [copied, setCopied] = useState(false);
  
  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/product/${product.category || 'product'}/${product._id || product.id}`
    : '';
  const productName = product.name || 'Product';
  const productImage = product.images?.[0] || product.image || '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productName)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${productName} ${productUrl}`)}`,
    email: `mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(`Check out this product: ${productUrl}`)}`,
  };

  const handleShare = (platform) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(productUrl);
      setCopied(true);
      success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Share:</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Share on Facebook"
        >
          <Facebook className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
          title="Share on Twitter"
        >
          <Twitter className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleShare('whatsapp')}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Share on WhatsApp"
        >
          <WhatsApp className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleShare('email')}
          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          title="Share via Email"
        >
          <Mail className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleShare('copy')}
          className={`p-2 rounded-lg transition-colors ${
            copied ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:bg-gray-50'
          }`}
          title="Copy link"
        >
          {copied ? <Copy className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default SocialShare;

