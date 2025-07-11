// lib/requireAuth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/app/lib/jwt';

interface AuthPayload {
  userId: string;
  role: 'User' | 'Admin'; // Update if you have more roles
  email: string;
}

interface AuthResult {
  error: boolean;
  payload?: AuthPayload;
  response?: NextResponse;
}

export async function requireAuth(req: NextRequest): Promise<AuthResult> {
  try {
    const token = req.cookies.get('accessToken')?.value;

    if (!token) {
      return {
        error: true,
        response: NextResponse.json({ message: 'Unauthorized: No access token' }, { status: 401 }),
      };
    }

    const payload = verifyAccessToken(token) as AuthPayload;

    if (!payload || !payload.userId) {
      return {
        error: true,
        response: NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 }),
      };
    }

    return { error: false, payload };
  } catch (err) {
    console.error('Auth error:', err);
    return {
      error: true,
      response: NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 }),
    };
  }
}
