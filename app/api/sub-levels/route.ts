import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import SubCategory from "@/app/schema/subCategorySchema";


export async function GET(request: Request) {
    await connectMongo();
     
    try{
        const categories = await SubCategory.find({}, 'name description _id');
        return NextResponse.json({status: "success",statusCode:200,message:"Categories fetched successfully",categories},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}