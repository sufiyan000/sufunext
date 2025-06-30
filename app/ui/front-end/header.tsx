'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Search from '@/app/ui/search';
import AcmeLogo from '@/app/ui/acme-logo';
import { lusitana } from '@/app/ui/fonts';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

const Header = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { user } = useSelector((state: RootState) => state.auth);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  // State for mobile menu and dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="container h-[60px] mx-auto flex justify-between items-center px-4 md:px-6">
        {/* Logo */}
        <AcmeLogo />

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className={`${lusitana.className} text-sm font-medium hover:text-[#07f0f0] transition-colors duration-300`}>
            Home
          </Link>
          <Link href="/" className={`${lusitana.className} text-sm font-medium hover:text-[#07f0f0] transition-colors duration-300`}>
            Shop
          </Link>
          <Link href="/category" className={`${lusitana.className} text-sm font-medium hover:text-[#07f0f0] transition-colors duration-300`}>
            Category
          </Link>
          <Link href="/" className={`${lusitana.className} text-sm font-medium hover:text-[#07f0f0] transition-colors duration-300`}>
            Services
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <Search placeholder="Search Products..." />
        </div>

        {/* Icons for Cart and User Account */}
        <div className="flex items-center space-x-6">
          <Link href="/cart" className="text-sm hover:text-[#07f0f0] relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l1.6 5M17 13l-1.6 5M9 18h6"
              />
            </svg>
            {/* Cart item count badge */}
            <span className="absolute -top-2 -right-2 bg-[#07f0f0] text-gray-900 rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          </Link>

        
          {user ? (
            <Link href={"/accounts"}>Welcome, {user.firstName}</Link>
          ) : (
            <Link href="/login" className="text-sm hover:text-[#07f0f0] relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A5 5 0 0112 15a5 5 0 016.879 2.804M15 10a3 3 0 10-6 0 3 3 0 006 0zm3.98 3.421a8.003 8.003 0 10-11.962 0"
              />
            </svg>
          </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 p-6 space-y-6 transition-transform transform ease-in-out duration-300">
          <Link href="/" className="block text-white text-lg font-medium hover:text-[#07f0f0]">
            Home
          </Link>
          <Link href="/" className="block text-white text-lg font-medium hover:text-[#07f0f0]">
            Shop
          </Link>
          <Link href="/category" className="block text-white text-lg font-medium hover:text-[#07f0f0]">
            Category
          </Link>
          <Link href="/" className="block text-white text-lg font-medium hover:text-[#07f0f0]">
            Services
          </Link>
          <Link href="/login" className="block text-white text-lg font-medium hover:text-[#07f0f0]">
            Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
