import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import slugify from 'slugify';
import Product, { IProduct } from "@/app/schema/productSchema";
export async function POST(request: Request) {
    await connectMongo();
    const productData = await request.json();
    try{
             // Validate required fields
      const requiredFields = [
        'name',
        'brand',
        'sku',
        'suppliers',
        'purchasePrice',
        'sellingPrice',
        'regularPrice',
        'stock',
      ];
      for (const field of requiredFields) {
        if (!productData[field]) {
          return NextResponse.json({ error: `Field '${field}' is required.` });
        }
      }
        // Slug generate karo agar frontend se nahi aaya
    let baseSlug = slugify(productData.name, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

      const newProduct: IProduct = new Product({
        ...productData,
        slug: uniqueSlug,
        categories: productData.categories || [],
        subCategories: productData.subCategories || [],
        subLevels: productData.subLevels || [],
        attributes: productData.attributes || [],
        images: productData.images || [],
        isFeatured: productData.isFeatured || false,
      });

      const savedProduct = await newProduct.save();
        return NextResponse.json({status: "success",statusCode:200,message:"Product added successfully",productData},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}

export async function PUT(request: Request){
    await connectMongo();
    const productData = await request.json();
    const id = productData.id;
    const newProduct = {
      name: productData.name,
      videoUrl: productData.videoUrl,
      brand: productData.brand,
      warranty: productData.warranty,
      describe: productData.describe,
      suppliers: productData.suppliers,
      purchasePrice: productData.purchasePrice,
      sellingPrice: productData.sellingPrice,
      regularPrice: productData.regularPrice,
      sku: productData.sku,
      isFeatured: productData.isFeatured,
    }
    if (!id) {
        return NextResponse.json({ error: 'Product ID is required.' });
      }
      if (!productData) {
        return NextResponse.json({ error: 'Product data is required.' });
      }
      
      try{
        const updatedProduct = await Product.findByIdAndUpdate(id, newProduct, { new: true });
        if (!updatedProduct) {
          return NextResponse.json({ error: 'Product not found.' });
        }
        return NextResponse.json({ status: "success",statusCode:200, message:"Product updated successfully",productData},{status:200});
      }
      catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
      }
    
}


export async function GET(req: Request) {
  await connectMongo();
  const url = new URL(req.url);
  const search = url.searchParams.get('search') || '';

  const products = await Product.find({
    name: { $regex: search, $options: 'i' }
  }).select('name _id sellingPrice stock thumbnailUrl');

  return NextResponse.json(products);
}