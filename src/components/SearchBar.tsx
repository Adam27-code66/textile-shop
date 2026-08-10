'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <Search size={16} className="absolute left-3 text-[#A6A6B0]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-none py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-[#A6A6B0]/60 focus:outline-none focus:border-[#8B3DFF]/50 transition-colors duration-300"
        aria-label="Search products"
        autoFocus
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-[#A6A6B0] hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
