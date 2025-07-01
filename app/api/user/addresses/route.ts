// app/api/user/addresses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import User from '@/app/schema/userSchema';
import { verifyAccessToken } from '@/app/lib/jwt';

export async function GET(req: NextRequest) {
  await connectMongo();
  const token = req.cookies.get('accessToken')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ message: 'Invalid token' }, { status: 403 });

  const user = await User.findById(payload.userId);
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  return NextResponse.json({ addresses: user.addresses || [] });
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const token = req.cookies.get('accessToken')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ message: 'Invalid token' }, { status: 403 });

  const body = await req.json();

  const user = await User.findById(payload.userId);
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  user.addresses = [...(user.addresses || []), body];
  await user.save();

  return NextResponse.json({ message: 'Address added successfully' });
}
