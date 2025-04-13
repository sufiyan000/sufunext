import { NextResponse } from "next/server";
import connectMongo from "@/app/lib/mongodb";
import Purchase, { IPurchase} from "@/app/schema/purchaseSchema";
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    await connectMongo();
    try{
        const { id } = await params
        if (!id) {
            return NextResponse.json(
              {
                data: null,
                status: "fail",
                statusCode: 400,
                message: "ID is missing in the request.",
              },
              { status: 400 }
            );
          }
          const deletedPurchase = await Purchase.findByIdAndDelete(id);
          if (!deletedPurchase) {
            return NextResponse.json(
              {
                data: null,
                status: "fail",
                statusCode: 404,
                message: "Purchase not found.",
              },
              { status: 404 }
            );
          }
        return NextResponse.json(
            {
                data: deletedPurchase,
                status: "success",
                statusCode: 200,
                message: "Purchase deleted successfully.",
              },
             { status: 200 }
           );

    }catch(err: any){
        console.error("Error fetching purchases:", err);
        return NextResponse.json(
            {
              status: "error",
              statusCode: 500,
              message: err.message
            },
            { status: 500 }
          );


    }
   

  }