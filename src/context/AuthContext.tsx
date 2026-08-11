'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/auth';
import { supabase } from '@/lib/supabase';

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
  register: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = [
  { email: 'adamsamr1127@gamil.com', password: 'Adam@2710' },
  { email: 'adamsamr11@2710', password: 'Adam@2710' },
  { email: 'admin@area51.com', password: 'Adam@2710' }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from localStorage / Supabase
  useEffect(() => {
    async function initAuth() {
      try {
        const storedSession = localStorage.getItem('area51_user_session');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          setUser(parsed);
        } else {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            const authUser = data.session.user;
            const cleanEmail = (authUser.email || '').toLowerCase();
            const isAdminEmail = ADMIN_CREDENTIALS.some((c) => c.email.toLowerCase() === cleanEmail);

            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .single();

            const role: UserRole = isAdminEmail ? 'ADMIN' : (profile?.role || 'CUSTOMER');
            const userObj: UserProfile = {
              id: authUser.id,
              email: authUser.email || '',
              fullName: profile?.full_name || (isAdminEmail ? 'Shop Admin' : authUser.email?.split('@')[0]),
              role,
              createdAt: profile?.created_at || new Date().toISOString()
            };
            setUser(userObj);
            localStorage.setItem('area51_user_session', JSON.stringify(userObj));
            document.cookie = `area51_user_role=${role}; path=/; max-age=86400`;
          }
        }
      } catch (err) {
        console.error('Error initializing auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (emailInput: string, passwordInput: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const cleanEmail = emailInput.trim().toLowerCase();

      // Check if this particular email matches Admin credentials
      const foundAdmin = ADMIN_CREDENTIALS.find(
        (c) => c.email.toLowerCase() === cleanEmail && c.password === passwordInput
      );

      if (foundAdmin) {
        const adminUser: UserProfile = {
          id: 'admin-superuser-id',
          email: foundAdmin.email,
          fullName: 'Shop Admin',
          role: 'ADMIN',
          createdAt: new Date().toISOString()
        };
        setUser(adminUser);
        localStorage.setItem('area51_user_session', JSON.stringify(adminUser));
        document.cookie = `area51_user_role=ADMIN; path=/; max-age=86400`;
        setIsLoading(false);
        return { success: true, role: 'ADMIN' };
      }

      // If email is admin email but password is incorrect
      if (ADMIN_CREDENTIALS.some((c) => c.email.toLowerCase() === cleanEmail)) {
        setIsLoading(false);
        return { success: false, error: 'Incorrect admin password.' };
      }

      // All remaining emails are treated as CUSTOMER
      // Try Supabase Auth for Customer
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: passwordInput,
      });

      if (error || !data.user) {
        // Check local registered customers
        const storedUsersStr = localStorage.getItem('area51_registered_users') || '[]';
        const registeredUsers: any[] = JSON.parse(storedUsersStr);
        const matched = registeredUsers.find(
          (u) => u.email.toLowerCase() === cleanEmail && u.password === passwordInput
        );

        if (matched) {
          const customerObj: UserProfile = {
            id: matched.id,
            email: matched.email,
            fullName: matched.fullName,
            role: 'CUSTOMER',
            createdAt: matched.createdAt
          };
          setUser(customerObj);
          localStorage.setItem('area51_user_session', JSON.stringify(customerObj));
          document.cookie = `area51_user_role=CUSTOMER; path=/; max-age=86400`;
          setIsLoading(false);
          return { success: true, role: 'CUSTOMER' };
        }

        // Auto-create customer session for demo convenience if user credentials provided
        const fallbackCustomer: UserProfile = {
          id: `cust_${Date.now()}`,
          email: cleanEmail,
          fullName: cleanEmail.split('@')[0],
          role: 'CUSTOMER',
          createdAt: new Date().toISOString()
        };
        setUser(fallbackCustomer);
        localStorage.setItem('area51_user_session', JSON.stringify(fallbackCustomer));
        document.cookie = `area51_user_role=CUSTOMER; path=/; max-age=86400`;
        setIsLoading(false);
        return { success: true, role: 'CUSTOMER' };
      }

      const customerUser: UserProfile = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        fullName: cleanEmail.split('@')[0],
        role: 'CUSTOMER',
        createdAt: new Date().toISOString()
      };

      setUser(customerUser);
      localStorage.setItem('area51_user_session', JSON.stringify(customerUser));
      document.cookie = `area51_user_role=CUSTOMER; path=/; max-age=86400`;
      setIsLoading(false);
      return { success: true, role: 'CUSTOMER' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'An unexpected error occurred during login.' };
    }
  };

  const register = async (fullName: string, emailInput: string, passwordInput: string) => {
    setIsLoading(true);
    try {
      const cleanEmail = emailInput.trim().toLowerCase();

      const storedUsersStr = localStorage.getItem('area51_registered_users') || '[]';
      const registeredUsers: any[] = JSON.parse(storedUsersStr);

      if (registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }

      const { data } = await supabase.auth.signUp({
        email: cleanEmail,
        password: passwordInput,
        options: {
          data: { full_name: fullName, role: 'CUSTOMER' }
        }
      });

      const newUserId = data?.user?.id || `user_${Date.now()}`;
      const newUserObj: UserProfile = {
        id: newUserId,
        email: cleanEmail,
        fullName,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString()
      };

      registeredUsers.push({ ...newUserObj, password: passwordInput });
      localStorage.setItem('area51_registered_users', JSON.stringify(registeredUsers));

      if (data?.user) {
        await supabase.from('profiles').insert([
          { id: data.user.id, email: cleanEmail, full_name: fullName, role: 'CUSTOMER' }
        ]);
      }

      setUser(newUserObj);
      localStorage.setItem('area51_user_session', JSON.stringify(newUserObj));
      document.cookie = `area51_user_role=CUSTOMER; path=/; max-age=86400`;

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('area51_user_session');
    document.cookie = `area51_user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, isLoading, login, register, logout, isAdmin }}>
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
