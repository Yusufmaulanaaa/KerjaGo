import { Router } from 'express';
import {
  getAllNotesHandler,
  getNoteBySlugHandler,
  createNoteHandler,
  updateNoteHandler,
  deleteNoteHandler,
} from '../controllers/career-notes.controller.js';

const router = Router();

router.get('/', getAllNotesHandler);
router.get('/:slug', getNoteBySlugHandler);
router.post('/', createNoteHandler);
router.put('/:id', updateNoteHandler);
router.delete('/:id', deleteNoteHandler);

export default router;
