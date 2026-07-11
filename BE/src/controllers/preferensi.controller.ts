// ============================================================================
// PREFERENSI CONTROLLER (TypeScript)
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { savePreferensi } from '../services/preferensi.service.js';
import { BadRequestError } from '../utils/errors.js';
import type { PreferensiBody } from '../types/index.js';

/**
 * POST /api/preferensi
 * Menyimpan atau memperbarui preferensi & bobot kriteria milik user.
 */
export async function savePreferensiHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string | undefined = req.user?.id_user;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized — User tidak terautentikasi.',
      });
      return;
    }

    const { kriteria_bobot } = req.body as PreferensiBody;

    if (!kriteria_bobot) {
      res.status(400).json({
        success: false,
        message: 'Body request harus memiliki field "kriteria_bobot" berupa array.',
      });
      return;
    }

    const data = await savePreferensi(userId, kriteria_bobot);

    res.status(200).json({
      success: true,
      message: 'Preferensi berhasil disimpan.',
      data,
    });
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
}
