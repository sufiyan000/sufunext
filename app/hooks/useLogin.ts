'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';

interface LoginPayload {
  email: string;
  password: string;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async ({ email, password }: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/login', { email, password });

      if (res.status === 200) {
        const role = res.data.user.role;
        window.location.href = role === 'Admin' ? '/dashboard' : '/accounts';
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
