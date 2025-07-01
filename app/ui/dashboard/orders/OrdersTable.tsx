'use client';

import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '@/app/ui/dashboard/orders/invoicePdf';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  status: string;
  totalCost: number;
  createdAt: string;
  paymentMethod: string;
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState('');

  const filteredOrders = filter
    ? orders.filter(o => o.status.toLowerCase() === filter.toLowerCase())
    : orders;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Orders</h2>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 border p-2 rounded"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <div className="space-y-6">
        {filteredOrders.map(order => (
          <div key={order._id} className="p-4 bg-white rounded shadow-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                <p>Status: <span className="font-semibold">{order.status}</span></p>
                <p>Payment: {order.paymentMethod}</p>
              </div>
              <div className="text-sm text-right">
                <p>Total: ₹{order.totalCost.toFixed(2)}</p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <ul className="mt-2 text-sm">
              {order.orderItems.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity} = ₹{item.total.toFixed(2)}
                </li>
              ))}
            </ul>

            {/* Invoice Download */}
            <div className="mt-2">
              <PDFDownloadLink
                document={<InvoicePDF order={order} />}
                fileName={`invoice-${order._id}.pdf`}
                className="text-blue-600 underline text-sm"
              >
                {({ loading }) => loading ? 'Generating...' : 'Download Invoice'}
              </PDFDownloadLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
