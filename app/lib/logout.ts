import axios from './axios';

export const logoutUser = async () => {
  await axios.post('/api/auth/logout');
};
