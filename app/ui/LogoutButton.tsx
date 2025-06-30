// Frontend logout function example:

import api from '@/app/lib/axiosClient';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/redux/features/authSlice';

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await api.post('/api/auth/logout');
    dispatch(logout());
    window.location.href = '/login';
  };

  return <button onClick={handleLogout}>Logout</button>;
}
