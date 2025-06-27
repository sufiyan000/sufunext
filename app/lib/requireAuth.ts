// lib/requireAuth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/app/lib/jwt';

export async function requireAuth(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  if (!token) {
    return { error: true, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return { error: true, response: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }) };
  }

  return { error: false, payload };
}
