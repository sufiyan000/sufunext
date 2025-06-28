import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import GuestCart from '@/app/schema/guestCartSchema';

export async function POST(req: NextRequest) {
  await connectMongo();
  const { guestId, ...item } = await req.json();

  let cart = await GuestCart.findOne({ guestId });
  if (!cart) {
    cart = new GuestCart({ guestId, items: [item] });
  } else {
    const existingIndex = cart.items.findIndex((p: any) => p.productId.toString() === item.productId);
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
  }

  await cart.save();
  return NextResponse.json({ message: 'Guest cart updated', cart });
}

export async function GET(req: NextRequest) {
  await connectMongo();
  const guestId = req.nextUrl.searchParams.get('guestId');

  if (!guestId) {
    return NextResponse.json({ message: 'guestId required' }, { status: 400 });
  }

  const cart = await GuestCart.findOne({ guestId });
  if (!cart) return NextResponse.json({ cart: [] });

  return NextResponse.json({ cart: cart.items });
}
