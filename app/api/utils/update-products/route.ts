import { NextResponse } from 'next/server';
import connectMongo from "@/app/lib/mongodb";
import Product from '@/app/schema/productSchema';
import slugify from 'slugify';

export async function GET() {
  await connectMongo();

  try {
    const products = await Product.find();
    let updatedCount = 0;

    for (const product of products) {
      let updated = false;

      // If slug is missing, generate one
      if (!product.slug) {
        let baseSlug = slugify(product.name, { lower: true, strict: true });
        let uniqueSlug = baseSlug;
        let counter = 1;

        // Ensure slug is unique
        while (await Product.findOne({ slug: uniqueSlug })) {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }

        product.slug = uniqueSlug;
        updated = true;
      }

      if (updated) {
        await product.save();
        updatedCount++;
      }
    }

    return NextResponse.json({ message: `Products updated successfully ✅`, updatedCount });
  } catch (err) {
    console.error("Error updating products:", err);
    return NextResponse.json({ message: 'Error updating products ❌', error: err }, { status: 500 });
  }
}
