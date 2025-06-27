'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
}

export default function AccountsOverview() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user/me', { withCredentials: true });
        setUser(res.data.user);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.firstName}!</h1>
      <p className="mb-2"><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
      <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
      <p className="mb-2"><strong>Phone:</strong> {user?.phoneNumber || 'N/A'}</p>
      <p className="mb-2"><strong>Role:</strong> {user?.role}</p>
    </div>
  );
}
