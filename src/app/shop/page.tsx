'use client';

import { Suspense } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import SectionHeading from '@/components/SectionHeading';
import { useProducts } from '@/context/ProductContext';
import { SortOption } from '@/types/product';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const { products, categories: dynamicCategories, isLoading } = useProducts();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'All');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (initialFilter === 'new') {
      result = result.filter((p) => p.isNewArrival);
    }

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Deterministic Stable Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'price-low') {
        cmp = a.price - b.price;
      } else if (sortBy === 'price-high') {
        cmp = b.price - a.price;
      } else if (sortBy === 'newest') {
        cmp = (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      } else {
        cmp = (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }

      if (cmp !== 0) return cmp;
      // Stable tie-breaker by product ID
      return a.id.localeCompare(b.id);
    });

    return result;
  }, [products, activeCategory, sortBy, searchQuery, initialFilter]);

  if (isLoading) {
    return <ShopFallback />;
  }

  return (
    <>
      <SectionHeading
        title={initialFilter === 'new' ? 'NEW ARRIVALS' : 'SHOP ALL'}
        subtitle={
          initialFilter === 'new'
            ? 'The latest clothing items from AREA 51 Textile.'
            : 'Explore our complete collection of premium textile and apparel.'
        }
      />

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name, material, category..."
            className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 px-4 text-sm text-white placeholder:text-[#A6A6B0]/60 focus:outline-none focus:border-[#8B3DFF]/50 transition-colors"
            aria-label="Search products"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-white/[0.08] text-sm text-[#A6A6B0] hover:text-white transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white/[0.04] border border-white/[0.08] py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-[#8B3DFF]/50 transition-colors cursor-pointer"
              aria-label="Sort products"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#13141B] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A6B0] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className={`mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="flex flex-wrap gap-2">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white shadow-[0_0_15px_rgba(139,61,255,0.4)]'
                  : 'border border-white/[0.08] text-[#A6A6B0] hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-[#A6A6B0] mb-6">
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </p>

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} />
    </>
  );
}

function ShopFallback() {
  return (
    <>
      <SectionHeading
        title="SHOP ALL"
        subtitle="Explore our complete collection of premium textile and apparel."
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-[#13141B]" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-16 bg-[#13141B] rounded" />
              <div className="h-4 w-32 bg-[#13141B] rounded" />
              <div className="h-4 w-20 bg-[#13141B] rounded" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-[#08090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ShopFallback />}>
          <ShopContent />
        </Suspense>
      </div>
    </div>
  );
}
