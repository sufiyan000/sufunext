'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useRouter } from 'next/navigation';
import LogoutButton from '../ui/LogoutButton';

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { auth } = useSelector((state: RootState) => state);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setChecking(true);
    if (!auth.user && !auth.accessToken) {
      router.push('/login');
      return;
    }

    if (auth.user && auth.accessToken && auth.user.role !== 'User') {
      router.push('/login');
      return;
    }

    if (auth.user && auth.accessToken && auth.user.role === 'User') {
      setChecking(false);
    }
  }, [auth.user, auth.accessToken]);

  if (checking) {
    return <p className="text-center mt-20">Verifying access...</p>;
  }

  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-gray-100 p-4">
        <h2 className="font-bold text-lg mb-4">My Account</h2>
        <ul className="space-y-2">
          <li><a href="/accounts">Overview</a></li>
          <li><a href="/accounts/orders">Orders</a></li>
          <li><a href="/accounts/wishlist">Wishlist</a></li>
          <li><a href="/accounts/addresses">Addresses</a></li>
          <li><a href="/accounts/settings">Account Settings</a></li>
          <li><a href="/accounts/support">Support</a></li>
        </ul>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
