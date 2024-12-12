import Image from 'next/image';
import { fetchFilteredProducts } from '@/app/lib/data'; // Import the new fetch function
import { Card } from 'antd';
import Link from 'next/link';

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = await fetchFilteredProducts(query, currentPage); // Use the new function

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:p-8">
      {products.map((product, index) => (
        <div className="text-white rounded-lg overflow-hidden shadow-lg" key={index}>
          <Link href={`/products/${product.id}/view`}>
            <Card
              key={product._id as string}
              hoverable
              cover={
                product.thumbnailUrl ? (
                  <Image
                    src={product.thumbnailUrl}
                    width={100}
                    height={100}
                    alt={product.name || 'Product Image'}
                    className="h-40 w-full object-cover"
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
                <h3 className="text-base font-medium mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 mr-1">⭐⭐⭐⭐</span>
                </div>
                <p className="text-sm text-gray-500 line-through">
                  Rs.{product.regularPrice}
                </p>
                <p className="text-lg font-semibold mb-2">Rs.{product.sellingPrice}</p>
                <p className="text-sm text-green-600 mb-4">50% off</p>
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  );
}
