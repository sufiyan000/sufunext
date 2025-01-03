import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import Supplier from "@/app/schema/supplierSchema";


export async function GET(request: Request) {
    await connectMongo();
    try{
        const supplier = await Supplier.find({}, 'name  _id');
        return NextResponse.json({status: "success",statusCode:200,message:"Supplier fetch successfully",supplier},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}
export async function POST(request: Request) {
    await connectMongo();
    const data = await request.json();
    try{
        const supplier = new Supplier(data);
        await supplier.save();
        return NextResponse.json({status: "success",statusCode:200,message:"Supplier added successfully",supplier},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}


export async function PUT(request: Request) {
    await connectMongo();
    const data = await request.json();
    try{
        const product = new Supplier(data);
        await product.save();
        return NextResponse.json({status: "success",statusCode:200,message:"Supplier added successfully",product},{status:200});
    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}
