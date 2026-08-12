'use client';

import { useState, useEffect } from 'react';
import { X, Lock, ShieldCheck, ShoppingBag, CreditCard, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { items, total, subtotal, shipping, clearCart } = useCart();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomerEmail(user.email || '');
      setCustomerName(user.fullName || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName || !customerEmail || !shippingAddress) {
      setErrorMessage('Please fill in your name, email, and shipping address.');
      return;
    }

    if (!items || items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Razorpay Order on Server
      const createRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
        }),
      });

      const createData = await createRes.json();

      if (!createData.success) {
        setErrorMessage(createData.error || 'Failed to initialize payment.');
        setIsProcessing(false);
        return;
      }

      // 2. Load Razorpay Checkout Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMessage('Failed to load Razorpay SDK. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      // 3. Configure Razorpay Options
      const options = {
        key: createData.keyId,
        amount: createData.amount,
        currency: createData.currency || 'INR',
        name: 'AREA 51 ARCHIVES',
        description: 'Apparel & Textile Order (Test Mode)',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        order_id: createData.orderId,
        handler: async function (response: any) {
          try {
            // 4. Verify Cryptographic Signature on Server
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customerName,
                customerEmail,
                customerPhone,
                shippingAddress,
                items,
                totalAmount: createData.grandTotal,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();
              onSuccess(verifyData.orderId);
            } else {
              setErrorMessage(verifyData.error || 'Payment verification failed.');
            }
          } catch (err: any) {
            setErrorMessage(err.message || 'Payment verification error.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: '#8B3DFF',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        setErrorMessage(`Payment failed: ${response.error?.description || 'Transaction cancelled.'}`);
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0D0E13] border border-white/[0.1] rounded-xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#A6A6B0] hover:text-white transition-colors"
          aria-label="Close checkout modal"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#8B3DFF]/10 border border-[#8B3DFF]/30 text-[#B84DFF] rounded-lg">
            <CreditCard size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Razorpay Checkout</h2>
            <p className="text-xs text-[#A6A6B0]">Razorpay Test Mode — Secure Payment</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/60 text-red-300 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Order Brief */}
        <div className="mb-6 p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs space-y-2">
          <div className="flex justify-between text-[#A6A6B0]">
            <span>Items ({items.length})</span>
            <span className="text-white">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[#A6A6B0]">
            <span>Shipping</span>
            <span className="text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          <div className="border-t border-white/[0.06] pt-2 flex justify-between font-bold text-sm text-white">
            <span>Total Payable</span>
            <span className="text-[#B84DFF]">{formatPrice(total)}</span>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#A6A6B0] font-semibold uppercase tracking-wider mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 px-3.5 text-sm text-white placeholder:text-[#A6A6B0]/40 rounded focus:outline-none focus:border-[#8B3DFF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A6A6B0] font-semibold uppercase tracking-wider mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 px-3.5 text-sm text-white placeholder:text-[#A6A6B0]/40 rounded focus:outline-none focus:border-[#8B3DFF]"
              />
            </div>

            <div>
              <label className="block text-[#A6A6B0] font-semibold uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 px-3.5 text-sm text-white placeholder:text-[#A6A6B0]/40 rounded focus:outline-none focus:border-[#8B3DFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A6A6B0] font-semibold uppercase tracking-wider mb-1">
              Shipping Address <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Street address, City, Pincode, State"
              className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 px-3.5 text-sm text-white placeholder:text-[#A6A6B0]/40 rounded focus:outline-none focus:border-[#8B3DFF]"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-4 py-4 bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:from-[#7a2ef0] hover:to-[#a83ef0] transition-all duration-300 shadow-[0_0_20px_rgba(139,61,255,0.4)] rounded disabled:opacity-50"
          >
            <ShieldCheck size={16} />
            {isProcessing ? 'Initializing Razorpay...' : `Pay ${formatPrice(total)} (Test Mode)`}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#A6A6B0]/60">
          <Lock size={12} />
          <span>Secured by Razorpay Test Gateway (HMAC-SHA256 Verified)</span>
        </div>
      </div>
    </div>
  );
}
