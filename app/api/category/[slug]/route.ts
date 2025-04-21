import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Product, { IProduct } from "@/app/schema/productSchema";
import Category, {ICategory} from '@/app/schema/categorySchema';
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectMongo();

    // Find category by slug
    const category = await Category.findOne({ slug: params.slug });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error in /api/categories/[slug]:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
