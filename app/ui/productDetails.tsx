// pages/product/[id].tsx
"use client";
import React, { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { calculateDiscountPercentage } from './front-end/showProduct';

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    thumbnailUrl: string;
    regularPrice: number;
    salePrice: number;
    rating: number;
    ratingCount: number;
    images: string[];
    specifications: Record<string, string>;
    highlights: string[];
    description: string;
    reviews: { user: string; rating: number; comment: string }[];
    deliveryInfo: string;
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [mainImage, setMainImage] = useState(product.thumbnailUrl || '');
  const [pincode, setPincode] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      setDeliveryMessage(product.deliveryInfo);
    } else {
      setDeliveryMessage('Please enter a valid 6-digit pincode.');
    }
  };

  const handleImageChange = (image: string) => {
    setMainImage(image);
  };

    // Generate WhatsApp Order URL
    const handleWhatsAppOrder = () => {
      const phoneNumber = '918511888678'; // Replace with your WhatsApp number
      const message = `Hello, I would like to place an order for the following product:\n\n` +
      `*Product Image*: ${product.thumbnailUrl}\n` +
        `*Product Name*: ${product.name}\n` +
        `*Sale Price*: ₹${product.salePrice}\n` +
        `*Regular Price*: ₹${product.regularPrice}\n` +
        // `*Rating*: ${product.rating} (${product.ratingCount} reviews)\n\n` +
        `Please let me know how to proceed.`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };
  

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div>
        <Zoom>
        {mainImage ? (
              <img
                src={mainImage}
                alt="Main Product Image"
                className="w-full h-96 object-cover rounded-lg mb-4 cursor-pointer"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <span>No Image Available</span>
              </div>
            )}
        </Zoom>
        <div className="flex space-x-4">
        {product.images &&
              product.images.map((image, index) =>
                image ? (
                  <img
                    key={index}
                    src={image}
                    alt={product.name}
                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer ${
                      mainImage === image ? 'border-2 border-[#07f0f0]' : ''
                    }`}
                    onClick={() => handleImageChange(image)}
                  />
                ) : null // Skip rendering for empty or invalid images
              )}
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <h1 className={`${lusitana.className} text-3xl font-bold mb-4`} style={{ color: '#07f0f0' }}>
          {product.name}
        </h1>
        <p className={`${lusitana.className} text-lg text-gray-400 mb-2`}>
          Discount: {calculateDiscountPercentage(product.regularPrice, product.salePrice)+"%"}
        </p>
        <p className={`${lusitana.className} text-lg text-gray-400 mb-2`}>
          ₹{product.salePrice}{' '}
          <span className="line-through">₹{product.regularPrice}</span>
        </p>
        <div className="flex items-center mb-4">
          <span className="text-yellow-400 text-sm mr-2">
            ★ {product.rating}
          </span>
          <span className="text-sm text-gray-400">
            ({product.ratingCount} reviews)
          </span>
        </div>
       
        <Link
            href="/"
            className={`${lusitana.className} flex justify-center gap-5 self-start rounded-lg bg-[#07f0f0] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-blue-400 md:text-base mb-4`}
          >
           Add To Cart
          </Link>
          <button
            onClick={handleWhatsAppOrder}
            className={`${lusitana.className} w-full flex justify-center gap-5 self-start rounded-lg bg-[#07f0f0] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-blue-400 md:text-base mb-4`}
          >
            <img
          src="/icons8-whatsapp.png" // Replace with a valid WhatsApp icon
          alt="WhatsApp"
          className="w-6 h-6"
        />
           Order on Whatspp
          </button>
        <Link
            href="/"
            className={`${lusitana.className} flex justify-center gap-5 self-start rounded-lg bg-[#07f0f0] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-blue-400 md:text-base`}
          >
           Buy Now
          </Link>
        
        <div className="mt-6">
          <h3 className={`${lusitana.className} text-xl font-bold mb-2`} style={{ color: '#07f0f0' }}>
            Check Delivery Time
          </h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Enter Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="p-2 rounded-lg text-black"
            />
            <button 
             className={`${lusitana.className} flex justify-center gap-5 self-start rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base`}
            onClick={handlePincodeCheck}>Check</button>
          </div>
          {deliveryMessage && <p className="text-gray-300 mt-2">{deliveryMessage}</p>}
        </div>
      </div>
    </div>
    
    {/* description */}
    <div className="mt-12">
      <h3 className={`${lusitana.className} text-xl font-bold mb-4`} style={{ color: '#07f0f0' }}>
        Description
      </h3>
      {product.description && (
         <p className={`${lusitana.className} text-gray-500 mb-6`}>{product.description}</p>
      )
      }
      
      
    </div>

    {/* Specifications and Highlights */}
    <div className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className={`${lusitana.className} text-xl font-bold mb-4`} style={{ color: '#07f0f0' }}>
            Specifications
          </h3>
          <ul className="text-gray-500 space-y-2">
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={`${lusitana.className} text-xl font-bold mb-4`} style={{ color: '#07f0f0' }}>
            Highlights
          </h3>
          <ul className="text-gray-500 space-y-2">
            {product.highlights.map((highlight, index) => (
              <li key={index}>- {highlight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Ratings and Reviews */}
    <div className="mt-12">
      <h3 className={`${lusitana.className} text-xl font-bold mb-4`} style={{ color: '#07f0f0' }}>
        Ratings and Reviews
      </h3>
      <div className="space-y-4">
        <Link
            href="/"
            className={`${lusitana.className} flex justify-center gap-5 self-start rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base`}
          >
           Rate Product
          </Link>
        {product.reviews.map((review, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300">
              <strong>{review.user}</strong>: ★ {review.rating}
            </p>
            <p className="text-gray-400">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Similar Products */}
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-4" style={{ color: '#07f0f0' }}>
        You might be interested in
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        
      </div>
    </div>
      
    </div>
  );
};

export default ProductDetails;
