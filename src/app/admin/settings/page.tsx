'use client';

import { useState } from 'react';
import { Shield, Key, Mail, Store, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [storeName, setStoreName] = useState('AREA 51 Textile Shop');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'adamsamr1127@gamil.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setSuccessMessage('Admin store settings updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin & Store Settings</h1>
        <p className="text-xs text-[#A6A6B0] mt-1">Configure shop profile, admin credentials, and platform security.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-950/60 border border-red-800/60 text-red-300 text-xs rounded-lg flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="bg-[#0D0E13] border border-white/[0.08] p-6 md:p-8 rounded-xl space-y-6 shadow-xl">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Store size={16} className="text-[#8B3DFF]" /> Store Identity
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#8B3DFF] rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Admin Login Email
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#8B3DFF] rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
            <Shield size={16} className="text-[#8B3DFF]" /> Password & Security
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              New Admin Password (Optional)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#8B3DFF] rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 px-4 text-xs text-white focus:outline-none focus:border-[#8B3DFF] rounded-lg"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.06] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(139,61,255,0.4)] hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Save size={16} /> Save Admin Settings
          </button>
        </div>
      </form>
    </div>
  );
}
