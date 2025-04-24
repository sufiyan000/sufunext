import SubLevelShowcase from "@/app/ui/front-end/SubLevelShowcase";
export default async function SubLevelPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sublevels/${params.slug}`);
  const sublevels = await res.json();
    // Check if we got an error instead of an array
    if (!Array.isArray(sublevels)) {
      return (
        <div className="text-center py-20 text-xl text-red-500">
          {sublevels.message || 'Something went wrong'}
        </div>
      );
    }
    return <SubLevelShowcase sublevels={sublevels} />;
}
