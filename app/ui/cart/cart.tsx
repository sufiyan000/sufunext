"use client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { incrementQuantity, decrementQuantity, removeFromCart, clearCart } from '@/app/redux/features/cartSlice';
import Link from 'next/link';

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex flex-col sm:flex-row items-center bg-white shadow rounded-lg p-4 gap-4">
                <img src={item.thumbnailUrl} alt={item.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                  <p className="text-gray-600 mb-2">Price: ₹{item.price}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => dispatch(decrementQuantity(item.productId))} className="px-3 py-1 bg-gray-200 rounded">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => dispatch(incrementQuantity(item.productId))} className="px-3 py-1 bg-gray-200 rounded">+</button>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item.productId))} className="text-red-500">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t pt-4">
            <p className="text-xl font-bold mb-4">Subtotal: ₹{subtotal}</p>
            <Link href={"/checkout"} className="px-6 py-2 bg-[#07f0f0] text-black rounded hover:bg-[#05d6d6]">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}
