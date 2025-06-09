"use client";
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}



const SubCategoryShowcase = ({ subcategories }: { subcategories: SubCategory[] }) => {
  return (
    <div className="bg-gray-100 py-8 w-full p-4">
      <h2 className={`${lusitana.className} text-3xl font-bold text-center text-gray-800 mb-4`}>
        Explore Sub-Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {subcategories.map((sub) => {
          return (
            <Link
              href={`/category/levels/${sub.slug}`}
              key={sub._id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105"
            >
              <img
              src={sub.image || '/logo.png'}
              alt={sub.name}
              className="w-full h-36 object-contain mb-3"
            />
              <h3 className={`${lusitana.className} text-xl font-semibold text-gray-700 text-center`}>
                {sub.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SubCategoryShowcase;
