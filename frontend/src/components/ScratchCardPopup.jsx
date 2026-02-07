import { useState } from 'react';
import { scratchCardAPI } from '../utils/api';

const ScratchCardPopup = ({ onClose }) => {
  const [step, setStep] = useState('phone'); // 'phone' | 'scratch' | 'revealing' | 'revealed' | 'already'
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await scratchCardAPI.scratch(phone.replace(/\D/g, ''));
      if (response.success) {
        setCoupons(response.data.coupons || []);
        setStep('scratch');
      }
    } catch (err) {
      if (err.response?.data?.alreadyScratched || err.message?.includes('already scratched')) {
        setStep('already');
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScratchClick = () => {
    setStep('revealing');
    // Animate for 1.5 seconds then show coupons
    setTimeout(() => {
      setStep('revealed');
    }, 1800);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleDismiss = () => {
    localStorage.setItem('scratchCardDismissed', Date.now().toString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={handleDismiss}>
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ===== STEP 1: Phone Input ===== */}
        {step === 'phone' && (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🎁</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Scratch & Win!</h2>
              <p className="text-sm text-gray-500 mt-1.5">Enter your phone number to unlock exclusive coupons</p>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={loading || phone.replace(/\D/g, '').length < 10}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Checking...
                  </span>
                ) : (
                  'Get My Scratch Card →'
                )}
              </button>
            </form>

            <p className="text-[10px] text-gray-400 text-center mt-4">We won't spam you. Your number is only used to prevent duplicate scratches.</p>
          </div>
        )}

        {/* ===== STEP 2: Scratch Card with Button ===== */}
        {step === 'scratch' && (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">Your Card is Ready!</h2>
              <p className="text-xs text-gray-500 mt-1">Tap the button below to scratch and reveal your rewards</p>
            </div>

            {/* Scratch Card Visual */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 shadow-lg mx-auto" style={{ height: 200 }}>
              {/* Gold overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)',
                }} />
                {/* Stars decoration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white/40 text-2xl mb-2 tracking-widest">✦ ✧ ★ ✧ ✦</div>
                    <div className="text-amber-800/60 text-xs font-bold uppercase tracking-[0.2em]">Mystery Reward</div>
                    <div className="mt-3 text-5xl">🎁</div>
                    <div className="text-amber-800/40 text-[10px] mt-2 uppercase tracking-wider">Tap below to reveal</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scratch Button */}
            <button
              onClick={handleScratchClick}
              className="w-full mt-5 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-sm flex items-center justify-center gap-2"
            >
              <span className="text-lg">✨</span>
              Scratch Now!
              <span className="text-lg">✨</span>
            </button>
          </div>
        )}

        {/* ===== STEP 2.5: Revealing Animation ===== */}
        {step === 'revealing' && (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">Scratching...</h2>
            </div>

            {/* Animated scratch card */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300 shadow-lg mx-auto" style={{ height: 200 }}>
              {/* Revealed content underneath */}
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                  <span className="text-5xl block animate-bounce">🎊</span>
                  <p className="text-lg font-bold text-green-600 mt-2">Congratulations!</p>
                  <p className="text-xs text-gray-500 mt-1">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} unlocked!</p>
                </div>
              </div>

              {/* Gold overlay that animates away */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 animate-[scratchReveal_1.5s_ease-in-out_forwards]">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)',
                }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center animate-pulse">
                    <div className="text-5xl mb-2">✨</div>
                    <div className="text-amber-800/70 text-sm font-bold">Scratching...</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-[dotPulse_0.6s_ease-in-out_infinite]" />
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-[dotPulse_0.6s_ease-in-out_0.2s_infinite]" />
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-[dotPulse_0.6s_ease-in-out_0.4s_infinite]" />
            </div>
          </div>
        )}

        {/* ===== STEP 3: Revealed Coupons ===== */}
        {step === 'revealed' && (
          <div className="p-6 sm:p-8">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🎊</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">You Won!</h2>
              <p className="text-xs text-gray-500 mt-1">Use these coupon codes at checkout to get discounts</p>
            </div>

            {coupons.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-sm">
                No active coupons available right now. Check back later!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {coupons.map((coupon, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl px-4 py-3 animate-[fadeSlideUp_0.4s_ease-out_forwards]"
                    style={{ animationDelay: `${idx * 100}ms`, opacity: 0 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-gray-900 text-sm tracking-wide">{coupon.code}</span>
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}% OFF`
                            : `₹${coupon.discountValue} OFF`}
                        </span>
                      </div>
                      {coupon.description && (
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{coupon.description}</p>
                      )}
                      {coupon.minOrderAmount > 0 && (
                        <p className="text-[10px] text-gray-400 mt-0.5">Min order: ₹{coupon.minOrderAmount}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className={`ml-3 flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        copiedCode === coupon.code
                          ? 'bg-green-500 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {copiedCode === coupon.code ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Checkout hints */}
            <div className="mt-4 space-y-2">
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-green-700">
                  Copy a code and apply it in your <strong>cart</strong> to get the discount at checkout!
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <p className="text-xs text-amber-700">
                  This coupon will be visible when you <strong>checkout</strong> your items. Don't forget to apply it before placing your order!
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="w-full mt-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* ===== Already Scratched ===== */}
        {step === 'already' && (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">😅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Already Scratched!</h2>
            <p className="text-sm text-gray-500 mt-2">
              This phone number has already been used to scratch a card. Each number can only scratch once.
            </p>
            <button
              onClick={handleDismiss}
              className="mt-6 px-8 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {/* Decorative bottom stripe */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400" />
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scratchReveal {
          0% { clip-path: inset(0 0 0 0); opacity: 1; }
          30% { clip-path: inset(0 0 0 0); opacity: 1; }
          50% { clip-path: inset(10% 10% 10% 10%); opacity: 0.8; }
          70% { clip-path: inset(25% 25% 25% 25%); opacity: 0.5; }
          100% { clip-path: inset(50% 50% 50% 50%); opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ScratchCardPopup;
