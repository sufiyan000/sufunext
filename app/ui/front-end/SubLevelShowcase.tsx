'use client';

import { useRef } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SubLevel {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

const SubLevelCarousel = ({
  sublevels,
  titleData,
}: {
  sublevels: SubLevel[];
  titleData?: string;
}) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [instanceRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: 'free-snap',
    slides: {
      perView: 2,
      spacing: 15,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 3, spacing: 20 },
      },
      '(min-width: 768px)': {
        slides: { perView: 4, spacing: 20 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 5, spacing: 24 },
      },
    },
  });

  const handlePrev = () => {
    if (slider.current) slider.current.prev();
  };

  const handleNext = () => {
    if (slider.current) slider.current.next();
  };

  return (
    <div className="bg-gray-100 py-8 w-full px-4 relative">
      <h2 className={`${lusitana.className} text-3xl font-bold text-center text-gray-800 mb-6`}>
        {titleData || 'Explore Sub-Levels'}
      </h2>

      {/* Prev Button */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-md rounded-full hover:bg-gray-200"
      >
        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-md rounded-full hover:bg-gray-200"
      >
        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
      </button>

      <div
        ref={(el) => {
          sliderRef.current = el;
          instanceRef(el);
        }}
        className="keen-slider"
      >
        {sublevels.map((level) => (
          <div className="keen-slider__slide" key={level._id}>
            <Link
              href={`/products/levels/${level.slug}`}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-transform hover:scale-105 h-full"
            >
              <img
                src={level.image || '/logo.png'}
                alt={level.name}
                className="w-full h-36 object-contain mb-2"
              />
              <h3 className={`${lusitana.className} text-lg text-gray-700 text-center`}>
                {level.name}
              </h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubLevelCarousel;
