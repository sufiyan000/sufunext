'use client';
import { useState } from 'react';
import api from '@/app/lib/axios';
import { useRouter } from 'next/navigation';

interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const signup = async (payload: SignupPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/signup', payload);
      if (response.status === 201) {
        setSuccess('Signup successful. Please check your email to verify.');
        // Optional: router.push('/login');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Signup failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error, success };
}
