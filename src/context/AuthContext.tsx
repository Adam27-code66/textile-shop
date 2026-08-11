'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

interface LoginResult {
  success: boolean;
  role?: UserRole;
  error?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setRoleCookie(role: string) {
  document.cookie = `area51_user_role=${role}; path=/; max-age=86400; SameSite=Lax`;
}

function clearRoleCookie() {
  document.cookie = `area51_user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

const ADMIN_EMAIL = 'adamsamr1127@gmail.com';

async function fetchUserRole(userId: string, email?: string): Promise<UserRole> {
  if (email && email.toLowerCase() === ADMIN_EMAIL) {
    return 'ADMIN';
  }
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    return (data?.role as UserRole) || 'CUSTOMER';
  } catch {
    return 'CUSTOMER';
  }
}

async function buildUserProfile(authUser: User): Promise<UserProfile> {
  const email = authUser.email || '';
  const role = await fetchUserRole(authUser.id, email);
  return {
    id: authUser.id,
    email,
    fullName:
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      email.split('@')[0] ||
      'User',
    role,
    createdAt: authUser.created_at || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize: check for existing Supabase session
  const initializeAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await buildUserProfile(session.user);
        setUser(profile);
        setRoleCookie(profile.role);
      } else {
        setUser(null);
        clearRoleCookie();
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setUser(null);
      clearRoleCookie();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();

    // Listen for auth state changes (login, logout, token refresh, OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await buildUserProfile(session.user);
          setUser(profile);
          setRoleCookie(profile.role);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          clearRoleCookie();
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const profile = await buildUserProfile(session.user);
          setUser(profile);
          setRoleCookie(profile.role);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  // Email + Password Sign In
  const login = async (emailInput: string, passwordInput: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const cleanEmail = emailInput.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: passwordInput,
      });

      if (error || !data.user) {
        setIsLoading(false);
        return { success: false, error: error?.message || 'Invalid email or password.' };
      }

      const profile = await buildUserProfile(data.user);

      // Ensure profile exists in profiles table
      await supabase.from('profiles').upsert([{
        id: data.user.id,
        email: cleanEmail,
        full_name: profile.fullName,
        role: profile.role,
      }], { onConflict: 'id' });

      setUser(profile);
      setRoleCookie(profile.role);
      setIsLoading(false);
      return { success: true, role: profile.role };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'An unexpected error occurred.' };
    }
  };

  // Google OAuth Sign In
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const origin = typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google sign-in failed.' };
    }
  };

  // Email + Password Sign Up
  const register = async (fullName: string, emailInput: string, passwordInput: string) => {
    setIsLoading(true);
    try {
      const cleanEmail = emailInput.trim().toLowerCase();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: passwordInput,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data?.user) {
        // Create profile entry
        await supabase.from('profiles').upsert([{
          id: data.user.id,
          email: cleanEmail,
          full_name: fullName,
          role: 'CUSTOMER',
        }], { onConflict: 'id' });

        const profile: UserProfile = {
          id: data.user.id,
          email: cleanEmail,
          fullName,
          role: 'CUSTOMER',
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        setRoleCookie('CUSTOMER');
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    clearRoleCookie();
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{ user, role: user?.role || null, isLoading, login, signInWithGoogle, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
