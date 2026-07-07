import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../lib/axios';
import { JOB_API, STORAGE_KEYS } from '../constants';
import type { Job, Applicant, UserRole, AuthUser, UserProfile } from '../types';

// Re-export types for backward compatibility
export type { Job, Applicant, UserRole, AuthUser, UserProfile };

interface JobContextType {
  jobs: Job[];
  applicants: Applicant[];
  auth: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
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

const defaultApplicants: Applicant[] = [];

// ── Storage helpers (for auth & profile only) ──
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>(() => loadFromStorage('kerjago_applicants', defaultApplicants));
  const [auth, setAuth] = useState<AuthUser | null>(() => loadFromStorage('kerjago_auth', null));
  const [profile, setProfile] = useState<UserProfile | null>(() => loadFromStorage('kerjago_profile', null));
  const [loading, setLoading] = useState(false);

  // ── Fetch jobs from API via axios ──
  const fetchJobs = async (filters?: {
    search?: string;
    education?: string;
    maxDistance?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.education && filters.education !== 'Semua') params.set('education', filters.education);
      if (filters?.maxDistance && filters.maxDistance !== 'Semua') params.set('maxDistance', filters.maxDistance);

      const res = await api.get(`${JOB_API}${params.toString() ? `?${params.toString()}` : ''}`);
      console.log("Data dari backend:", res.data);

      // Backend mengembalikan { success: true, data: [...] }
      if (res.data && Array.isArray(res.data.data)) {
        // Mapping dari backend → frontend interface
        const mapped = res.data.data.map((item: any) => ({
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
        }));
        setJobs(mapped);
      } else {
        console.error('Unexpected API response structure:', res.data);
        setJobs([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch jobs:', err.message);
      throw err; // Rethrow agar bisa di-catch oleh pemanggil (FindJobsPage)
    }
  };

  // ── Fetch on mount ──
  useEffect(() => {
    fetchJobs();
  }, []);

  // ── Add job via API via axios ──
  const addJob = async (job: Omit<Job, 'id'>) => {
    try {
      await api.post(JOB_API, job);
      // Refetch to stay in sync with server
      await fetchJobs();
    } catch (err) {
      console.error('Failed to add job:', err);
    }
  };

  const updateJob = async (id: string, updated: Partial<Job>) => {
    try {
      await api.put(`${JOB_API}/${id}`, updated);
      await fetchJobs();
    } catch (err) {
      console.error('Failed to update job:', err);
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await api.delete(`${JOB_API}/${id}`);
      await fetchJobs();
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
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

  // ── Login via Backend API via axios ──
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

      // Simpan profile juga
      const userProfile: UserProfile = {
        role: (userData.role === 'perusahaan' || userData.role === 'rekruter') ? 'recruiter' : 'jobseeker',
        name: userData.nama,
        email: userData.email,
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        pendidikan: userData.pendidikan || '',
        riwayatKerja: userData.riwayat_kerja || '',
        pengalamanTahun: userData.pengalaman_tahun || undefined,
        cvFile: userData.cv_file || '',
        companyName: userData.company_name || '',
        companyDesc: userData.company_desc || '',
        companyLocation: userData.company_location || '',
      };
      setProfile(userProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));

      return authUser;
    } finally {
      setLoading(false);
    }
  };

  // ── Register via Backend API via axios ──
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    _companyName?: string
  ): Promise<AuthUser> => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        nama: name,
        email,
        password,
        role: role === 'perusahaan' ? 'perusahaan' : 'pelamar',
        company_name: role === 'perusahaan' ? _companyName : undefined,
      });
      const json = response.data;
      if (!json.success) throw new Error(json.message || 'Registrasi gagal');

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
        name: userData.nama,
        email: userData.email,
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        pendidikan: userData.pendidikan || '',
        riwayatKerja: userData.riwayat_kerja || '',
        pengalamanTahun: userData.pengalaman_tahun || undefined,
        cvFile: userData.cv_file || '',
        companyName: userData.company_name || '',
        companyDesc: userData.company_desc || '',
        companyLocation: userData.company_location || '',
      };
      setProfile(userProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));

      return authUser;
    } finally {
      setLoading(false);
    }
  };

  // ── Logout ──
  const logout = () => {
    setAuth(null);
    setProfile(null);
    localStorage.removeItem('kerjago_auth');
    localStorage.removeItem('kerjago_profile');
  };

  // ── Fetch Profile dari Backend ──
  const fetchProfile = async () => {
    if (!auth) return;
    try {
      const res = await api.get('/auth/profile', {
        headers: { 'x-user-id': auth.id },
      });
      const json = res.data;
      if (!json.success) return;

      const userData = json.data;
      const userProfile: UserProfile = {
        role: userData.role === 'perusahaan' ? 'recruiter' : 'jobseeker',
        name: userData.nama,
        email: userData.email,
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        pendidikan: userData.pendidikan || '',
        riwayatKerja: userData.riwayat_kerja || '',
        pengalamanTahun: userData.pengalaman_tahun || undefined,
        cvFile: userData.cv_file || '',
        companyName: userData.company_name || '',
        companyDesc: userData.company_desc || '',
        companyLocation: userData.company_location || '',
      };
      setProfile(userProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
    } catch (err) {
      console.error('Gagal fetch profile:', err);
    }
  };

  // ── Update Profile via Backend API via axios ──
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!auth) return;
    try {
      const body: Record<string, any> = {};
      // Sertakan id_user agar backend bisa identifikasi user tanpa UUID header
      body.id_user = auth.id;
      if (data.name !== undefined) body.nama = data.name;
      if (data.phone !== undefined) body.phone = data.phone;
      if (data.avatar !== undefined) body.avatar = data.avatar;
      if (data.pendidikan !== undefined) body.pendidikan = data.pendidikan;
      if (data.riwayatKerja !== undefined) body.riwayat_kerja = data.riwayatKerja;
      if (data.pengalamanTahun !== undefined) body.pengalaman_tahun = data.pengalamanTahun;
      if (data.cvFile !== undefined) body.cv_file = data.cvFile;
      if (data.companyName !== undefined) body.company_name = data.companyName;
      if (data.companyDesc !== undefined) body.company_desc = data.companyDesc;
      if (data.companyLocation !== undefined) body.company_location = data.companyLocation;

      const response = await api.put('/auth/profile', body, {
        headers: { 'x-user-id': auth.id },
      });
      const json = response.data;
      if (!json.success) throw new Error(json.message || 'Gagal update profile');

      // Refresh profile
      await fetchProfile();
    } catch (err) {
      console.error('Gagal update profile:', err);
      throw err;
    }
  };

  const updateApplicantStatus = (id: string, status: 'pending' | 'diterima' | 'ditolak') => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const deleteApplicant = (id: string) => {
    setApplicants((prev) => prev.filter((a) => a.id !== id));
  };

  const updateApplicantJobId = (oldJobId: string, newJobId: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.jobId === oldJobId ? { ...a, jobId: newJobId } : a))
    );
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        applicants,
        auth,
        profile,
        loading,
        fetchJobs,
        addJob,
        updateJob,
        deleteJob,
        addApplicant,
        updateApplicantStatus,
        deleteApplicant,
        login,
        register,
        logout,
        fetchProfile,
        updateProfile,
        updateApplicantJobId,
      }}
    >
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
