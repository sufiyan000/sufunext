import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Order from '@/app/schema/orderSchema';
import { verifyAccessToken } from '@/app/lib/jwt';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();

    const token = req.cookies.get('accessToken')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const payload = verifyAccessToken(token);
    if (!payload || payload.role !== 'Admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const order = await Order.findById(params.id)
      .populate('user', 'firstName lastName email phoneNumber')
      .lean();

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Order fetch error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo();
    const token = req.cookies.get('accessToken')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const payload = verifyAccessToken(token);
    if (!payload || payload.role !== 'Admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { status } = await req.json();
    const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true }).lean();

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated', order });
  } catch (err) {
    console.error('Status Update Error:', err);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

