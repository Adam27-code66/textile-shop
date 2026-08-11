'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Shirt, CheckCircle, AlertTriangle, ShoppingBag, PlusCircle, ArrowUpRight, FolderTree } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { formatPrice } from '@/data/products';

export default function AdminDashboardPage() {
  const { products } = useProducts();

  const stats = useMemo(() => {
    const total = products.length;
    const available = products.filter((p) => p.stockStatus !== 'Out of Stock').length;
    const outOfStock = products.filter((p) => p.stockStatus === 'Out of Stock').length;
    const featured = products.filter((p) => p.isFeatured).length;

    return { total, available, outOfStock, featured };
  }, [products]);

  const recentProducts = useMemo(() => {
    return products.slice(0, 5);
  }, [products]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#13141B] via-[#171822] to-[#1D122C] border border-[#8B3DFF]/30 p-6 md:p-8 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold text-[#B84DFF] uppercase tracking-widest">TEXTILE SHOP OWNER DASHBOARD</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Welcome to Admin Control</h1>
          <p className="text-xs md:text-sm text-[#A6A6B0] mt-2 max-w-2xl leading-relaxed">
            Manage all clothing products, upload images, update prices, and control stock availability. Any updates made here will instantly appear on your customer website.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/products/add"
              className="px-5 py-2.5 bg-gradient-to-r from-[#8B3DFF] to-[#E23DFF] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(139,61,255,0.4)] hover:opacity-90 transition-all flex items-center gap-2"
            >
              <PlusCircle size={16} />
              + Add New Clothing Item
            </Link>

            <Link
              href="/admin/products"
              className="px-5 py-2.5 bg-white/[0.05] border border-white/10 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Shirt size={16} />
              Manage All Products ({stats.total})
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-[#0D0E13] border border-white/[0.08] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A6A6B0] uppercase tracking-wider">Total Products</span>
            <div className="p-2 bg-[#8B3DFF]/10 text-[#B84DFF] rounded-lg">
              <Shirt size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{stats.total}</p>
          <p className="text-[11px] text-[#A6A6B0] mt-1">Active clothing items in store</p>
        </div>

        {/* Available Products */}
        <div className="bg-[#0D0E13] border border-white/[0.08] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A6A6B0] uppercase tracking-wider">Available Products</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 mt-3">{stats.available}</p>
          <p className="text-[11px] text-[#A6A6B0] mt-1">Ready for customer orders</p>
        </div>

        {/* Out-of-Stock Products */}
        <div className="bg-[#0D0E13] border border-white/[0.08] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A6A6B0] uppercase tracking-wider">Out of Stock</span>
            <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-red-400 mt-3">{stats.outOfStock}</p>
          <p className="text-[11px] text-[#A6A6B0] mt-1">Items requiring restock</p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#0D0E13] border border-white/[0.08] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A6A6B0] uppercase tracking-wider">Store Categories</span>
            <div className="p-2 bg-[#E23DFF]/10 text-[#E23DFF] rounded-lg">
              <FolderTree size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">9</p>
          <p className="text-[11px] text-[#A6A6B0] mt-1">Shirts, Tees, Sarees, Dresses...</p>
        </div>
      </div>

      {/* Quick Action Table */}
      <div className="bg-[#0D0E13] border border-white/[0.08] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">Recent Clothing Products</h2>
            <p className="text-xs text-[#A6A6B0]">Quick overview of your latest inventory entries.</p>
          </div>

          <Link
            href="/admin/products"
            className="text-xs text-[#B84DFF] font-semibold hover:underline flex items-center gap-1"
          >
            View All Products Catalog <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-[#A6A6B0] uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Product Name</th>
                <th className="py-3.5 px-6 font-semibold">Category</th>
                <th className="py-3.5 px-6 font-semibold">Price</th>
                <th className="py-3.5 px-6 font-semibold">Stock Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white">
              {recentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-10 h-12 object-cover rounded bg-[#13141B]"
                    />
                    <div>
                      <p className="font-semibold text-white truncate max-w-[200px]">{p.name}</p>
                      <span className="text-[10px] text-[#A6A6B0]">ID: {p.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#A6A6B0]">{p.category}</td>
                  <td className="py-4 px-6 font-bold text-white">{formatPrice(p.price)}</td>
                  <td className="py-4 px-6">
                    {p.stockStatus === 'Out of Stock' ? (
                      <span className="px-2.5 py-1 bg-red-950/60 border border-red-800/60 text-red-400 text-[10px] font-bold uppercase rounded">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-bold uppercase rounded">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/admin/products/edit/${p.id}`}
                      className="px-3 py-1.5 bg-[#8B3DFF]/20 border border-[#8B3DFF]/40 text-[#B84DFF] hover:bg-[#8B3DFF] hover:text-white transition-all text-xs font-semibold rounded"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
