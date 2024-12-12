// TrendingProducts.jsx
"use client";
import React from 'react';
import ProductCard from '@/app/ui/product-card';
// Sample product data
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    rating: 4.5, // Example rating out of 5
    regularPrice: '₹2,499', // Original price
    sellPrice: '₹1,999', // Discounted price
    discountPercentage: 20, // Calculated percentage discount
    image: '/headphone.jpg',
  },
  {
    id: 2,
    name: 'Smart Watch',
    rating: 4.5, // Example rating out of 5
    regularPrice: '₹2,499', // Original price
    sellPrice: '₹1,999', // Discounted price
    discountPercentage: 20, // Calculated percentage discount
    image: '/watch.jpg',
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    rating: 4.5, // Example rating out of 5
    regularPrice: '₹2,499', // Original price
    sellPrice: '₹1,999', // Discounted price
    discountPercentage: 20, // Calculated percentage discount
    image: '/speaker.jpg',
  },
  {
    id: 4,
    name: 'Fitness Tracker',
    rating: 4.5, // Example rating out of 5
    regularPrice: '₹2,499', // Original price
    sellPrice: '₹1,999', // Discounted price
    discountPercentage: 20, // Calculated percentage discount
    image: '/fitness.jpg',
  },
  {
    id: 5,
    name: 'Gaming Mouse',
    rating: 4.5, // Example rating out of 5
    regularPrice: '₹2,499', // Original price
    sellPrice: '₹1,999', // Discounted price
    discountPercentage: 20, // Calculated percentage discount
    image: '/mouse.jpg',
  },
  {
    id: 6,
    name: 'Portable Charger',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/charger.jpg',
  },
  {
    id: 7,
    name: 'Wireless Headphones',
    rating: 4.5, // Example rating out of 5
    regularPrice: '₹2,499', // Original price
    sellPrice: '₹1,999', // Discounted price
    discountPercentage: 20, // Calculated percentage discount
    image: '/headphone.jpg',
  },
  {
    id: 8,
    name: 'Smart Watch',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/watch.jpg',
  },
  {
    id: 9,
    name: 'Bluetooth Speaker',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/speaker.jpg',
  },
  {
    id: 10,
    name: 'Fitness Tracker',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/fitness.jpg',
  },
  {
    id: 11,
    name: 'Gaming Mouse',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/mouse.jpg',
  },
  {
    id: 12,
    name: 'Portable Charger',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/charger.jpg',
  },
  {
    id: 13,
    name: 'Wireless Headphones',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/headphone.jpg',
  },
  {
    id: 14,
    name: 'Smart Watch',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/watch.jpg',
  },
  {
    id: 15,
    name: 'Bluetooth Speaker',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/speaker.jpg',
  },
  {
    id: 16,
    name: 'Fitness Tracker',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/fitness.jpg',
  },
  {
    id: 17,
    name: 'Gaming Mouse',
   rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/mouse.jpg',
  },
  {
    id: 18,
    name: 'Portable Charger',
    rating: 4.5, // Example rating out of 5
  regularPrice: '₹2,499', // Original price
  sellPrice: '₹1,999', // Discounted price
  discountPercentage: 20, // Calculated percentage discount
    image: '/charger.jpg',
  },
];

const TrendingProducts = () => {
  return (
    <div className="bg-white py-8 px-4 md:px-8">
      <h2 className="text-lg font-semibold mb-6">Trending Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {products.map((product,index) => (
          <ProductCard product={product} key={index} />
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
