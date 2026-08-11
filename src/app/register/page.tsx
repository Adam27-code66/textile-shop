'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    const result = await register(fullName, email, password);
    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting to shop catalog...');
      setTimeout(() => {
        router.push('/shop');
      }, 1500);
    } else {
      setErrorMessage(result.error || 'Failed to create customer account.');
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#08090C] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0D0E13] border border-white/[0.08] p-8 rounded-lg shadow-2xl relative">
        <div className="text-center mb-8">
          <span className="text-xs tracking-[0.3em] uppercase text-[#B84DFF] font-semibold">Join AREA 51</span>
          <h1 className="text-2xl font-bold text-white mt-1">Create Customer Account</h1>
          <p className="text-xs text-[#A6A6B0] mt-2">Sign up to get fast checkout and order tracking.</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800/40 text-red-300 text-xs rounded flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs rounded flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#A6A6B0]/50 focus:outline-none focus:border-[#8B3DFF] transition-colors rounded"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6B0]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#A6A6B0]/50 focus:outline-none focus:border-[#8B3DFF] transition-colors rounded"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6B0]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#A6A6B0]/50 focus:outline-none focus:border-[#8B3DFF] transition-colors rounded"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6B0]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-[#A6A6B0]/50 focus:outline-none focus:border-[#8B3DFF] transition-colors rounded"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6B0]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white text-xs font-bold uppercase tracking-wider hover:from-[#7a2ef0] hover:to-[#a83ef0] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,61,255,0.3)] rounded mt-4"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up & Continue'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-xs text-[#A6A6B0]">
            Already have a customer account?{' '}
            <Link href="/login" className="text-[#B84DFF] font-semibold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
