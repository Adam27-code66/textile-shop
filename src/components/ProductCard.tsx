'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, product.sizes[0] || 'M', product.colors[0] || { name: 'Default', hex: '#000' });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#13141B]">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-75' : ''
          }`}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badge */}
        {product.badge && !isOutOfStock && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] text-white text-[10px] font-bold uppercase tracking-wider">
            {product.badge}
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm z-10">
            Out of Stock
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 bg-[#08090C]/60 backdrop-blur-sm border border-white/[0.06] text-white/80 hover:text-[#E23DFF] transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? '#E23DFF' : 'none'} stroke={wishlisted ? '#E23DFF' : 'currentColor'} />
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`absolute bottom-3 left-3 right-3 py-2.5 backdrop-blur-sm border border-white/[0.08] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-500 z-10 ${
            isOutOfStock
              ? 'bg-neutral-800/80 text-neutral-400 cursor-not-allowed opacity-100'
              : 'bg-[#08090C]/80 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#8B3DFF]/80'
          }`}
          aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
        >
          <ShoppingBag size={14} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <p className="text-[11px] uppercase tracking-wider text-[#A6A6B0]/60">{product.category}</p>
        <h3 className="text-sm font-medium text-white group-hover:text-[#B84DFF] transition-colors duration-300 truncate">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">{formatPrice(product.price)}</p>
          {isOutOfStock && (
            <span className="text-[10px] text-red-400 font-medium uppercase tracking-wide">Unavailable</span>
          )}
        </div>

        {/* Color dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.name}
                className="w-3 h-3 rounded-full border border-white/10"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
