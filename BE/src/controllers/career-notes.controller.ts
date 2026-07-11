// ============================================================================
// CAREER NOTES CONTROLLER (TypeScript) — Handler untuk artikel karir
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { getAllNotes, getNoteBySlug, createNote, updateNote, deleteNote } from '../services/career-notes.service.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

/**
 * GET /api/career-notes
 */
export async function getAllNotesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await getAllNotes();

    res.json({
      success: true,
      message: 'Career notes berhasil diambil.',
      data,
    });
  } catch (error: unknown) {
    next(error);
  }
}

/**
 * GET /api/career-notes/:slug
 */
export async function getNoteBySlugHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const slug = req.params.slug as string;
    const data = await getNoteBySlug(slug);

    res.json({
      success: true,
      message: 'Career note berhasil diambil.',
      data,
    });
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * POST /api/career-notes
 */
export async function createNoteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await createNote(req.body);
    res.status(201).json({ success: true, message: 'Career note berhasil dibuat.', data });
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * PUT /api/career-notes/:id
 */
export async function updateNoteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID harus berupa angka.' });
      return;
    }
    const data = await updateNote(id, req.body);
    res.json({ success: true, message: 'Career note berhasil diperbarui.', data });
  } catch (error: unknown) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * DELETE /api/career-notes/:id
 */
export async function deleteNoteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'ID harus berupa angka.' });
      return;
    }
    await deleteNote(id);
    res.json({ success: true, message: 'Career note berhasil dihapus.' });
  } catch (error: unknown) {
    next(error);
  }
}
