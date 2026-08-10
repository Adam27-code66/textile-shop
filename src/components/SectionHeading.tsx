interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ title, subtitle, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[#A6A6B0] max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 h-px w-16 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </div>
  );
}
