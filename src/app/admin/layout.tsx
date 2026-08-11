'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Shirt,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
  Store
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Shirt },
  { href: '/admin/products/add', label: 'Add Product', icon: PlusCircle },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Route security check - ALL HOOKS MUST RUN UNCONDITIONALLY TOP-LEVEL
  useEffect(() => {
    if (pathname !== '/admin/login' && !isLoading && (!user || !isAdmin)) {
      router.push('/login?error=Unauthorized. Please sign in with Admin credentials.');
    }
  }, [user, isAdmin, isLoading, router, pathname]);

  // Render without sidebar for login redirect page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090C] flex items-center justify-center text-white text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#8B3DFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#A6A6B0] uppercase tracking-wider font-medium">Verifying Admin Permissions...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#08090C] text-white flex flex-col md:flex-row">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0D0E13] border-r border-white/[0.08] flex flex-col z-50 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,61,255,0.4)]">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider">AREA 51</h2>
              <p className="text-[10px] text-[#B84DFF] font-semibold uppercase tracking-widest">Admin Control</p>
            </div>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-[#A6A6B0] hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8B3DFF] to-[#B84DFF] text-white shadow-[0_0_20px_rgba(139,61,255,0.3)]'
                    : 'text-[#A6A6B0] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.06] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-[#A6A6B0] hover:text-white hover:border-white/20 transition-all"
          >
            <span className="flex items-center gap-2">
              <Store size={14} className="text-[#8B3DFF]" /> View Customer Site
            </span>
            <ExternalLink size={12} />
          </Link>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-red-400 hover:bg-red-950/30 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Header */}
        <header className="h-16 border-b border-white/[0.06] bg-[#08090C]/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-[#A6A6B0] hover:text-white p-2"
            >
              <Menu size={20} />
            </button>
            <span className="text-xs font-semibold text-[#A6A6B0] uppercase tracking-wider">
              Shop Management System
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white truncate max-w-[180px]">{user.email}</p>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Admin Session
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="px-3 py-1.5 border border-red-800/40 bg-red-950/20 text-red-400 hover:bg-red-900/40 text-xs font-medium rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
