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

    const deliveryMode = data.deliveryMode;
    if (!['Pickup', 'HomeDelivery'].includes(deliveryMode)) {
      return NextResponse.json({ message: 'Invalid delivery mode' }, { status: 400 });
    }

    if (!Array.isArray(data.orderItems) || data.orderItems.length === 0) {
      return NextResponse.json({ message: 'No order items provided' }, { status: 400 });
    }

    if (deliveryMode === 'HomeDelivery') {
      const requiredFields = ['name', 'phone', 'addressLine1', 'city', 'state', 'country', 'postalCode'];
      const missingFields = requiredFields.filter(field => !data.shippingAddress?.[field]);
      if (missingFields.length > 0) {
        return NextResponse.json({ message: `Missing address fields: ${missingFields.join(', ')}` }, { status: 400 });
      }
    }

    // ✅ YAHAN KARNA HAI YE CHANGE:
    const shippingAddress =
      deliveryMode === 'HomeDelivery' && Object.keys(data.shippingAddress || {}).length > 0
        ? data.shippingAddress
        : undefined;

    const orderItems = data.orderItems.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      thumbnailUrl: item.thumbnailUrl,
      quantity: item.quantity,
      price: item.salePrice,
      total: item.quantity * item.salePrice,
      attributes: item.attributes || {},
    }));

    const newOrder = new Order({
      user: auth.payload.userId,
      deliveryMode,
      orderItems,
      shippingAddress, // 👈 yahi new variable use ho raha
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
