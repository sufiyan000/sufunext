import CheckoutForm from "./CheckoutForm";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CheckoutPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');

  if (!token) {
    redirect('/login');
  }

  const res = await fetch('http://localhost:3000/api/cart', {
    cache: 'no-store',
    headers: {
      Cookie: `accessToken=${token.value}`,
    },
  });

  const cartData = await res.json();

  const items = cartData?.cart || [];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <CheckoutForm cart={{ items }} />
    </div>
  );
}
