// File: app/lib/axiosClient.ts

import axios from 'axios';
import { store } from '@/app/redux/store';
import { loginSuccess, logout } from '@/app/redux/features/authSlice';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken, user } = res.data;
        
        // ✅ Update Redux store with new token
        store.dispatch(loginSuccess({ accessToken, user }));

        // ❌ No need to set header, backend uses cookie
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
