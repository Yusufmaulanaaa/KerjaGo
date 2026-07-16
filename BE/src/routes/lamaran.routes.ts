// ============================================================================
// LAMARAN ROUTES (TypeScript)
// ============================================================================

import { Router } from 'express';
import {
  createLamaranHandler,
  getMyLamaranHandler,
  getLamaranByLowonganHandler,
  updateStatusLamaranHandler,
  deleteLamaranHandler,
} from '../controllers/lamaran.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createLamaranHandler);
router.get('/me', getMyLamaranHandler);
router.get('/lowongan/:idLowongan', getLamaranByLowonganHandler);
router.patch('/:id/status', updateStatusLamaranHandler);
router.delete('/:id', deleteLamaranHandler);

export default router;
