import EditProductForm from '@/app/ui/dashboard/products/edit-products';
import Breadcrumbs from '@/app/ui/dashboard/invoices/breadcrumbs';
import { fetchProductById, fetchCustomers, } from '@/app/lib/data';
 
export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const data = await fetchProductById(id);
    console.log(data);
    
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditProductForm  />
    </main>
  );
}