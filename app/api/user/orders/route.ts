import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Order from '@/app/schema/orderSchema';
import { requireAuth } from '@/app/lib/requireAuth';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const { error, response, payload } = await requireAuth(req);
    if (error) return response;

    const userId = payload!.userId; // ✅ Safe non-null assertion

    const orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Order fetch error:', err);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}
