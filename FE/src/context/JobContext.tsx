import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../lib/axios';
import { JOB_API, STORAGE_KEYS } from '../constants';
import { jobService } from '../services/jobService';
import type { Job, Applicant, UserRole, AuthUser, UserProfile } from '../types';

export type { Job, Applicant, UserRole, AuthUser, UserProfile };

interface SiteStats {
  total: number;
  perusahaan_count: number;
}

interface JobContextType {
  jobs: Job[];
  applicants: Applicant[];
  auth: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  siteStats: SiteStats;
  fetchJobs: (filters?: Record<string, any>) => Promise<void>;
  addJob: (job: Omit<Job, 'id'>) => Promise<void>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  addApplicant: (applicant: Omit<Applicant, 'id' | 'appliedAt'>) => void;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string, role: UserRole, companyName?: string) => Promise<AuthUser>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateApplicantStatus: (id: string, status: 'pending' | 'diterima' | 'ditolak') => void;
  deleteApplicant: (id: string) => void;
  updateApplicantJobId: (oldJobId: string, newJobId: string) => void;
}

const JobContext = createContext<JobContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

// ── Shared mapper: backend item → frontend Job ──
function mapJob(item: any): Job {
  return {
    id: String(item.id_lowongan),
    id_lowongan: item.id_lowongan,
    title: item.judul_pekerjaan || '',
    company: item.nama_perusahaan || '',
    companyLogo: (item.nama_perusahaan || '')[0] || '?',
    location: item.jarak || '',
    salary: item.gaji || '',
    type: item.tipe_pekerjaan || '',
    description: item.deskripsi || '',
    category: item.kategori || 'Umum',
    verified: false,
    featured: false,
    distance: item.id_jarak ?? 0,
    distance_label: item.jarak || '',
    education: item.pendidikan || '',
    education_label: item.pendidikan || '',
    requirements: [],
  };
}

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>(() => loadFromStorage('kerjago_applicants', []));
  const [auth, setAuth] = useState<AuthUser | null>(() => loadFromStorage('kerjago_auth', null));
  const [profile, setProfile] = useState<UserProfile | null>(() => loadFromStorage('kerjago_profile', null));
  const [loading, setLoading] = useState(false);
  const [siteStats, setSiteStats] = useState<SiteStats>({ total: 0, perusahaan_count: 0 });

  // ── Fetch lightweight stats on mount (not all jobs) ──
  useEffect(() => {
    jobService.getStats().then((res) => {
      if (res.data.success) setSiteStats(res.data.data);
    }).catch(() => {});
  }, []);

  // ── Fetch jobs (paginated) — called by pages that need it ──
  const fetchJobs = async (filters?: Record<string, any>) => {
    try {
      const params: Record<string, string> = {};
      if (filters) {
        Object.entries(filters).forEach(([k, v]) => {
          if (v != null && v !== '' && v !== 'Semua') params[k] = String(v);
        });
      }
      const res = await jobService.getAll(params);
      if (res.data.success && Array.isArray(res.data.data)) {
        setJobs(res.data.data.map(mapJob));
      } else {
        setJobs([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch jobs:', err.message);
      throw err;
    }
  };

  const addJob = async (job: Omit<Job, 'id'>) => {
    await api.post(JOB_API, job);
    await fetchJobs();
  };

  const updateJob = async (id: string, updated: Partial<Job>) => {
    await api.put(`${JOB_API}/${id}`, updated);
    await fetchJobs();
  };

  const deleteJob = async (id: string) => {
    await api.delete(`${JOB_API}/${id}`);
    await fetchJobs();
  };

  const addApplicant = (applicant: Omit<Applicant, 'id' | 'appliedAt'>) => {
    const newApplicant: Applicant = {
      ...applicant,
      id: Date.now().toString(),
      appliedAt: new Date().toISOString(),
      status: 'pending',
    };
    setApplicants((prev) => [newApplicant, ...prev]);
  };

  const login = async (email: string, password: string): Promise<AuthUser> => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const json = response.data;
      if (!json.success) throw new Error(json.message || 'Login gagal');

      const userData = json.data;
      const authUser: AuthUser = {
        id: userData.id_user,
        name: userData.nama,
        email: userData.email,
        role: (userData.role === 'perusahaan' || userData.role === 'rekruter') ? 'perusahaan' : 'pencari-kerja',
        companyName: userData.company_name || undefined,
      };
      setAuth(authUser);
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authUser));

      const userProfile: UserProfile = {
        role: (userData.role === 'perusahaan' || userData.role === 'rekruter') ? 'recruiter' : 'jobseeker',
        name: userData.nama, email: userData.email,
        phone: userData.phone || '', avatar: userData.avatar || '',
        pendidikan: userData.pendidikan || '', riwayatKerja: userData.riwayat_kerja || '',
        pengalamanTahun: userData.pengalaman_tahun || undefined, cvFile: userData.cv_file || '',
        keahlian: (() => { try { return JSON.parse(userData.keahlian || '[]'); } catch { return []; } })(),
        lokasi: userData.lokasi || '',
        companyName: userData.company_name || '', companyDesc: userData.company_desc || '',
        companyLocation: userData.company_location || '',
      };
      setProfile(userProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, _companyName?: string): Promise<AuthUser> => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        nama: name, email, password,
        role: role === 'perusahaan' ? 'perusahaan' : 'pelamar',
        company_name: role === 'perusahaan' ? _companyName : undefined,
      });
      const json = response.data;
      if (!json.success) throw new Error(json.message || 'Registrasi gagal');

      const userData = json.data;
      const authUser: AuthUser = {
        id: userData.id_user, name: userData.nama, email: userData.email,
        role: (userData.role === 'perusahaan' || userData.role === 'rekruter') ? 'perusahaan' : 'pencari-kerja',
        companyName: userData.company_name || undefined,
      };
      setAuth(authUser);
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authUser));

      const userProfile: UserProfile = {
        role: (userData.role === 'perusahaan' || userData.role === 'rekruter') ? 'recruiter' : 'jobseeker',
        name: userData.nama, email: userData.email,
        phone: userData.phone || '', avatar: userData.avatar || '',
        pendidikan: userData.pendidikan || '', riwayatKerja: userData.riwayat_kerja || '',
        pengalamanTahun: userData.pengalaman_tahun || undefined, cvFile: userData.cv_file || '',
        keahlian: (() => { try { return JSON.parse(userData.keahlian || '[]'); } catch { return []; } })(),
        lokasi: userData.lokasi || '',
        companyName: userData.company_name || '', companyDesc: userData.company_desc || '',
        companyLocation: userData.company_location || '',
      };
      setProfile(userProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
      return authUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  };

  const fetchProfile = async () => {
    if (!auth) return;
    try {
      const res = await api.get('/auth/profile', { headers: { 'x-user-id': auth.id } });
      const json = res.data;
      if (!json.success) return;
      const u = json.data;
      const userProfile: UserProfile = {
        role: u.role === 'perusahaan' ? 'recruiter' : 'jobseeker',
        name: u.nama, email: u.email, phone: u.phone || '', avatar: u.avatar || '',
        pendidikan: u.pendidikan || '', riwayatKerja: u.riwayat_kerja || '',
        pengalamanTahun: u.pengalaman_tahun || undefined, cvFile: u.cv_file || '',
        keahlian: (() => { try { return JSON.parse(u.keahlian || '[]'); } catch { return []; } })(),
        lokasi: u.lokasi || '',
        companyName: u.company_name || '', companyDesc: u.company_desc || '',
        companyLocation: u.company_location || '',
      };
      setProfile(userProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch (err) {
      console.error('Gagal fetch profile:', err);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!auth) return;
    try {
      const body: Record<string, any> = { id_user: auth.id };
      if (data.name !== undefined) body.nama = data.name;
      if (data.phone !== undefined) body.phone = data.phone;
      if (data.avatar !== undefined) body.avatar = data.avatar;
      if (data.pendidikan !== undefined) body.pendidikan = data.pendidikan;
      if (data.riwayatKerja !== undefined) body.riwayat_kerja = data.riwayatKerja;
      if (data.pengalamanTahun !== undefined) body.pengalaman_tahun = data.pengalamanTahun;
      if (data.cvFile !== undefined) body.cv_file = data.cvFile;
      if (data.keahlian !== undefined) body.keahlian = JSON.stringify(data.keahlian);
      if (data.lokasi !== undefined) body.lokasi = data.lokasi;
      if (data.companyName !== undefined) body.company_name = data.companyName;
      if (data.companyDesc !== undefined) body.company_desc = data.companyDesc;
      if (data.companyLocation !== undefined) body.company_location = data.companyLocation;

      await api.put('/auth/profile', body, { headers: { 'x-user-id': auth.id } });
      await fetchProfile();
    } catch (err) {
      console.error('Gagal update profile:', err);
      throw err;
    }
  };

  const updateApplicantStatus = (id: string, status: 'pending' | 'diterima' | 'ditolak') => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };
  const deleteApplicant = (id: string) => { setApplicants((prev) => prev.filter((a) => a.id !== id)); };
  const updateApplicantJobId = (oldJobId: string, newJobId: string) => {
    setApplicants((prev) => prev.map((a) => (a.jobId === oldJobId ? { ...a, jobId: newJobId } : a)));
  };

  return (
    <JobContext.Provider value={{
      jobs, applicants, auth, profile, loading, siteStats,
      fetchJobs, addJob, updateJob, deleteJob, addApplicant,
      login, register, logout, fetchProfile, updateProfile,
      updateApplicantStatus, deleteApplicant, updateApplicantJobId,
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error('useJobs must be used within JobProvider');
  return ctx;
}

export default JobContext;
