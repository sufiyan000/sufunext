import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import subCategory from "@/app/schema/subCategorySchema";
export async function GET(request: Request,context:any) {
    await connectMongo();
     
    try{
        const id = context.params.id;
        const subCategorys = await subCategory.find({_id:id});
        return NextResponse.json({status: "success",statusCode:200,message:"Sub-Categories fetched successfully",subCategorys},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}