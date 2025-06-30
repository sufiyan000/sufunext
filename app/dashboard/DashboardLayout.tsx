'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { useRouter } from 'next/navigation';
import SideNav from '@/app/ui/dashboard/sidenav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!accessToken || !user) {
      router.push('/login');
    } else if (user.role !== 'Admin') {
      router.push('/login');
    }
  }, [user, accessToken]);

  if (!user || user.role !== 'Admin') {
    return <p className="text-center mt-20">Checking access...</p>;
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 overflow-auto">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
