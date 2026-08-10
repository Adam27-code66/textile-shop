import Image from 'next/image';
import SectionHeading from './SectionHeading';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600&q=80',
    alt: 'Street style lookbook shot 1',
  },
  {
    src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    alt: 'Street style lookbook shot 2',
  },
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    alt: 'Fashion editorial shot 1',
  },
  {
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
    alt: 'Fashion editorial shot 2',
  },
  {
    src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
    alt: 'Urban fashion lookbook shot',
  },
  {
    src: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80',
    alt: 'Minimalist fashion photography',
  },
];

export default function SocialGallery() {
  return (
    <section className="py-20 md:py-28 bg-[#08090C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="THE LOOKBOOK"
          subtitle="Street-ready style, captured in the wild."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden bg-[#13141B]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#08090C]/0 group-hover:bg-[#08090C]/30 transition-all duration-500" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-[#8B3DFF]/20 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
