import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import User from '@/app/schema/userSchema';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/app/lib/mailer';

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo();
    const body: SignupPayload = await req.json();

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    const verifyToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      phoneNumber: body.phoneNumber,
      isEmailVerified: false,
      tokens: {},
      metadata: {
        verifyToken,
        verifyTokenExpiry: Date.now() + 1000 * 60 * 60, // 1 hour
      },
    });

    await newUser.save();
    await sendVerificationEmail(body.email, verifyToken);

    return NextResponse.json(
      { message: 'Signup successful. Check email to verify your account.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
