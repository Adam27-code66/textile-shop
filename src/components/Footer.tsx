import Link from 'next/link';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'T-Shirts', href: '/shop?category=T-Shirts' },
    { label: 'Hoodies', href: '/shop?category=Hoodies' },
    { label: 'Accessories', href: '/shop?category=Accessories' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/contact' },
  ],
  support: [
    { label: 'Shipping', href: '/contact' },
    { label: 'Returns', href: '/contact' },
    { label: 'Size Guide', href: '/contact' },
  ],
};

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#08090C] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex flex-col items-start">
              <span className="text-lg font-black tracking-wider bg-gradient-to-r from-[#B84DFF] to-[#E23DFF] bg-clip-text text-transparent">
                AREA 51
              </span>
              <span className="text-[8px] tracking-[0.35em] text-[#A6A6B0] uppercase">
                Archives
              </span>
            </Link>
            <p className="mt-4 text-sm text-[#A6A6B0] leading-relaxed max-w-xs">
              Premium streetwear for those who dare to be different. Limited drops, unlimited expression.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/[0.08] text-[#A6A6B0] hover:text-[#B84DFF] hover:border-[#B84DFF]/30 transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/[0.08] text-[#A6A6B0] hover:text-[#B84DFF] hover:border-[#B84DFF]/30 transition-all duration-300"
                aria-label="Twitter / X"
              >
                <XIcon size={16} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A6A6B0] hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A6A6B0] hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A6A6B0] hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#A6A6B0]/60">
            © {new Date().getFullYear()} AREA 51 ARCHIVES. All rights reserved.
          </p>
          <p className="text-xs text-[#A6A6B0]/40">
            Designed with purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
