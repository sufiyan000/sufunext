"use client";
import {
    ShoppingCartIcon,
    HomeIcon,
    BookOpenIcon,
    ShoppingBagIcon,
    PlusIcon ,
    HeartIcon ,
    ComputerDesktopIcon
  } from '@heroicons/react/24/outline';
  import { lusitana } from '@/app/ui/fonts';
  const categories = [
      { id: 1, name: 'Grocery & Food Items', Icon: ShoppingCartIcon },
      { id: 2, name: 'Home Essentials', Icon: HomeIcon },
      { id: 3, name: 'Personal Care', Icon: HeartIcon  },
    { id: 4, name: 'Clothing & Accessories', Icon: ShoppingBagIcon },
    { id: 5, name: 'Electronics & Gadgets', Icon: ComputerDesktopIcon },
    { id: 6, name: 'Health & Wellness', Icon: PlusIcon  },
    { id: 7, name: 'Stationery & Office Supplies', Icon: HomeIcon },
    { id: 8, name: 'Toys & Kids Items', Icon: BookOpenIcon },
    { id: 9, name: 'Kitchenware & Dining', Icon: HomeIcon },
    { id: 10, name: 'Seasonal & Occasional Items', Icon: BookOpenIcon },
  ];
const Category = ()=>{
    return(
        <>
        <div className="bg-gray-100 py-8 w-full p-4">
      <h2 className={`${lusitana.className} text-3xl font-bold text-center text-gray-800 mb-4`}>
        Explore Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105"
          >
            <category.Icon className="h-16 w-16 text-[#07f0f0] mb-4" />
            <h3 className={`${lusitana.className} text-xl font-semibold text-gray-700 text-center`}>
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
        </>
    );

}
export default Category;