'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Overview from './Overview';
import AddressManager from './Addresses';
import Orders from './Orders';
import LogoutButton from '../ui/LogoutButton';

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { auth } = useSelector((state: RootState) => state);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses'>('overview');

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
      {/* Sidebar */}
      <aside
        className={`bg-gray-100 p-4 w-60 fixed md:relative h-full transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">My Account</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => {
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
              className="text-left w-full hover:underline"
            >
              Overview
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setActiveTab('orders');
                setSidebarOpen(false);
              }}
              className="text-left w-full hover:underline"
            >
              Orders
            </button>
          </li>
          <li>
  <button onClick={() => setActiveTab('addresses')} className="text-left w-full hover:underline">
    Addresses
  </button>
</li>
        </ul>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-0 md:ml-60 overflow-y-auto w-full">
        <button className="md:hidden mb-4" onClick={() => setSidebarOpen(true)}>
          <Bars3Icon className="w-6 h-6" />
        </button>
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'addresses' && <AddressManager />}
      </main>
    </div>
  );
}
