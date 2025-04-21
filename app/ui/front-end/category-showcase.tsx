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
}

const iconMap: Record<string, React.ElementType> = {
  "Grocery & Food Items": ShoppingCartIcon,
  "Home Essentials": HomeIcon,
  "Personal Care": HeartIcon,
  "Clothing & Accessories": ShoppingBagIcon,
  "Electronics & Gadgets": ComputerDesktopIcon,
  "Health & Wellness": PlusIcon,
  "Stationery & Office Supplies": BookOpenIcon,
  "Toys & Kids Items": BookOpenIcon,
  "Kitchenware & Dining": HomeIcon,
  "Seasonal & Occasional Items": BookOpenIcon,
};

const CategoryShowcase = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="bg-gray-100 py-8 w-full p-4">
      <h2 className={`${lusitana.className} text-3xl font-bold text-center text-gray-800 mb-4`}>
        Explore Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => {
          const Icon = iconMap[category.name] || CubeIcon;
          return (
            <Link
              href={`/category/${category.slug}`}
              key={category._id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105"
            >
              <Icon className="h-16 w-16 text-[#07f0f0] mb-4" />
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
