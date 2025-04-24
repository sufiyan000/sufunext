// app/products/[slug]/page.tsx

import ProductShowcase from '@/app/ui/front-end/ProductShowcase';

export default async function ProductSlugPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.slug}`);
  const products = await res.json();
  console.log(products);

  // Optional: Error handling
  if (!Array.isArray(products)) {
    return <div className="text-red-500 text-center py-10">Products not found.</div>;
  }

  return <ProductShowcase products={products} />;
}
