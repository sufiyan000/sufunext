'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { loginSuccess } from '@/app/redux/features/authSlice';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (user && accessToken) {
      if (user.role === 'Admin') {
        router.push('/dashboard');
      } else if (user.role === 'User') {
        router.push('/accounts');
      }
    }
  }, [user, accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/login', form);
      const data = res.data;

      dispatch(
        loginSuccess({
          accessToken: data.accessToken,
          user: data.user,
        })
      );

      // ✅ Redirect based on role
      if (data.user.role === 'Admin') {
        router.push('/dashboard');
      } else if (data.user.role === 'User') {
        router.push('/accounts');
      } else {
        router.push('/unauthorized');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
