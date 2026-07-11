# Kerjago — SPK Job Portal

Portal pencarian kerja berbasis **Sistem Pendukung Keputusan (SPK)** dengan 3 metode perbandingan: **SAW**, **WP**, dan **TOPSIS**. Dikembangkan untuk tugas besar UAS mata kuliah Pemrograman Web 2.

---

## Fitur Utama

### Pelamar (Pencari Kerja)
- Cari lowongan dengan filter 5 kriteria SPK (Tipe, Gaji, Jarak, Pendidikan, Pengalaman)
- SPK Rekomendasi otomatis menggunakan 3 metode sekaligus
- Atur bobot kriteria sesuai preferensi pribadi
- Lihat detail skor dan ranking per metode
- Career Notes (artikel tips karir)
- Profil pelamar (pendidikan, pengalaman, CV, keahlian, lokasi)

### Perusahaan (Admin)
- Dashboard kelola lowongan pekerjaan
- Tambah/edit/hapus lowongan dengan kriteria SPK
- Kelola Career Notes (artikel)
- Lihat data pelamar

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│  React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4     │
│                                                         │
│  Pages: Landing, FindJobs, SPKRekomendasi, Dashboard,   │
│         CareerNotes, Profile, Login, Register           │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (axios + x-user-id)
┌──────────────────────▼──────────────────────────────────┐
│                      BACKEND                            │
│  Express 5 + TypeScript 6 + Supabase (PostgreSQL)       │
│                                                         │
│  Routes: /auth, /lowongan, /spk, /preferensi,           │
│          /career-notes                                  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    DATABASE                             │
│  Supabase (PostgreSQL)                                  │
│                                                         │
│  Tables: users, profile, perusahaan, lowongan,          │
│          kriteria, sub_kriteria, preferensi,            │
│          detail_preferensi, hasil_saw, hasil_wp,        │
│          hasil_topsis, career_notes                     │
└─────────────────────────────────────────────────────────┘
```

---

## Teknologi

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Axios, React Router 7 |
| Backend | Express 5, TypeScript 6, Supabase JS Client, pg (node-postgres) |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma (schema only, query via Supabase client) |

---

## Struktur Folder

### Frontend (`FE/`)
```
src/
├── App.tsx                    # Router utama
├── main.tsx                   # Entry point
├── index.css                  # Global styles + Tailwind
├── components/
│   ├── common/                # JobCard, Newsletter
│   ├── dashboard/             # SPKDashboard
│   ├── home/                  # HeroSection, TrendingJobs, FeaturedJobs, dll
│   └── layout/                # Navbar, Footer
├── constants/
│   └── index.ts               # API URLs, filter maps, storage keys
├── context/
│   └── JobContext.tsx          # Global state (auth, profile, jobs)
├── hooks/
│   └── useRevealOnScroll.ts   # Custom hook animasi scroll
├── lib/
│   └── axios.ts               # Axios instance + x-user-id interceptor
├── pages/                     # 11 halaman (Landing, Login, Dashboard, dll)
├── services/
│   ├── jobService.ts          # CRUD lowongan
│   ├── careerNotesService.ts  # Career notes API
│   └── rekomendasiService.ts  # SPK rekomendasi + preferensi
└── types/
    └── index.ts               # TypeScript interfaces
```

### Backend (`BE/`)
```
src/
├── app.ts                     # Express app setup + route mounts
├── server.ts                  # Server entry + seeder execution
├── controllers/               # Handler functions (auth, lowongan, spk, career-notes, preferensi)
├── routes/                    # Route definitions
├── services/
│   ├── auth.service.ts        # Login & register
│   ├── auth-profile.service.ts # Profile CRUD
│   ├── career-notes.service.ts # Career notes CRUD
│   ├── preferensi.service.ts  # Simpan bobot kriteria
│   ├── lowongan/              # Job CRUD (create, read, update, delete, utils)
│   └── spk/                   # SPK Engine
│       ├── saw.ts             # Simple Additive Weighting
│       ├── wp.ts              # Weighted Product
│       ├── topsis.ts          # TOPSIS
│       ├── index.ts           # Orchestrator (jalankan 3 metode paralel)
│       ├── repository.ts      # Data fetching dari Supabase
│       └── persistence.ts     # Simpan hasil ke database
├── types/                     # TypeScript interfaces
├── lib/
│   └── supabase.ts            # Supabase client + PostgreSQL pool
├── middleware/
│   └── auth.ts                # x-user-id authentication
└── utils/
    ├── errors.ts              # Custom error classes
    ├── seeder.ts              # Barrel export seeders
    └── parts/                 # Seeder modules (master, database, career_notes_data, helpers, config)
