// /app/api/products/featured/route.ts

import { NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Product from '@/app/schema/productSchema';

export async function GET() {
  await connectMongo();

  try {
    const featuredProducts = await Product.find({ isFeatured: true }).sort({ updatedAt: -1 }).limit(10);
    return NextResponse.json({ status: 'success', featuredProducts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
