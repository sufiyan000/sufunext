// /app/api/categories/[slug]/products/route.ts
import { NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Product, { IProduct } from "@/app/schema/productSchema";
import Category, { ICategory } from '@/app/schema/categorySchema';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await connectMongo();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');  // Ensure limit is 6
  const skip = (page - 1) * limit;

  try {
    const category = await Category.findOne({ slug: params.slug });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    const products = await Product.find({ categories: { $in: [category._id] } })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ categories: { $in: [category._id] } });

    return NextResponse.json({
      products,
      total,
      hasMore: skip + products.length < total,  // Correctly checking if more products are available
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching products', error }, { status: 500 });
  }
}
