'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { getProductById } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();

  const wishlistProducts = wishlist
    .map((id) => getProductById(id))
    .filter(Boolean);

  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-[#08090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          WISHLIST
        </h1>
        <p className="text-sm text-[#A6A6B0] mb-10">
          {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
        </p>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto text-[#A6A6B0]/30 mb-6" />
            <h2 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-[#A6A6B0] mb-8">Save items you love for later.</p>
            <Button href="/shop" variant="primary" size="lg">
              Browse Collection
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={clearWishlist}
                className="text-xs text-[#A6A6B0] hover:text-[#E23DFF] transition-colors uppercase tracking-wider"
              >
                Clear Wishlist
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlistProducts.map(
                (product) =>
                  product && <ProductCard key={product.id} product={product} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
