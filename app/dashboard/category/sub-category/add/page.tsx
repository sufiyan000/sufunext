import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import AddSubCategoryForm from "@/app/ui/category/sub-category";
import { fetchCategory } from '@/app/lib/data';
export default async function Page() {
    const category = await fetchCategory();
 
    return (
       <main>
         <Breadcrumbs
              breadcrumbs={[
                { label: 'Category', href: '/dashboard/category' },
                {
                  label: 'Sub-Category',
                  href: '/dashboard/category/sub-category',
                  active: true,
                },  
              ]}
            />
            <AddSubCategoryForm category={category} />

       </main>
    )
  }