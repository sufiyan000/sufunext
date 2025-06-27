'use client';
import api from '@/app/lib/axios';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await api.post('/logout');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return { logout };
}
