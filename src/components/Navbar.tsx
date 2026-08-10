'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import SearchBar from './SearchBar';

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?filter=new', label: 'New Arrivals' },
  { href: '/shop', label: 'Collections' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#08090C]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="AREA 51 ARCHIVES Home">
              <div className="flex flex-col items-center leading-none">
                <span className="text-[10px] tracking-[0.3em] text-[#B84DFF]">▲</span>
                <span className="text-lg md:text-xl font-black tracking-wider bg-gradient-to-r from-[#B84DFF] to-[#E23DFF] bg-clip-text text-transparent">
                  AREA 51
                </span>
                <span className="text-[8px] md:text-[9px] tracking-[0.35em] text-[#A6A6B0] uppercase">
                  Archives
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium tracking-wider uppercase text-[#A6A6B0] hover:text-white transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gradient-to-r after:from-[#8B3DFF] after:to-[#E23DFF] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Right Icons */}
            <div className="flex items-center gap-1 md:gap-3">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-[#A6A6B0] hover:text-white transition-colors duration-300"
                aria-label="Toggle search"
              >
                <Search size={18} />
              </button>

              <Link
                href="/wishlist"
                className="hidden md:flex p-2.5 text-[#A6A6B0] hover:text-white transition-colors duration-300 relative"
                aria-label={`Wishlist (${wishlist.length} items)`}
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0 -right-0 w-4 h-4 bg-[#E23DFF] rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="p-2.5 text-[#A6A6B0] hover:text-white transition-colors duration-300 relative"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-0 -right-0 w-4 h-4 bg-[#8B3DFF] rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden p-2.5 text-[#A6A6B0] hover:text-white transition-colors duration-300"
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isSearchOpen ? 'max-h-24 border-b border-white/[0.06]' : 'max-h-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileOpen ? 'visible' : 'invisible'
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[280px] bg-[#0D0E13] border-l border-white/[0.06] transition-transform duration-500 ease-out ${
            isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="pt-20 px-6">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="py-3 text-lg font-medium tracking-wider uppercase text-[#A6A6B0] hover:text-white hover:pl-2 transition-all duration-300 border-b border-white/[0.04]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setIsMobileOpen(false)}
                className="py-3 text-lg font-medium tracking-wider uppercase text-[#A6A6B0] hover:text-white hover:pl-2 transition-all duration-300 border-b border-white/[0.04] flex items-center gap-3"
              >
                <Heart size={18} />
                Wishlist
                {wishlist.length > 0 && (
                  <span className="ml-auto bg-[#E23DFF] rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileOpen(false)}
                className="py-3 text-lg font-medium tracking-wider uppercase text-[#A6A6B0] hover:text-white hover:pl-2 transition-all duration-300"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
