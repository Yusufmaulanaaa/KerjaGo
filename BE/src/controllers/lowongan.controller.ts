// ============================================================================
// LOWONGAN CONTROLLER (TypeScript) — CRUD Handlers
// ============================================================================

import { Request, Response, NextFunction } from 'express';
import {
  createLowongan,
  getAllLowongan,
  updateLowongan,
  deleteLowongan,
} from '../services/lowongan/index.js';
import supabase from '../lib/supabase.js';
import { BadRequestError } from '../utils/errors.js';
import type { JobPostingBody, JobUpdateBody } from '../types/index.js';
import { getKategoriFromJudul, loadSubKriteria, getSubLabel } from '../services/lowongan/utils.js';

/**
 * POST /api/lowongan
 */
export async function createLowonganHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as JobPostingBody;
    const data = await createLowongan(body);
    res.status(201).json({ success: true, message: 'Lowongan berhasil dibuat.', data });
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * GET /api/lowongan
 */
export async function getJobsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filters = req.query;
    const result = await getAllLowongan(filters);
    res.json({ success: true, message: 'Daftar lowongan berhasil diambil.', data: result.data, total: result.total });
  } catch (error: any) {
    console.error('ERROR PADA GET LOWONGAN:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
}

/**
 * GET /api/lowongan/stats — statistik lowongan (untuk dashboard)
 */
export async function getStatsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { count: total } = await supabase
      .from('lowongan')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'aktif');

    const { count: perusahaanCount } = await supabase
      .from('perusahaan')
      .select('*', { count: 'exact', head: true });

    const { data: lowonganData } = await supabase
      .from('lowongan')
      .select('judul_pekerjaan, id_tipe')
      .eq('status', 'aktif');

    const { subMap } = await loadSubKriteria();

    const perTipe: Record<string, number> = {};
    const perKategori: Record<string, number> = {};

    (lowonganData ?? []).forEach((row: any) => {
      const tipe = getSubLabel(subMap, 'id_tipe', row.id_tipe) || 'Lainnya';
      perTipe[tipe] = (perTipe[tipe] || 0) + 1;

      const kategori = getKategoriFromJudul(row.judul_pekerjaan);
      perKategori[kategori] = (perKategori[kategori] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        total: total ?? 0,
        perusahaan_count: perusahaanCount ?? 0,
        per_tipe: perTipe,
        per_kategori: perKategori,
      },
    });
  } catch (error: any) {
    console.error('ERROR PADA GET STATS:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
}

/**
 * GET /api/lowongan/featured — random 6 lowongan untuk landing page
 */
export async function getFeaturedHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 6, 20);

    const { subMap } = await loadSubKriteria();

    const { data, error } = await supabase
      .from('lowongan')
      .select(`*, perusahaan:perusahaan!inner(id_perusahaan, nama_perusahaan)`)
      .eq('status', 'aktif')
      .order('created_at', { ascending: false })
      .limit(limit * 3);

    if (error) throw new Error('Gagal mengambil featured lowongan: ' + error.message);

    // Shuffle and take `limit`
    const shuffled = (data ?? []).sort(() => Math.random() - 0.5).slice(0, limit);

    const enriched = shuffled.map((row: any) => ({
      id_lowongan: row.id_lowongan,
      judul_pekerjaan: row.judul_pekerjaan,
      deskripsi: row.deskripsi,
      nama_perusahaan: row.perusahaan?.nama_perusahaan || null,
      kategori: getKategoriFromJudul(row.judul_pekerjaan),
      tipe_pekerjaan: getSubLabel(subMap, 'id_tipe', row.id_tipe),
      gaji: getSubLabel(subMap, 'id_gaji', row.id_gaji),
      jarak: getSubLabel(subMap, 'id_jarak', row.id_jarak),
      pendidikan: getSubLabel(subMap, 'id_pendidikan', row.id_pendidikan),
      pengalaman: getSubLabel(subMap, 'id_pengalaman', row.id_pengalaman),
      id_tipe: row.id_tipe,
      id_gaji: row.id_gaji,
      id_jarak: row.id_jarak,
      id_pendidikan: row.id_pendidikan,
      id_pengalaman: row.id_pengalaman,
    }));

    res.json({ success: true, data: enriched });
  } catch (error: any) {
    console.error('ERROR PADA GET FEATURED:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
}

/**
 * GET /api/lowongan/categories — daftar kategori unik + jumlah
 */
export async function getCategoriesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { data } = await supabase
      .from('lowongan')
      .select('judul_pekerjaan')
      .eq('status', 'aktif');

    const counts: Record<string, number> = {};
    (data ?? []).forEach((row: any) => {
      const k = getKategoriFromJudul(row.judul_pekerjaan);
      counts[k] = (counts[k] || 0) + 1;
    });

    const categories = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    res.json({ success: true, data: categories });
  } catch (error: any) {
    console.error('ERROR PADA GET CATEGORIES:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
}

/**
 * PUT /api/lowongan/:id
 */
export async function updateJobHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'id_lowongan harus berupa angka.' });
      return;
    }
    const body = req.body as JobUpdateBody;
    const data = await updateLowongan(id, body);
    res.json({ success: true, message: 'Lowongan berhasil diperbarui.', data });
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}

/**
 * DELETE /api/lowongan/:id
 */
export async function deleteJobHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'id_lowongan harus berupa angka.' });
      return;
    }
    const data = await deleteLowongan(id);
    res.json({ success: true, message: 'Lowongan berhasil dinonaktifkan.', data });
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}
