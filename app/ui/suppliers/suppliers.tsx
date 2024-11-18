'use client';

import React, { useState } from 'react';

interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function SupplierManager() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [formData, setFormData] = useState<Omit<Supplier, '_id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSupplier = () => {
    const newSupplier: Supplier = {
      ...formData,
      _id: `${Date.now()}`, // Generate a temporary ID for local state
    };
    setSuppliers([...suppliers, newSupplier]);
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    });
  };

  const handleUpdateSupplier = () => {
    if (!editingSupplier) return;

    const updatedSuppliers = suppliers.map((supplier) =>
      supplier._id === editingSupplier._id ? { ...editingSupplier, ...formData } : supplier
    );
    setSuppliers(updatedSuppliers);
    setEditingSupplier(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  const handleDeleteSupplier = (supplierId: string) => {
    const updatedSuppliers = suppliers.filter((supplier) => supplier._id !== supplierId);
    setSuppliers(updatedSuppliers);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supplier Management</h1>

      {/* Add/Edit Supplier Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editingSupplier ? handleUpdateSupplier() : handleAddSupplier();
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
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
            </button>
            {editingSupplier && (
              <button
                type="button"
                onClick={() => {
                  setEditingSupplier(null);
                  setFormData({ name: '', email: '', phone: '', address: '' });
                }}
                className="ml-4 text-gray-600 underline"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Supplier List */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Suppliers</h2>
        {suppliers.length === 0 ? (
          <p>No suppliers found. Add some suppliers.</p>
        ) : (
          <ul className="space-y-4">
            {suppliers.map((supplier) => (
              <li key={supplier._id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{supplier.name}</h3>
                  <p className="text-sm text-gray-500">{supplier.email}</p>
                  <p className="text-sm text-gray-500">{supplier.phone}</p>
                  <p className="text-sm text-gray-500">{supplier.address}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSupplier(supplier)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSupplier(supplier._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
