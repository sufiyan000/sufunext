'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/axiosClient';
import { Input, Table, Tag, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface Order {
  _id: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  orderItems: {
    name: string;
    quantity: number;
    salePrice: number;
  }[];
  shippingAddress: {
    addressLine1: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  status: string;
  totalCost: number;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/admin/orders');
      setOrders(res.data.orders || []);
      setFilteredOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchText(value);

  if (value.trim() === '') {
    // 🔁 Reset filtered orders when search is cleared
    setFilteredOrders(orders);
  } else {
    // 🔍 Filter orders by phone number
    setFilteredOrders(
      orders.filter((order) =>
        order.user?.phoneNumber?.includes(value)
      )
    );
  }
};


  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: 'id',
    },
    {
      title: 'Customer',
      key: 'user',
      render: (order: Order) => (
        <div>
          <div>{order.user?.firstName || 'N/A'} {order.user?.lastName || ''}</div>
          <div className="text-xs text-gray-500">{order.user?.email || 'No Email'}</div>
          <div className="text-xs text-gray-500">{order.user?.phoneNumber || 'No Phone'}</div>
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'totalCost',
      key: 'total',
      render: (val: number) => `₹${val}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Pending' ? 'orange' : status === 'Delivered' ? 'green' : 'blue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (order: Order) => (
        <Button type="link" href={`/dashboard/orders/${order._id}`}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">All Orders</h1>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search by phone number"
        value={searchText}
        onChange={handleSearch}
        className="max-w-xs mb-4"
      />

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
