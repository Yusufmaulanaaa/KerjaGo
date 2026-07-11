// ============================================================================
// AUTH ROUTES (TypeScript) — Login, Register, Profile endpoints
// ============================================================================
// POST   /api/auth/login      → Login dengan email & password
// POST   /api/auth/register   → Registrasi user baru
// GET    /api/auth/profile    → Ambil profile (x-user-id header)
// PUT    /api/auth/profile    → Update profile (x-user-id header)
// ============================================================================

import { Router } from 'express';
import {
  loginHandler,
  registerHandler,
  getProfileHandler,
  updateProfileHandler,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.get('/profile', getProfileHandler);
router.put('/profile', updateProfileHandler);

export default router;
