import { notFound } from 'next/navigation';
import Header from '@/app/ui/front-end/header';
import Footer from '@/app/ui/front-end/footer';
import CategoryPage from '@/app/ui/front-end/category-slug';
export default async function Page({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category/${params.slug}`);

  if (!res.ok) {
    notFound(); // triggers Next.js 404 page
  }
  const slug = params.slug;
    
  return (
    <main>
      <Header />
      <CategoryPage slug={slug} />
        <Footer />
      
    </main>
  );
}

