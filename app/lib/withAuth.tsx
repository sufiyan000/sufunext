'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/app/redux/store';

interface Options {
  role?: 'Admin' | 'User' | 'Vendor';
}

// ✅ Fix: Add constraint to T
export function withAuth<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>,
  options?: Options
) {
  return function AuthWrapper(props: T) {
    const router = useRouter();
    const { user, accessToken } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (!user || !accessToken) {
        router.push('/login');
      } else if (options?.role && user.role !== options.role) {
        router.push('/unauthorized');
      }
    }, [user, accessToken]);

    if (!user || !accessToken || (options?.role && user.role !== options.role)) {
      return <p className="text-center mt-20">Checking access...</p>;
    }

    return <Component {...props} />;
  };
}
