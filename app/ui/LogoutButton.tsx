'use client';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { logout } from '@/app/redux/features/authSlice';
import { logoutUser } from '@/app/lib/logout';
import { useState } from 'react';
import { persistor } from '@/app/redux/store'; // ✅ import persistor

export default function LogoutButton() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);

 const handleLogout = async () => {
  setLoading(true);
  try {
    await logoutUser(); // call your API
    dispatch(logout());
    await persistor.purge(); // ✅ clear localStorage
    router.push('/login');
  } catch (err) {
    console.error('Logout failed', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      disabled={loading}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
