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
                  
                },  
                {
                    label: 'Sub-Level',
                    href: '/dashboard/category/sub-category/sub-level',
                  },
                  {
                    label: 'Add Sub-Level',
                    href: '/dashboard/category/sub-category/sub-level/add',
                    active: true,
                  },
              ]}
            />
            <AddSubCategoryForm category={category} />

       </main>
    )
  }