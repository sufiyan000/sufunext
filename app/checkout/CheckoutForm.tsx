'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import api from '@/app/lib/axiosClient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { clearCart } from '@/app/redux/features/cartSlice';
import { message } from 'antd';
import { useSearchParams } from 'next/navigation';

interface CartItem {
  productId: string;
  name: string;
  salePrice: number;
  quantity: number;
  thumbnailUrl?: string;
  attributes?: Record<string, any>;
}

interface FormState {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  paymentMethod: 'COD' | 'CreditCard' | 'DebitCard' | 'UPI' | 'PayPal';
}

interface CheckoutFormProps {
  cart: { items: CartItem[] };
  onCartUpdate?: (updatedCart: CartItem[]) => void;
}

export default function CheckoutForm({ cart, onCartUpdate }: CheckoutFormProps) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [processing, setProcessing] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<'Pickup' | 'HomeDelivery'>('HomeDelivery');

  const [items, setItems] = useState<CartItem[]>(cart.items || []);
  const [savedAddresses, setSavedAddresses] = useState<FormState[]>([]);
  const [useNewAddress, setUseNewAddress] = useState(true);

  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    paymentMethod: 'COD',
  });

  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === '1';
  const buyNowProductId = searchParams.get('id');

  useEffect(() => {
    const init = async () => {
      if (isBuyNow && buyNowProductId) {
        try {
          const res = await api.get(`/api/products/id/${buyNowProductId}`);
          const product = res.data;
          setItems([{
            productId: product._id,
            thumbnailUrl: product.thumbnailUrl,
            name: product.name,
            salePrice: product.sellingPrice,
            quantity: 1,
          }]);
        } catch (err) {
          messageApi.error('Failed to load product for Buy Now');
        }
      } else {
        setItems(cart.items || []);
      }
    };
    init();
  }, [cart.items]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/api/user/addresses');
        const addresses = res.data.addresses || [];
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          setUseNewAddress(false);
          setForm({ ...addresses[0], paymentMethod: 'COD' });
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
      }
    };
    fetchAddresses();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const increment = (index: number) =>
    setItems(prev => prev.map((item, i) => i === index ? { ...item, quantity: item.quantity + 1 } : item));

  const decrement = (index: number) =>
    setItems(prev => prev.map((item, i) => i === index && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    const totalCost = items.reduce((acc, item) => acc + item.quantity * item.salePrice, 0);

    const payload: any = {
      user: user?._id,
      deliveryMode,
      orderItems: items.map(item => ({
        ...item,
        total: item.quantity * item.salePrice,
      })),
      paymentMethod: form.paymentMethod,
      shippingCost: 0,
      totalCost,
      status: 'Pending',
    };

    if (deliveryMode === 'HomeDelivery') {
      const requiredFields: (keyof FormState)[] = ['name', 'phone', 'addressLine1', 'city', 'state', 'country', 'postalCode'];
      const missingFields = requiredFields.filter(field => !form[field]);

      if (missingFields.length > 0) {
        messageApi.error(`Missing field(s): ${missingFields.join(', ')}`);
        setProcessing(false);
        return;
      }

      payload.shippingAddress = { ...form };
    }

    try {
      if (useNewAddress && deliveryMode === 'HomeDelivery') {
        await api.post('/api/user/addresses', form);
      }

      await api.post('/api/orders', payload);

      if (!isBuyNow) {
        await api.delete('/api/cart');
        dispatch(clearCart());
        if (onCartUpdate) onCartUpdate([]);
      }

      messageApi.success('Order placed successfully');
      setItems([]);
      window.location.href = '/order-confirmation';
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to place order');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto p-4">
      {contextHolder}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold">Billing Details</h2>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="radio" name="deliveryMode" value="HomeDelivery" checked={deliveryMode === 'HomeDelivery'} onChange={() => setDeliveryMode('HomeDelivery')} />
            Home Delivery
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="deliveryMode" value="Pickup" checked={deliveryMode === 'Pickup'} onChange={() => setDeliveryMode('Pickup')} />
            Pickup from Store
          </label>
        </div>

        {deliveryMode === 'HomeDelivery' && (
          <>
            {savedAddresses.length > 0 && !useNewAddress && (
              <div className="space-y-4">
                <h3 className="font-semibold">Select Shipping Address:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr, index) => {
                    const isSelected =
                      addr.addressLine1 === form.addressLine1 &&
                      addr.city === form.city &&
                      addr.postalCode === form.postalCode;

                    return (
                      <label
                        key={index}
                        className={`block border p-4 rounded cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={index}
                          checked={isSelected}
                          onChange={() =>
                            setForm({
                              name: addr.name || '',
                              phone: addr.phone || '',
                              addressLine1: addr.addressLine1 || '',
                              addressLine2: addr.addressLine2 || '',
                              city: addr.city || '',
                              state: addr.state || '',
                              country: addr.country || '',
                              postalCode: addr.postalCode || '',
                              paymentMethod: 'COD',
                            })
                          }
                          className="mr-2"
                        />
                        <div>
                          <p className="font-semibold">{addr.name}</p>
                          <p>{addr.phone}</p>
                          <p>{addr.addressLine1}</p>
                          {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                          <p>{addr.city}, {addr.state}, {addr.country} - {addr.postalCode}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="mt-4 text-blue-600 underline"
                  onClick={() => {
                    setUseNewAddress(true);
                    setForm({
                      name: '',
                      phone: '',
                      addressLine1: '',
                      addressLine2: '',
                      city: '',
                      state: '',
                      country: '',
                      postalCode: '',
                      paymentMethod: 'COD',
                    });
                  }}
                >
                  + Add New Address
                </button>
              </div>
            )}

            {(useNewAddress || savedAddresses.length === 0) && (
              <>
                <input className="w-full border p-2 rounded" type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input className="w-full border p-2 rounded" type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                <input className="w-full border p-2 rounded" type="text" name="addressLine1" placeholder="Address Line 1" value={form.addressLine1} onChange={handleChange} required />
                <input className="w-full border p-2 rounded" type="text" name="addressLine2" placeholder="Address Line 2" value={form.addressLine2} onChange={handleChange} />
                <input className="w-full border p-2 rounded" type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
                <input className="w-full border p-2 rounded" type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} required />
                <input className="w-full border p-2 rounded" type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
                <input className="w-full border p-2 rounded" type="text" name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} required />

                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    className="text-blue-600 underline"
                    onClick={() => setUseNewAddress(false)}
                  >
                    ← Use Existing Address
                  </button>
                )}
              </>
            )}
          </>
        )}

        <select className="w-full border p-2 rounded" name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
          <option value="COD">Cash on Delivery</option>
          <option value="CreditCard">Credit Card</option>
          <option value="DebitCard">Debit Card</option>
          <option value="UPI">UPI</option>
          <option value="PayPal">PayPal</option>
        </select>

        <button
          type="submit"
          disabled={processing}
          className={`w-full text-white px-4 py-2 rounded ${processing ? 'bg-gray-400' : 'bg-blue-600'}`}
        >
          {processing ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        {items.map((item, index) => (
          <div key={item.productId} className="flex items-center justify-between border p-2 rounded gap-4">
            <img src={item.thumbnailUrl || '/placeholder.png'} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">Price: ₹{item.salePrice}</p>
              <p className="text-sm text-gray-600">Subtotal: ₹{item.salePrice * item.quantity}</p>
              <div className="flex items-center space-x-2 mt-2">
                <button type="button" onClick={() => decrement(index)} className="px-2 py-1 bg-gray-300 rounded">-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => increment(index)} className="px-2 py-1 bg-gray-300 rounded">+</button>
              </div>
            </div>
          </div>
        ))}
        <div className="text-right font-bold text-xl border-t pt-4">
          Total: ₹{items.reduce((acc, item) => acc + item.quantity * item.salePrice, 0)}
        </div>
      </div>
    </div>
  );
}