```

---

## Database Schema (ERD)

```
users ──┬── profile
        └── preferensi ──┬── detail_preferensi ── kriteria ── sub_kriteria
                         ├── hasil_saw ──┐
                         ├── hasil_wp ───┼── lowongan ── perusahaan
                         └── hasil_topsis┘

career_notes (independen)
```

### Kriteria SPK

| ID | Kriteria | Atribut | Sub Kriteria |
|----|----------|---------|--------------|
| 1 | Tipe Pekerjaan | benefit | Internship (1), Part-time (2), Contract (3), Full-time (4) |
| 2 | Gaji | benefit | Rp 0-5 Jt (1), Rp 5-10 Jt (2), Rp 10-20 Jt (3), Rp 20-40 Jt (4), Rp 40 Jt+ (5) |
| 3 | Jarak | cost | < 5 km (1), < 15 km (2), < 30 km (3), < 50 km (4) |
| 4 | Pendidikan | benefit | SMA/SMK (1), Diploma (2), S1 (3), S2/S3 (4) |
| 5 | Pengalaman | benefit | Fresh Graduate (1), 1-2 Thn (2), 2-3 Thn (3), 3-5 Thn (4) |

---

## Metode SPK

### 1. SAW (Simple Additive Weighting)
- Normalisasi: Benefit → `X/max`, Cost → `min/X`
- Skor: `V = Σ (bobot × nilai ternormalisasi)`
- Ranking: skor tertinggi = peringkat 1

### 2. WP (Weighted Product)
- Normalisasi bobot: `w = bobot / Σbobot`
- Vektor S: `S = ∏ X^{±w}` (benefit: +w, cost: -w)
- Vektor V: `V = S / ΣS`
- Ranking: V tertinggi = peringkat 1

### 3. TOPSIS
- Normalisasi: `r = X / √(ΣX²)`
- Matriks terbobot: `Y = w × r`
- Solusi ideal: A+ (max benefit, min cost), A- (min benefit, max cost)
- Jarak: D+ ke A+, D- ke A-
- Preferensi: `V = D- / (D+ + D-)`
- Ranking: V tertinggi = peringkat 1

---

## Cara Menjalankan

### Prerequisites
- Node.js ≥ 18
- Supabase project (PostgreSQL)

### 1. Setup Backend

```bash
cd BE
npm install
```

Buat file `.env`:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxxx
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-1-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
PORT=3000
```

Jalankan:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000` dan otomatis:
- Seed demo users (pelamar@gmail.com / rekruter@gmail.com, password: 123)
- Seed kriteria & sub_kriteria SPK
- Seed 10 perusahaan BUMN
- Seed 60 lowongan dummy
- Seed 15 career notes

### 2. Setup Frontend

```bash
cd FE
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173`

### 3. Login Demo

| Role | Email | Password |
|------|-------|----------|
| Pelamar | pelamar@gmail.com | 123 |
| Perusahaan | rekruter@gmail.com | 123 |

---

## API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/login` | - | Login |
| POST | `/api/auth/register` | - | Register |
| GET | `/api/auth/profile` | x-user-id | Ambil profile |
| PUT | `/api/auth/profile` | x-user-id | Update profile |
| GET | `/api/lowongan` | - | List lowongan (dengan filter) |
| POST | `/api/lowongan` | - | Buat lowongan |
| PUT | `/api/lowongan/:id` | - | Update lowongan |
| DELETE | `/api/lowongan/:id` | - | Hapus lowongan |
| GET | `/api/lowongan/stats` | - | Statistik lowongan |
| GET | `/api/lowongan/featured` | - | Lowongan random untuk landing |
| GET | `/api/lowongan/categories` | - | Daftar kategori |
| GET | `/api/spk/rekomendasi` | x-user-id | Hitung SPK (3 metode) |
| POST | `/api/preferensi` | x-user-id | Simpan bobot kriteria |
| GET | `/api/career-notes` | - | List career notes |
| GET | `/api/career-notes/:slug` | - | Detail career note |
| POST | `/api/career-notes` | - | Buat career note |
| PUT | `/api/career-notes/:id` | - | Update career note |
| DELETE | `/api/career-notes/:id` | - | Hapus career note |

---

## License

Tugas Akhir Semester — Pemrograman Web 2
