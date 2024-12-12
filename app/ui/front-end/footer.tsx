// Footer.jsx
import React from 'react';
import Image from 'next/image';
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="container mx-auto grid md:grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#07f0f0' }}>
            Faydazone
          </h3>
          <p className="text-sm mb-2">192 Ratnakala building ved raod pandol, surat, India</p>
          <p className="text-sm mb-2">Email: faydazone67@company.com</p>
          <p className="text-sm">Phone: +91 9601420947</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#07f0f0' }}>
            Quick Links
          </h3>
          <ul>
            <li className="mb-2">
              <a href="/about" className="text-sm hover:text-[#07f0f0]">
                About Us
              </a>
            </li>
            <li className="mb-2">
              <a href="/shop" className="text-sm hover:text-[#07f0f0]">
                Shop
              </a>
            </li>
            <li className="mb-2">
              <a href="/contact" className="text-sm hover:text-[#07f0f0]">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="text-sm hover:text-[#07f0f0]">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#07f0f0' }}>
            Follow Us
          </h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Image src="/icons8-facebook.svg" width={50} height={50} alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Image src="/icons8-twitter.svg"  width={50} height={50} alt="Twitter" className="h-6 w-6" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Image src="/icons8-instagram.svg"  width={50} height={50} alt="Instagram" className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com"  target="_blank" rel="noopener noreferrer">
              <Image src="/icons8-linkedin.svg"  width={50} height={50} alt="LinkedIn" className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
