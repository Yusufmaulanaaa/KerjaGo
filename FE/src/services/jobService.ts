import api from '../lib/axios';
import { JOB_API } from '../constants';

export interface JobResponse {
  success: boolean;
  data: any[];
  total?: number;
  message?: string;
}

export const jobService = {
  getAll: async (params?: Record<string, string>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
    }
    const qs = query.toString();
    return api.get<JobResponse>(`${JOB_API}${qs ? `?${qs}` : ''}`);
  },

  getStats: async () => {
    return api.get<{ success: boolean; data: { total: number; perusahaan_count: number; per_tipe: Record<string, number>; per_kategori: Record<string, number> } }>(`${JOB_API}/stats`);
  },

  getFeatured: async (limit = 6) => {
    return api.get<{ success: boolean; data: any[] }>(`${JOB_API}/featured?limit=${limit}`);
  },

  getCategories: async () => {
    return api.get<{ success: boolean; data: { name: string; count: number }[] }>(`${JOB_API}/categories`);
  },

  create: async (data: any) => {
    return api.post(JOB_API, data);
  },

  update: async (id: string, data: any) => {
    return api.put(`${JOB_API}/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`${JOB_API}/${id}`);
  },
};
