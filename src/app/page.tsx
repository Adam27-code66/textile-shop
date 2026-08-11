'use client';

import { useMemo } from 'react';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import ProductGrid from '@/components/ProductGrid';
import { CategoryGrid } from '@/components/CategoryCard';
import EditorialSection from '@/components/EditorialSection';
import WhyUs from '@/components/WhyUs';
import SocialGallery from '@/components/SocialGallery';
import Newsletter from '@/components/Newsletter';
import { useProducts } from '@/context/ProductContext';

export default function HomePage() {
  const { products } = useProducts();

  const featured = useMemo(() => {
    const list = products.filter((p) => p.isFeatured);
    return list.length > 0 ? list : products;
  }, [products]);

  const newArrivals = useMemo(() => {
    const list = products.filter((p) => p.isNewArrival);
    return list.length > 0 ? list : products;
  }, [products]);

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Featured Collection */}
      <section className="py-20 md:py-28 bg-[#08090C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="FEATURED COLLECTION"
            subtitle="Curated apparel & textiles from our latest drop."
          />
          <ProductGrid products={featured.slice(0, 4)} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 md:py-28 bg-[#0D0E13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="NEW ARRIVALS"
            subtitle="Fresh off the line. Explore the latest textile creations."
          />
          <ProductGrid products={newArrivals.slice(0, 4)} />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 md:py-28 bg-[#08090C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="SHOP BY CATEGORY"
            subtitle="Find exactly what you're looking for."
          />
          <CategoryGrid />
        </div>
      </section>

      {/* Editorial */}
      <EditorialSection />

      {/* Why Us */}
      <WhyUs />

      {/* Social Gallery */}
      <SocialGallery />

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
