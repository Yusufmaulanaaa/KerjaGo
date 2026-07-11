// ============================================================================
// AUTH MIDDLEWARE (TypeScript)
// ============================================================================
// Middleware autentikasi sederhana yang mengekstrak identitas user dari
// header x-user-id. Silakan sesuaikan dengan JWT/Supabase Auth yang
// sesungguhnya.
// ============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Perluas tipe Request Express agar memiliki properti `user`.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id_user: string;
      };
    }
  }
}

/**
 * Middleware autentikasi.
 * Membaca id_user dari header 'x-user-id' dan menyimpannya di req.user.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const userId = req.headers['x-user-id'];

  if (userId && typeof userId === 'string') {
    req.user = { id_user: userId };
    return next();
  }

  res.status(401).json({
    success: false,
    message: 'Unauthorized — Sertakan header x-user-id.',
  });
}
