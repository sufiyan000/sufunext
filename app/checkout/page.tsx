// app/checkout/page.tsx
import CheckoutForm from "./CheckoutForm";
import { protectServerRoute } from '@/app/lib/protectServerRoute';

export default async function CheckoutPage() {
  // ✅ Auth check on server
  const { token, payload } = protectServerRoute(); // optional: you can use payload.userId if needed

  // ✅ Fetch cart using token
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart`, {
    cache: 'no-store',
    headers: {
      Cookie: `accessToken=${token}`,
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
