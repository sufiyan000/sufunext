'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/axiosClient';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  section: { marginBottom: 10 },
  header: { fontSize: 16, marginBottom: 10, fontWeight: 'bold' },
  item: { marginBottom: 5 },
  footer: { marginTop: 10, borderTop: '1px solid #ccc', paddingTop: 5 }
});

function Invoice({ order }: { order: Order }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Invoice - Order ID: {order._id}</Text>
          <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>Items</Text>
          {order.orderItems.map((item, idx) => (
            <Text key={idx} style={styles.item}>
              {item.name} × {item.quantity} = ₹{item.total.toFixed(2)}
            </Text>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Total: ₹{order.totalCost.toFixed(2)}</Text>
          <Text>Payment Method: {order.paymentMethod}</Text>
          <Text>Status: {order.status}</Text>
        </View>
      </Page>
    </Document>
  );
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
              <PDFDownloadLink
                document={<Invoice order={order} />}
                fileName={`invoice-${order._id}.pdf`}
                className="text-blue-600 underline mt-2 inline-block"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download Invoice')}
              </PDFDownloadLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
