import CategoryShowcase from "../ui/front-end/category-showcase";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/category`, {
    cache: 'no-store',
  });

  const jsonData = await res.json();
  console.log(jsonData); // Check the structure here

  // Access categories properly from response
  const categories: Category[] = jsonData.categories || [];

  return (
    <CategoryShowcase categories={categories} />
  );
}
