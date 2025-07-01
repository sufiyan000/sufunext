'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { loginSuccess } from '@/app/redux/features/authSlice';
import api from '@/app/lib/axiosClient';

export default function LoginPage() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false); // ✅ For resend button
  const [resendSuccess, setResendSuccess] = useState('');
  

  useEffect(() => {
    if (user && accessToken) {
      if (user.role === 'Admin') {
        router.push('/dashboard');
      } else if (user.role === 'User') {
        router.push('/');
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
    setShowResend(false);
    setResendSuccess('');

    try {
      const res = await api.post('/api/auth/login', form);
      const data = res.data;

      dispatch(loginSuccess({ accessToken: data.accessToken, user: data.user }));

      if (data.user.role === 'Admin') {
        router.push('/dashboard');
      } else if (data.user.role === 'User') {
        router.push('/');
      } else {
        router.push('/unauthorized');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';

      // ✅ Show resend option if not verified
      if (msg === 'Please verify your email first') {
        setShowResend(true);
        setError('⚠️ Please verify your email. Didn\'t receive the link?');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend verification email handler
  const handleResendVerification = async () => {
    setResendSuccess('');
    setError('');
    try {
      await api.post('/api/auth/resend-verification', { email: form.email });
      setResendSuccess('✅ Verification email sent successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
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

        {/* ✅ Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* ✅ Resend Verification Email */}
        {showResend && (
          <button
            type="button"
            onClick={handleResendVerification}
            className="text-sm text-blue-600 hover:underline"
          >
            Resend Verification Email
          </button>
        )}

        {/* ✅ Resend Success Message */}
        {resendSuccess && <p className="text-green-600 text-sm">{resendSuccess}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
