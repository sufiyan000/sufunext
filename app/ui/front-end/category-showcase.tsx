"use client";
import {
  ShoppingCartIcon,
  HomeIcon,
  BookOpenIcon,
  ShoppingBagIcon,
  PlusIcon,
  HeartIcon,
  ComputerDesktopIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}



const CategoryShowcase = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="bg-gray-100 py-8 w-full p-4">
      <h2 className={`${lusitana.className} text-3xl font-bold text-center text-gray-800 mb-4`}>
        Explore Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => {
          return (
            <Link
              href={`/category/${category.slug}`}
              key={category._id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105"
            >
              <img
              src={category.image || '/logo.png'}
              alt={category.name}
              className="w-full h-36 object-contain mb-3"
            />
              <h3 className={`${lusitana.className} text-xl font-semibold text-gray-700 text-center`}>
                {category.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryShowcase;
