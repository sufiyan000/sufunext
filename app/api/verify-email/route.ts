import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import User from '@/app/schema/userSchema';

export async function GET(req: NextRequest) {
  await connectMongo();

  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Token is missing' }, { status: 400 });
  }

  const user = await User.findOne({
    'metadata.verifyToken': token,
    'metadata.verifyTokenExpiry': { $gt: Date.now() },
  });

  if (!user) {
    return NextResponse.json({ message: 'Token is invalid or expired' }, { status: 400 });
  }

  // ✅ Make sure metadata is always initialized
  if (!user.metadata) {
    user.metadata = {};
  }

  user.isEmailVerified = true;
  user.metadata.verifyToken = undefined;
  user.metadata.verifyTokenExpiry = undefined;

  await user.save();

  return NextResponse.redirect(new URL('/login?verified=1', req.url));
}
