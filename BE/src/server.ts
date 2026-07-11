// ============================================================================
// SERVER — Menjalankan Aplikasi Express (TypeScript)
// ============================================================================

import 'dotenv/config';
import app from './app.js';
import { seedMasterData, seedDatabase, seedCareerNotes, seedDemoUsers } from './utils/seeder.js';

const PORT: number = Number(process.env.PORT) || 3000;

// Seed demo users (pelamar & rekruter)
try {
  await seedDemoUsers();
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[SERVER] Gagal menjalankan seeder demo users: ${message}`);
}

// Seed master data (kriteria, sub_kriteria, perusahaan) — WAJIB untuk SPK
try {
  await seedMasterData();
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[SERVER] Gagal menjalankan seeder master data: ${message}`);
}

// Seed data dummy sebelum server mulai menerima request
try {
  await seedDatabase(60, true);
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[SERVER] Gagal menjalankan seeder lowongan: ${message}`);
}

// Seed career notes (15 artikel)
try {
  await seedCareerNotes();
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[SERVER] Gagal menjalankan seeder career notes: ${message}`);
}

app.listen(PORT, () => {
  console.log(`╔══════════════════════════════════════════════════╗`);
  console.log(`║   🚀  SPK Job Portal Engine — Berjalan!        ║`);
  console.log(`║   📡  http://localhost:${PORT}/api/health       ║`);
  console.log(`║   📋  POST /api/lowongan                       ║`);
  console.log(`║   📋  POST /api/preferensi                     ║`);
  console.log(`║   📋  GET  /api/spk/rekomendasi                ║`);
  console.log(`╚══════════════════════════════════════════════════╝`);
});
