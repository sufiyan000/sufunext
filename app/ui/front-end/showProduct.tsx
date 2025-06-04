import Image from 'next/image';
import { fetchFilteredProducts } from '@/app/lib/data'; // Import the new fetch function
import { Card } from 'antd';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
export function calculateDiscountPercentage(regularPrice: number, salePrice: number): number {
  if (regularPrice <= 0) {
    throw new Error("Regular price must be greater than zero");
  }

  // Calculate discount percentage and round down to nearest integer
  const discountPercentage = Math.floor(((regularPrice - salePrice) / regularPrice) * 100);

  return discountPercentage;
}
export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = await fetchFilteredProducts(query, currentPage); // Use the new function

 
  

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 lg:p-8">
      {products.map((product, index) => (
        <div className="" key={index}>
          <Link href={`/products/${product.slug}`}>
            <Card
              key={product._id as string}
              hoverable
              cover={
                product.thumbnailUrl ? (
                  <Image
                    src={product.thumbnailUrl}
                    width={500}
                    height={500}
                    alt={product.name || 'Product Image'}
                    className="w-full h-36 object-contain mb-3"
                  />
                ) : (
                  <div className="h-40 w-full bg-gray-200 flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )
              }
              className="flex flex-col"
            >
              <div className="flex flex-col items-center">
                <h3 className={`${lusitana.className} text-sm text-gray-800 md:text-md md:leading-normal line-clamp-2`}>{product.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 mr-1">⭐⭐⭐⭐</span>
                </div>
                <p className="text-sm text-gray-500 line-through">
                  Rs.{product.regularPrice}
                </p>
                <p className={`${lusitana.className} text-lg text-gray-800 md:text-lg md:leading-normal`}>
                <strong>Rs.{product.sellingPrice}</strong>
                  </p>
                <p className="text-sm text-green-600 mb-4">
                  {
                    calculateDiscountPercentage(product.regularPrice, product.sellingPrice)+"%"
                  }
                </p>
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}
