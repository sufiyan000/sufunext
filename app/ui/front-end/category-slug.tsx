'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from 'antd';
import { lusitana } from '@/app/ui/fonts';
import { calculateDiscountPercentage } from "./showProduct";

interface Category {
  name: string;
  description: string;
  image: string;
}

interface Product {
  _id: string;
  slug: string;
  name: string;
  image: string;
  sellingPrice: number;
  regularPrice: number;
  thumbnailUrl: string;
}

export default function CategoryPage({ slug }: { slug: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Fetch category details
  useEffect(() => {
    axios.get(`/api/category/${slug}`)
      .then(res => setCategory(res.data))
      .catch(err => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error('Error fetching category:', err);
        }
      });
  }, [slug]);

  // Fetch products (paginated)
  useEffect(() => {
    if (!hasMore || notFound) return;

    axios.get(`/api/category/${slug}/products`, {
      params: { page, limit: 6 }  // Consistent limit as backend
    }).then(res => {
      setProducts(prev => [...prev, ...res.data.products]);
      setHasMore(res.data.hasMore); // Ensure hasMore is set properly based on API response
    }).catch(err => {
      console.error('Product fetch error:', err);
    });
  }, [page, slug, hasMore, notFound]);

  // Infinite scroll logic
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore) {
      setPage(prev => prev + 1);  // Increment page to load more products
    }
  }, [hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  if (notFound) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Category not found 😔
      </div>
    );
  }

  if (!category) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-gray-600">{category.description}</p>
      {category.image && (
        <img src={category.image} alt={category.name} className="my-4 rounded-md" />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id}>
            <Link href={`/products/${product.slug}`}>
              <Card
                hoverable
                cover={
                  product.thumbnailUrl?.trim() ? (
                    <Image
                      src={product.thumbnailUrl}
                      width={500}
                      height={500}
                      alt={product.name || 'Product Image'}
                      className="h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="h-40 w-full bg-gray-200 flex items-center justify-center">
                      <span>No Image</span>
                    </div>
                  )
                }
                className="flex flex-col"
              >
                <div className="flex flex-col items-center">
                  <h3 className={`${lusitana.className} text-sm text-gray-800 md:text-md line-clamp-2`}>
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-sm text-gray-500 line-through">
                    Rs.{product.regularPrice}
                  </p>
                  <p className={`${lusitana.className} text-lg text-gray-800`}>
                    <strong>Rs.{product.sellingPrice}</strong>
                  </p>
                  <p className="text-sm text-green-600 mb-4">
                    {calculateDiscountPercentage(product.regularPrice, product.sellingPrice) + "%"}
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* Loader for infinite scroll */}
      {hasMore && (
        <div ref={loaderRef} className="mt-4 text-center text-sm text-gray-500">
          Loading more products...
        </div>
      )}
    </div>
  );
}
