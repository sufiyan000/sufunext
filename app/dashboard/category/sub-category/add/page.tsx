import Breadcrumbs from '@/app/ui/dashboard/invoices/breadcrumbs';
import AddSubCategoryForm from "@/app/ui/dashboard/category/sub-category";
import { fetchCategory } from '@/app/lib/data';
export default async function Page() {
    const category = await fetchCategory();
    console.log(category,"sufiyan");
 
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