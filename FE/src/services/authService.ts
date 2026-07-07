import api from '../lib/axios';

export const authService = {
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },

  register: async (name: string, email: string, password: string, role: string) => {
    return api.post('/auth/register', { nama: name, email, password, role });
  },

  getProfile: async () => {
    return api.get('/auth/profile');
  },

  updateProfile: async (data: any) => {
    return api.put('/auth/profile', data);
  },
};
