import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import User from '@/app/schema/userSchema';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Already logged out' }, { status: 200 });
    }

    // Verify and decode refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
      cookies().set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
      return NextResponse.json({ message: 'Invalid refresh token cleared' }, { status: 200 });
    }

    // Find user and clear tokens
    const user = await User.findById(decoded.userId);
    if (user) {
      user.tokens = { accessToken: '', refreshToken: '' };
      await user.save();
    }

    // Clear refresh token cookie
    cookies().set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (err: any) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
