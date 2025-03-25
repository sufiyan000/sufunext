import ProductDetails from '@/app/ui/productDetails';
import Header from '@/app/ui/front-end/header';
import Footer from '@/app/ui/front-end/footer';
import { getProductByIdUsingAggregate } from '@/app/lib/data';
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const productData = await getProductByIdUsingAggregate(id);
    console.log(productData);
    
  return (
    <main>
      <Header />
        <ProductDetails product={productData} />
        <Footer />
      
    </main>
  );
}

