import { Sparkles, Timer, Shirt, Compass } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Every piece is crafted from handpicked fabrics that feel as good as they look.',
  },
  {
    icon: Timer,
    title: 'Limited Drops',
    description: 'Small batches. Once they\'re gone, they\'re gone. Exclusivity is our standard.',
  },
  {
    icon: Shirt,
    title: 'Comfort First',
    description: 'Designed to move with you. From the streets to the studio, comfort is non-negotiable.',
  },
  {
    icon: Compass,
    title: 'Designed with Purpose',
    description: 'Every detail is intentional. From stitch to silhouette, nothing is accidental.',
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-[#0D0E13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 border border-white/[0.04] hover:border-[#8B3DFF]/20 transition-all duration-500 bg-white/[0.01] hover:bg-white/[0.02]"
            >
              <feature.icon
                size={24}
                className="text-[#8B3DFF] mb-4 group-hover:text-[#B84DFF] transition-colors duration-300"
                strokeWidth={1.5}
              />
              <h3 className="text-sm font-semibold tracking-wider uppercase text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[#A6A6B0] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
