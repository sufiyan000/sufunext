import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Order from '@/app/schema/orderSchema';
import { verifyAccessToken } from '@/app/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const token = req.cookies.get('accessToken')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload || payload.role !== 'Admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // ✅ Fetch all orders and populate user details
    const orders = await Order.find()
      .populate('user', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Admin Order Fetch Error:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
