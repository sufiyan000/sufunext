'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/axiosClient';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  attributes?: Record<string, string | number | boolean>;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  status: string;
  totalCost: number;
  createdAt: string;
  paymentMethod: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/user/orders');
        setOrders(res.data.orders);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!orders.length) return <p>No orders found.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="border p-4 rounded shadow-sm bg-white">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">Order ID: {order._id}</p>
                <p className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                {order.status}
              </span>
            </div>

            <ul className="text-sm mb-2">
              {order.orderItems.map((item, index) => (
                <li key={index} className="mb-1 border-b pb-1">
                  {item.name} × {item.quantity} = ₹{item.total.toFixed(2)}
                </li>
              ))}
            </ul>

            <div className="text-right text-sm">
              <p><strong>Total:</strong> ₹{order.totalCost.toFixed(2)}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
