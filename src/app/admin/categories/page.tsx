'use client';

import { useState } from 'react';
import { FolderTree, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

export default function AdminCategoriesPage() {
  const { categories, addCategory } = useProducts();
  const [newCatName, setNewCatName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!newCatName.trim()) {
      setErrorMessage('Please enter a category name.');
      return;
    }

    const res = await addCategory(newCatName.trim());
    if (res.success) {
      setSuccessMessage(`Category "${newCatName.trim()}" added successfully!`);
      setNewCatName('');
    } else {
      setErrorMessage(res.error || 'Failed to add category.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Store Category Management</h1>
        <p className="text-xs text-[#A6A6B0] mt-1">Organize clothing products by categories for customer filtering.</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-950/60 border border-red-800/60 text-red-300 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="bg-[#0D0E13] border border-white/[0.08] p-6 rounded-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FolderTree size={16} className="text-[#8B3DFF]" /> Add New Apparel Category
        </h3>

        <div className="flex gap-3">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Sarees, Ethnic Wear, Winter Jackets..."
            className="flex-1 bg-white/[0.04] border border-white/[0.08] py-2.5 px-4 text-xs text-white placeholder:text-[#A6A6B0]/50 focus:outline-none focus:border-[#8B3DFF] rounded-lg"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </form>

      {/* Categories Grid */}
      <div className="bg-[#0D0E13] border border-white/[0.08] p-6 rounded-xl">
        <h3 className="text-sm font-bold text-white mb-4">Active Categories ({categories.length})</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat}
              className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg flex items-center justify-between hover:border-[#8B3DFF]/40 transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">{cat}</p>
                <span className="text-[10px] text-[#A6A6B0]">Active Category</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
