import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Product from '@/app/schema/productSchema';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query || query.trim() === '') {
    return NextResponse.json({ products: [] });
  }

  try {
    await connectMongo();

    const regex = new RegExp(query, 'i'); // case-insensitive search

    const products = await Product.find({
      $or: [
        { name: regex },
        { slug: regex },
        { brand: regex },
        { tags: regex }, // ✅ fixed from $elemMatch to direct regex
        { 'attributes.key': regex },
        { 'attributes.value': regex },
      ],
    })
      .limit(10)
      .select('_id name slug thumbnailUrl sellingPrice'); // ✅ ensure slug is included for frontend

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { message: 'Search failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
