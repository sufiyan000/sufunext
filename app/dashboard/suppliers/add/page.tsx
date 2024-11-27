import SupplierManager from "@/app/ui/suppliers/add-suppliers";
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
export default async function Page() {
 
    
    return (
        <main>
            <Breadcrumbs
              breadcrumbs={[
                { label: 'Suppliers', href: '/dashboard/suppliers' },
                {
                  label: 'Add Supplier',
                  href: '/dashboard/suppliers/add',
                  active: true,
                },  
              ]}
            />
            <SupplierManager />
          
        </main>
         
    )
  }