import CategoryPage from "@/app/ui/category/category";
import SubCategoryPage from "@/app/ui/category/sub-category";
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