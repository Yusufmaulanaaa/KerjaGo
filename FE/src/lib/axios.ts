import axios from 'axios';
import { STORAGE_KEYS } from '../constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://kerjago.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token (user id) to every request if available
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.id) {
        config.headers['x-user-id'] = user.id;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan';
    return Promise.reject(new Error(message));
  }
);

export default api;
