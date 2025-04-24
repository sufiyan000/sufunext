'use client';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  sellingPrice: number;
  thumbnailUrl: string;
  slug: string;
}

const ProductShowcase = ({ products }: { products: Product[] }) => {
  return (
    <section className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h2 className={`${lusitana.className} text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800`}>
        📦 Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
        {products.map((product) => (
          <Link key={product._id} href={`/products/${product.slug}`}>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-4">
              <img
                src={product.thumbnailUrl || '/placeholder.png'}
                alt={product.name}
                className="w-full h-36 object-contain mb-3"
              />
              <h3 className={`${lusitana.className} text-sm font-semibold text-gray-800 line-clamp-2`}>
                {product.name}
              </h3>
              <p className={`${lusitana.className} text-[#07f0f0] font-bold mt-1 text-sm`}>
                ₹{product.sellingPrice}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;
