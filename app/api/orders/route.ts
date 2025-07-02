import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Order from '@/app/schema/orderSchema';
import { requireAuth } from '@/app/lib/requireAuth';

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.error || !auth.payload) return auth.response;

  try {
    await connectMongo();
    const data = await req.json();

    const orderItems = data.orderItems.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.salePrice, // use salePrice directly as price
      total: item.quantity * item.salePrice,
      attributes: item.attributes || {},
    }));

    const newOrder = new Order({
      user: auth.payload.userId, // ✅ Fix here
      orderItems,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      shippingCost: data.shippingCost || 0,
      totalCost: data.totalCost,
      status: 'Pending',
    });

    await newOrder.save();
    return NextResponse.json({ message: 'Order placed successfully' }, { status: 201 });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ message: 'Failed to place order' }, { status: 500 });
  }
}
