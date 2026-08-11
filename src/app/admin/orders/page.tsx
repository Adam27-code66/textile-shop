'use client';

import { useState } from 'react';
import { ShoppingBag, PackageCheck, Clock, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/data/products';

interface SampleOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  itemCount: number;
}

const INITIAL_ORDERS: SampleOrder[] = [
  {
    id: 'ORD-948123',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul.s@example.com',
    totalAmount: 2499,
    status: 'Shipped',
    date: '2026-08-10',
    itemCount: 1
  },
  {
    id: 'ORD-948124',
    customerName: 'Priya Patel',
    customerEmail: 'priya.p@example.com',
    totalAmount: 3798,
    status: 'Processing',
    date: '2026-08-11',
    itemCount: 2
  },
  {
    id: 'ORD-948125',
    customerName: 'Amit Verma',
    customerEmail: 'amit.v@example.com',
    totalAmount: 1499,
    status: 'Pending',
    date: '2026-08-11',
    itemCount: 1
  }
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<SampleOrder[]>(INITIAL_ORDERS);

  const updateOrderStatus = (orderId: string, newStatus: SampleOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Customer Orders</h1>
        <p className="text-xs text-[#A6A6B0] mt-1">View and fulfill incoming customer textile orders.</p>
      </div>

      <div className="bg-[#0D0E13] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] text-[#A6A6B0] uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-4 px-6 font-semibold">Order ID</th>
                <th className="py-4 px-6 font-semibold">Customer</th>
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold">Items</th>
                <th className="py-4 px-6 font-semibold">Total Amount</th>
                <th className="py-4 px-6 font-semibold">Fulfillment Status</th>
                <th className="py-4 px-6 font-semibold text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-white">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-mono text-[#B84DFF] font-bold">{o.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-white">{o.customerName}</p>
                    <p className="text-[10px] text-[#A6A6B0]">{o.customerEmail}</p>
                  </td>
                  <td className="py-4 px-6 text-[#A6A6B0]">{o.date}</td>
                  <td className="py-4 px-6 font-medium">{o.itemCount} item(s)</td>
                  <td className="py-4 px-6 font-bold text-white">{formatPrice(o.totalAmount)}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
