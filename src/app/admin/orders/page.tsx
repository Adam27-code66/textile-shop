'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, CreditCard, ShieldCheck, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/data/products';

interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: string;
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status?: 'Pending' | 'Paid' | 'Failed';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setOrders(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'ADMIN',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Customer Orders</h1>
          <p className="text-xs text-[#A6A6B0] mt-1">View and fulfill incoming customer textile orders & Razorpay payments.</p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-white hover:border-white/20 transition-all rounded flex items-center gap-2"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh Orders
        </button>
      </div>

      <div className="bg-[#0D0E13] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-[#A6A6B0] uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-4 px-6 font-semibold">Order ID</th>
                <th className="py-4 px-6 font-semibold">Customer</th>
                <th className="py-4 px-6 font-semibold">Total Amount</th>
                <th className="py-4 px-6 font-semibold">Payment Status</th>
                <th className="py-4 px-6 font-semibold">Razorpay Ref</th>
                <th className="py-4 px-6 font-semibold">Fulfillment Status</th>
                <th className="py-4 px-6 font-semibold text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#A6A6B0]">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#A6A6B0]">
                    No customer orders found yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-mono text-[#B84DFF] font-bold">{o.id}</td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-white">{o.customer_name}</p>
                      <p className="text-[10px] text-[#A6A6B0]">{o.customer_email}</p>
                    </td>
                    <td className="py-4 px-6 font-bold text-white">{formatPrice(o.total_amount)}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${
                          o.payment_status === 'Paid'
                            ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                            : o.payment_status === 'Failed'
                            ? 'bg-red-950/60 border-red-800/60 text-red-400'
                            : 'bg-amber-950/60 border-amber-800/60 text-amber-400'
                        }`}
                      >
                        {o.payment_status || 'Paid'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[10px] text-[#A6A6B0]">
                      {o.razorpay_payment_id ? (
                        <span className="text-white" title={o.razorpay_payment_id}>
                          {o.razorpay_payment_id.slice(0, 14)}...
                        </span>
                      ) : (
                        <span className="text-[#A6A6B0]/40">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                            : o.status === 'Shipped'
                            ? 'bg-blue-950/60 border-blue-800/60 text-blue-400'
                            : o.status === 'Processing'
                            ? 'bg-purple-950/60 border-purple-800/60 text-purple-400'
                            : 'bg-amber-950/60 border-amber-800/60 text-amber-400'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                        className="bg-[#13141B] border border-white/[0.1] text-xs text-white py-1.5 px-2.5 rounded cursor-pointer focus:outline-none focus:border-[#8B3DFF]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
