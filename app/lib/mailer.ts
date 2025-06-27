import nodemailer, { Transporter } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  // ✅ Correct:
const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"FaydaZone" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify Your Email',
    html: `
      <h2>Welcome to FaydaZone 🎉</h2>
      <p>Click below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  });
};
