import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import Category from "@/app/schema/categorySchema";
export async function POST(request: Request) {
    await connectMongo();
    const data = await request.json();
    try{
        const category = new Category(data);
        await category.save();
        return NextResponse.json({status: "success",statusCode:200,message:"Category added successfully",data},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}