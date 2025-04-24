import { NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Category from '@/app/schema/categorySchema';
import SubCategory from '@/app/schema/subCategorySchema';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await connectMongo();

  try {
    const category = await Category.findOne({ slug: params.slug });
    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    const subcategories = await SubCategory.find({ categoryId: category._id });

    return NextResponse.json(subcategories);
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching subcategories', error: err }, { status: 500 });
  }
}
