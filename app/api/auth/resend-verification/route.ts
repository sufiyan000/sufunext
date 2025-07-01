import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/app/lib/mongodb';
import User from '@/app/schema/userSchema';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/app/lib/mailer';

export async function POST(req: NextRequest) {
  await connectMongo();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  if (user.isEmailVerified) {
    return NextResponse.json({ message: 'Email already verified' }, { status: 400 });
  }

  // ✅ Overwrite old token with new one
  const verifyToken = crypto.randomBytes(32).toString('hex');
  user.metadata = {
    verifyToken,
    verifyTokenExpiry: Date.now() + 1000 * 60 * 60 // 1 hour
  };

  await user.save();
  await sendVerificationEmail(user.email, verifyToken);

  return NextResponse.json({ message: 'Verification email resent' }, { status: 200 });
}
