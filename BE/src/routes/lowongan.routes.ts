// ============================================================================
// LOWONGAN ROUTES (TypeScript) — CRUD endpoints
// ============================================================================

import { Router } from 'express';
import {
  createLowonganHandler,
  getJobsHandler,
  getStatsHandler,
  getFeaturedHandler,
  getCategoriesHandler,
  updateJobHandler,
  deleteJobHandler,
} from '../controllers/lowongan.controller.js';

const router = Router();

// Specific routes BEFORE /:id to avoid conflicts
router.get('/stats', getStatsHandler);
router.get('/featured', getFeaturedHandler);
router.get('/categories', getCategoriesHandler);

router.post('/', createLowonganHandler);
router.get('/', getJobsHandler);
router.put('/:id', updateJobHandler);
router.delete('/:id', deleteJobHandler);

export default router;
