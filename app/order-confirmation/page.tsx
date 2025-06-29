// app/order-confirmation/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAccessToken } from '@/app/lib/jwt';

export default function OrderConfirmationPage() {
  const token = cookies().get('accessToken')?.value;
  const payload = token ? verifyAccessToken(token) : null;

  if (!payload) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
      <div className="bg-white p-8 rounded shadow max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Thank You!</h1>
        <p className="text-lg mb-4">Your order has been placed successfully.</p>
        <p className="text-gray-600 mb-6">We are processing your order and will update you once it's shipped.</p>
        <a href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Continue Shopping</a>
      </div>
    </div>
  );
}
