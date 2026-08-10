import Image from 'next/image';
import Button from './Button';

export default function EditorialSection() {
  return (
    <section className="py-20 md:py-28 bg-[#08090C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-[#13141B]">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              alt="The New Archive Collection"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090C]/60 via-transparent to-transparent" />
            {/* Purple glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#8B3DFF]/10 to-transparent" />
          </div>

          {/* Content */}
          <div className="lg:pl-12">
            <span className="text-xs tracking-[0.4em] uppercase text-[#B84DFF]">
              New Season
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]">
              THE NEW
              <br />
              ARCHIVE
            </h2>
            <p className="mt-6 text-base md:text-lg text-[#A6A6B0] leading-relaxed max-w-md">
              Everyday pieces. Built differently. Our latest collection merges street-ready
              silhouettes with premium materials, designed for those who move with intention.
            </p>
            <div className="mt-8">
              <Button href="/shop" variant="outline" size="lg">
                Explore Collection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
