export interface Job {
  id: string;
  id_lowongan: number;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  category: string;
  verified: boolean;
  featured: boolean;
  distance: number;
  distance_label: string;
  education: string;
  education_label: string;
  requirements: string[];
}

export interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  candidateType: string;
  proposal: string;
  appliedAt: string;
  cvFile?: string;
  avatar?: string;
  status?: 'pending' | 'diterima' | 'ditolak';
}

export type UserRole = 'pencari-kerja' | 'perusahaan';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
}

export interface UserProfile {
  role: 'jobseeker' | 'recruiter';
  name: string;
  email: string;
  phone: string;
  avatar: string;
  // Khusus Jobseeker
  pendidikan?: string;
  riwayatKerja?: string;
  pengalamanTahun?: number;
  cvFile?: string;
  // Khusus Recruiter
  companyName?: string;
  companyDesc?: string;
  companyLocation?: string;
}

export interface JobFilters {
  search?: string;
  id_tipe?: string;
  kategori?: string;
  id_gaji?: string;
  id_jarak?: string;
  id_pendidikan?: string;
  id_pengalaman?: string;
}
