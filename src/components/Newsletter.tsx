'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#0D0E13] relative overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#8B3DFF]/40 to-transparent" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          GET FIRST ACCESS
        </h2>
        <p className="mt-4 text-[#A6A6B0] text-base">
          Be the first to know about new drops, exclusive releases, and members-only offers.
        </p>

        {submitted ? (
          <div className="mt-8 py-4 px-6 border border-[#8B3DFF]/30 bg-[#8B3DFF]/[0.05]">
            <p className="text-white font-medium">Welcome to the Archive.</p>
            <p className="text-[#A6A6B0] text-sm mt-1">You&apos;ll hear from us soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 bg-white/[0.04] border border-white/[0.08] py-3.5 px-5 text-sm text-white placeholder:text-[#A6A6B0]/60 focus:outline-none focus:border-[#8B3DFF]/50 transition-colors"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white text-sm font-semibold uppercase tracking-wider hover:from-[#7a2ef0] hover:to-[#a83ef0] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,61,255,0.3)]"
            >
              Join the Archive
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
