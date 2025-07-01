'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/axiosClient';
import { message } from 'antd';

interface Address {
  _id?: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState<Address>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/api/user/addresses');
      setAddresses(res.data.addresses || []);
    } catch (err) {
      message.error('Failed to load addresses');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/user/addresses', form);
      message.success('Address added');
      setForm({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      });
      fetchAddresses(); // Refresh list
    } catch (err) {
      message.error('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-xl font-bold">My Addresses</h2>

      {/* Address List */}
      {addresses.length === 0 ? (
        <p>No saved addresses.</p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr, i) => (
            <li key={i} className="border p-4 rounded shadow-sm bg-gray-50">
              <p className="font-semibold">{addr.name} — {addr.phone}</p>
              <p>{addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
              <p>{addr.city}, {addr.state}, {addr.country} - {addr.postalCode}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Add Address Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="border p-2 rounded" />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="border p-2 rounded" />
        <input name="addressLine1" placeholder="Address Line 1" value={form.addressLine1} onChange={handleChange} required className="border p-2 rounded" />
        <input name="addressLine2" placeholder="Address Line 2" value={form.addressLine2} onChange={handleChange} className="border p-2 rounded" />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required className="border p-2 rounded" />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required className="border p-2 rounded" />
        <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required className="border p-2 rounded" />
        <input name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} required className="border p-2 rounded" />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add Address'}
        </button>
      </form>
    </div>
  );
}
