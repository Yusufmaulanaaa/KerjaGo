import api from '../lib/axios';
import { JOB_API } from '../constants';

export interface JobResponse {
  success: boolean;
  data: any[];
  message?: string;
}

export const jobService = {
  getAll: async (params?: { search?: string; id_pendidikan?: string; id_jarak?: string; id_tipe?: string; id_gaji?: string; id_pengalaman?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.id_pendidikan) query.set('id_pendidikan', params.id_pendidikan);
    if (params?.id_jarak) query.set('id_jarak', params.id_jarak);
    if (params?.id_tipe) query.set('id_tipe', params.id_tipe);
    if (params?.id_gaji) query.set('id_gaji', params.id_gaji);
    if (params?.id_pengalaman) query.set('id_pengalaman', params.id_pengalaman);
    const qs = query.toString();
    return api.get<JobResponse>(`${JOB_API}${qs ? `?${qs}` : ''}`);
  },

  getById: async (id: string) => {
    return api.get(`${JOB_API}/${id}`);
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
