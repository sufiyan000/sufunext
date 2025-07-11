import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import Cart from '@/app/schema/cartSchema';
import { requireAuth } from '@/app/lib/requireAuth';
interface UpdateCartBody {
  productId: string;
  quantity: number;
}
interface CartItemInput {
  productId: string;
  quantity: number;
  attributes?: Record<string, string | number | boolean>; // Optional for variations
}

export async function POST(req: NextRequest) {
  await connectMongo();

  const { error, response, payload } = await requireAuth(req);
  if (error) return response;

  const userId = payload!.userId;
  const body: CartItemInput = await req.json();

  // ✅ Input validation
  if (!body.productId || typeof body.quantity !== 'number') {
    return NextResponse.json({ error: 'Invalid product or quantity' }, { status: 400 });
  }

  if (body.quantity <= 0) {
    return NextResponse.json({ error: 'Quantity must be greater than 0' }, { status: 400 });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [body] });
  } else {
    const existingIndex = cart.items.findIndex(
      (p: any) => p.productId.toString() === body.productId
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += body.quantity;
    } else {
      cart.items.push(body);
    }
  }

  await cart.save();

  return NextResponse.json({
    message: 'Cart updated successfully',
    cart: cart.items,
  });
}

export async function GET(req: NextRequest) {
  await connectMongo();

  const { error, response, payload } = await requireAuth(req);
  if (error) return response;

  const userId = payload!.userId; // ✅ Non-null assertion since requireAuth passed

  const cart = await Cart.findOne({ userId });

  if (!cart || !cart.items?.length) {
    return NextResponse.json({
      cart: [],
      message: 'Your cart is empty',
    });
  }

  return NextResponse.json({
    cart: cart.items,
    message: 'Cart fetched successfully',
  });
}


export async function PATCH(req: NextRequest) {
  await connectMongo();
  const { error, response, payload } = await requireAuth(req);
  if (error) return response;

  const userId = payload?.userId;
  const { productId, quantity }: UpdateCartBody = await req.json();

  if (!productId || typeof quantity !== 'number') {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }

  if (quantity <= 0) {
    return NextResponse.json({ error: 'Quantity must be greater than 0' }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

  const item = cart.items.find((p: any) => p.productId.toString() === productId);
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  item.quantity = quantity;
  await cart.save();

  return NextResponse.json({ message: 'Cart item updated', cart });
}


export async function DELETE(req: NextRequest) {
  await connectMongo();

  const { error, response, payload } = await requireAuth(req);
  if (error) return response;

  const userId = payload?.userId;

  let productId = '';
  try {
    const body = await req.json().catch(() => null);
    productId = body?.productId || '';
  } catch (e) {
    productId = '';
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return NextResponse.json({ message: 'No cart found' }, { status: 404 });
  }

  if (productId) {
    // 🧹 Remove one item
    cart.items = cart.items.filter(
      (item: any) => item.productId.toString() !== productId
    );
  } else {
    // 🧹 Clear entire cart
    cart.items = [];
  }

  await cart.save();

  return NextResponse.json({ message: 'Cart updated', cart });
}