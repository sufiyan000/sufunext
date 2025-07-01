'use client';
import { useEffect, useState } from 'react';
import api from '@/app/lib/axiosClient';

export default function Overview() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/user/me')
      .then(res => setUser(res.data.user))
      .catch(err => setError(err?.response?.data?.error || 'Error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.firstName}</h1>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Phone:</strong> {user?.phoneNumber || 'N/A'}</p>
      <p><strong>Role:</strong> {user?.role}</p>
    </div>
  );
}
