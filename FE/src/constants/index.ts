export const API_BASE_URL = 'http://localhost:3000/api';

export const JOB_API = `${API_BASE_URL}/lowongan`;
export const AUTH_API = `${API_BASE_URL}/auth`;
export const SPK_API = `${API_BASE_URL}/spk`;
export const PREFERENSI_API = `${API_BASE_URL}/preferensi`;
export const CAREER_NOTES_API = `${API_BASE_URL}/career-notes`;

// Storage keys
export const STORAGE_KEYS = {
  AUTH: 'kerjago_auth',
  PROFILE: 'kerjago_profile',
  APPLICANTS: 'kerjago_applicants',
  ALERTS: 'kerjago_alerts',
} as const;

// Filter option constants
export const JOB_TYPES = ['Semua', 'Full-time', 'Part-time', 'Contract', 'Internship'] as const;

export const CATEGORIES = [
  'Semua',
  'UX/UI Design',
  'Digital Marketing',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'AI / Machine Learning',
  'DevOps',
  'Quality Assurance',
  'Product Management',
] as const;

export const PENGALAMAN_OPTIONS = [
  'Semua',
  'Fresh Graduate',
  '1-2 Tahun',
  '2-3 Tahun',
  '3-5 Tahun',
  'Expert',
] as const;

export const SALARY_RANGES = [
  'Semua',
  'Rp 0 – Rp 5 Jt',
  'Rp 5 Jt – Rp 10 Jt',
  'Rp 10 Jt – Rp 20 Jt',
  'Rp 20 Jt – Rp 40 Jt',
  'Rp 40 Jt+',
] as const;

export const DISTANCE_OPTIONS = ['Semua', '< 5 km', '< 15 km', '< 30 km', '< 50 km'] as const;

export const EDUCATION_OPTIONS = [
  'Semua',
  'SMA/SMK Sederajat',
  'Diploma (D3/D4)',
  'Sarjana (S1)',
  'Pascasarjana (S2/S3)',
] as const;

// Maps: label → backend filter id
export const TYPE_MAP: Record<string, string | undefined> = {
  Semua: undefined,
  'Full-time': '4',
  'Part-time': '2',
  Contract: '3',
  Internship: '1',
};

export const PENGALAMAN_MAP: Record<string, string | undefined> = {
  Semua: undefined,
  'Fresh Graduate': '18',
  '1-2 Tahun': '19',
  '2-3 Tahun': '20',
  '3-5 Tahun': '21',
  Expert: '21',
};

export const SALARY_MAP: Record<string, string | undefined> = {
  Semua: undefined,
  'Rp 0 – Rp 5 Jt': '5',
  'Rp 5 Jt – Rp 10 Jt': '6',
  'Rp 10 Jt – Rp 20 Jt': '7',
  'Rp 20 Jt – Rp 40 Jt': '8',
  'Rp 40 Jt+': '9',
};

export const DISTANCE_MAP: Record<string, string | undefined> = {
  Semua: undefined,
  '< 5 km': '10',
  '< 15 km': '11',
  '< 30 km': '12',
  '< 50 km': '13',
};

export const EDUCATION_MAP: Record<string, string | undefined> = {
  Semua: undefined,
  'SMA/SMK Sederajat': '14',
  'Diploma (D3/D4)': '15',
  'Sarjana (S1)': '16',
  'Pascasarjana (S2/S3)': '17',
};

export const CAREER_NOTE_CATEGORIES: Record<string, string> = {
  'Tips CV': 'bg-blue-100 text-blue-700',
  Interview: 'bg-purple-100 text-purple-700',
  'Tren Industri': 'bg-orange-100 text-orange-700',
  Karir: 'bg-green-100 text-green-700',
  Skill: 'bg-pink-100 text-pink-700',
};

export const CAREER_NOTE_CATEGORY_OPTIONS = [
  'Semua',
  'UX/UI Design',
  'Digital Marketing',
  'Web Development',
  'Data Science',
] as const;
