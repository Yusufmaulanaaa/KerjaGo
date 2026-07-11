// ============================================================================
// LOWONGAN — Delete (soft)
// ============================================================================

import supabase from '../../lib/supabase.js';
import type { LowonganRow } from '../../types/index.js';

/**
 * Nonaktifkan lowongan (soft delete) — mengubah status menjadi 'nonaktif'.
 */
export async function deleteLowongan(id_lowongan: number): Promise<LowonganRow> {
  const { data: updated, error } = await supabase
    .from('lowongan')
    .update({ status: 'nonaktif' })
    .eq('id_lowongan', id_lowongan)
    .select()
    .single();

  if (error) {
    throw new Error('Gagal menonaktifkan lowongan: ' + error.message);
  }

  return updated as LowonganRow;
}
