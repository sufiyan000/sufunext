import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectMongo from '@/app/lib/mongodb';
import User from '@/app/schema/userSchema';
import { createAccessToken, createRefreshToken } from '@/app/lib/jwt';
import { cookies } from 'next/headers';

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    // Get refresh token from cookies
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    // Verify refresh token
    const decoded: any = jwt.verify(refreshToken, REFRESH_SECRET);

    // Find user with that token
    const user = await User.findById(decoded.userId);
    if (!user || user.tokens.refreshToken !== refreshToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 403 });
    }

    // Generate new tokens
    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    // Update tokens in DB
    user.tokens = {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
    await user.save();

    // Set new refresh token in cookie
    cookies().set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    // Return new access token
    return NextResponse.json({
      message: 'Token refreshed',
      accessToken: newAccessToken,
    });
  } catch (err: any) {
    console.error('Refresh token error:', err);
    return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 403 });
  }
}
