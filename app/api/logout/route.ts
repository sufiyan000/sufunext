import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  cookies().set('accessToken', '', {
    maxAge: 0,
    path: '/',
  });

  cookies().set('refreshToken', '', {
    maxAge: 0,
    path: '/',
  });

  return NextResponse.json({ message: 'Logged out' });
}
