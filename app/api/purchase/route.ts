import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import Purchase, { IPurchase} from "@/app/schema/purchaseSchema";
import Product, { IProduct } from "@/app/schema/productSchema";
import Supplier from "@/app/schema/supplierSchema";
export async function POST(request: Request) {
    await connectMongo();
    try{
        const {id, quantity} = await request.json();
        if(!id ||!quantity){
            return NextResponse.json({success:false,message: "Product id and quantity are required"});
        }
        const product = await Product.findById(id);
        if(!product){
            return NextResponse.json({success:false, message: "Product Not Found"});
        }
        const { thumbnailUrl,name,purchasePrice, suppliers } = product;
        const existingPurchase = await Purchase.findOne({ product_id: id });
        if (existingPurchase) {
            return NextResponse.json({success:true, message: "product already created"});
        }
        const purchaseData = {
            product_id: id,
            product_image: thumbnailUrl,
            title: name,
            price: purchasePrice,
            quantity,
            total: purchasePrice * quantity,
            suppliers_id: suppliers,
        };
        const purchase = await Purchase.create(purchaseData);
        if(!purchase){
            return NextResponse.json({success:false, message: "Failed to create purchase record"});
        }
        return NextResponse.json({success: true, message: "Product Successfully Added", purchase});

    }
    catch(err: any) {
        return NextResponse.json({status: "error", statusCode: 400, message: err.message}, {status: 400});
    }
}

// This is the GET route for retrieving a product by ID

export async function GET(request: Request) {
    await connectMongo();
    try{
       const purchase = await Purchase.find().populate('suppliers_id', 'name').exec();
       console.log(purchase);
       return NextResponse.json(
      {
        status: "success",
        statusCode: 200,
        message: "Purchases fetched successfully",
        purchase
      },
      { status: 200 }
    );

    }
    catch(err: any) {
        console.error("Error fetching purchases:", err);
        return NextResponse.json(
            {
              status: "error",
              statusCode: 400,
              message: err.message
            },
            { status: 400 }
          );
    }
}