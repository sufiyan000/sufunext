import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '', // default to same origin
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies (for refreshToken)
});

export default axiosInstance;
