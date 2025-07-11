'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import { message, Spin } from 'antd';
import api from '@/app/lib/axiosClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
interface CartItem {
  productId: string;
  name: string;
  salePrice: number;
  quantity: number;
  thumbnailUrl?: string;
  attributes?: Record<string, any>;
}
export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get('buyNow') === '1';
  const id = searchParams.get('id');

  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (isBuyNow && id) {
          const res = await api.get(`/api/products/id/${id}`);
          const product = res.data;

          setItems([{
            productId: product._id,
            name: product.name,
            thumbnailUrl: product.thumbnailUrl,
            salePrice: product.sellingPrice,
            quantity: 1,
          }]);
        } else {
          const res = await api.get('/api/cart');
          setItems(res.data.cart || []);
        }
      } catch (err) {
        message.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, isBuyNow, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <CheckoutForm cart={{ items }} />
    </div>
  );
}
