import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import ProductGrid from '@/components/ProductGrid';
import { CategoryGrid } from '@/components/CategoryCard';
import EditorialSection from '@/components/EditorialSection';
import WhyUs from '@/components/WhyUs';
import SocialGallery from '@/components/SocialGallery';
import Newsletter from '@/components/Newsletter';
import { getFeaturedProducts, getNewArrivals } from '@/data/products';

export default function HomePage() {
  const featured = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Featured Collection */}
      <section className="py-20 md:py-28 bg-[#08090C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="FEATURED COLLECTION"
            subtitle="Curated pieces from our latest drop. Designed to stand out."
          />
          <ProductGrid products={featured.slice(0, 4)} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 md:py-28 bg-[#0D0E13]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="NEW ARRIVALS"
            subtitle="Fresh off the line. Be the first to wear what's next."
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
