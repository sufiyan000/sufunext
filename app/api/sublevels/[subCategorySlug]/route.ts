// app/api/sublevels/[subCategorySlug]/route.ts

import { NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import SubLevel from '@/app/schema/subLevelSchema';
import SubCategory from '@/app/schema/subCategorySchema';

export async function GET(req: Request, { params }: { params: { subCategorySlug: string } }) {
  await connectMongo();

  try {
    const subCategory = await SubCategory.findOne({ slug: params.subCategorySlug });
    console.log("Slug received:", params.subCategorySlug);

    if (!subCategory) {
      return NextResponse.json({ message: 'Sub-category not found' }, { status: 404 });
    }

    const subLevels = await SubLevel.find({ subCategoryId: subCategory._id });

    return NextResponse.json(subLevels);
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching sub-levels', error: err }, { status: 500 });
  }
}
