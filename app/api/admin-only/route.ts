import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/app/lib/jwt';

export async function GET() {
  const token = cookies().get('accessToken')?.value;
  if (!token) return NextResponse.json({ message: 'Not Authenticated' }, { status: 401 });

  const decoded = verifyAccessToken(token);
  if (!decoded || decoded.role !== 'Admin') {
    return NextResponse.json({ message: 'Access Denied' }, { status: 403 });
  }

  return NextResponse.json({ message: 'Welcome Admin!' });
}
