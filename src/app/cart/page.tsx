'use client';

import { ShoppingBag, ArrowRight } from 'lucide-react';
import CartItemComponent from '@/components/CartItem';
import Button from '@/components/Button';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';

export default function CartPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();

  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-[#08090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          YOUR CART
        </h1>
        <p className="text-sm text-[#A6A6B0] mb-10">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="mx-auto text-[#A6A6B0]/30 mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-[#A6A6B0] mb-8">Looks like you haven&apos;t added anything yet.</p>
            <Button href="/shop" variant="primary" size="lg">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {items.map((item, idx) => (
                <CartItemComponent key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${idx}`} item={item} />
              ))}
              <div className="flex justify-between items-center mt-6">
                <Button href="/shop" variant="ghost" size="sm">
                  ← Continue Shopping
                </Button>
                <button
                  onClick={clearCart}
                  className="text-xs text-[#A6A6B0] hover:text-[#E23DFF] transition-colors uppercase tracking-wider"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 bg-[#0D0E13] border border-white/[0.06]">
                <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#A6A6B0]">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#A6A6B0]">
                    <span>Shipping</span>
                    <span className="text-white">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-[#A6A6B0]/60">
                      Free shipping on orders above ₹1,999
                    </p>
                  )}
                  <div className="border-t border-white/[0.06] pt-3 flex justify-between font-semibold text-base">
                    <span className="text-white">Total</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                </div>

                <button className="w-full mt-6 py-4 bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:from-[#7a2ef0] hover:to-[#a83ef0] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,61,255,0.3)]">
                  Checkout
                  <ArrowRight size={16} />
                </button>

                <p className="text-[10px] text-[#A6A6B0]/40 text-center mt-4">
                  Payment integration coming soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
