// ✅ Backend: /api/auth/refresh

import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, createAccessToken } from '@/app/lib/jwt';
import User from '@/app/schema/userSchema';
import connectMongo from '@/app/lib/mongodb';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  await connectMongo();
  const refreshToken = req.cookies.get('refreshToken')?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const decoded: any = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error('User not found');

    const newAccessToken = createAccessToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    cookies().set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
