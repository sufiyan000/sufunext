import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface AccessTokenPayload {
  userId: string;
  role: 'User' | 'Admin' | 'Vendor';
  email: string;
}

interface RefreshTokenPayload {
  userId: string;
}

export const createAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const createRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
  } catch (err) {
    return null;
  }
}

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
  } catch (err) {
    return null;
  }
};
