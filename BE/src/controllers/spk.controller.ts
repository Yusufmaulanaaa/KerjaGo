// ============================================================================
// SPK CONTROLLER
// ————————————————————————————————————————————————————————————————————————————
// Controller ini bertindak sebagai jembatan antara HTTP Request/Response
// dan SPK Service. Autentikasi user diperoleh dari middleware yang
// menyisipkan objek `req.user` (berisi `id_user`).
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import { getRekomendasi } from '../services/spk/index.js';

// ---------------------------------------------------------------------------
// GET /api/spk/rekomendasi
// ---------------------------------------------------------------------------
// Mendapatkan rekomendasi lowongan pekerjaan berdasarkan preferensi user
// yang sudah dihitung dengan 3 metode (SAW, WP, TOPSIS).
//
// Flow:
//   1. Middleware auth menempatkan `req.user.id_user`
//   2. Panggil service `getRekomendasi(userId)`
//   3. Kembalikan hasil dalam format JSON
// ---------------------------------------------------------------------------
async function getRekomendasiHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Ambil id_user dari token/session (disisipkan oleh middleware auth)
    const userId = req.user?.id_user;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized — User tidak terautentikasi.',
      });
      return;
    }

    // Panggil service utama SPK Engine
    const data = await getRekomendasi(userId);

    // Response sukses
    res.status(200).json({
      success: true,
      message: 'Rekomendasi SPK berhasil dihitung.',
      data,
    });
  } catch (error: unknown) {
    // Jika error berasal dari logika bisnis (misal preferensi tdk ditemukan)
    // kirim sebagai 400, selain itu 500.
    if (
      error instanceof Error &&
      error.message &&
      (error.message.includes('tidak ditemukan') ||
        error.message.includes('belum diisi') ||
        error.message.includes('Belum ada data'))
    ) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    // Error lain: forward ke middleware error handler
    next(error);
  }
}

// ---------------------------------------------------------------------------
// Export semua handler
// ---------------------------------------------------------------------------
export { getRekomendasiHandler };
