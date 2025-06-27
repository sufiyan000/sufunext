import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import User from '@/app/schema/userSchema';
import { verifyAccessToken } from '@/app/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const token = req.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 });
    }

    const payload = verifyAccessToken(token); // 🔐 JWT Verify

    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const user = await User.findById(payload.userId).select('-password -tokens');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Error in /api/user/me:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
