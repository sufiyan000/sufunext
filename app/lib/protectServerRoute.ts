// lib/protectServerRoute.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAccessToken } from './jwt';

export function protectServerRoute() {
  const token = cookies().get('accessToken')?.value;

  if (!token) redirect('/login');

  const payload = verifyAccessToken(token);
  if (!payload) redirect('/login');

  return { token, payload }; // payload = { userId, email, role, ... }
}
