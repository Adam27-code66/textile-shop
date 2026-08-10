import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
}

const categoryImages: Record<string, string> = {
  'T-Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  'Hoodies': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  'Shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
  'Pants': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
};

export default function CategoryCard({ name, image, href }: CategoryCardProps) {
  return (
    <Link href={href} className="group relative block aspect-[3/4] overflow-hidden bg-[#13141B]">
      <Image
        src={image || categoryImages[name] || ''}
        alt={`Shop ${name}`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 border border-white/[0.04] group-hover:border-[#8B3DFF]/30 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-lg md:text-xl font-bold tracking-wider uppercase text-white">
          {name}
        </h3>
        <span className="inline-block mt-2 text-xs tracking-wider uppercase text-[#A6A6B0] group-hover:text-[#B84DFF] transition-colors duration-300">
          Shop Now →
        </span>
      </div>
    </Link>
  );
}

export function CategoryGrid() {
  const categories = [
    { name: 'T-Shirts', href: '/shop?category=T-Shirts' },
    { name: 'Hoodies', href: '/shop?category=Hoodies' },
    { name: 'Shirts', href: '/shop?category=Shirts' },
    { name: 'Pants', href: '/shop?category=Pants' },
    { name: 'Accessories', href: '/shop?category=Accessories' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.name}
          name={cat.name}
          image={categoryImages[cat.name]}
          href={cat.href}
        />
      ))}
    </div>
  );
}
