import ProductDetails from '@/app/ui/productDetails';
import Header from '@/app/ui/front-end/header';
import Footer from '@/app/ui/front-end/footer';
import { getProductBySlugUsingAggregate } from '@/app/lib/data';
export default async function Page({ params }: { params: { slug: string } }) {
    const slug = params.slug;
    const productData = await getProductBySlugUsingAggregate(slug);
    
  return (
    <main>
      <Header />
        <ProductDetails product={productData} />
        <Footer />
      
    </main>
  );
}

