"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { message } from 'antd';

export default function CheckoutForm({ cart }: { cart: any, onCartUpdate: (updatedCart: any) => void }) {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [form, setForm] = useState({ name: '', phone: '', address: '', paymentMethod: 'COD' });
  const [items, setItems] = useState(cart.items);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const increment = async (index: number) => {
  const updated = [...items];
  updated[index].quantity += 1;
  setItems(updated);
  await updateQuantity(updated[index].productId, updated[index].quantity);
};

const decrement = async (index: number) => {
  const updated = [...items];
  if (updated[index].quantity > 1) {
    updated[index].quantity -= 1;
    setItems(updated);
    await updateQuantity(updated[index].productId, updated[index].quantity);
  }
};

const updateQuantity = async (productId: string, quantity: number) => {
  try {
    await axios.patch('/api/cart', { productId, quantity }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    messageApi.success('Cart updated');
  } catch (error) {
    console.error(error);
    messageApi.error('Failed to update cart');
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/orders
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Billing Details</h2>
      <input className="w-full border p-2 rounded" type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      <input className="w-full border p-2 rounded" type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} required />

      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
      <select className="w-full border p-2 rounded" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
        <option value="COD">Cash on Delivery</option>
        <option value="Online">Online Payment</option>
      </select>

      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      <ul className="space-y-2">
        {items.map((item: any, index: number) => (
          <li key={item.id} className="flex items-center justify-between border p-2 rounded">
            <img src={item.thumbnailUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <span className="flex-1 ml-4">{item.name}</span>
            <div className="flex items-center space-x-2">
              <button type="button" onClick={() => decrement(index)} className="px-2 py-1 bg-gray-300 rounded">-</button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => increment(index)} className="px-2 py-1 bg-gray-300 rounded">+</button>
            </div>
          </li>
        ))}
      </ul>

      <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded mt-4">Place Order</button>
    </form>
  );
}
