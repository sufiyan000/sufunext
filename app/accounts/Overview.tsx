'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

export default function Overview() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow p-6 rounded">
      <h1 className="text-xl font-bold mb-2">Welcome, {user.firstName}!</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}
