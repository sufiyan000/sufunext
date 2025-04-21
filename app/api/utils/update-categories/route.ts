// /app/api/utils/update-categories/route.ts

import { NextResponse } from 'next/server';
import connectMongo from "@/app/lib/mongodb";
import Category, {ICategory} from '@/app/schema/categorySchema';
import slugify from 'slugify';

export async function GET() {
  await connectMongo();

  try {
    const categories = await Category.find();

    for (const cat of categories) {
      let updated = false;

      if (!cat.slug) {
        cat.slug = slugify(cat.name, { lower: true, strict: true });
        updated = true;
      }

      if (!cat.image) {
        cat.image = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(cat.name);
        updated = true;
      }

      if (updated) await cat.save();
    }

    return NextResponse.json({ message: 'Categories updated successfully ✅' });
  } catch (err) {
    return NextResponse.json({ message: 'Error updating categories ❌', error: err }, { status: 500 });
  }
}
