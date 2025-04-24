import { NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Product from '@/app/schema/productSchema';
import SubLevel from '@/app/schema/subLevelSchema';

export async function GET(req: Request, { params }: { params: { subLevelSlug: string } }) {
  await connectMongo();

  try {
    const subLevel = await SubLevel.findOne({ slug: params.subLevelSlug });

    if (!subLevel) {
      return NextResponse.json({ message: 'Sub-level not found' }, { status: 404 });
    }

    const products = await Product.find({ subLevels: subLevel._id });

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching products', error: err }, { status: 500 });
  }
}
