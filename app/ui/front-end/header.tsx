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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md w-full">
      {/* Top Row */}
      <div className="flex items-center justify-between px-4 py-2 md:px-6 h-[60px]">
        {/* Left: Logo */}
        <div className="flex items-center space-x-4">
          <AcmeLogo />

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 text-sm">
            <Link href="/" className="hover:text-[#07f0f0]">Home</Link>
            <Link href="/" className="hover:text-[#07f0f0]">Shop</Link>
            <Link href="/category" className="hover:text-[#07f0f0]">Category</Link>
            <Link href="/" className="hover:text-[#07f0f0]">Services</Link>
          </nav>
        </div>

        {/* Right: Cart & User */}
        <div className="flex items-center space-x-4 text-sm">
          {/* Cart */}
          <Link href="/cart" className="relative hover:text-[#07f0f0]">
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l1.6 5M17 13l-1.6 5M9 18h6"
              />
            </svg>
            <span className="absolute -top-2 -right-2 bg-[#07f0f0] text-gray-900 rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          </Link>

          {/* User */}
          {user ? (
            <Link href="/accounts" className="hover:text-[#07f0f0]">Hi, {user.firstName}</Link>
          ) : (
            <Link href="/login" className="hover:text-[#07f0f0]">
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden focus:outline-none"
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

      {/* Search Bar Row */}
      <div className="w-full px-4 mt-2 md:mt-0 md:w-auto">
  <Search placeholder="Search products..." />
</div>

      {/* Desktop search (inline) */}
      

      {/* Mobile Menu Items */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-4 text-sm">
          <Link href="/" className="block hover:text-[#07f0f0]">Home</Link>
          <Link href="/" className="block hover:text-[#07f0f0]">Shop</Link>
          <Link href="/category" className="block hover:text-[#07f0f0]">Category</Link>
          <Link href="/" className="block hover:text-[#07f0f0]">Services</Link>
          <Link href="/login" className="block hover:text-[#07f0f0]">
            {user ? `Hi, ${user.firstName}` : 'Login'}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
