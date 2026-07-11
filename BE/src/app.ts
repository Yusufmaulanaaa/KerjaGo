// ============================================================================
// APP — Entry Point Aplikasi Express (TypeScript)
// ============================================================================

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Routes — existing JS routes & new TS routes
import spkRoutes from './routes/spk.routes.js';
import lowonganRoutes from './routes/lowongan.routes.js';
import preferensiRoutes from './routes/preferensi.routes.js';
import authRoutes from './routes/auth.routes.js';
import careerNotesRoutes from './routes/career-notes.routes.js';

const app = express();

// ---------------------------------------------------------------------------
// Middleware Global
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health-check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'SPK Engine is running 🚀' });
});

// SPK Engine — rekomendasi lowongan dengan 3 metode (SAW, WP, TOPSIS)
app.use('/api/spk', spkRoutes);

// Manajemen lowongan pekerjaan (perusahaan)
app.use('/api/lowongan', lowonganRoutes);

// Pengaturan preferensi & bobot kriteria (pelamar)
app.use('/api/preferensi', preferensiRoutes);

// Autentikasi & profile
app.use('/api/auth', authRoutes);

// Career Notes — artikel & tips karir
app.use('/api/career-notes', careerNotesRoutes);

// ---------------------------------------------------------------------------
// Error Handler Global
// ---------------------------------------------------------------------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.stack || err.message || err);

  const statusCode: number = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal server.',
  });
});

// ---------------------------------------------------------------------------
// Export app
// ---------------------------------------------------------------------------
export default app;
