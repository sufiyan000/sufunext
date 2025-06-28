import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Cart from '@/app/schema/cartSchema';
import { requireAuth } from '@/app/lib/requireAuth';

export async function POST(req: NextRequest) {
  await connectMongo();

  const { error, response, payload } = await requireAuth(req);
  if (error) return response;

  const userId = payload?.userId;
  const body = await req.json();

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [body] });
  } else {
    const existingIndex = cart.items.findIndex((p: any) => p.productId.toString() === body.productId);
    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += body.quantity;
    } else {
      cart.items.push(body);
    }
  }

  await cart.save();
  return NextResponse.json({ message: 'Cart updated successfully', cart });
}

export async function GET(req: NextRequest) {
  await connectMongo();

  const { error, response, payload } = await requireAuth(req);
  if (error) return response;

  const userId = payload?.userId;
  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ cart: [] });

  return NextResponse.json({ cart: cart.items });
}


export async function PATCH(req: NextRequest) {
  await connectMongo();
  const { error, response, payload } = await requireAuth(req);
  if (error) return response;

  const userId = payload?.userId;
  const { productId, quantity } = await req.json();

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

  const item = cart.items.find((p: any) => p.productId.toString() === productId);
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  item.quantity = quantity;
  await cart.save();

  return NextResponse.json({ message: 'Cart item updated', cart });
}
