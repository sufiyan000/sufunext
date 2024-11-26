import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import Product from "@/app/schema/productSchema";
export async function POST(request: Request) {
    await connectMongo();
    const data = await request.json();
    try{
        const product = new Product(data);
        await product.save();
        return NextResponse.json({status: "success",statusCode:200,message:"Product added successfully",product},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}