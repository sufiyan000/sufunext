import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import Purchase, { IPurchase} from "@/app/schema/purchaseSchema";
import Product, { IProduct } from "@/app/schema/productSchema";
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
        const purchase = await Purchase.aggregate([
            {
              $lookup: {
                from: "suppliers", // ✅ Supplier model ka exact collection name
                localField: "suppliers_id",
                foreignField: "_id",
                as: "supplierDetails",
              },
            },
            {
              $unwind: {
                path: "$supplierDetails",
                preserveNullAndEmptyArrays: true, // Agar supplier na ho to bhi record aaye
              },
            },
            {
              $project: {
                _id: 1,
                product_id: 1,
                product_image: 1,
                title: 1,
                price: 1,
                quantity: 1,
                total: 1,
                purchase_status: 1,
                createdAt: 1,
                updatedAt: 1,
                __v: 1,
                suppliers_id: {
                  _id: "$supplierDetails._id",
                  name: "$supplierDetails.name",
                },
              },
            },
          ]);
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