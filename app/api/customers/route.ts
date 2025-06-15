// app/api/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from "@/app/lib/mongodb";
import Customer from '@/app/schema/customerSchema';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body = await req.json();

    const newCustomer = new Customer({
      name: body.name,
      mobile: body.mobile,
      billingAddress: {
        flat: body.flat,
        area: body.area,
        pincode: body.pincode,
        city: body.city,
        state: body.state,
      },
      shippingAddress: {
        flat: body.shippingAddress.flat,
        area: body.shippingAddress.area,
        pincode: body.shippingAddress.pincode,
        city: body.shippingAddress.city,
        state: body.shippingAddress.state,
      },
    });

    const saved = await newCustomer.save();
    return NextResponse.json({ success: true, customer: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  try {
    const customers = await Customer.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ],
    }).limit(10);

    return NextResponse.json(customers);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}