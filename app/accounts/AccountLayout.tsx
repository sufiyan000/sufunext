'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useRouter } from 'next/navigation';
import LogoutButton from '../ui/LogoutButton';
import Orders from "./Orders"
import Overview from './Overview';
// Add more components like WishlistPage, SettingsPage, etc.

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { auth } = useSelector((state: RootState) => state);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders'>('overview'); // ✅

  useEffect(() => {
    if (!auth.user || !auth.accessToken || auth.user.role !== 'User') {
      router.push('/login');
    } else {
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
          <li>
            <button onClick={() => setActiveTab('overview')} className="text-left w-full hover:underline">
              Overview
            </button>
          </li>
          <li>
            <button onClick={() => setActiveTab('orders')} className="text-left w-full hover:underline">
              Orders
            </button>
          </li>
        </ul>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'orders' && <Orders />}
        {/* Add more: WishlistPage, AddressPage, etc. */}
      </main>
    </div>
  );
}
