// ============================================================================
// SPK ROUTES
// ————————————————————————————————————————————————————————————————————————————
// Route definitions untuk fitur SPK (Sistem Pendukung Keputusan).
// Semua route di sini sudah melewati middleware autentikasi.
// ============================================================================

import { Router } from 'express';
import { getRekomendasiHandler } from '../controllers/spk.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Middleware autentikasi diterapkan ke semua route SPK
router.use(authenticate);

// GET /api/spk/rekomendasi — Hitung & tampilkan rekomendasi lowongan
router.get('/rekomendasi', getRekomendasiHandler);

export default router;
