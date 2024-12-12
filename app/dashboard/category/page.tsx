import CategoryPage from "@/app/ui/dashboard/category/category";
import SubCategoryPage from "@/app/ui/dashboard/category/sub-category";
import { fetchCategory} from "@/app/lib/data";

export default async function Page() {
  const categories = await fetchCategory();
    
    return (
        <>
         <CategoryPage />
         {/* <SubCategoryPage  /> */}
        
        </>
    )
  }