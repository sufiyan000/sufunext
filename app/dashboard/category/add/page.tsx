import CategoryPage from "@/app/ui/category/category";
import Add from "@/app/ui/category/add";
import { fetchCategory} from "@/app/lib/data";

export default async function Page() {
  const categories = await fetchCategory();
   console.log(categories);
    
    return (
        <>
         <Add />
         {/* <SubCategoryPage  /> */}
        
        </>
    )
  }