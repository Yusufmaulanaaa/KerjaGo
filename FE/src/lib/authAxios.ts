import axios from 'axios';
import { useAuth } from '../lib/useAuth';

const authAxios = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { authAxios };

export const useAuthAxios = () => {
  const { auth } = useAuth();
  
  // Intercept requests to set x-user-id header
  authAxios.interceptors.request.use(config => {
    if (auth?.id) {
      config.headers['x-user-id'] = auth.id;
    }
    return config;
  });
  
  return authAxios;
};