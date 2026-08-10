'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Minus, Plus, ChevronRight, Truck, RotateCcw, Shield } from 'lucide-react';
import { getProductById, getRelatedProducts, formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import { Size, ProductColor } from '@/types/product';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const product = getProductById(params.id as string);
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product ? product.colors[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'material' | 'shipping'>('details');

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center min-h-screen bg-[#08090C]">
        <h1 className="text-2xl font-bold text-white">Product not found</h1>
        <p className="text-[#A6A6B0] mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Button href="/shop" variant="outline" className="mt-6">
          Back to Shop
        </Button>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const relatedProducts = getRelatedProducts(product.id, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product, selectedSize, selectedColor || product.colors[0], quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product, selectedSize, selectedColor || product.colors[0], quantity);
    router.push('/cart');
  };

  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-[#08090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#A6A6B0] mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-white truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#13141B]">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] text-white text-[10px] font-bold uppercase tracking-wider">
                  {product.badge}
                </div>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-16 h-20 overflow-hidden bg-[#13141B] border-2 transition-all duration-300 ${
                    activeImage === idx
                      ? 'border-[#8B3DFF]'
                      : 'border-transparent hover:border-white/20'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-[#B84DFF] mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-semibold text-white">
              {formatPrice(product.price)}
            </p>
            <p className="mt-4 text-sm text-[#A6A6B0] leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-wider uppercase text-white mb-3">
                Color — {selectedColor?.name || product.colors[0].name}
              </p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      (selectedColor?.name || product.colors[0].name) === color.name
                        ? 'border-[#8B3DFF] scale-110'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-wider uppercase text-white mb-3">
                Size
              </p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      selectedSize === size
                        ? 'bg-[#8B3DFF] text-white border border-[#8B3DFF]'
                        : 'border border-white/[0.08] text-[#A6A6B0] hover:text-white hover:border-white/20'
                    }`}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <p className="text-xs font-semibold tracking-wider uppercase text-white mb-3">
                Quantity
              </p>
              <div className="inline-flex items-center border border-white/[0.08]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-[#A6A6B0] hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 text-sm font-medium text-white min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-[#A6A6B0] hover:text-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white text-sm font-semibold uppercase tracking-wider hover:from-[#7a2ef0] hover:to-[#a83ef0] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,61,255,0.3)]"
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 border border-white/20 text-white text-sm font-semibold uppercase tracking-wider hover:bg-white/5 transition-all duration-300"
              >
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 border transition-all duration-300 ${
                  wishlisted
                    ? 'border-[#E23DFF]/30 text-[#E23DFF] bg-[#E23DFF]/5'
                    : 'border-white/[0.08] text-[#A6A6B0] hover:text-[#E23DFF] hover:border-[#E23DFF]/30'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={18} fill={wishlisted ? '#E23DFF' : 'none'} />
              </button>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-12 border-t border-white/[0.06] pt-8">
              <div className="flex gap-6 mb-6">
                {(['details', 'material', 'shipping'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs font-semibold tracking-wider uppercase pb-2 border-b-2 transition-all duration-300 ${
                      activeTab === tab
                        ? 'text-white border-[#8B3DFF]'
                        : 'text-[#A6A6B0] border-transparent hover:text-white'
                    }`}
                  >
                    {tab === 'details' ? 'Product Details' : tab === 'material' ? 'Material' : 'Shipping & Returns'}
                  </button>
                ))}
              </div>

              <div className="text-sm text-[#A6A6B0] leading-relaxed space-y-3">
                {activeTab === 'details' && (
                  <>
                    <p>{product.description}</p>
                    <p>Category: {product.category}</p>
                    <p>Available sizes: {product.sizes.join(', ')}</p>
                  </>
                )}
                {activeTab === 'material' && (
                  <>
                    <p>{product.material || 'Premium quality materials'}</p>
                    <p>{product.careInstructions || 'Machine wash cold. Tumble dry low.'}</p>
                  </>
                )}
                {activeTab === 'shipping' && (
                  <>
                    <div className="flex items-start gap-3">
                      <Truck size={16} className="text-[#8B3DFF] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white font-medium">Free shipping on orders above ₹1,999</p>
                        <p>Standard delivery: 5-7 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RotateCcw size={16} className="text-[#8B3DFF] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white font-medium">Easy returns</p>
                        <p>15-day return policy on all unworn items with tags</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield size={16} className="text-[#8B3DFF] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white font-medium">Quality guarantee</p>
                        <p>We stand behind every piece we make</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-8">
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
