// components/FeaturedProducts.tsx
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  sellingPrice: number;
  thumbnailUrl: string;
  slug: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get('/api/products/featured')
      .then(res => setProducts(res.data.featuredProducts))
      .catch(err => console.error('Error fetching featured products:', err));
  }, []);

  return (
    <section className="p-4 md:p-8">
      <h2 className={`${lusitana.className} text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800`}>
        🔥 Featured Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {products.map(product => (
            <Link key={product._id} href={`/products/${product.slug}`}>
          <div key={product._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-4">
            <img
              src={product.thumbnailUrl || '/placeholder.png'}
              alt={product.name}
              className="w-full h-36 object-contain mb-3"
            />
            
            <h3 className={`${lusitana.className} text-sm font-semibold text-gray-800 line-clamp-2`}>{product.name}</h3>
            <p className={`${lusitana.className} text-green-600 font-bold mt-1 text-sm`}>₹{product.sellingPrice}</p>
          </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
