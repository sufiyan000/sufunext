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
    cart = new Cart({ userId, products: [body] });
  } else {
    const existingIndex = cart.products.findIndex((p:any) => p.productId === body.productId);
    if (existingIndex >= 0) {
      cart.products[existingIndex].quantity += body.quantity;
    } else {
      cart.products.push(body);
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

  return NextResponse.json({ cart: cart.products });
}
