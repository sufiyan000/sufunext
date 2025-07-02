'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/app/lib/axiosClient';
import { Spin, Tag, Select, message } from 'antd';

const { Option } = Select;

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/admin/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdating(true);
      const res = await api.patch(`/api/admin/orders/${id}`, { status: newStatus });
      setOrder(res.data.order);
      message.success('Order status updated!');
    } catch (err) {
      message.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spin className="mt-10 ml-10" />;

  if (!order) return <p className="text-red-500 p-4">Order not found</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Order #{order._id}</h1>

      {/* Customer Info */}
      <div className="border p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Customer Info</h2>
        <p>Name: {order.user?.firstName} {order.user?.lastName}</p>
        <p>Email: {order.user?.email}</p>
        <p>Phone: {order.user?.phoneNumber}</p>
      </div>

      {/* Shipping Address */}
      <div className="border p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}</p>
        <p>{order.shippingAddress.state}, {order.shippingAddress.country} - {order.shippingAddress.postalCode}</p>
        <p>Phone: {order.shippingAddress.phone}</p>
      </div>

      {/* Items */}
      <div className="border p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Items</h2>
        <ul className="space-y-2">
          {order.orderItems.map((item: any, i: number) => (
            <li key={i} className="flex justify-between border-b pb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.total}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment & Status */}
      <div className="border p-4 rounded shadow space-y-2">
        <p><strong>Payment:</strong> {order.paymentMethod}</p>

        <div>
          <strong>Status:</strong>{' '}
          <Select
            value={order.status}
            onChange={handleStatusChange}
            loading={updating}
            className="w-40 ml-2"
          >
            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map((s) => (
              <Option key={s} value={s}>{s}</Option>
            ))}
          </Select>
        </div>

        <p><strong>Shipping Cost:</strong> ₹{order.shippingCost}</p>
        <p><strong>Total:</strong> ₹{order.totalCost}</p>
      </div>
    </div>
  );
}
