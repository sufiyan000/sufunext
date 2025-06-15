'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CustomerForm() {
  const [billing, setBilling] = useState({
    name: '',
    mobile: '',
    flat: '',
    area: '',
    pincode: '',
    city: '',
    state: ''
  });

  const [shipping, setShipping] = useState({
    flat: '',
    area: '',
    pincode: '',
    city: '',
    state: ''
  });

  const [sameAsBilling, setSameAsBilling] = useState(false);

  const handleBillingChange = (e: any) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e: any) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    const checked = !sameAsBilling;
    setSameAsBilling(checked);
    if (checked) {
      setShipping({
        flat: billing.flat,
        area: billing.area,
        pincode: billing.pincode,
        city: billing.city,
        state: billing.state
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const customerData = {
      ...billing,
      shippingAddress: sameAsBilling ? { ...billing } : { ...shipping }
    };

    console.log("Customer Data:", customerData);
    // POST to API here
    try {
    const res = await axios.post('/api/customers', customerData);
    if (res.data.success) {
      alert('Customer added successfully!');
      // Optionally reset form here
    } else {
      alert('Failed to add customer');
    }
  } catch (err) {
    console.error('Error saving customer:', err);
    alert('Something went wrong');
  }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-semibold">Add Customer</h2>

      {/* Billing Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" placeholder="Customer Name" value={billing.name} onChange={handleBillingChange} className="p-2 border rounded" required />
        <input type="text" name="mobile" placeholder="Mobile Number" value={billing.mobile} onChange={handleBillingChange} className="p-2 border rounded" required />
        <input type="text" name="flat" placeholder="Flat / Building" value={billing.flat} onChange={handleBillingChange} className="p-2 border rounded" required />
        <input type="text" name="area" placeholder="Area / Locality" value={billing.area} onChange={handleBillingChange} className="p-2 border rounded" required />
        <input type="text" name="pincode" placeholder="Pincode" value={billing.pincode} onChange={handleBillingChange} className="p-2 border rounded" required />
        <input type="text" name="city" placeholder="City" value={billing.city} onChange={handleBillingChange} className="p-2 border rounded" required />
        <input type="text" name="state" placeholder="State" value={billing.state} onChange={handleBillingChange} className="p-2 border rounded" />
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={sameAsBilling} onChange={handleCheckboxChange} />
        <label>Shipping address same as billing address</label>
      </div>

      {/* Shipping Address */}
      {!sameAsBilling && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="flat" placeholder="Shipping Flat / Building" value={shipping.flat} onChange={handleShippingChange} className="p-2 border rounded" required />
          <input type="text" name="area" placeholder="Shipping Area / Locality" value={shipping.area} onChange={handleShippingChange} className="p-2 border rounded" required />
          <input type="text" name="pincode" placeholder="Shipping Pincode" value={shipping.pincode} onChange={handleShippingChange} className="p-2 border rounded" required />
          <input type="text" name="city" placeholder="Shipping City" value={shipping.city} onChange={handleShippingChange} className="p-2 border rounded" required />
          <input type="text" name="state" placeholder="Shipping State" value={shipping.state} onChange={handleShippingChange} className="p-2 border rounded" required />
        </div>
      )}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Customer
      </button>
    </form>
  );
}
