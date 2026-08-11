'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    async function handleAuthCallback() {
      try {
        const code = searchParams.get('code');
        let authUser = null;

        if (code) {
          // 1. Exchange OAuth code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.warn('Code exchange notice:', error.message);
            // Fallback: check if session was already established
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData?.session?.user) {
              authUser = sessionData.session.user;
            } else {
              if (isSubscribed) setErrorMsg(error.message || 'Failed to exchange authorization code.');
              return;
            }
          } else if (data?.user) {
            authUser = data.user;
          }
        } else {
          // 2. No code parameter — check if an active session exists
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            authUser = sessionData.session.user;
          } else {
            if (isSubscribed) setErrorMsg('No authentication code or active session found. Please sign in again.');
            return;
          }
        }

        if (!authUser) {
          if (isSubscribed) setErrorMsg('Could not verify user identity.');
          return;
        }

        // 3. Retrieve user role from profiles table
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();

        let role = 'CUSTOMER';
        if (existingProfile?.role) {
          role = existingProfile.role;
        } else {
          // Create profile for new Google user if missing
          const userName =
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email?.split('@')[0] ||
            'User';

          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: authUser.id,
              email: authUser.email || '',
              full_name: userName,
              role: 'CUSTOMER',
            },
          ]);

          if (profileError) {
            console.warn('Profile creation notice:', profileError.message);
          }
        }

        // 4. Set role cookie for middleware route protection
        document.cookie = `area51_user_role=${role}; path=/; max-age=86400; SameSite=Lax`;

        // 5. Remove OAuth code from URL & redirect based on role
        const destination = role === 'ADMIN' ? '/admin/dashboard' : '/shop';
        if (isSubscribed) {
          router.replace(destination);
        }
      } catch (err: any) {
        if (isSubscribed) {
          setErrorMsg(err.message || 'An unexpected error occurred during authentication.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isSubscribed = false;
    };
  }, [router, searchParams]);

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#08090C] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0D0E13] border border-white/[0.08] p-8 rounded-xl text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Authentication Error</h2>
          <p className="text-xs text-[#A6A6B0] mb-6 leading-relaxed">{errorMsg}</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg hover:brightness-110 transition-all"
          >
            <ArrowLeft size={16} /> Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090C] flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-10 h-10 border-2 border-[#8B3DFF] border-t-transparent rounded-full animate-spin flex items-center justify-center">
          <Loader2 size={20} className="text-[#B84DFF] animate-spin hidden" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wider uppercase">Authenticating</h2>
          <p className="text-xs text-[#A6A6B0] mt-1">Completing secure Google sign-in...</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090C] flex items-center justify-center text-white text-xs">
          Loading authentication callback...
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
