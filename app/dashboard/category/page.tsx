import CategoryPage from "@/app/ui/category/category";
import SubCategoryPage from "@/app/ui/category/sub-category";

export default function Page() {
    // Fetch products based on category name
    // Replace "CategoryName" with the actual category name
    const categoryName = "CategoryName";
    // Replace "fetchProducts" with the actual function to fetch products based on category name
    const products = [
        // Sample product data
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
        // Add more products as needed
      ];
    
    return (
        <>
         <CategoryPage />
         <SubCategoryPage />
        
        </>
    )
  }