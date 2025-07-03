'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import api from '@/app/lib/axiosClient'; // Adjust path if needed
import { useDebounce } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const [input, setInput] = useState('');
  const [debouncedInput] = useDebounce(input, 300);
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedInput.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await api.get(`/api/search?query=${debouncedInput}`);
        setResults(res.data.products || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedInput]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full"
  ref={dropdownRef}>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowDropdown(true);
        }}
        placeholder={placeholder}
        className="text-black w-full rounded-md border border-gray-200 py-[9px] pl-10 pr-3 text-sm outline-none placeholder:text-gray-500"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />

      {/* Suggestions Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-64 overflow-y-auto">
          {results.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm text-black"
              onClick={() => setShowDropdown(false)}
            >
              <img
                src={product.thumbnailUrl || '/placeholder.png'}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
              />
              <span>{product.name}</span>
            </Link>
          ))}
        </div>
      )}

      {/* No results */}
      {showDropdown && input && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white shadow-md rounded-md border border-gray-200 px-4 py-2 text-gray-500 text-sm">
          No results found
        </div>
      )}
    </div>
  );
}
