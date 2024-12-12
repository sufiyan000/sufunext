import CategoryPage from "@/app/ui/dashboard/category/category";
import Add from "@/app/ui/dashboard/category/add";
import { fetchCategory} from "@/app/lib/data";
import Breadcrumbs from '@/app/ui/dashboard/invoices/breadcrumbs';

export default async function Page() {
  const categories = await fetchCategory();
   console.log(categories);
    
    return (
        <main>
           <Breadcrumbs
              breadcrumbs={[
                { label: 'Category', href: '/dashboard/category' },
                {
                  label: 'Add Category',
                  href: '/dashboard/category/add',
                  active: true,
                },  
              ]}
            />
         <Add />
        </main>
         
    )
  }