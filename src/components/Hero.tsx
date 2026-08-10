import Button from './Button';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#08090C]">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#8B3DFF]/[0.07] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#E23DFF]/[0.05] rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Logo mark */}
        <div className="mb-8 inline-flex flex-col items-center animate-fade-in">
          <span className="text-4xl mb-2">
            <svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 0L48 20H32L24 28L16 20H0L24 0Z" fill="url(#hero-gradient)" fillOpacity="0.8" />
              <defs>
                <linearGradient id="hero-gradient" x1="0" y1="14" x2="48" y2="14" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B3DFF" />
                  <stop offset="1" stopColor="#E23DFF" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="text-xs tracking-[0.5em] uppercase text-[#A6A6B0]">
            Area 51 Archives
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-white leading-[0.9] animate-fade-in-up">
          WEAR YOUR
          <br />
          <span className="bg-gradient-to-r from-[#8B3DFF] via-[#B84DFF] to-[#E23DFF] bg-clip-text text-transparent">
            IDENTITY
          </span>
        </h1>

        {/* Supporting text */}
        <p className="mt-8 text-base md:text-lg text-[#A6A6B0] max-w-xl mx-auto leading-relaxed animate-fade-in-up-delay">
          Premium streetwear designed for those who refuse to blend in.
          <br className="hidden sm:block" />
          Limited drops. Unlimited expression.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up-delay-2">
          <Button href="/shop" variant="primary" size="lg">
            Shop Collection
          </Button>
          <Button href="/about" variant="outline" size="lg">
            Explore
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#8B3DFF]/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
