import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import SubSubCategory from "@/app/schema/subLevelSchema";
export async function GET(request: Request,context:any) {
    await connectMongo();
     
    try{
        const id = context.params.subcategoryId;
        if(!id){
            return NextResponse.json({success:false,message: "sub-Category Id is required"});
        }
        const subLevels = await SubSubCategory.find({subCategoryId:id});
        return NextResponse.json({status: "success",statusCode:200,message:"Sub-Categories fetched successfully",subLevels},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}