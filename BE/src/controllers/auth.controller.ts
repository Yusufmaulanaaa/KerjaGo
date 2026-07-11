// ============================================================================
// AUTH CONTROLLER (TypeScript) — Login, Register, Profile handlers
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import {
  login,
  register,
} from '../services/auth.service.js';
import {
  getProfile,
  updateProfile,
} from '../services/auth-profile.service.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import type { LoginPayload, RegisterPayload, UpdateProfilePayload } from '../services/auth.service.js';

/**
 * POST /api/auth/login
 */
export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const payload = req.body as LoginPayload;
    const data = await login(payload);

    res.json({
      success: true,
      message: 'Login berhasil.',
      data,
    });
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * POST /api/auth/register
 */
export async function registerHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const payload = req.body as RegisterPayload;
    const data = await register(payload);

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil.',
      data,
    });
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * GET /api/auth/profile
 * Membutuhkan header x-user-id
 */
export async function getProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id_user = req.headers['x-user-id'] as string;
    if (!id_user) {
      res.status(401).json({ success: false, message: 'Header x-user-id wajib dikirim.' });
      return;
    }

    const data = await getProfile(id_user);

    res.json({
      success: true,
      message: 'Data profile berhasil diambil.',
      data,
    });
  } catch (error: unknown) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * PUT /api/auth/profile
 * Membutuhkan header x-user-id (atau id_user di body sebagai fallback)
 */
export async function updateProfileHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Prioritas: header x-user-id, fallback ke body.id_user
    const id_user = (req.headers['x-user-id'] as string) || req.body?.id_user;
    if (!id_user) {
      res.status(401).json({ success: false, message: 'Header x-user-id atau id_user di body wajib dikirim.' });
      return;
    }

    const payload = req.body as UpdateProfilePayload;
    const data = await updateProfile(id_user, payload);

    res.json({
      success: true,
      message: 'Profile berhasil diperbarui.',
      data,
    });
  } catch (error: unknown) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}
