import CategoryPage from "@/app/ui/category/category";
import Add from "@/app/ui/category/add";
import { fetchCategory} from "@/app/lib/data";
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';

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