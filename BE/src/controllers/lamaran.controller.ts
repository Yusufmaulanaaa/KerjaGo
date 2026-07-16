// ============================================================================
// LAMARAN CONTROLLER (TypeScript) — HTTP handlers untuk lamaran kerja
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import {
  createLamaran,
  getLamaranByUser,
  getLamaranByLowongan,
  updateStatusLamaran,
  deleteLamaran,
} from '../services/lamaran.service.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import type { LamaranBody } from '../types/lamaran.js';

export async function createLamaranHandler(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id_user;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }
    const body = req.body as LamaranBody;
    const data = await createLamaran(userId, body);
    res.status(201).json({ success: true, message: 'Lamaran berhasil dikirim.', data });
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

export async function getMyLamaranHandler(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id_user;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }
    const data = await getLamaranByUser(userId);
    res.json({ success: true, message: 'Data lamaran berhasil diambil.', data });
  } catch (error: unknown) {
    next(error);
  }
}

export async function getLamaranByLowonganHandler(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.idLowongan as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'idLowongan harus angka.' });
      return;
    }
    const data = await getLamaranByLowongan(id);
    res.json({ success: true, message: 'Data lamaran berhasil diambil.', data });
  } catch (error: unknown) {
    next(error);
  }
}

export async function updateStatusLamaranHandler(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'id harus angka.' });
      return;
    }
    const { status } = req.body;
    const data = await updateStatusLamaran(id, status);
    res.json({ success: true, message: 'Status lamaran berhasil diupdate.', data });
  } catch (error: unknown) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

export async function deleteLamaranHandler(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'id harus angka.' });
      return;
    }
    await deleteLamaran(id);
    res.json({ success: true, message: 'Lamaran berhasil dihapus.' });
  } catch (error: unknown) {
    next(error);
  }
}
