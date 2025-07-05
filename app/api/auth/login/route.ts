import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import User from '@/app/schema/userSchema';
import { createAccessToken, createRefreshToken } from '@/app/lib/jwt';
import { cookies } from 'next/headers';

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const { email, password }: LoginBody = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isEmailVerified) {
      return NextResponse.json({ message: 'Please verify your email first' }, { status: 403 });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

 const accessToken = createAccessToken({
  userId: user._id.toString(),
  role: user.role,
  email: user.email,
});

    const refreshToken = createRefreshToken({ userId: user._id.toString() });


    // Save tokens in DB for future (optional but safe)
    user.tokens = { accessToken, refreshToken };
    await user.save();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    cookies().set('accessToken', accessToken, { ...cookieOptions, maxAge: 60 * 15 });
    cookies().set('refreshToken', refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 7 });

    return NextResponse.json({
  message: 'Login successful',
  accessToken, 
  user: {
    _id: user._id.toString(), 
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
  },
});

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
