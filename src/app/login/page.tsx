'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter email and password.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      if (result.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/shop');
      }
    } else {
      setErrorMessage(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#08090C] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0D0E13] border border-white/[0.08] p-8 rounded-xl shadow-2xl relative">
        <div className="text-center mb-8">
          <span className="text-xs tracking-[0.3em] uppercase text-[#B84DFF] font-semibold">AREA 51 ARCHIVES</span>
          <h1 className="text-2xl font-bold text-white mt-1">Sign In</h1>
          <p className="text-xs text-[#A6A6B0] mt-2">
            Enter your email and password. Admin emails automatically access the Shop Owner dashboard.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/60 text-red-300 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com or admin email"
                className="w-full bg-white/[0.04] border border-white/[0.08] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#A6A6B0]/50 focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6B0]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#A6A6B0]/50 focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6B0]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white text-xs font-bold uppercase tracking-wider hover:from-[#7a2ef0] hover:to-[#a83ef0] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,61,255,0.3)] rounded-lg"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-[#A6A6B0]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#B84DFF] font-semibold hover:underline">
              Create Customer Account (Sign Up)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
