'use client';

import React, { useState } from 'react';
import axios from 'axios';
import {  message } from 'antd';

interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  telegram: string;
  website: string;
}
export default function SupplierManager() {
  const [messageApi, contextHolder] = message.useMessage();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [formData, setFormData] = useState<Omit<Supplier, '_id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    telegram: '',
    website: '',
  });
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message',
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSupplier = async () => {
    const data = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      telegram: formData.telegram,
      website: formData.website,

    }
      const response = await axios.post('http://localhost:3000/api/suppliers', data);
      success(response.data.message);
    const newSupplier: Supplier = {
      ...formData,
      _id: `${Date.now()}`, // Generate a temporary ID for local state
    };
    setSuppliers([...suppliers, newSupplier]);
    setFormData({ name: '', email: '', phone: '', address: '', telegram: '', website: '',});
  };

  

 
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {contextHolder}
      <h1 className="text-2xl font-bold mb-4">Supplier Management</h1>

      {/* Add/Edit Supplier Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
             handleAddSupplier();
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
                telegram
              </label>
              <input
                type="text"
                id="telegram"
                name="telegram"
                value={formData.telegram}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Supplier
            </button>
            
          </div>
        </form>
      </div>

    </div>
  );
}
