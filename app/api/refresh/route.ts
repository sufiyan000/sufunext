import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, createAccessToken } from '@/app/lib/jwt';

export async function POST(req: NextRequest) {
  const token = cookies().get('refreshToken')?.value;

  if (!token) return NextResponse.json({ message: 'No refresh token' }, { status: 401 });

  const decoded = verifyRefreshToken(token);
  if (!decoded) return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });

  const newAccessToken = createAccessToken(decoded);

  cookies().set('accessToken', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15,
    path: '/',
  });

  return NextResponse.json({ message: 'Token refreshed' });
}
