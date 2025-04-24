"use client";
import {
  CubeIcon, BookOpenIcon, HeartIcon, HomeIcon, ShoppingBagIcon, ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';

interface SubLevel {
  _id: string;
  name: string;
  slug: string;
}

const iconMap: Record<string, React.ElementType> = {
  "Lipstick": HeartIcon,
  "Foundation": CubeIcon,
  "Notebooks": BookOpenIcon,
  "Wall Art": HomeIcon,
  "Dresses": ShoppingBagIcon,
  "Mobile Chargers": ComputerDesktopIcon,
};

const SubLevelShowcase = ({ sublevels }: { sublevels: SubLevel[] }) => {
  return (
    <div className="bg-gray-100 py-8 w-full p-4">
      <h2 className={`${lusitana.className} text-3xl font-bold text-center text-gray-800 mb-4`}>
        Explore Sub-Levels
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {sublevels.map((level) => {
          const Icon = iconMap[level.name] || CubeIcon;
          return (
            <Link
              href={`/products/levels/${level.slug}`}
              key={level._id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105"
            >
              <Icon className="h-14 w-14 text-[#07f0f0] mb-4" />
              <h3 className={`${lusitana.className} text-xl font-semibold text-gray-700 text-center`}>
                {level.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SubLevelShowcase;
