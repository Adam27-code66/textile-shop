import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | AREA 51 ARCHIVES',
  description: 'The story behind AREA 51 ARCHIVES. Premium streetwear designed with purpose.',
};

export default function AboutPage() {
  return (
    <div className="pt-20 md:pt-24 pb-20 min-h-screen bg-[#08090C]">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-[#13141B]">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
          alt="AREA 51 ARCHIVES brand story"
          fill
          sizes="100vw"
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/50 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <span className="text-xs tracking-[0.4em] uppercase text-[#B84DFF]">
              Our Story
            </span>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white">
              BUILT DIFFERENT.
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Story */}
        <section className="py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs tracking-[0.4em] uppercase text-[#B84DFF]">
                Chapter 01
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-white">
                OUR STORY
              </h2>
              <div className="mt-6 space-y-4 text-[#A6A6B0] leading-relaxed">
                <p>
                  AREA 51 ARCHIVES was born from a simple belief: clothing should be more than
                  fabric. It should be a statement, a feeling, an extension of who you are.
                </p>
                <p>
                  What started as a small passion project between friends has grown into a movement.
                  We create pieces that bridge the gap between street culture and premium quality —
                  clothing that feels as good as it looks.
                </p>
                <p>
                  Every drop is limited. Every design is intentional. We don&apos;t follow trends —
                  we set them.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#13141B]">
              <Image
                src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80"
                alt="Our story"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Philosophy */}
        <section className="py-20 md:py-28 border-t border-white/[0.04]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#13141B] lg:order-1">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
                alt="Our philosophy"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="lg:order-2">
              <span className="text-xs tracking-[0.4em] uppercase text-[#B84DFF]">
                Chapter 02
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-white">
                OUR PHILOSOPHY
              </h2>
              <div className="mt-6 space-y-4 text-[#A6A6B0] leading-relaxed">
                <p>
                  We believe in doing less, better. Every piece in our collection exists because it
                  deserves to — not because we need to fill shelves.
                </p>
                <p>
                  Minimal design. Maximum impact. We strip away the unnecessary and focus on what
                  matters: fit, fabric, and feeling.
                </p>
                <p>
                  Our archive isn&apos;t just a collection — it&apos;s a curation. Each piece tells
                  a story, and together they create a wardrobe that&apos;s distinctly yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Quality */}
        <section className="py-20 md:py-28 border-t border-white/[0.04]">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs tracking-[0.4em] uppercase text-[#B84DFF]">
                Chapter 03
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-white">
                OUR QUALITY
              </h2>
              <div className="mt-6 space-y-4 text-[#A6A6B0] leading-relaxed">
                <p>
                  We source our fabrics from the finest mills. Every stitch is inspected. Every seam
                  is reinforced. We don&apos;t cut corners — we reinforce them.
                </p>
                <p>
                  From 240 GSM cotton tees to 380 GSM French terry hoodies, weight is just the
                  beginning. The hand-feel, the drape, the way it ages — that&apos;s what separates
                  us from the rest.
                </p>
                <p>
                  Our garments aren&apos;t fast fashion. They&apos;re built to last, to develop
                  character, to become your favorite pieces.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#13141B]">
              <Image
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                alt="Our quality"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Community */}
        <section className="py-20 md:py-28 border-t border-white/[0.04]">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs tracking-[0.4em] uppercase text-[#B84DFF]">
              Chapter 04
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-white">
              OUR COMMUNITY
            </h2>
            <div className="mt-6 space-y-4 text-[#A6A6B0] leading-relaxed">
              <p>
                AREA 51 ARCHIVES is more than a brand — it&apos;s a community of individuals who
                choose to express themselves through what they wear.
              </p>
              <p>
                From the streets of Chennai to cities across India, our archive is worn by those who
                dare to be different. Join us.
              </p>
            </div>
            <div className="mt-6 h-px w-16 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] mx-auto" />
          </div>
        </section>
      </div>
    </div>
  );
}
