import SubCategoryShowcase from '@/app/ui/front-end/SubCategoryShowcase';

export default async function CategorySlugPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subcategories/${params.slug}`);
  const subcategories = await res.json();

  return <SubCategoryShowcase subcategories={subcategories} />;
}
