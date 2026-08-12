'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, signInWithGoogle, isLoading } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setErrorMessage(errorParam);
    }
  }, [searchParams]);

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
      setSuccessMessage(result.message || 'Account created successfully. You can now sign in.');
      setTimeout(() => {
        router.push('/shop');
      }, 1500);
    } else {
      setErrorMessage(result.error || 'Failed to create customer account.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    const result = await signInWithGoogle('register');
    if (!result.success) {
      setErrorMessage(result.error || 'Google sign-in failed. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0D0E13] border border-white/[0.08] p-8 rounded-lg shadow-2xl relative">
      <div className="text-center mb-8">
        <span className="text-xs tracking-[0.3em] uppercase text-[#B84DFF] font-semibold">Join AREA 51</span>
        <h1 className="text-2xl font-bold text-white mt-1">Create Account</h1>
        <p className="text-xs text-[#A6A6B0] mt-2">Sign up with Google or create an email account to access the shop.</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-amber-950/60 border border-amber-600/60 text-amber-200 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0 text-amber-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs rounded flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
        className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-900 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 rounded-lg shadow-md mb-6 border border-gray-300 disabled:opacity-50"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        {isGoogleLoading ? 'Connecting to Google...' : 'Sign Up with Google'}
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-white/[0.08] w-full" />
        <span className="bg-[#0D0E13] px-3 text-[10px] uppercase tracking-widest text-[#A6A6B0]">OR REGISTER WITH EMAIL</span>
        <div className="border-t border-white/[0.08] w-full" />
      </div>

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
          disabled={isLoading || isGoogleLoading}
          className="w-full py-3.5 bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white text-xs font-bold uppercase tracking-wider hover:from-[#7a2ef0] hover:to-[#a83ef0] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,61,255,0.3)] rounded mt-4 disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up & Continue'}
          {!isLoading && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
        <p className="text-xs text-[#A6A6B0]">
          Already registered?{' '}
          <Link href="/login" className="text-[#B84DFF] font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CustomerRegisterPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#08090C] flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="w-full max-w-md bg-[#0D0E13] border border-white/[0.08] p-8 rounded-xl text-center text-white text-xs">
          Loading Registration...
        </div>
      }>
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
