'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Edit3, Trash2, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { formatPrice } from '@/data/products';
import { Product } from '@/types/product';

export default function AdminProductsPage() {
  const { products, deleteProduct, categories, isLoading, refreshProducts } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    return result;
  }, [products, searchQuery, selectedCategory]);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    const res = await deleteProduct(productToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      setNotification({ type: 'success', message: `Product "${productToDelete.name}" deleted successfully.` });
      setProductToDelete(null);
    } else {
      setNotification({ type: 'error', message: res.error || 'Failed to delete product.' });
    }

    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Product Management</h1>
          <p className="text-xs text-[#A6A6B0] mt-1">Manage, add, edit, or delete clothing items from your store.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshProducts()}
            className="p-2.5 bg-white/[0.04] border border-white/[0.08] text-[#A6A6B0] hover:text-white rounded-lg transition-colors"
            title="Refresh Inventory"
          >
            <RefreshCw size={16} />
          </button>

          <Link
            href="/admin/products/add"
            className="px-5 py-2.5 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(139,61,255,0.4)] hover:opacity-90 transition-all flex items-center gap-2"
          >
            <PlusCircle size={16} />
            + Add Product
          </Link>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-lg text-xs font-medium flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/80 border border-red-800 text-red-300'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="bg-[#0D0E13] border border-white/[0.08] p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product by name, ID, or category..."
            className="w-full bg-white/[0.04] border border-white/[0.08] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-[#A6A6B0]/60 focus:outline-none focus:border-[#8B3DFF] transition-colors rounded-lg"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6A6B0]" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-all shrink-0 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#8B3DFF] text-white'
                  : 'bg-white/[0.03] border border-white/[0.06] text-[#A6A6B0] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0D0E13] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-[#A6A6B0] uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-4 px-6 font-semibold">Product Image</th>
                <th className="py-4 px-6 font-semibold">Product Name</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Price</th>
                <th className="py-4 px-6 font-semibold">Stock</th>
                <th className="py-4 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#A6A6B0]">
                    No clothing products found. Click &quot;+ Add Product&quot; to add your first item.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Product Image */}
                    <td className="py-4 px-6">
                      <div className="relative w-12 h-16 bg-[#13141B] rounded overflow-hidden border border-white/10">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-white text-sm truncate max-w-[220px]">{p.name}</p>
                      <p className="text-[10px] text-[#A6A6B0] mt-0.5">ID: {p.id}</p>
                      {p.badge && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#8B3DFF]/20 text-[#B84DFF] text-[9px] font-bold uppercase rounded border border-[#8B3DFF]/30">
                          {p.badge}
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-[#A6A6B0] font-medium">{p.category}</td>

                    {/* Price */}
                    <td className="py-4 px-6 font-extrabold text-white">{formatPrice(p.price)}</td>

                    {/* Stock */}
                    <td className="py-4 px-6">
                      {p.stockStatus === 'Out of Stock' ? (
                        <span className="px-2.5 py-1 bg-red-950/60 border border-red-800/60 text-red-400 text-[10px] font-bold uppercase rounded">
                          Out of Stock
                        </span>
                      ) : p.stockStatus === 'Low Stock' ? (
                        <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-800/60 text-amber-400 text-[10px] font-bold uppercase rounded">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-bold uppercase rounded">
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/products/edit/${p.id}`}
                          className="px-3 py-1.5 bg-[#8B3DFF]/20 border border-[#8B3DFF]/40 text-[#B84DFF] hover:bg-[#8B3DFF] hover:text-white transition-all text-xs font-semibold rounded flex items-center gap-1"
                        >
                          <Edit3 size={13} /> Edit
                        </Link>

                        <button
                          onClick={() => setProductToDelete(p)}
                          className="px-3 py-1.5 bg-red-950/30 border border-red-800/40 text-red-400 hover:bg-red-900/60 hover:text-white transition-all text-xs font-semibold rounded flex items-center gap-1"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C0D12] border border-red-800/40 w-full max-w-md p-6 rounded-xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 bg-red-950 rounded-lg">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Delete Product Confirmation</h3>
            </div>

            <p className="text-xs text-[#A6A6B0] leading-relaxed">
              Are you sure you want to delete this product?
            </p>

            <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg flex items-center gap-3">
              <img
                src={productToDelete.images[0]}
                alt={productToDelete.name}
                className="w-10 h-12 object-cover rounded bg-[#13141B]"
              />
              <div>
                <p className="text-xs font-bold text-white">{productToDelete.name}</p>
                <p className="text-[10px] text-[#A6A6B0]">{formatPrice(productToDelete.price)} • {productToDelete.category}</p>
              </div>
            </div>

            <p className="text-[11px] text-red-400/80 italic">
              This action will permanently remove the product from the customer website.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-white/10 text-white text-xs font-semibold rounded-lg hover:bg-white/5 transition-all"
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
