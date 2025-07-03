import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Product from '@/app/schema/productSchema';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectMongo();

  try {
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid product ID or server error' }, { status: 500 });
  }
}
