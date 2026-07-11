// ============================================================================
// PREFERENSI ROUTES (TypeScript)
// ============================================================================
// POST /api/preferensi  →  Simpan bobot kriteria pelamar
// Semua route di sini dilindungi oleh auth middleware.
// ============================================================================

import { Router } from 'express';
import { savePreferensiHandler } from '../controllers/preferensi.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Middleware auth diterapkan ke semua route preferensi
router.use(authenticate);

router.post('/', savePreferensiHandler);

export default router;
