import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import SubSubCategory from "@/app/schema/subLevelSchema";
import slugify from 'slugify';
export async function GET(request: Request) {
    await connectMongo();
     
    try{
        const subLevel = await SubSubCategory.find({}, 'name description _id');
        return NextResponse.json({status: "success",statusCode:200,message:"sub-Level fetched successfully",subLevel},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}

export async function POST(request: Request) {
    await connectMongo();
    const { name, description, subCategoryId, image } = await request.json();
    if (!name || !subCategoryId) {
        return NextResponse.json({status: "success",statusCode:200,message:"something went wrong"},{status:200});
      }
            // Slug generate karo agar frontend se nahi aaya
    let baseSlug = slugify(name, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await SubSubCategory.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
  
    try{
        const newSubLevel = new SubSubCategory({
            name,
            description,
            subCategoryId,
            image,
            slug: uniqueSlug,
          });
          // Save the sub-level to the database
      await newSubLevel.save();
        return NextResponse.json({status: "success",statusCode:200,message:"subLevels added successfully",newSubLevel},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}